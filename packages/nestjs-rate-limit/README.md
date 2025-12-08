# NestJS Rate Limiter

A flexible, production-ready rate-limiting package for NestJS with multiple algorithms and Redis support.

## Features

- 🎯 **Multiple Algorithms**: Sliding Window, Leaky Bucket, and Token Bucket strategies
- 🔧 **Flexible Configuration**: Apply rate limits globally, at controller level, or per route
- 🚀 **Priority System**: Route > Controller > Global
- 💾 **Storage Options**: In-memory (default) or Redis for distributed systems
- 📝 **TypeScript First**: Fully typed for better developer experience
- 🎨 **Easy to Use**: Simple decorator-based API

## Installation

```bash
npm install @rate-limitter/nestjs-rate-limit
```

For Redis support:

```bash
npm install ioredis
```

## Quick Start

```typescript
import { Module } from '@nestjs/common';
import { RateLimitModule, SlidingWindowStrategy } from '@rate-limitter/nestjs-rate-limit';

@Module({
  imports: [
    RateLimitModule.forRoot({
      strategy: new SlidingWindowStrategy(100, 60), // 100 requests per 60 seconds
    }),
  ],
})
export class AppModule {}
```

## Documentation

For complete documentation, examples, and API reference, visit the [documentation site](./docs).

## License

MIT

