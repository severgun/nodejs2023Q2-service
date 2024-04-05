import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { validate } from 'uuid';
import { Response } from 'express';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  async getAll() {
    return await this.artistService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string, @Res() res: Response) {
    // TODO: Refactor repeated checks
    if (!validate(id)) {
      throw new BadRequestException('Not valid artist ID.');
    }

    const artist = await this.artistService.getById(id);

    if (!artist) {
      throw new NotFoundException('Artist not found.');
    }

    res.status(HttpStatus.OK).send(artist);
  }

  @Post()
  async createArtist(@Body() dto: CreateArtistDto, @Res() res: Response) {
    const newArtist = await this.artistService.createArtist(dto);

    res.status(HttpStatus.CREATED).send(newArtist);
  }

  @Put(':id')
  async updateArtist(
    @Body() dto: UpdateArtistDto,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    if (!validate(id)) {
      throw new BadRequestException('Not valid artist ID.');
    }

    const artist = await this.artistService.getById(id);
    if (!artist) {
      throw new NotFoundException('Artist not found.');
    }

    const updatedArtist = await this.artistService.updateArtist(dto, id);

    res.status(HttpStatus.OK).send(updatedArtist);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteArtist(@Param('id') id: string, @Res() res: Response) {
    if (!validate(id)) {
      throw new BadRequestException('Not valid artist ID.');
    }

    const result = await this.artistService.deleteArtist(id);

    if (!result) {
      throw new NotFoundException('Artist not found.');
    }

    res.status(HttpStatus.NO_CONTENT).send();
  }
}
