import { Module } from '@nestjs/common';
import { FavoritesController } from './favs.controller';
import { FavoritesService } from './favs.service';
import { ArtistModule } from 'src/artist/artist.module';
import { AlbumModule } from 'src/album/album.module';
import { TrackModule } from 'src/track/track.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [ArtistModule, AlbumModule, TrackModule],
  controllers: [FavoritesController],
  providers: [FavoritesService, PrismaService],
})
export class FavoritesModule {}
