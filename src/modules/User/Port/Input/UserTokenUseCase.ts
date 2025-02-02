import { UserInfo, UserUpdater } from '@modules/User/Domain/@types/user';
import { UserRegisterDTORequest } from '@modules/User/Domain/DTO/HTTPRequest/userHttpRequest';
import { UserRegisterResponse } from '@modules/User/Domain/DTO/HTTPResponse/userHttpResponse';

export interface UserTokenUseCase {
	register(registerUserDTO: UserRegisterDTORequest): Promise<UserRegisterResponse>;
	deleteUser(email: string): Promise<string>;
	updateUser(email: string, updatedUserData: UserUpdater): Promise<UserInfo>;
	getUser(email: string): Promise<UserInfo | undefined>;
}
