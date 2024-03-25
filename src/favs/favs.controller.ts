import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
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
      res.status(HttpStatus.BAD_REQUEST).send('Not valid artist ID.');
      return;
    }

    const result = await this.favoritesService.addFavoriteArtist(id);

    result
      ? res.status(HttpStatus.CREATED).send()
      : res.status(HttpStatus.UNPROCESSABLE_ENTITY).send();
  }

  @Post('album/:id')
  async addFavoriteAlbum(@Param('id') id: string, @Res() res: Response) {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST).send('Not valid album ID.');
      return;
    }

    const result = await this.favoritesService.addFavoriteAlbum(id);
    result
      ? res.status(HttpStatus.CREATED).send()
      : res.status(HttpStatus.UNPROCESSABLE_ENTITY).send();
  }

  @Post('track/:id')
  async addFavoriteTrack(@Param('id') id: string, @Res() res: Response) {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST).send('Not valid track ID.');
      return;
    }

    const result = await this.favoritesService.addFavoriteTrack(id);
    result
      ? res.status(HttpStatus.CREATED).send()
      : res.status(HttpStatus.UNPROCESSABLE_ENTITY).send();
  }

  @Delete('artist/:id')
  async deleteFavoriteArtist(@Param('id') id: string, @Res() res: Response) {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST).send('Not valid artist ID.');
      return;
    }

    const result = await this.favoritesService.deleteFavoriteArtist(id);
    result
      ? res.status(HttpStatus.NO_CONTENT).send()
      : res.status(HttpStatus.NOT_FOUND).send();
  }

  @Delete('album/:id')
  async deleteFavoriteAlbum(@Param('id') id: string, @Res() res: Response) {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST).send('Not valid album ID.');
      return;
    }

    const result = await this.favoritesService.deleteFavoriteAlbum(id);

    result
      ? res.status(HttpStatus.NO_CONTENT).send()
      : res.status(HttpStatus.NOT_FOUND).send();
  }

  @Delete('track/:id')
  async deleteFavoriteTrack(@Param('id') id: string, @Res() res: Response) {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST).send('Not valid track ID.');
      return;
    }

    const result = await this.favoritesService.deleteFavoriteTrack(id);
    result
      ? res.status(HttpStatus.NO_CONTENT).send()
      : res.status(HttpStatus.NOT_FOUND).send();
  }
}
