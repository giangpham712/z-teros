import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from './services/auth.service';
import { JwtPayload } from './response-object/jwt-payload.interface';

import { cognitoPoolId, cognitoRegion } from '@bn-config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://cognito-idp.${cognitoRegion}.amazonaws.com/${cognitoPoolId}/.well-known/jwks.json`,
      }),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.authService.getValidatedUserDetail(payload.username);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
