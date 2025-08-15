import { Body, Controller, Get, Param, Post, Patch, Delete, Query, ParseIntPipe, ValidationPipe, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path'; 
import { LucrariService } from './lucrari.service';
import { CreateLucrareDto } from './dto/create-lucrari.dto';
import { UpdateLucrareDto } from './dto/update-lucrare.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { unlinkSync } from 'fs';
import { join } from 'path';

@Controller('lucrari')
export class LucrariController {

    constructor(private readonly lucrariService: LucrariService) {}

    @Get() // GET /lucrari or /lucrari?role=value
    findAll(@Query('status') status?: 'visible' | 'hidden') {
        return this.lucrariService.findAll(status)
    }

    @Get(':id') // GET /lucrari/:id
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.lucrariService.findOne(id)
    }

    @Post() // POST /lucrari
    @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createLucrareDto: CreateLucrareDto,
  ) {
    if (!file) {
      throw new BadRequestException('Imaginea este obligatorie');
    }

    return this.lucrariService.create({
      ...createLucrareDto,
      imagePath: `/uploads/${file.filename}`,
    });
  }


    @Patch(':id')
    @UseInterceptors(FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }))
    async update(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateLucrareDto: UpdateLucrareDto,
      @UploadedFile() file?: Express.Multer.File
    ) {
      console.log('Fișier primit:', file?.filename);

      if (file) {
        // Șterge vechea imagine dacă există
        const oldLucrare = await this.lucrariService.findOne(id);
        if (oldLucrare.imagePath) {
          try {
            unlinkSync(join(__dirname, '..', '..', oldLucrare.imagePath));
          } catch (err) {
            console.error('Eroare la ștergerea imaginii vechi:', err);
          }
        }
        updateLucrareDto.imagePath = `/uploads/${file.filename}`;
      }

      return this.lucrariService.update(id, updateLucrareDto);
    }
    
    @Delete(':id') // DELETE /lucrari/:id
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.lucrariService.remove(id)
    }

    @Delete('image/:filename')
    async deleteImage(@Param('filename') filename: string) {
      try {
        const filePath = join(__dirname, '..', '..', 'uploads', filename);
        unlinkSync(filePath);
        return { message: 'Imagine ștearsă cu succes' };
      } catch (error) {
        throw new BadRequestException('Ștergerea imaginii a eșuat');
      }
    }

    @Get('sterge-invalide')
    async stergeInvalide() {
      return this.lucrariService.stergeInregistrariInvalide();
    }
}

