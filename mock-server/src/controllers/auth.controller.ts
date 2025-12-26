import { Controller, Post, Body, Headers } from '@nestjs/common';
import { RateLimit, SlidingWindowStrategy, TokenBucketStrategy } from '../../../packages/nestjs-rate-limit/src';

@Controller('auth')
export class AuthController {
  @RateLimit(new SlidingWindowStrategy(5, 60))
  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    if (body.email && body.password) {
      return {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: 1,
          email: body.email,
          name: 'User Name',
        },
        message: 'Login successful',
      };
    }
    return {
      error: 'Invalid credentials',
      message: 'Login failed',
    };
  }

  @RateLimit(new TokenBucketStrategy(3, 0.1))
  @Post('register')
  register(@Body() body: { email: string; password: string; name: string }) {
    return {
      id: Math.floor(Math.random() * 1000),
      email: body.email,
      name: body.name,
      message: 'Registration successful',
    };
  }

  @Post('refresh')
  refreshToken(@Headers('authorization') auth: string) {
    return {
      token: 'new-mock-jwt-token-' + Date.now(),
      message: 'Token refreshed successfully',
    };
  }
}

