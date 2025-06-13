import { CardDto } from "./card.dto";
import { IsDefined, IsNotEmptyObject, ValidateNested, IsEmail } from "class-validator";
import { IsNumber } from "class-validator";
import { Type } from "class-transformer";

export class CreateChargeDto {
    @IsDefined()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => CardDto)
    card: CardDto;

    @IsNumber()
    amount: number;
}
    