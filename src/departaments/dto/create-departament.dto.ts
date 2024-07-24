import { IsNotEmpty, IsString } from "class-validator";

export class CreateDepartamentDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}
