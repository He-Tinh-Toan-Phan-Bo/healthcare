import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly configService: ConfigService) {}

  async sendRegisterOtp(
    email: string,
    otp: string,
    expiresInSeconds: number,
  ): Promise<void> {
    return this.sendOtpEmail({
      email,
      otp,
      expiresInSeconds,
      subject: 'HEALTHCARE verification code',
      textTemplate: (code, expiresInMinutes) =>
        `Your verification code is ${code}. It expires in ${expiresInMinutes} minutes.`,
      htmlTemplate: (code, expiresInMinutes) =>
        `<p>Your HEALTHCARE verification code is <b>${code}</b>.</p><p>This code expires in ${expiresInMinutes} minutes.</p>`,
      logLabel: 'register OTP',
    });
  }

  private getSmtpConfig() {
    const host = this.configService.get<string>('SMTP_HOST')?.trim();
    const port = this.configService.get<number>('SMTP_PORT') ?? 587;
    const user = this.configService.get<string>('SMTP_USER')?.trim();
    const rawPass = this.configService.get<string>('SMTP_PASS');
    const pass = rawPass?.replaceAll(/\s+/g, '');
    const from = this.configService.get<string>('SMTP_FROM')?.trim();

    if (!host || !from) {
      this.logger.error('SMTP is not configured properly');
      throw new InternalServerErrorException('SMTP is not configured');
    }

    return {
      host,
      port,
      from,
      auth: user && pass ? { user, pass } : undefined,
    };
  }

  private async sendOtpEmail(params: {
    email: string;
    otp: string;
    expiresInSeconds: number;
    subject: string;
    textTemplate: (otp: string, expiresInMinutes: number) => string;
    htmlTemplate: (otp: string, expiresInMinutes: number) => string;
    logLabel: string;
  }): Promise<void> {
    const {
      email,
      otp,
      expiresInSeconds,
      subject,
      textTemplate,
      htmlTemplate,
      logLabel,
    } = params;

    const smtp = this.getSmtpConfig();

    try {
      const transporter = nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.port === 465,
        auth: smtp.auth,
      });

      const expiresInMinutes = Math.ceil(expiresInSeconds / 60);

      await transporter.sendMail({
        from: smtp.from,
        to: email,
        subject,
        text: textTemplate(otp, expiresInMinutes),
        html: htmlTemplate(otp, expiresInMinutes),
      });
    } catch (error) {
      this.logger.error(
        `Failed to send ${logLabel} email to ${email}: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new InternalServerErrorException('Failed to send OTP email');
    }
  }
}
