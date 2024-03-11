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
import { UserNoPassword, UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { validate } from 'uuid';
import { Response } from 'express';
import { filterOutPassword } from 'src/utils/filterOutPassword';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAll(): UserNoPassword[] {
    return this.userService.getAll().map((user) => filterOutPassword(user));
  }

  @Get(':id')
  getById(@Param('id') id: string, @Res() res: Response) {
    // TODO: Refactor repeated checks
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST).send('Not valid user ID.');
      return;
    }

    const user = this.userService.getById(id);

    if (!user) {
      res.status(HttpStatus.NOT_FOUND).send('User not found.');
      return;
    }

    res.status(HttpStatus.OK).send(filterOutPassword(user));
  }

  @Post()
  createUser(@Body() dto: CreateUserDto, @Res() res: Response) {
    if (!dto.login || !dto.password) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .send('Required fields are not provided.');
      return;
    }

    const newUser = this.userService.createUser(dto);

    res.status(HttpStatus.CREATED).send(filterOutPassword(newUser));
  }

  @Put(':id')
  updateUser(
    @Body() dto: UpdatePasswordDto,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST).send('Not valid user ID.');
      return;
    }

    if (!dto.oldPassword || !dto.newPassword) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .send('Required fields are not provided.');
      return;
    }

    const user = this.userService.getById(id);
    if (!user) {
      res.status(HttpStatus.NOT_FOUND).send('User not found.');
      return;
    }

    if (dto.oldPassword !== user.password) {
      res.status(HttpStatus.FORBIDDEN).send('Wrong password.');
      return;
    }

    const updatedUser = this.userService.updateUser(dto, id);

    res.status(HttpStatus.OK).send(filterOutPassword(updatedUser));
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string, @Res() res: Response) {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST).send('Not valid user ID.');
      return;
    }

    this.userService.deleteUser(id)
      ? res.status(HttpStatus.NO_CONTENT).send()
      : res.status(HttpStatus.NOT_FOUND).send('User not found.');
  }
}
