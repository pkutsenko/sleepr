import { Injectable } from "@nestjs/common";
import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { AUTH_SERVICE } from "../constants/services";
import { tap, map, catchError } from "rxjs";
import { UserDto } from "../dto";
import { of } from "rxjs";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const token = request.cookies?.Authentication;
        if (!token) {
            return false;
        }
        return this.authClient.send<UserDto>('authenticate', {
            Authentication: token,
        }).pipe(
            tap(res => {
                context.switchToHttp().getRequest().user = res;
            }),
            map(() => true),
            catchError(() => of(false)),
        );
    }
}