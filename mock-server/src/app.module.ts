import { Module } from '@nestjs/common';
import { RateLimitModule, SlidingWindowStrategy, LeakyBucketStrategy, TokenBucketStrategy } from '../../packages/nestjs-rate-limit/src';
import { UsersController } from './controllers/users.controller';
import { PostsController } from './controllers/posts.controller';
import { AuthController } from './controllers/auth.controller';
import { UploadController } from './controllers/upload.controller';

@Module({
  imports: [
    RateLimitModule.forRoot({
      strategy: new SlidingWindowStrategy(100, 60), // Global: 100 requests per 60 seconds
    }),
  ],
  controllers: [
    UsersController,
    PostsController,
    AuthController,
    UploadController,
  ],
})
export class AppModule {}

