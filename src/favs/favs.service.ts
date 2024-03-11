import { Injectable } from '@nestjs/common';
import { ArtistService } from 'src/artist/artist.service';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from 'src/track/track.service';
import { Artist } from 'src/artist/interfaces/artist.interface';
import { Album } from 'src/album/interfaces/album.interface';
import { Track } from 'src/track/interfaces/track.interface';

export interface Favorites {
  artists: string[]; // favorite artists ids
  albums: string[]; // favorite albums ids
  tracks: string[]; // favorite tracks ids
}

export interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}

@Injectable()
export class FavoritesService {
  constructor(
    private artistService: ArtistService,
    private albumService: AlbumService,
    private trackService: TrackService,
  ) {}

  private favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  getAll(): FavoritesResponse {
    return {
      artists: this.favorites.artists.map((id) =>
        this.artistService.getById(id),
      ),
      albums: this.favorites.albums.map((id) => this.albumService.getById(id)),
      tracks: this.favorites.tracks.map((id) => this.trackService.getById(id)),
    };
  }

  addFavoriteArtist(id): boolean {
    if (this.artistService.getById(id)) {
      this.favorites.artists.push(id);
      return true;
    }

    return false;
  }

  addFavoriteAlbum(id): boolean {
    if (this.albumService.getById(id)) {
      this.favorites.albums.push(id);
      return true;
    }

    return false;
  }

  addFavoriteTrack(id): boolean {
    if (this.trackService.getById(id)) {
      this.favorites.tracks.push(id);
      return true;
    }

    return false;
  }

  // deleteFavoriteArtist(): void {}
  // deleteFavoriteAlbum(): void {}
  // deleteFavoriteTrack(): void {}
}
