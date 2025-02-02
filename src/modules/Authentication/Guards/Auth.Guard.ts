import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(private readonly jwtService: JwtService) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();
		try {
			const authHeader = request.headers.authorization;
			if (!authHeader) throw new UnauthorizedException('Authorization header is missing');

			const token = authHeader.split(' ')[1];
			const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
			request.user = payload;

			return true;
		} catch (error) {
			throw new UnauthorizedException('Invalid token');
		}
	}
}
