import { BaseUrls, DependencyInjectionTokens } from '@helper/AppConstants';
import { AuthenticationService } from '@modules/Authentication/Domain/AuthenticationService';
import { LoginDTO } from '@modules/Authentication/Domain/DTO/HTTPRequest/AuthenticationRequest';
import { LoginDTOSwagger } from '@modules/Authentication/Domain/DTO/Swagger/LoginDtoSwagger';
import { Body, Controller, Inject, Logger, Post } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller(BaseUrls.AUTH)
@ApiTags('Auth API Endpoint')
export class AuthenticationWebAdapter {
	private readonly logger = new Logger('AuthenticationWebAdapter');

	constructor(
		@Inject(DependencyInjectionTokens.AUTH_TOKEN_USE_CASE)
		private readonly authenticationService: AuthenticationService,
	) {}

	/**
	 *
	 * @param loginDTO
	 * @returns `{ access_token: string }`
	 */
	@Post('/login')
	@ApiOperation({ summary: 'Login user', description: 'Login user to application' })
	@ApiBody({ type: LoginDTOSwagger })
	@ApiOkResponse({ description: 'Login successful', type: String })
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	@ApiBadRequestResponse({ description: 'Bad request' })
	async login(@Body() loginDTO: LoginDTO): Promise<{ access_token: string }> {
		try {
			this.logger.log('---------- PROCESS BEGIN ----------');
			this.logger.log('Running Authentication Web Adapter');
			this.logger.log('running login method...');

			const { ...loginInfo } = loginDTO;
			this.logger.log(`loginDTO: ${JSON.stringify(loginInfo)}`);

			const query = await this.authenticationService.login(loginDTO);
			this.logger.log(`query: ${JSON.stringify(query)}`);

			this.logger.log('---------- PROCESS END ----------');
			return query;
		} catch (e) {
			const errorMessage = e.response ? e.response.data : e.message;
			this.logger.error(`Error : ${JSON.stringify(errorMessage)}`);
			throw new Error(`An error ocurred in executing login method on application `);
		}
	}
}
