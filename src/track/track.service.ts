import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './interfaces/track.interface';
import { StoreService } from 'src/store/store.service';

@Injectable()
export class TrackService {
  constructor(private storeService: StoreService) {}

  getAll(): Track[] {
    return Array.from(this.storeService.tracks.values());
  }

  getById(id: string): Track {
    return this.storeService.tracks.get(id);
  }

  createTrack(dto: CreateTrackDto): Track {
    const id = uuidv4();
    const newTrack: Track = {
      id,
      ...dto,
    };

    this.storeService.tracks.set(id, newTrack);

    return newTrack;
  }

  updateTrack(dto: UpdateTrackDto, id: string): Track {
    const track = this.getById(id);

    track.name = dto.name;
    track.artistId = dto.artistId;
    track.albumId = dto.albumId;
    track.duration = dto.duration;

    return track;
  }

  deleteTrack(id: string): boolean {
    const tracks = this.storeService.tracks;
    if (tracks.has(id)) {
      this.storeService.favorites.tracks.delete(id);

      this.storeService.tracks.delete(id);

      return true;
    }

    return false;
  }
}
