import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './common/prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private prisma: PrismaService) {}

  @Get('db-test')
  async getAll() {
    await this.prisma.$queryRaw`SELECT 1`;
    return 'DB CONNECTED';
  }
}
