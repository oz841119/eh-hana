import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUsers() {
    const users = await this.prismaService.user.findMany();
    return users;
  }

  /**
   * 根據 email 找到使用者，若不存在則建立
   */
  async findOrCreate(data: { email: string; name: string }) {
    const existing = await this.prismaService.user.findUnique({
      where: { email: data.email },
    });
    if (existing) return existing;

    return this.prismaService.user.create({
      data: {
        email: data.email,
        name: data.name,
      },
    });
  }
}
