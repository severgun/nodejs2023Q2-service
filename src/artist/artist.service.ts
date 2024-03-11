import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './interfaces/artist.interface';
import { StoreService } from 'src/store/store.service';

@Injectable()
export class ArtistService {
  constructor(private storeService: StoreService) {}

  getAll(): Artist[] {
    return Array.from(this.storeService.artists.values());
  }

  getById(id: string): Artist {
    return this.storeService.artists.get(id);
  }

  createArtist(dto: CreateArtistDto): Artist {
    const id = uuidv4();
    const newArtist: Artist = {
      id,
      ...dto,
    };

    this.storeService.artists.set(id, newArtist);

    return newArtist;
  }

  updateArtist(dto: UpdateArtistDto, id: string): Artist {
    const artist = this.getById(id);

    artist.name = dto.name;
    artist.grammy = dto.grammy;

    return artist;
  }

  deleteArtist(id: string): boolean {
    const artists = this.storeService.artists;
    if (artists.has(id)) {
      this.storeService.albums.forEach((album) => {
        if (album.artistId === id) {
          album.artistId = null;
        }
      });

      this.storeService.tracks.forEach((track) => {
        if (track.artistId === id) {
          track.artistId = null;
        }
      });

      this.storeService.favorites.artists.delete(id);

      this.storeService.artists.delete(id);

      return true;
    }
    return false;
  }
}
