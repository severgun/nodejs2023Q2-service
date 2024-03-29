import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Res,
  UnprocessableEntityException,
} from '@nestjs/common';
import { validate } from 'uuid';
import { FavoritesService } from './favs.service';
import { Response } from 'express';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async getAll(@Res() res: Response) {
    const result = await this.favoritesService.getAll();

    res.status(HttpStatus.OK).send(result);
  }

  @Post('artist/:id')
  async addFavoriteArtist(@Param('id') id: string, @Res() res: Response) {
    if (!validate(id)) {
      throw new BadRequestException('Not valid artist ID.');
    }

    const result = await this.favoritesService.addFavoriteArtist(id);

    if (!result) {
      throw new UnprocessableEntityException();
    }

    res.status(HttpStatus.CREATED).send();
  }

  @Post('album/:id')
  async addFavoriteAlbum(@Param('id') id: string, @Res() res: Response) {
    if (!validate(id)) {
      throw new BadRequestException('Not valid album ID.');
    }

    const result = await this.favoritesService.addFavoriteAlbum(id);

    if (!result) {
      throw new UnprocessableEntityException();
    }

    res.status(HttpStatus.CREATED).send();
  }

  @Post('track/:id')
  async addFavoriteTrack(@Param('id') id: string, @Res() res: Response) {
    if (!validate(id)) {
      throw new BadRequestException('Not valid track ID.');
    }

    const result = await this.favoritesService.addFavoriteTrack(id);

    if (!result) {
      throw new UnprocessableEntityException();
    }

    res.status(HttpStatus.CREATED).send();
  }

  @Delete('artist/:id')
  async deleteFavoriteArtist(@Param('id') id: string, @Res() res: Response) {
    if (!validate(id)) {
      throw new BadRequestException('Not valid artist ID.');
    }

    const result = await this.favoritesService.deleteFavoriteArtist(id);

    if (!result) {
      throw new NotFoundException();
    }

    res.status(HttpStatus.NO_CONTENT).send();
  }

  @Delete('album/:id')
  async deleteFavoriteAlbum(@Param('id') id: string, @Res() res: Response) {
    if (!validate(id)) {
      throw new BadRequestException('Not valid album ID.');
    }

    const result = await this.favoritesService.deleteFavoriteAlbum(id);

    if (!result) {
      throw new NotFoundException();
    }

    res.status(HttpStatus.NO_CONTENT).send();
  }

  @Delete('track/:id')
  async deleteFavoriteTrack(@Param('id') id: string, @Res() res: Response) {
    if (!validate(id)) {
      throw new BadRequestException('Not valid track ID.');
    }

    const result = await this.favoritesService.deleteFavoriteTrack(id);

    if (!result) {
      throw new NotFoundException();
    }

    res.status(HttpStatus.NO_CONTENT).send();
  }
}
