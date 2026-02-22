import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  validate(
    accessToken: string,
    _refreshToken: string,
    profile: {
      name?: { givenName?: string; familyName?: string };
      emails?: { value: string }[];
      photos?: { value: string }[];
    },
    done: VerifyCallback,
  ) {
    const user = {
      email: profile.emails?.[0]?.value ?? '',
      firstName: profile.name?.givenName ?? '',
      lastName: profile.name?.familyName ?? '',
      picture: profile.photos?.[0]?.value ?? '',
      accessToken,
    };
    done(null, user);
  }
}
