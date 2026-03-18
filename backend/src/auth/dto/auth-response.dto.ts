import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

class UserPublicDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false })
  phone?: string | null;

  @ApiProperty({ enum: UserRole })
  role: UserRole;
}

export class AuthResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty({ type: UserPublicDto })
  user: UserPublicDto;
}

