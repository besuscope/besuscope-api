export interface UserInfo {
	id: number;
	email: string;
	username: string;
	profileImageUrl: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface UserUpdater {
	email?: string;
	walletAddress?: string;
	isAdmin?: boolean;
}

export interface UserData {
	id: number;
	email: string;
	username: string;
	password: string;
	profileImageUrl?: string;
	createdAt: Date;
	updatedAt: Date;
}
