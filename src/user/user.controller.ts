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
import { User, UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { validate } from 'uuid';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAll(): User[] {
    return this.userService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string, @Res() res: Response): User {
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

    return user;
  }

  @Post()
  createUser(@Body() dto: CreateUserDto, @Res() res: Response): User {
    if (!dto.login || !dto.password) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .send('Required fields are not provided.');
      return;
    }

    return this.userService.createUser(dto);
  }

  @Put(':id')
  updateUser(
    @Body() dto: UpdatePasswordDto,
    @Param('id') id: string,
    @Res() res: Response,
  ): User {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST).send('Not valid user ID.');
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

    return this.userService.updateUser(dto, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(@Param('id') id: string, @Res() res: Response) {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST).send('Not valid user ID.');
      return;
    }

    const user = this.userService.getById(id);
    if (!user) {
      res.status(HttpStatus.NOT_FOUND).send('User not found.');
      return;
    }

    this.userService.deleteUser(id);
  }
}
