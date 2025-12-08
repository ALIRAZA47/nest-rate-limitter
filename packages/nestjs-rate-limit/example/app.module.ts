import { Module } from '@nestjs/common';
import { RateLimitModule, SlidingWindowStrategy } from '../src';

@Module({
  imports: [
    RateLimitModule.forRoot({
      strategy: new SlidingWindowStrategy(100, 60), // 100 requests per 60 seconds
    }),
  ],
})
export class AppModule {}

