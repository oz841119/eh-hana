import {
  Controller,
  ExecutionContext,
  Get,
  Injectable,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { AuthService, GoogleProfile } from './auth.service';

@Injectable()
class GoogleOAuthGuard extends AuthGuard('google') {
  getAuthenticateOptions(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const redirectTo = (request.query.redirectTo as string) || '/';
    return { state: redirectTo };
  }
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  googleAuth() {
    // Guard redirects to Google consent screen
  }

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const { accessToken } = await this.authService.googleLogin(
      req.user as GoogleProfile,
    );
    const redirectTo = (req.query.state as string) || '/';
    const frontendUrl = this.configService.get<string>(
      'FRONTEND_URL',
      'http://localhost:3000',
    );

    res.cookie('token', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60_000,
    });
    res.redirect(`${frontendUrl}${redirectTo}`);
  }

  @Get('me')
  me(@Req() req: Request) {
    const token = (req.cookies as Record<string, string> | undefined)?.token;
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = this.authService.verifyToken(token);
      return { id: payload.sub, email: payload.email };
    } catch {
      throw new UnauthorizedException();
    }
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token', { path: '/' });
    return { message: 'ok' };
  }
}
