import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { RateLimit, LeakyBucketStrategy, TokenBucketStrategy } from '../../../packages/nestjs-rate-limit/src';

@RateLimit(new LeakyBucketStrategy(10, 1))
@Controller('users')
export class UsersController {
  @RateLimit(new TokenBucketStrategy(5, 1))
  @Get('profile')
  getProfile() {
    return {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Profile data retrieved successfully',
    };
  }

  @Get('all')
  getAllUsers() {
    return {
      users: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
        { id: 3, name: 'Bob Johnson' },
      ],
      message: 'All users retrieved successfully',
    };
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return {
      id: parseInt(id, 10),
      name: 'User Name',
      message: `User ${id} retrieved successfully`,
    };
  }

  @Post()
  createUser(@Body() body: any) {
    return {
      id: Math.floor(Math.random() * 1000),
      ...body,
      message: 'User created successfully',
    };
  }
}

