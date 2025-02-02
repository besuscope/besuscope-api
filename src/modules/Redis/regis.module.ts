import { Global, Module } from '@nestjs/common';
import { Redis } from 'ioredis';

@Global()
@Module({
	providers: [
		{
			provide: 'REDIS_CLIENT',
			useFactory: () => {
				const redis = new Redis({
					host: process.env.REDIS_HOST || '127.0.0.1',
					port: parseInt(process.env.REDIS_PORT || '6379', 10),
				});
				return redis;
			},
		},
	],
	exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
