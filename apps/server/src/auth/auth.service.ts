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

  async googleLogin(profile: GoogleProfile) {
    const name = [profile.firstName, profile.lastName]
      .filter(Boolean)
      .join(' ');

    const user = await this.userService.findOrCreate({
      email: profile.email,
      name,
    });

    const payload = { sub: user.id, email: user.email };
    return { accessToken: this.jwtService.sign(payload) };
  }

  verifyToken(token: string): { sub: string; email: string } {
    return this.jwtService.verify(token);
  }
}
