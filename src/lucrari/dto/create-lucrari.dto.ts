import { IsEnum, IsNotEmpty, IsString, IsOptional} from "class-validator";

export class CreateLucrareDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    descriere: string;

    @IsOptional()
    @IsString()
    link_client?: string;

    @IsEnum(["visible","hidden"])
    status: "visible" | "hidden";

     @IsString()
    @IsNotEmpty()
    imagePath: string;
}