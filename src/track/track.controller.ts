import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
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

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  async getAll() {
    return await this.trackService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string, @Res() res: Response) {
    // TODO: Refactor repeated checks
    if (!validate(id)) {
      throw new BadRequestException('Not valid track ID.');
    }

    const track = await this.trackService.getById(id);

    if (!track) {
      throw new NotFoundException('Track not found.');
    }

    res.status(HttpStatus.OK).send(track);
  }

  @Post()
  async createTrack(@Body() dto: CreateTrackDto, @Res() res: Response) {
    const newTrack = await this.trackService.createTrack(dto);

    res.status(HttpStatus.CREATED).send(newTrack);
  }

  @Put(':id')
  async updateTrack(
    @Body() dto: UpdateTrackDto,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    if (!validate(id)) {
      throw new BadRequestException('Not valid track ID.');
    }

    const track = await this.trackService.getById(id);
    if (!track) {
      throw new NotFoundException('Track not found.');
    }

    const updatedTrack = await this.trackService.updateTrack(dto, id);

    res.status(HttpStatus.OK).send(updatedTrack);
  }

  @Delete(':id')
  async deleteTrack(@Param('id') id: string, @Res() res: Response) {
    if (!validate(id)) {
      throw new BadRequestException('Not valid track ID.');
    }

    const track = await this.trackService.getById(id);
    if (!track) {
      throw new NotFoundException('Track not found.');
    }

    const result = await this.trackService.deleteTrack(id);

    if (!result) {
      throw new NotFoundException('Track not found.');
    }

    res.status(HttpStatus.NO_CONTENT).send();
  }
}
