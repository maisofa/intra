import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @IsPublic()
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get()
  findByEmail(@Body() email: string) {
    return this.usersService.findByEmail(email);
  }

  @IsPublic()
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @IsPublic()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
