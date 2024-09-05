import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthSignupDto, AuthLoginDto } from './dto';
import * as hasher from 'hash.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async login({ username, password }: AuthLoginDto) {
    // find the user by username
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      throw new ForbiddenException('Username invalid');
    }

    // hash the password
    const hash = await hasher.sha256().update(password).digest('hex');
    if (hash !== user.password) {
      throw new ForbiddenException('Password invalid');
    }
    const signToken = await this.signToken(
      user.id,
      user.email,
      user.password,
      user.role,
    );

    return {
      ...signToken,
      username: user.username,
    };
  }

  async signup({
    email,
    username,
    password,
    firstname,
    lastname,
    birthday,
  }: AuthSignupDto) {
    // hash the password
    const hash = await hasher.sha256().update(password).digest('hex');

    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          username,
          password: hash,
          firstname,
          lastname,
          birthday,
          role: UserRole.AUTH_USER,
        },
      });

      return this.signToken(user.id, user.email, user.password, user.role);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async signToken(
    userId: number,
    email: string,
    hash: string,
    role: UserRole,
  ): Promise<{ accessToken: string }> {
    const data = {
      sub: userId,
      email,
      hash,
      role,
    };
    const accessToken = await this.jwt.signAsync(data, {
      expiresIn: '2h',
      secret: this.config.get('JWT_SECRET'),
    });
    return {
      accessToken,
    };
  }
}
