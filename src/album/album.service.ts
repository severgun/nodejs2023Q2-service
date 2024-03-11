import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './interfaces/album.interface';
import { StoreService } from 'src/store/store.service';

@Injectable()
export class AlbumService {
  constructor(private storeService: StoreService) {}

  getAll(): Album[] {
    return Array.from(this.storeService.albums.values());
  }

  getById(id: string): Album {
    return this.storeService.albums.get(id);
  }

  createAlbum(dto: CreateAlbumDto): Album {
    const id = uuidv4();
    const newAlbum: Album = {
      id,
      ...dto,
    };

    this.storeService.albums.set(id, newAlbum);

    return newAlbum;
  }

  updateAlbum(dto: UpdateAlbumDto, id: string): Album {
    const album = this.getById(id);

    album.name = dto.name;
    album.year = dto.year;
    album.artistId = dto.artistId;

    return album;
  }

  deleteAlbum(id: string): boolean {
    const albums = this.storeService.albums;
    if (albums.has(id)) {
      this.storeService.tracks.forEach((track) => {
        if (track.albumId === id) {
          track.albumId = null;
        }
      });

      this.storeService.favorites.albums.delete(id);

      this.storeService.albums.delete(id);

      return true;
    }
    return false;
  }
}
