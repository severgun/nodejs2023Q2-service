import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './interfaces/artist.interface';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<Artist[]> {
    return this.prisma.artist.findMany();
  }

  async getById(id: string): Promise<Artist> {
    return this.prisma.artist.findUnique({
      where: {
        id,
      },
    });
  }

  async createArtist(dto: CreateArtistDto): Promise<Artist> {
    const id = uuidv4();
    const newArtist: Artist = {
      id,
      ...dto,
    };

    return this.prisma.artist.create({
      data: newArtist,
    });
  }

  async updateArtist(dto: UpdateArtistDto, id: string): Promise<Artist> {
    return this.prisma.artist.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async deleteArtist(id: string): Promise<boolean> {
    try {
      await this.prisma.artist.delete({
        where: {
          id,
        },
      });

      return true;
    } catch (error) {
      return false;
    }
  }
}
