import { ApiProperty } from '@nestjs/swagger';

export class ClinicResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string | null;

  @ApiProperty()
  address: string;

  @ApiProperty({ required: false })
  phone?: string | null;

  @ApiProperty({ required: false })
  email?: string | null;

  @ApiProperty({ required: false })
  website?: string | null;

  @ApiProperty()
  rating: string;

  @ApiProperty()
  reviewCount: number;

  @ApiProperty({ required: false })
  image?: string | null;

  @ApiProperty()
  isOpen: boolean;

  @ApiProperty({ required: false })
  openingHours?: string | null;
}

