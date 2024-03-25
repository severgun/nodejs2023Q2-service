import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './interfaces/track.interface';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<Track[]> {
    return await this.prisma.track.findMany();
  }

  async getById(id: string): Promise<Track> {
    return this.prisma.track.findUnique({
      where: {
        id,
      },
    });
  }

  async createTrack(dto: CreateTrackDto): Promise<Track> {
    const id = uuidv4();
    const newTrack: Track = {
      id,
      ...dto,
    };

    return this.prisma.track.create({
      data: newTrack,
    });
  }

  async updateTrack(dto: UpdateTrackDto, id: string): Promise<Track> {
    return this.prisma.track.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async deleteTrack(id: string): Promise<boolean> {
    try {
      await this.prisma.track.delete({
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
