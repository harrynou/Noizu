import { IsEmail, IsString, isString, IsStrongPassword, Length } from "class-validator"
import { Transform } from 'class-transformer';

export class userCredentialsDto {
    @Transform(({value}) => value.toLowerCase())
    @IsEmail()
    email:string;

    @IsStrongPassword({minLength: 8, minLowercase:1, minUppercase: 1, minNumbers: 1, minSymbols:0})
    password?:string;
}


