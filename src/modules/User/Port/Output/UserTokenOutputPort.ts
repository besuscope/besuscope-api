import { UserData, UserInfo, UserUpdater } from '@modules/User/Domain/@types/user';
import { UserRegisterDTORequest } from '@modules/User/Domain/DTO/HTTPRequest/userHttpRequest';

export interface UserTokenOutputPort {
	register(registerUserDTO: UserRegisterDTORequest): Promise<UserData>;
	deleteUser(email: string): Promise<string>;
	updateUser(email: string, updatedUserData: UserUpdater): Promise<UserInfo>;
	getUser(email: string): Promise<UserInfo | undefined>;
}
