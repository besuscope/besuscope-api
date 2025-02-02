import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

class UserResponse {
	@ApiProperty({ example: 'user@example.com' })
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty({ example: 'username' })
	@IsString()
	@IsNotEmpty()
	username: string;

	@ApiProperty({ example: '/image/profile.png' })
	@IsString()
	@IsOptional()
	profileImageUrl?: string;

	@ApiProperty({ example: '2020-01-01T00:00:00.000Z' })
	@IsNotEmpty()
	createdAt: Date;
}

export class UserRegisterResponse {
	@ApiProperty({ example: 'User registered successfully' })
	@IsString()
	message: string;

	@ApiProperty({ type: UserResponse })
	user: UserResponse;
}
