import {
  IsEmail,
  IsString,
  IsStrongPassword,
  Length,
  IsOptional,
  IsNumber,
  IsAlphanumeric,
  IsAlpha,
} from "class-validator";
import { Transform, Type } from "class-transformer";

export class userCredentialsDto {
  @Transform(({ value }) => value.toLowerCase())
  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
  })
  @IsOptional()
  password?: string;
}

export class userPasswordChangeDto {
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
  })
  password: string;
}
export class searchQueryDto {
  @Transform(({ value }) => value.trim())
  @Length(1)
  @IsString()
  query: string;

  @IsString()
  @IsAlpha()
  provider: string;

  @Type(() => Number)
  @IsNumber()
  limit: number;

  @Type(() => Number)
  @IsNumber()
  offset: number;
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

// Playlist DTO's
export class createPlaylistDTO {
  @IsString()
  @IsAlphanumeric()
  name: string;
}

export class removePlaylistDTO {
  @IsNumber()
  playlistId: number;
}

// Used for Insert and Delete
export class playlistTrackDTO {
  @IsNumber()
  playlistId: number;

  @IsString()
  trackId: number;

  @IsString()
  @IsAlphanumeric()
  provider: string;
}

export class getPlaylistTracksDTO {
  @IsNumber()
  @Type(() => Number)
  playlistId: number;
}

export class disconnectProviderDto {
  @IsString()
  @IsAlpha()
  provider: string;
}
