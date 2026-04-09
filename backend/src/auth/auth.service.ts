import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RedisService } from '../common/redis/redis.service';
import { MailService } from '../common/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { randomInt } from 'node:crypto';
import { VerifyRegisterOtpDto } from './dto/verify-register-otp.dto';

interface PendingRegisterPayload extends RegisterDto {
  passwordHash: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const normalizedEmail = dto.email.trim().toLowerCase();

    const existing = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException({
        code: 'EMAIL_ALREADY_EXISTS',
        message: 'Email already exists',
      });
    }

    const otpTtlSeconds =
      this.configService.get<number>('REGISTER_OTP_TTL_SECONDS') ?? 300;
    const minResendCooldownSeconds = 60;

    const existingOtpTtl = await this.redisService.ttl(
      this.getRegisterOtpKey(normalizedEmail),
    );
    if (existingOtpTtl > 0) {
      const remainingCooldown =
        existingOtpTtl - (otpTtlSeconds - minResendCooldownSeconds);
      if (remainingCooldown > 0) {
        throw new BadRequestException({
          code: 'OTP_RESEND_TOO_SOON',
          message: `OTP was already sent. Please wait ${remainingCooldown} seconds before requesting again`,
        });
      }
    }

    const otp = this.generateOtp();
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const pendingPayload: PendingRegisterPayload = {
      ...dto,
      email: normalizedEmail,
      passwordHash,
    };

    await this.redisService.set(
      this.getRegisterOtpKey(normalizedEmail),
      otp,
      otpTtlSeconds,
    );
    await this.redisService.set(
      this.getRegisterPayloadKey(normalizedEmail),
      JSON.stringify(pendingPayload),
      otpTtlSeconds,
    );

    try {
      await this.mailService.sendRegisterOtp(
        normalizedEmail,
        otp,
        otpTtlSeconds,
      );
    } catch (error) {
      await this.clearRegisterOtpCache(normalizedEmail);
      throw new InternalServerErrorException({
        code: 'OTP_EMAIL_SERVICE_UNAVAILABLE',
        message: 'Email OTP service unavailable',
      });
    }

    return {
      message: 'OTP has been sent to your email',
      expiresInSeconds: otpTtlSeconds,
    };
  }

  async verifyRegisterOtp(dto: VerifyRegisterOtpDto): Promise<AuthResponseDto> {
    const email = dto.email.trim().toLowerCase();
    const otp = dto.otp.trim();

    const [cachedOtp, cachedPayload] = await Promise.all([
      this.redisService.get(this.getRegisterOtpKey(email)),
      this.redisService.get(this.getRegisterPayloadKey(email)),
    ]);

    if (!cachedOtp || cachedOtp !== otp) {
      throw new UnauthorizedException({
        code: 'OTP_INVALID_OR_EXPIRED',
        message: 'OTP is invalid or expired',
      });
    }

    if (!cachedPayload) {
      throw new UnauthorizedException({
        code: 'OTP_PENDING_DATA_NOT_FOUND',
        message: 'Registration session is expired. Please request OTP again',
      });
    }

    const pending = JSON.parse(cachedPayload) as PendingRegisterPayload;

    const user = await this.prisma.user.create({
      data: {
        name: pending.name,
        email: pending.email,
        phone: pending.phone,
        passwordHash: pending.passwordHash,
        emailVerified: true,
      },
      select: { id: true, name: true, email: true, phone: true, role: true },
    });

    await this.clearRegisterOtpCache(email);

    const accessToken = await this.signAccessToken(
      user.id,
      user.email,
      user.role,
    );
    return { accessToken, user };
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user)
      throw new UnauthorizedException({
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid credentials',
      });

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok)
      throw new UnauthorizedException({
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid credentials',
      });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
      select: { id: true },
    });

    const accessToken = await this.signAccessToken(
      user.id,
      user.email,
      user.role,
    );
    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    };
  }

  private async signAccessToken(
    userId: string,
    email: string,
    role: any,
  ): Promise<string> {
    return this.jwtService.signAsync({
      sub: userId,
      email,
      role,
    });
  }

  private generateOtp(): string {
    return randomInt(100000, 999999).toString();
  }

  private getRegisterOtpKey(email: string): string {
    return `auth:register:otp:${email}`;
  }

  private getRegisterPayloadKey(email: string): string {
    return `auth:register:payload:${email}`;
  }

  private async clearRegisterOtpCache(email: string): Promise<void> {
    await Promise.all([
      this.redisService.del(this.getRegisterOtpKey(email)),
      this.redisService.del(this.getRegisterPayloadKey(email)),
    ]);
  }
}
