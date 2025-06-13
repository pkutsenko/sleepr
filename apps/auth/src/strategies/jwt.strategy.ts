import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../users/users.service";
import { Request } from "express";
import { TokenPayload } from "../interfaces/token-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService, private readonly usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: any) => {
                  return req?.cookies?.Authentication || req?.Authentication
                },
            ]),
            secretOrKey: configService.get('JWT_SECRET'),
        });
    }

    async validate({userId}: TokenPayload) {
        return this.usersService.getUser({_id: userId});
    }
}
