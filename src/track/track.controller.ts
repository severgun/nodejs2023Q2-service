import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { validate } from 'uuid';
import { Response } from 'express';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './interfaces/track.interface';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  getAll(): Track[] {
    return this.trackService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string, @Res() res: Response): void {
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

    res.status(HttpStatus.OK).send(track);
  }

  @Post()
  createTrack(@Body() dto: CreateTrackDto, @Res() res: Response): void {
    const newTrack = this.trackService.createTrack(dto);

    res.status(HttpStatus.CREATED).send(newTrack);
  }

  @Put(':id')
  updateTrack(
    @Body() dto: UpdateTrackDto,
    @Param('id') id: string,
    @Res() res: Response,
  ): void {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST).send('Not valid track ID.');
      return;
    }

    const track = this.trackService.getById(id);
    if (!track) {
      res.status(HttpStatus.NOT_FOUND).send('Track not found.');
      return;
    }

    const updatedTrack = this.trackService.updateTrack(dto, id);

    res.status(HttpStatus.OK).send(updatedTrack);
  }

  @Delete(':id')
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

    this.trackService.deleteTrack(id)
      ? res.status(HttpStatus.NO_CONTENT).send()
      : res.status(HttpStatus.NOT_FOUND).send('Track not found.');
  }
}
