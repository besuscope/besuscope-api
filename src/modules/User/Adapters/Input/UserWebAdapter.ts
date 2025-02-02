import { BaseUrls, DependencyInjectionTokens } from '@helper/AppConstants';
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Inject,
	Logger,
	Param,
	Patch,
	Post,
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UserService } from '../../Domain/UserService';

import { UserInfo } from '@modules/User/Domain/@types/user';
import { UserRegisterDTORequest } from '@modules/User/Domain/DTO/HTTPRequest/userHttpRequest';
import { UserRegisterResponse } from '@modules/User/Domain/DTO/HTTPResponse/userHttpResponse';
import { GetUserResponseSwagger, UserUpdateSwagger } from '@modules/User/Domain/DTO/Swagger';

@Controller(BaseUrls.USER)
@ApiTags('User API Endpoints')
export class UserWebAdapter {
	private readonly logger = new Logger('UserWebAdapter');

	constructor(
		@Inject(DependencyInjectionTokens.USER_TOKEN_USE_CASE)
		private userService: UserService,
	) {}

	/**
	 *
	 * @param registerDTO
	 * @returns `{ message: string }`
	 */
	@Post('/register')
	@ApiOperation({ summary: 'Register user', description: 'Register new user to application' })
	@ApiBody({ type: UserRegisterDTORequest })
	@ApiOkResponse({ description: 'Registration successful', type: UserRegisterResponse })
	@ApiBadRequestResponse({ description: 'Bad request' })
	async register(@Body() registerDTO: UserRegisterDTORequest): Promise<any> {
		try {
			if (registerDTO) {
				this.logger.log('---------- PROCESS BEGIN ----------');
				this.logger.log('Running User Web Adapter');
				this.logger.log('Executing register method...');

				this.logger.log(`email: ${registerDTO.email}`);
				this.logger.log(`username: ${registerDTO.username}`);
				this.logger.log(`password: ${registerDTO.password}`);

				this.logger.log('---------- PROCESS END ----------');

				return this.userService.register({
					email: registerDTO.email,
					username: registerDTO.username,
					password: registerDTO.password,
					profileImageUrl: registerDTO.profileImageUrl,
				});
			} else {
				throw new Error('Bad request');
			}
		} catch (error) {
			this.logger.log('---------- PROCESS END WITH ERROR ----------');
			this.logger.error(`Error : ${JSON.stringify(error.message)}`);
			throw new HttpException(
				{
					message: error.message,
					error: 'Bad Request',
				},
				error.statusCode || HttpStatus.BAD_REQUEST,
			);
		}
	}

	/// --------------------------------------------------------------------------------------
	/// ------------------------      DELETE USER           ---------------------
	/// --------------------------------------------------------------------------------------
	@ApiOperation({
		summary: 'Delete a  user on api',
		description: 'This route is used to delete a user.',
	})
	@ApiOkResponse({
		description: 'Success operation',
		type: String,
	})
	@ApiBadRequestResponse({ description: 'Bad request' })
	@ApiUnauthorizedResponse({ description: 'Unauthorized' })
	@ApiForbiddenResponse({ description: 'Forbidden' })
	@ApiNotFoundResponse({ description: 'Segment not found' })
	@ApiInternalServerErrorResponse({ description: 'Unexpected error' })
	@ApiParam({ name: 'email', type: 'string', description: 'The email registered' })
	@Delete('/delete')
	async deleteUser(@Param('email') email: string): Promise<string> {
		try {
			this.logger.log('----------PROCESS BEGIN ----------');
			this.logger.log(`Running User Web adapter`);
			this.logger.log(`email: ${email}`);

			this.logger.log('---------- PROCESS END ----------');

			const result = await this.userService.deleteUser(email);
			if (result) {
				return 'User deleted successfully';
			}

			return result;
		} catch (error) {
			this.logger.error(`Error in getClientData: ${error.message}`);
			throw new HttpException(error.message, error.statusCode || HttpStatus.NOT_FOUND);
		}
	}

	/// --------------------------------------------------------------------------------------
	/// ------------------------      GET USER DATA          ---------------------
	/// --------------------------------------------------------------------------------------
	@ApiOperation({
		summary: 'Get User by Email',
		description: 'Find User Information by Email',
	})
	@ApiOkResponse({
		description: 'Success operation',
		type: GetUserResponseSwagger,
	})
	@ApiBadRequestResponse({ description: 'Bad request' })
	@ApiUnauthorizedResponse({ description: 'Unauthorized' })
	@ApiForbiddenResponse({ description: 'Forbidden' })
	@ApiNotFoundResponse({ description: 'Segment not found' })
	@Get('/get/:email')
	async getClientData(@Param('email') email: string) {
		try {
			this.logger.log('----------PROCESS BEGIN ----------');
			this.logger.log(`Running User Web adapter`);
			this.logger.log(`email: ${email}`);

			return await this.userService.getUser(email);
		} catch (error) {
			this.logger.error(`Error in getClientData: ${error.message}`);
			throw new HttpException(error.message, error.statusCode || HttpStatus.BAD_REQUEST);
		}
	}

	/// --------------------------------------------------------------------------------------
	/// ------------------------      UPDATE  METADATA TOKEN URI JSON            ---------------------
	/// --------------------------------------------------------------------------------------
	@ApiBody({ required: true, type: UserUpdateSwagger })
	@ApiOperation({
		summary: 'Update a  user on api',
		description: 'This route is used to update a metadata tokenID off Client on blockchain',
	})
	@ApiOkResponse({
		description: 'Success operation',
		type: String,
	})
	@ApiBadRequestResponse({ description: 'Bad request' })
	@ApiUnauthorizedResponse({ description: 'Unauthorized' })
	@ApiForbiddenResponse({ description: 'Forbidden' })
	@ApiNotFoundResponse({ description: 'Segment not found' })
	@ApiInternalServerErrorResponse({ description: 'Unexpected error' })
	@Patch('/update/:email')
	async updateUser(@Param('email') email: string, @Body() updateUserDTO: UserInfo): Promise<UserInfo> {
		try {
			this.logger.log('----------PROCESS BEGIN ----------');
			this.logger.log(`Running Metadata Web adapter`);
			this.logger.log(`email: ${email}`);
			this.logger.log(`updateUserDTO: ${JSON.stringify(updateUserDTO)}`);
			this.logger.log('---------- PROCESS END ----------');
			return await this.userService.updateUser(email, updateUserDTO);
		} catch (error) {
			this.logger.error(`Error in updateUser: ${error.message}`);
			throw new HttpException(error.message, error.statusCode || HttpStatus.BAD_REQUEST);
		}
	}
}
