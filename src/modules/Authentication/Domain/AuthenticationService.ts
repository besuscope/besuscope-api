// src/modules/Authentication/Domain/AuthService.ts
import { Inject, Injectable, Logger } from '@nestjs/common';

import { DependencyInjectionTokens } from '@helper/AppConstants';

import { LoginDTO } from '@modules/Authentication/Domain/DTO/HTTPRequest/AuthenticationRequest';
import { AuthenticationTokenUseCase } from '@modules/Authentication/Port/Input/AuthenticationTokenUseCase';
import { AuthenticationTokenOutputPort } from '@modules/Authentication/Port/Output/AuthenticationTokenOutputPort';

@Injectable()
export class AuthenticationService implements AuthenticationTokenUseCase {
	private readonly logger = new Logger('AuthenticationService');

	constructor(
		@Inject(DependencyInjectionTokens.AUTH_TOKEN_OUTPUT_PORT)
		private readonly authenticationTokenAdapter: AuthenticationTokenOutputPort,
	) {}

	async login(loginDTO: LoginDTO): Promise<{ access_token: string }> {
		try {
			return await this.authenticationTokenAdapter.login(loginDTO);
		} catch (error) {
			this.logger.error(error);
			throw new Error(error);
		}
	}

	async validateUser(payload: any): Promise<any> {
		try {
			return await this.authenticationTokenAdapter.validateUser(payload);
		} catch (error) {
			this.logger.error(error);
			throw new Error(error);
		}
	}
}
