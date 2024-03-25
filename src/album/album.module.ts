import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { StoreModule } from 'src/store/store.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [StoreModule],
  controllers: [AlbumController],
  providers: [AlbumService, PrismaService],
  exports: [AlbumService],
})
export class AlbumModule {}
