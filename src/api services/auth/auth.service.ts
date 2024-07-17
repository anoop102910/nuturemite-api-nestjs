import {
  Injectable,
  HttpException,
  HttpStatus,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../core services/prisma/prisma.service';
import { AuthDto, SigninDto } from './auth.dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  private async signToken(userId: number, email: string,role:string): Promise<string> {
    const secret = this.config.get('JWT_SECRET_KEY');
    return await this.jwt.signAsync(
      { id: userId, email ,role},
      { secret: secret, expiresIn: '10d' },
    );
  }

  async register(dto: AuthDto) {
    const password = dto.password;
    const hash = await argon.hash(password);
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser)
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    const user = await this.prisma.user.create({
      data: { ...dto, password: hash },
    });
    delete user.password;
    const token: string = await this.signToken(
      user.id,
      user.email,
      user.role
    );
    return { msg: 'Signup success', token };

  }

  async login(dto: SigninDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!existingUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const isPasswordCorrect = await argon.verify(
      existingUser.password,
      dto.password,
    );

    if (!isPasswordCorrect)
      throw new HttpException('Password is not correct', HttpStatus.FORBIDDEN);

    const token: string = await this.signToken(
      existingUser.id,
      existingUser.email,
      existingUser.role
    );
    return { msg: 'Signin success', token };
  }

  /* async refreshToken(userId: number, dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new NotFoundException('Uesr not found');
    const refreshToken = await this.signToken(user.id, user.email);
    const accessToken = await this.signToken(user.id, user.email);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });
    return { accessToken, refreshToken };
  } */
}
