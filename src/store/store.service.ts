import { Injectable } from '@nestjs/common';
import { Album } from 'src/album/interfaces/album.interface';
import { Artist } from 'src/artist/interfaces/artist.interface';
import { Favorites } from 'src/favs/favs.service';
import { Track } from 'src/track/interfaces/track.interface';

@Injectable()
export class StoreService {
  readonly favorites: Favorites = {
    artists: new Set<string>(),
    albums: new Set<string>(),
    tracks: new Set<string>(),
  };

  readonly artists: Map<string, Artist> = new Map();

  readonly albums: Map<string, Album> = new Map();

  readonly tracks: Map<string, Track> = new Map();
}
