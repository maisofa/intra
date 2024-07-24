import { IsNotEmpty, IsString } from "class-validator"

export class RegisterUserDto {
    @IsString()
    @IsNotEmpty()
    @IsString()
    @IsNotEmpty()
    name: string
    @IsString()
    @IsNotEmpty()
    email: string
    @IsString()
    @IsNotEmpty()
    password: string
    @IsString()
    @IsNotEmpty()
    departament_id: string
}
