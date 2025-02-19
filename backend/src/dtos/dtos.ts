import { IsEmail, IsString, IsStrongPassword, Length, IsOptional, IsNumber } from "class-validator"
import { Transform } from 'class-transformer';
import { Providers } from "../utils/types";

export class userCredentialsDto {
    @Transform(({value}) => value.toLowerCase())
    @IsEmail()
    email:string;

    @IsStrongPassword({minLength: 8, minLowercase:1, minUppercase: 1, minNumbers: 1, minSymbols:0})
    @IsOptional()
    password?:string;
}

export class userPasswordChangeDto {
    @IsStrongPassword({minLength: 8, minLowercase:1, minUppercase: 1, minNumbers: 1, minSymbols:0})
    password:string;
}
export class searchQueryDto {
    @Transform(({ value }) => value.trim())
    @Length(1)
    @IsString()
    query:string;

    @IsString()
    provider: string
}

export class volumeDto {
    @IsNumber()
    newVolume: number;
}


