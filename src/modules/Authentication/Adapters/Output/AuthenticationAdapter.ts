import { DependencyInjectionTokens } from '@helper/AppConstants';
import { LoginDTO } from '@modules/Authentication/Domain/DTO/HTTPRequest/AuthenticationRequest';
import { AuthenticationTokenOutputPort } from '@modules/Authentication/Port/Output/AuthenticationTokenOutputPort';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '@user/Adapters/Output/db/UserEntity';
import * as bcrypt from 'bcrypt';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class AuthenticationAdapter implements AuthenticationTokenOutputPort {
	constructor(
		@Inject(DependencyInjectionTokens.DATA_SOURCE) private readonly dataSource: DataSource,
		private readonly jwtService: JwtService,
	) {}

	private readonly userRepository: Repository<UserEntity> = this.dataSource.getRepository(UserEntity);

	async login(loginDTO: LoginDTO): Promise<{ access_token: string }> {
		const user = await this.userRepository.findOneBy({ email: loginDTO.email });

		if (!user) throw new Error('User not found');
		if (!loginDTO.password) throw new Error('Password is required');

		const isMatch = await bcrypt.compare(loginDTO.password, user.password);

		if (!isMatch) throw new Error('Invalid credentials');

		const payload = { email: user.email, sub: user.id };
		const access_token = this.jwtService.sign(payload);
		return { access_token };
	}
	async validateUser(payload: any): Promise<any> {
		return await this.userRepository.findOneBy({ id: payload.sub });
	}
}
