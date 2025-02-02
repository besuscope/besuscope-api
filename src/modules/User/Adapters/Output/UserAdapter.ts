// src/modules/Authentication/Adapters/Output/AuthenticationAdapter.ts
import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DataSource, Repository } from 'typeorm';
import { UserRegisterDTORequest } from '../../Domain/DTO/HTTPRequest/userHttpRequest';
import { InternalServerError, UserNotFoundError } from '../../Domain/errors/user.errors';
import { UserEntity } from './db/UserEntity';

import { DependencyInjectionTokens } from '@helper/AppConstants';
import { UserData, UserInfo, UserUpdater } from '../../Domain/@types/user';

@Injectable()
export class UserAdapter {
	constructor(@Inject(DependencyInjectionTokens.DATA_SOURCE) private readonly dataSource: DataSource) {}

	private readonly userRepository: Repository<UserEntity> = this.dataSource.getRepository(UserEntity);

	async register(registerUserDTO: UserRegisterDTORequest): Promise<UserData> {
		const { email, username, password, profileImageUrl } = registerUserDTO;
		if (!password) throw new InternalServerError('Password is required');
		if (!username) throw new InternalServerError('Username is required');
		if (!email) throw new InternalServerError('Email is required');

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = this.userRepository.create({
			email,
			username,
			profileImageUrl,
			password: hashedPassword,
		});

		// 2. Salva o novo usuário no banco de dados
		await this.userRepository.save(newUser);

		return newUser;
	}

	async getUser(email: string): Promise<UserInfo | undefined> {
		const user = await this.userRepository.findOne({
			select: ['id', 'email', 'username', 'profileImageUrl', 'createdAt', 'updatedAt'],
			where: { email },
		});

		if (!user) return undefined;

		return user;
	}

	async deleteUser(email: string): Promise<string> {
		const user = await this.userRepository.findOne({ where: { email } });
		if (!user) throw new UserNotFoundError('User not found');
		const result = await this.userRepository.delete({ id: user.id });
		return result.affected === 1 ? 'User deleted successfully' : 'User not found';
	}

	async updateUser(email: string, updatedUserData: UserUpdater): Promise<UserData> {
		const user = await this.userRepository.findOne({ where: { email } });
		if (!user) throw new UserNotFoundError('User not found');

		const allowedUpdates = ['email'];
		allowedUpdates.forEach((field) => {
			if (field in updatedUserData) user[field] = updatedUserData[field];
		});

		await this.userRepository.save(user);
		return user;
	}
}
