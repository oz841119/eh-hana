import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

export interface GoogleProfile {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  /**
   * 透過 Google OAuth 資料找到或建立使用者
   */
  async validateOAuthUser(profile: GoogleProfile) {
    return this.userService.findOrCreate({
      email: profile.email,
      name: `${profile.firstName} ${profile.lastName}`,
    });
  }

  /**
   * 簽發 JWT token
   */
  async login(user: { id: number; email: string }) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
