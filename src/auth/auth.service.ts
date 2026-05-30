import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private prisma: PrismaClient;

  // 👇 Notice we handed the worker the jwtService machine here!
  constructor(private jwtService: JwtService) {
    const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
    this.prisma = new PrismaClient({ adapter });
  }

  async register(authDto: AuthDto) {
    const existingUser = await this.prisma.user.findUnique({ where: { email: authDto.email } });
    if (existingUser) throw new BadRequestException('An engineer with this email already exists!');

    const hashedPassword = await bcrypt.hash(authDto.password, 10);
    const newUser = await this.prisma.user.create({
      data: { email: authDto.email, password: hashedPassword },
    });

    return { message: 'Engineer successfully registered!', user: { id: newUser.id, email: newUser.email } };
  }

  // 🔑 NEW: The Login Function
  async login(authDto: AuthDto) {
    // 1. Find the engineer by email
    const user = await this.prisma.user.findUnique({ where: { email: authDto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials!');

    // 2. Compare the password they typed with the shredded one in the database
    const isPasswordValid = await bcrypt.compare(authDto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials!');

    // 3. If it matches, print the digital keycard (JWT)
    const payload = { sub: user.id, email: user.email };
    return {
      message: 'Login successful!',
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}