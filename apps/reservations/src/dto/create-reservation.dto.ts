import { IsDate, IsDefined, IsNotEmpty, IsNotEmptyObject, IsNumber, IsString } from "class-validator";
import { Type } from "class-transformer";
import { CardDto, CreateChargeDto } from "@app/common";
import { ValidateNested } from "class-validator";

export class CreateReservationDto {
    @IsDate()
    @Type(() => Date)
    startDate: Date;

    @IsDate()
    @Type(() => Date)
    endDate: Date;

    @IsDefined()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => CreateChargeDto)
    charge: CreateChargeDto;
}
