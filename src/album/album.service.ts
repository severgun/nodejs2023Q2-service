import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

export interface Album {
  id: string; // uuid v4
  name: string;
  year: number;
  artistId: string | null; // refers to Artist
}

@Injectable()
export class AlbumService {
  private readonly albums: Map<string, Album> = new Map();

  getAll(): Album[] {
    return Array.from(this.albums.values());
  }

  getById(id: string): Album {
    return this.albums.get(id);
  }

  createAlbum(dto: CreateAlbumDto): Album {
    const id = uuidv4();
    const newAlbum: Album = {
      id,
      ...dto,
    };

    this.albums.set(id, newAlbum);

    return newAlbum;
  }

  updateAlbum(dto: UpdateAlbumDto, id: string): Album {
    const album = this.getById(id);

    album.name = dto.name;
    album.year = dto.year;
    album.artistId = dto.artistId;

    return album;
  }

  deleteAlbum(id: string) {
    this.albums.delete(id);
  }
}
