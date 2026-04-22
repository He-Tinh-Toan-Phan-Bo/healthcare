export class AuthUserDto {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
}

export class AuthResponseDto {
  accessToken: string;
  user: AuthUserDto;
}
