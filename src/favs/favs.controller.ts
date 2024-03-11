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
import { FavoritesResponse, FavoritesService } from './favs.service';
import { Response } from 'express';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  getAll(): FavoritesResponse {
    return this.favoritesService.getAll();
  }

  @Post('artist/:id')
  addFavoriteArtist(@Param('id') id: string, @Res() res: Response): void {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST).send('Not valid artist ID.');
      return;
    }

    this.favoritesService.addFavoriteArtist(id)
      ? res.status(HttpStatus.CREATED).send()
      : res.status(HttpStatus.UNPROCESSABLE_ENTITY).send();
  }

  @Post('album/:id')
  addFavoriteAlbum(@Param('id') id: string, @Res() res: Response): void {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST).send('Not valid album ID.');
      return;
    }

    this.favoritesService.addFavoriteAlbum(id)
      ? res.status(HttpStatus.CREATED).send()
      : res.status(HttpStatus.UNPROCESSABLE_ENTITY).send();
  }

  @Post('track/:id')
  addFavoriteTrack(@Param('id') id: string, @Res() res: Response): void {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST).send('Not valid track ID.');
      return;
    }

    this.favoritesService.addFavoriteTrack(id)
      ? res.status(HttpStatus.CREATED).send()
      : res.status(HttpStatus.UNPROCESSABLE_ENTITY).send();
  }

  @Delete('artist/:id')
  deleteFavoriteArtist(@Param('id') id: string, @Res() res: Response): void {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST).send('Not valid artist ID.');
      return;
    }

    this.favoritesService.deleteFavoriteArtist(id)
      ? res.status(HttpStatus.NO_CONTENT).send()
      : res.status(HttpStatus.NOT_FOUND).send();
  }

  @Delete('album/:id')
  deleteFavoriteAlbum(@Param('id') id: string, @Res() res: Response): void {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST).send('Not valid album ID.');
      return;
    }

    this.favoritesService.deleteFavoriteAlbum(id)
      ? res.status(HttpStatus.NO_CONTENT).send()
      : res.status(HttpStatus.NOT_FOUND).send();
  }

  @Delete('track/:id')
  deleteFavoriteTrack(@Param('id') id: string, @Res() res: Response): void {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST).send('Not valid track ID.');
      return;
    }

    this.favoritesService.deleteFavoriteTrack(id)
      ? res.status(HttpStatus.NO_CONTENT).send()
      : res.status(HttpStatus.NOT_FOUND).send();
  }
}
