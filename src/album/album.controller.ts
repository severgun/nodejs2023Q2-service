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

    res.status(HttpStatus.OK).send(album);
  }

  @Post()
  createAlbum(@Body() dto: CreateAlbumDto, @Res() res: Response) {
    const newAlbum = this.albumService.createAlbum(dto);

    res.status(HttpStatus.CREATED).send(newAlbum);
  }

  @Put(':id')
  updateAlbum(
    @Body() dto: UpdateAlbumDto,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST).send('Not valid album ID.');
      return;
    }

    const album = this.albumService.getById(id);
    if (!album) {
      res.status(HttpStatus.NOT_FOUND).send('Album not found.');
      return;
    }

    const updatedAlbum = this.albumService.updateAlbum(dto, id);

    res.status(HttpStatus.OK).send(updatedAlbum);
  }

  @Delete(':id')
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

    this.albumService.deleteAlbum(id)
      ? res.status(HttpStatus.NO_CONTENT).send()
      : res.status(HttpStatus.NOT_FOUND).send('Album not found.');
  }
}
