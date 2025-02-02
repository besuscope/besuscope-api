import { LoginDTO } from '../../Domain/DTO/HTTPRequest/AuthenticationRequest';

export interface AuthenticationTokenUseCase {
	login(loginDTO: LoginDTO): Promise<{ access_token: string }>;
	validateUser(payload: any): Promise<any>;
}
