import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, HttpStatus, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import express, {Request, Response} from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async create(@Body() registerUserDto: RegisterUserDto, @Req() req: Request, @Res() res: Response) {
    try {
      const user = await this.authService.register(registerUserDto);

      return res
        .status(HttpStatus.CREATED)
        .json({
          message: 'User successfully registered.',
          user: user
        });
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An error occurred during registration.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
