import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { StoreModule } from 'src/store/store.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [StoreModule],
  controllers: [ArtistController],
  providers: [ArtistService, PrismaService],
  exports: [ArtistService],
})
export class ArtistModule {}
