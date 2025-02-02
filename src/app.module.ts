import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DataSource } from 'typeorm';
import { DependencyInjectionTokens } from './helper/AppConstants';
import { AuthenticationWebAdapter } from './modules/Authentication/Adapters/Input/AuthenticationWebAdapter';
import { AuthenticationAdapter } from './modules/Authentication/Adapters/Output/AuthenticationAdapter';
import { AuthenticationService } from './modules/Authentication/Domain/AuthenticationService';
/** ALL JWT MODULES IMPORT */
import { JwtAuthGuard } from './modules/Authentication/Guards/Auth.Guard';
import { JwtStrategy } from './modules/Authentication/Strategies/Jwt.Strategy';
/** ALL USER MODULES IMPORT */
import { UserWebAdapter } from './modules/User/Adapters/Input/UserWebAdapter';
import { UserAdapter } from './modules/User/Adapters/Output/UserAdapter';
import { UserEntity } from './modules/User/Adapters/Output/db/UserEntity';
import { UserService } from './modules/User/Domain/UserService';

import { Redis } from 'ioredis';

@Module({
	imports: [
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.register({
			secret: process.env.JWT_SECRET || '15151456121561651451',
			signOptions: { expiresIn: '260s' },
		}),
	],
	controllers: [AuthenticationWebAdapter, UserWebAdapter],
	providers: [
		{
			useClass: AuthenticationService,
			provide: DependencyInjectionTokens.AUTH_TOKEN_USE_CASE,
		},
		{
			useClass: AuthenticationAdapter,
			provide: DependencyInjectionTokens.AUTH_TOKEN_OUTPUT_PORT,
		},
		{
			useClass: UserService,
			provide: DependencyInjectionTokens.USER_TOKEN_USE_CASE,
		},
		{
			useClass: UserAdapter,
			provide: DependencyInjectionTokens.USER_TOKEN_OUTPUT_PORT,
		},
		{
			provide: DependencyInjectionTokens.DATA_SOURCE,
			useFactory: async () => {
				const dataSource = new DataSource({
					type: 'postgres',
					url: process.env.CONNECTION_STRING,
					entities: [UserEntity],
					synchronize: true,
					// ssl: {
					// 	requestCert: true,
					// 	rejectUnauthorized: false,
					// },
				});

				return dataSource.initialize();
			},
		},
		{
			provide: DependencyInjectionTokens.REDIS_CLIENT,
			useFactory: () =>
				new Redis({
					host: process.env.REDIS_HOST || 'localhost',
					port: parseInt(process.env.REDIS_PORT) || 6379,
				}),
		},
		JwtStrategy,
		JwtAuthGuard,
	],
})
export class AppModule {}
