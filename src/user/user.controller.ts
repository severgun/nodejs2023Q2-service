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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { validate } from 'uuid';
import { Response } from 'express';
import { filterOutPassword } from 'src/utils/filterOutPassword';
import { dateToNumber } from 'src/utils/dateToNumber';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll(@Res() res: Response) {
    const users = await this.userService.getAll();

    const result = users
      .map((user) => filterOutPassword(user))
      .map((user) => dateToNumber(user));

    res.status(HttpStatus.OK).send(result);
    return;
  }

  @Get(':id')
  async getById(@Param('id') id: string, @Res() res: Response) {
    // TODO: Refactor repeated checks
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST).send('Not valid user ID.');
      return;
    }

    const user = await this.userService.getById(id);

    if (!user) {
      res.status(HttpStatus.NOT_FOUND).send('User not found.');
      return;
    }

    const result = filterOutPassword(user);

    res.status(HttpStatus.OK).send(dateToNumber(result));
  }

  @Post()
  async createUser(@Body() dto: CreateUserDto, @Res() res: Response) {
    const newUser = await this.userService.createUser(dto);

    const result = filterOutPassword(newUser);

    res.status(HttpStatus.CREATED).send(dateToNumber(result));
  }

  @Put(':id')
  async updateUser(
    @Body() dto: UpdatePasswordDto,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST).send('Not valid user ID.');
      return;
    }

    const user = await this.userService.getById(id);
    if (!user) {
      res.status(HttpStatus.NOT_FOUND).send('User not found.');
      return;
    }

    if (dto.oldPassword !== user.password) {
      res.status(HttpStatus.FORBIDDEN).send('Wrong password.');
      return;
    }

    const updatedUser = await this.userService.updateUser(dto, id);

    const result = filterOutPassword(updatedUser);

    res.status(HttpStatus.OK).send(dateToNumber(result));
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST).send('Not valid user ID.');
      return;
    }

    const result = await this.userService.deleteUser(id);

    result
      ? res.status(HttpStatus.NO_CONTENT).send()
      : res.status(HttpStatus.NOT_FOUND).send('User not found.');
  }
}
