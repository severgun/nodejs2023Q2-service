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
import { Album, AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  getAll(): Album[] {
    return this.albumService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string, @Res() res: Response): Album {
    // TODO: Refactor repeated checks
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST).send('Not valid album ID.');
      return;
    }

    const album = this.albumService.getById(id);

    if (!album) {
      res.status(HttpStatus.NOT_FOUND).send('Album not found.');
      return;
    }

    return album;
  }

  @Post()
  createAlbum(@Body() dto: CreateAlbumDto, @Res() res: Response): Album {
    if (!dto.name || !dto.year || !dto.artistId) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .send('Required fields are not provided.');
      return;
    }

    return this.albumService.createAlbum(dto);
  }

  @Put(':id')
  updateAlbum(
    @Body() dto: UpdateAlbumDto,
    @Param('id') id: string,
    @Res() res: Response,
  ): Album {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST).send('Not valid album ID.');
      return;
    }

    const album = this.albumService.getById(id);
    if (!album) {
      res.status(HttpStatus.NOT_FOUND).send('Album not found.');
      return;
    }

    return this.albumService.updateAlbum(dto, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAlbum(@Param('id') id: string, @Res() res: Response) {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST).send('Not valid album ID.');
      return;
    }

    const album = this.albumService.getById(id);
    if (!album) {
      res.status(HttpStatus.NOT_FOUND).send('Album not found.');
      return;
    }

    this.albumService.deleteAlbum(id);
  }
}
