import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { StoreModule } from 'src/store/store.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [StoreModule],
  controllers: [TrackController],
  providers: [TrackService, PrismaService],
  exports: [TrackService],
})
export class TrackModule {}
