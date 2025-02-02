export class UserNotFoundError extends Error {
	statusCode: number;
	constructor(message: string) {
		super(message);
		this.name = 'UserNotFoundError';
		this.statusCode = 404;
	}
}

export class InternalServerError extends Error {
	statusCode: number;
	constructor(message: string) {
		super(message);
		this.name = 'InternalServerError';
		this.statusCode = 500;
	}
}

export class BadRequestError extends Error {
	statusCode: number;
	constructor(message: string) {
		super(message);
		this.name = 'BadRequestError';
		this.statusCode = 400;
	}
}
