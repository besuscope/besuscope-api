import { HttpStatus } from '@nestjs/common';

interface ApplicationErrorInterface {
	code: HttpStatus;
	message: string;
}

export class ApplicationError extends Error {
	code: HttpStatus;
	constructor(error: ApplicationErrorInterface) {
		super(error.message);
		this.name = this.constructor.name;
		this.code = error.code;
		Error.captureStackTrace(this, this.constructor);
	}
}

export class ContractError extends Error {
	code = HttpStatus.BAD_REQUEST;
	constructor(message: string) {
		super(message);
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}
}
