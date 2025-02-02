import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class UserRegisterDTORequest {
	@ApiProperty({ example: 'user@example.com', description: 'The email of the user', required: true })
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty({ example: 'username', description: 'The username of the user', required: true })
	@IsNotEmpty()
	username: string;

	@ApiProperty({ example: 'strongpassword', description: 'The password of the user', required: true })
	@IsNotEmpty()
	password: string;

	@ApiProperty({ example: '/image/file.png', description: 'The profile image url', required: false })
	@IsOptional()
	@IsNotEmpty()
	profileImageUrl?: string;
}
