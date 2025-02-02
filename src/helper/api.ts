import axios from 'axios';

export const api = axios.create({
	baseURL: process.env.API_URL,
});

export function getUserByEmail(email: string) {
	return api.get(`/user/get/${email}`);
}

export const walletEngineAPI = axios.create({
	baseURL: process.env.SIGN_SERVICE_API,
});
