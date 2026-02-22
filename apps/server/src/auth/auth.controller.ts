import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Step 1: 導向 Google 登入頁面
  // 前端可傳入 redirectTo 指定登入後跳轉的頁面，例如：
  // /auth/google?redirectTo=/dashboard
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Query('redirectTo') _redirectTo?: string) {
    // GoogleAuthGuard 會先把 redirectTo 寫入 cookie，再重導向至 Google
  }

  // Step 2: Google 授權後的回調（callbackURL 必須在 Google Cloud Console 中預先註冊）
  @Get('google-redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: any, @Res() res: any) {
    const { access_token } = await this.authService.login(req.user);
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';

    // 從 cookie 讀取 redirectTo（不依賴 session，手動解析 cookie header）
    const cookieStr = (req.headers.cookie as string) ?? '';
    const cookies = Object.fromEntries(
      cookieStr
        .split(';')
        .map((c) => c.trim().split('='))
        .filter((parts) => parts.length >= 2)
        .map(([k, ...v]) => [k.trim(), decodeURIComponent(v.join('=').trim())]),
    );
    const redirectTo = cookies['redirect_to'] ?? '/';

    // 清除 cookie 並重導向前端
    res.setHeader('Set-Cookie', 'redirect_to=; HttpOnly; Max-Age=0; Path=/; SameSite=Lax');
    res.redirect(`${frontendUrl}${redirectTo}?token=${access_token}`);
  }
}
