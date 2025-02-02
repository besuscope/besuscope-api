// src/modules/Authentication/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

/**
 *  Strategy para o Passport que use o JwtModule para validar tokens
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET || '15151456121561651451',
		});
	}

	async validate(payload: any) {
		return { userId: payload.sub, email: payload.email };
	}
}
