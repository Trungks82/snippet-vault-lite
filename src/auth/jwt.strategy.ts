import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // 👇 We changed this to getOrThrow to satisfy TypeScript's strict safety checks!
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'), 
    });
  }

  // Once the signature is verified, this method runs.
  // Whatever we return here gets attached to `req.user` in your controller!
  async validate(payload: any) {
    return { sub: payload.sub, email: payload.email };
  }
}