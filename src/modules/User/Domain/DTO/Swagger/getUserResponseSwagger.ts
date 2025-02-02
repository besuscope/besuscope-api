import { UserData } from '@modules/User/Domain/@types/user';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsNumber } from 'class-validator';

export class GetUserResponseSwagger {
	@ApiProperty({ example: 2 })
	@IsNumber()
	id: number;

	@ApiProperty({ example: 'anton@gmail.com' })
	@IsEmail()
	email: string;

	@ApiProperty({ example: '2024-02-04T00:05:07.652Z' })
	@IsDateString()
	createdAt: Date;

	@ApiProperty({ example: '2024-02-04T00:05:07.652Z' })
	@IsDateString()
	updatedAt: Date;

	constructor(userData: UserData) {
		this.id = userData.id;
		this.email = userData.email;
		this.createdAt = new Date(userData.createdAt);
		this.updatedAt = new Date(userData.updatedAt);
	}
}
