# NestJS Rate Limiter

A flexible, production-ready rate-limiting package for NestJS with multiple algorithms and Redis support.

## Packages

- `packages/nestjs-rate-limit` - The main NestJS rate limiting package
- `docs` - React documentation application

## Getting Started

### Package Development

```bash
cd packages/nestjs-rate-limit
npm install
npm run build
```

### Documentation Development

```bash
cd docs
npm install
npm run dev
```

## Features

- 🎯 Multiple rate limiting algorithms (Sliding Window, Leaky Bucket, Token Bucket)
- 🔧 Flexible configuration (Global, Controller, Route level)
- 🚀 Priority system (Route > Controller > Global)
- 💾 Storage options (In-memory, Redis)
- 📝 Fully typed with TypeScript
- 🎨 Simple decorator-based API

## License

MIT

