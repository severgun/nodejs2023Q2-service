import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { validate } from 'uuid';
import { Response } from 'express';
import { Track, TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  getAll(): Track[] {
    return this.trackService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string, @Res() res: Response): Track {
    // TODO: Refactor repeated checks
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST).send('Not valid track ID.');
      return;
    }

    const track = this.trackService.getById(id);

    if (!track) {
      res.status(HttpStatus.NOT_FOUND).send('Track not found.');
      return;
    }

    return track;
  }

  @Post()
  createTrack(@Body() dto: CreateTrackDto, @Res() res: Response): Track {
    if (!dto.name || !dto.albumId || !dto.artistId || !dto.duration) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .send('Required fields are not provided.');
      return;
    }

    return this.trackService.createTrack(dto);
  }

  @Put(':id')
  updateTrack(
    @Body() dto: UpdateTrackDto,
    @Param('id') id: string,
    @Res() res: Response,
  ): Track {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST).send('Not valid track ID.');
      return;
    }

    const track = this.trackService.getById(id);
    if (!track) {
      res.status(HttpStatus.NOT_FOUND).send('Track not found.');
      return;
    }

    return this.trackService.updateTrack(dto, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTrack(@Param('id') id: string, @Res() res: Response) {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST).send('Not valid track ID.');
      return;
    }

    const track = this.trackService.getById(id);
    if (!track) {
      res.status(HttpStatus.NOT_FOUND).send('Track not found.');
      return;
    }

    this.trackService.deleteTrack(id);
  }
}
