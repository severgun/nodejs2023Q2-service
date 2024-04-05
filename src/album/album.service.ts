import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './interfaces/album.interface';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<Album[]> {
    return this.prisma.album.findMany();
  }

  async getById(id: string): Promise<Album> {
    return this.prisma.album.findUnique({
      where: {
        id,
      },
    });
  }

  async createAlbum(dto: CreateAlbumDto): Promise<Album> {
    const id = uuidv4();
    const newAlbum: Album = {
      id,
      ...dto,
    };

    return this.prisma.album.create({
      data: newAlbum,
    });
  }

  async updateAlbum(dto: UpdateAlbumDto, id: string): Promise<Album> {
    return this.prisma.album.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async deleteAlbum(id: string): Promise<boolean> {
    try {
      await this.prisma.album.delete({
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
