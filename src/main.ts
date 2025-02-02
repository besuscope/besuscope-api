import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'dotenv';
import { AppModule } from './app.module';
import { BaseUrls } from './helper/AppConstants';

config();

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		logger: ['error', 'log'],
		cors: true,
	});

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			transformOptions: {
				enableImplicitConversion: true,
			},
		}),
	);

	app.setGlobalPrefix(BaseUrls.API_BASE_URL);

	const swaggerConfig = new DocumentBuilder()
		.setTitle('BesuScope API')
		.setDescription('API para o projeto BesuScope.')
		.setVersion('1.0.0')

		.addBearerAuth(
			{
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
				in: 'header',
				name: 'Authorization',
			},
			'JWT-auth',
		)
		.build();

	const document = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup('api', app, document);

	await app.listen(process.env.PORT || 3000);
}

bootstrap();
