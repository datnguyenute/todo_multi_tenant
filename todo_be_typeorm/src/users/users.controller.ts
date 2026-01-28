import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { ResponseMessage } from 'src/decorator/customize';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ResponseMessage('List user')
  list() {
    return this.usersService.findAll();
  }

  @Post()
  @ResponseMessage('Create user')
  async register(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Patch(':id')
  @ResponseMessage('Update user')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @ResponseMessage('Delete user')
  async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
