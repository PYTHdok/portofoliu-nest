import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lucrare } from './lucrare.entity';
import { CreateLucrareDto } from './dto/create-lucrari.dto';
import { UpdateLucrareDto } from './dto/update-lucrare.dto';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';

@Injectable()
export class LucrariService {
  constructor(
    @InjectRepository(Lucrare)
    private lucrariRepository: Repository<Lucrare>,
  ) {}
//      private lucrari = [
//      {
//     id: 1,
//     image: "",
//     title: "Web design",
//     descriere: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam amet earum maxime officia itaque rem!",
//     link_client: "",
//     status: "visible"
//   },
//   {
//     id: 2,
//     image: "",
//     title: "App movil",
//     descriere: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam amet earum maxime officia itaque rem!",
//     link_client: "",
//     status: "visible"
//   },
//   {
//     id: 3,
//     image: "",
//     title: "Brand design",
//     descriere: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam amet earum maxime officia itaque rem!",
//     link_client: "",
//     status: "hidden"
//   },
//   {
//     id: 4,
//     image: "",
//     title: "App movil",
//     descriere: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam amet earum maxime officia itaque rem!",
//     link_client: "",
//     status: "hidden"
//   },
//   {
//     id: 5,
//     image: "",
//     title: "Web design",
//     descriere: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam amet earum maxime officia itaque rem!",
//     link_client: "",
//     status: "visible"
//   },
//   {
//     id: 6,
//     image: "",
//     title: "Forest Env",
//     descriere: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam amet earum maxime officia itaque rem!",
//     link_client: "",
//     status: "visible"
//   },
//  ];

    async findAll(status?: 'visible' | 'hidden'): Promise<Lucrare[]> {
        const options = status ? { where: { status } } : {};
        return this.lucrariRepository.find(options);
  }
    

    async findOne(id: number): Promise<Lucrare> {
        const lucrare = await this.lucrariRepository.findOne({ where: { id } });
        if (!lucrare) {
          throw new NotFoundException(`Lucrarea #${id} nu există`);
        }
        return lucrare;
    }

    async create(createLucrareDto: CreateLucrareDto): Promise<Lucrare> {
      // Verificare daca imagePatch exista in DTo

         if (!createLucrareDto.imagePath) {
         throw new Error('Calea imaginii este necesară');
         }
         
         const lucrare = this.lucrariRepository.create(createLucrareDto);
         return this.lucrariRepository.save(lucrare);
    }

    async update(id: number, updateLucrareDto: UpdateLucrareDto): Promise<Lucrare> {
      console.log('Actualizează lucrare:', { id, dto: updateLucrareDto });
      
      const lucrare = await this.lucrariRepository.preload({
        id,
        ...updateLucrareDto
      });

      if (!lucrare) {
        throw new NotFoundException(`Lucrarea #${id} nu există`);
      }

      return this.lucrariRepository.save(lucrare);
    }

    async remove(id: number): Promise<void> {
      const result = await this.lucrariRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Lucrarea #${id} nu există`);
      }
    }

    async stergeInregistrariInvalide() {
    const toateLucrarile = await this.lucrariRepository.find();
    const lucrariInvalide: number[] = [];

    for (const lucrare of toateLucrarile) {
      const caleFisier = join(__dirname, '..', '..', lucrare.imagePath); // ajusteaza calea
      if (!existsSync(caleFisier)) {
        lucrariInvalide.push(lucrare.id);
      }
    }

    if (lucrariInvalide.length > 0) {
      await this.lucrariRepository.delete(lucrariInvalide);
      return `Șterse ${lucrariInvalide.length} înregistrări invalide.`;
    } else {
      return 'Nu există înregistrări invalide.';
    }
  }
}
