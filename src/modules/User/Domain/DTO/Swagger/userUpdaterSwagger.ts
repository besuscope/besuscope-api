import { UserUpdater } from '@modules/User/Domain/@types/user';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class UserUpdateSwagger {
	@ApiProperty({ example: 'anton@gmail.com' })
	@IsEmail()
	email: string;

	constructor(userData: UserUpdater) {
		this.email = userData.email;
	}
}
