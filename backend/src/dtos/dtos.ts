import { IsEmail, IsString, IsStrongPassword, Length, IsOptional, IsNumber, IsAlphanumeric, IsAlpha, isString } from "class-validator"
import { Transform } from 'class-transformer';

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
    @IsAlpha()
    provider: string;
}

export class volumeDto {
    @IsNumber()
    newVolume: number;
}
export class favoriteTrackDto {
    @IsString()
    trackId: string;

    @IsString()
    @IsAlpha()
    provider: string;
}

export class createPlaylistDTO {
    @IsString()
    @IsAlphanumeric()
    name: string;

    @IsString()
    image_url?: string;

}

export class playlistTrackDTO {
    @IsNumber()
    playlist_id: number;

    @IsString()
    track_id: number;

    @IsString()
    @IsAlphanumeric()
    provider: string;
}