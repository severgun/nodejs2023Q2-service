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
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  async getAll(@Res() res: Response) {
    const result = await this.albumService.getAll();

    res.status(HttpStatus.OK).send(result);
  }

  @Get(':id')
  async getById(@Param('id') id: string, @Res() res: Response) {
    // TODO: Refactor repeated checks
    if (!validate(id)) {
      throw new BadRequestException('Not valid album ID.');
    }

    const album = await this.albumService.getById(id);

    if (!album) {
      throw new NotFoundException('Album not found.');
    }

    res.status(HttpStatus.OK).send(album);
  }

  @Post()
  async createAlbum(@Body() dto: CreateAlbumDto, @Res() res: Response) {
    const newAlbum = await this.albumService.createAlbum(dto);

    res.status(HttpStatus.CREATED).send(newAlbum);
  }

  @Put(':id')
  async updateAlbum(
    @Body() dto: UpdateAlbumDto,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    if (!validate(id)) {
      throw new BadRequestException('Not valid album ID.');
    }

    const album = await this.albumService.getById(id);
    if (!album) {
      throw new NotFoundException('Album not found.');
    }

    const updatedAlbum = await this.albumService.updateAlbum(dto, id);

    res.status(HttpStatus.OK).send(updatedAlbum);
  }

  @Delete(':id')
  async deleteAlbum(@Param('id') id: string, @Res() res: Response) {
    if (!validate(id)) {
      throw new BadRequestException('Not valid album ID.');
    }

    const result = await this.albumService.deleteAlbum(id);

    if (!result) {
      throw new NotFoundException('Album not found.');
    }

    res.status(HttpStatus.NO_CONTENT).send();
  }
}
