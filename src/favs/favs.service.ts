import { Injectable } from '@nestjs/common';
import { ArtistService } from 'src/artist/artist.service';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from 'src/track/track.service';
import { Artist } from 'src/artist/interfaces/artist.interface';
import { Album } from 'src/album/interfaces/album.interface';
import { Track } from 'src/track/interfaces/track.interface';
import { PrismaService } from 'src/prisma.service';

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
    private prisma: PrismaService,
  ) {
    this.init();
  }

  private id: string;

  async init() {
    const newFavs = await this.prisma.favorites.create({
      data: {
        artists: [],
        albums: [],
        tracks: [],
      },
    });

    this.id = newFavs.id;
  }

  async getAll(): Promise<FavoritesResponse> {
    const favorites = await this.prisma.favorites.findUnique({
      where: {
        id: this.id,
      },
    });

    const artists = await this.prisma.artist.findMany({
      where: {
        id: {
          in: favorites.artists,
        },
      },
    });

    const albums = await this.prisma.album.findMany({
      where: {
        id: {
          in: favorites.albums,
        },
      },
    });

    const tracks = await this.prisma.track.findMany({
      where: {
        id: {
          in: favorites.tracks,
        },
      },
    });

    return {
      artists,
      albums,
      tracks,
    };
  }

  async addFavoriteArtist(id: string): Promise<boolean> {
    const artist = await this.artistService.getById(id);

    if (artist) {
      await this.prisma.favorites.update({
        where: {
          id: this.id,
        },
        data: {
          artists: {
            push: id,
          },
        },
      });
      return true;
    }

    return false;
  }

  async addFavoriteAlbum(id: string): Promise<boolean> {
    const album = await this.albumService.getById(id);

    if (album) {
      await this.prisma.favorites.update({
        where: {
          id: this.id,
        },
        data: {
          albums: {
            push: id,
          },
        },
      });
      return true;
    }

    return false;
  }

  async addFavoriteTrack(id: string): Promise<boolean> {
    const track = await this.trackService.getById(id);

    if (track) {
      await this.prisma.favorites.update({
        where: {
          id: this.id,
        },
        data: {
          tracks: {
            push: id,
          },
        },
      });
      return true;
    }

    return false;
  }

  async deleteFavoriteArtist(id: string): Promise<boolean> {
    const { artists } = await this.prisma.favorites.findUnique({
      where: { id: this.id },
    });

    try {
      await this.prisma.favorites.update({
        where: {
          id: this.id,
        },
        data: {
          artists: {
            set: artists.filter((artistId) => artistId !== id),
          },
        },
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteFavoriteAlbum(id: string): Promise<boolean> {
    const { albums } = await this.prisma.favorites.findUnique({
      where: { id: this.id },
    });

    try {
      await this.prisma.favorites.update({
        where: {
          id: this.id,
        },
        data: {
          albums: {
            set: albums.filter((albumId) => albumId !== id),
          },
        },
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteFavoriteTrack(id: string): Promise<boolean> {
    const { tracks } = await this.prisma.favorites.findUnique({
      where: { id: this.id },
    });

    try {
      await this.prisma.favorites.update({
        where: {
          id: this.id,
        },
        data: {
          tracks: {
            set: tracks.filter((trackId) => trackId !== id),
          },
        },
      });

      return true;
    } catch (error) {
      return false;
    }
  }
}
