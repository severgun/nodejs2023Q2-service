import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './interfaces/artist.interface';

@Injectable()
export class ArtistService {
  private readonly artists: Map<string, Artist> = new Map();

  getAll(): Artist[] {
    return Array.from(this.artists.values());
  }

  getById(id: string): Artist {
    return this.artists.get(id);
  }

  createArtist(dto: CreateArtistDto): Artist {
    const id = uuidv4();
    const newArtist: Artist = {
      id,
      ...dto,
    };

    this.artists.set(id, newArtist);

    return newArtist;
  }

  updateArtist(dto: UpdateArtistDto, id: string): Artist {
    const artist = this.getById(id);

    artist.name = dto.name;
    artist.grammy = dto.grammy;

    return artist;
  }

  deleteArtist(id: string): boolean {
    return this.artists.delete(id);
  }
}
