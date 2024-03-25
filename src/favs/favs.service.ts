import { Injectable } from '@nestjs/common';
import { ArtistService } from 'src/artist/artist.service';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from 'src/track/track.service';
import { Artist } from 'src/artist/interfaces/artist.interface';
import { Album } from 'src/album/interfaces/album.interface';
import { Track } from 'src/track/interfaces/track.interface';
import { StoreService } from 'src/store/store.service';
import { PrismaService } from 'src/prisma.service';

export interface Favorites {
  artists: Set<string>; // favorite artists ids
  albums: Set<string>; // favorite albums ids
  tracks: Set<string>; // favorite tracks ids
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
    private storeService: StoreService,
    private prisma: PrismaService,
  ) {}

  async getAll(): Promise<FavoritesResponse> {
    return {
      artists: Array.from(this.storeService.favorites.artists).map((id) =>
        this.artistService.getById(id),
      ),
      albums: await this.prisma.album.findMany(),
      // albums: Array.from(this.storeService.favorites.albums).map((id) =>
      //   this.albumService.getById(id),
      // ),
      tracks: Array.from(this.storeService.favorites.tracks).map((id) =>
        this.trackService.getById(id),
      ),
    };
  }

  addFavoriteArtist(id): boolean {
    if (this.artistService.getById(id)) {
      this.storeService.favorites.artists.add(id);
      return true;
    }

    return false;
  }

  addFavoriteAlbum(id): boolean {
    if (this.albumService.getById(id)) {
      this.storeService.favorites.albums.add(id);
      return true;
    }

    return false;
  }

  addFavoriteTrack(id): boolean {
    if (this.trackService.getById(id)) {
      this.storeService.favorites.tracks.add(id);
      return true;
    }

    return false;
  }

  deleteFavoriteArtist(id: string): boolean {
    return this.storeService.favorites.artists.delete(id);
  }

  deleteFavoriteAlbum(id: string): boolean {
    return this.storeService.favorites.albums.delete(id);
  }

  deleteFavoriteTrack(id: string): boolean {
    return this.storeService.favorites.tracks.delete(id);
  }
}
