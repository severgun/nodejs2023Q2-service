import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { validate } from 'uuid';
import { Response } from 'express';
import { filterOutUserData } from 'src/utils/filterOutUserData';
import { dateToNumber } from 'src/utils/dateToNumber';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAll(@Res() res: Response) {
    const users = await this.userService.getAll();

    const result = users
      .map((user) => filterOutUserData(user))
      .map((user) => dateToNumber(user));

    res.status(HttpStatus.OK).send(result);
  }

  @Get(':id')
  async getById(@Param('id') id: string, @Res() res: Response) {
    // TODO: Refactor repeated checks
    if (!validate(id)) {
      throw new BadRequestException('Not valid user ID.');
    }

    const user = await this.userService.getById(id);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const result = filterOutUserData(user);

    res.status(HttpStatus.OK).send(dateToNumber(result));
  }

  @Post()
  async createUser(@Body() dto: CreateUserDto, @Res() res: Response) {
    const newUser = await this.userService.createUser(dto);

    const result = filterOutUserData(newUser);

    res.status(HttpStatus.CREATED).send(dateToNumber(result));
  }

  @Put(':id')
  async updateUser(
    @Body() dto: UpdatePasswordDto,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    if (!validate(id)) {
      throw new BadRequestException('Not valid user ID.');
    }

    const user = await this.userService.getById(id);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (dto.oldPassword !== user.password) {
      throw new ForbiddenException('Wrong password.');
    }

    const updatedUser = await this.userService.updateUser(dto, id);

    const result = filterOutUserData(updatedUser);

    res.status(HttpStatus.OK).send(dateToNumber(result));
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    if (!validate(id)) {
      throw new BadRequestException('Not valid user ID.');
    }

    const result = await this.userService.deleteUser(id);

    if (!result) {
      throw new NotFoundException('User not found.');
    }

    res.status(HttpStatus.NO_CONTENT).send();
  }
}
