import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    // 在觸發 Google OAuth 之前，先將 redirectTo 存入短效 cookie
    // 因為 OAuth 跳轉後 query string 會消失，需要靠 cookie 帶過去
    const redirectTo = (req.query.redirectTo as string) ?? '/';
    res.setHeader(
      'Set-Cookie',
      `redirect_to=${encodeURIComponent(redirectTo)}; HttpOnly; Max-Age=300; Path=/; SameSite=Lax`,
    );

    // 呼叫原本的 Google OAuth 流程（不傳 state，避免觸發 session-based 驗證）
    return super.canActivate(context) as Promise<boolean>;
  }
}
