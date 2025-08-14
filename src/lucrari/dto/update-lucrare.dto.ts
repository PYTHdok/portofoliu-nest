import { CreateLucrareDto } from "./create-lucrari.dto"
import { PartialType } from "@nestjs/mapped-types"

export class UpdateLucrareDto extends PartialType(CreateLucrareDto) { }