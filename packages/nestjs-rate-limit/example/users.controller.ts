import { Controller, Get } from '@nestjs/common';
import { RateLimit, LeakyBucketStrategy, TokenBucketStrategy } from '../src';

@RateLimit(new LeakyBucketStrategy(10, 1))
@Controller('users')
export class UsersController {
  @RateLimit(new TokenBucketStrategy(5, 1))
  @Get('profile')
  getProfile() {
    return { message: 'Profile data' };
  }

  @Get('all')
  getAllUsers() {
    return { users: [] };
  }
}

