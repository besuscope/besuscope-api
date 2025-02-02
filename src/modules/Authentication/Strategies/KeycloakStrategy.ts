import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { DependencyInjectionTokens } from '../../../helper/AppConstants';
import { Redis } from 'ioredis';

@Injectable()
export class KeycloakStrategy extends PassportStrategy(Strategy, DependencyInjectionTokens.KEYCLOAK_STRATEGY) {
	constructor(@Inject(DependencyInjectionTokens.REDIS_CLIENT) private readonly redisClient: Redis) {
		super({
			authorizationURL: `${process.env.KEYCLOAK_URL}/auth/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/auth`,
			tokenURL: `${process.env.KEYCLOAK_URL}/auth/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
			clientID: process.env.KEYCLOAK_CLIENT_ID,
			clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
			callbackURL: process.env.KEYCLOAK_CALLBACK_URL,
			scope: 'openid profile email',
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
		const cachedUser = await this.redisClient.get(`user:${profile.username}`);
		if (!cachedUser) {
			throw new UnauthorizedException('User not found or session expired');
		}
		return JSON.parse(cachedUser);
	}
}
