# NestJS Rate Limiter

A flexible, production-ready rate-limiting package for NestJS with multiple algorithms and Redis support.

## Packages

- `packages/nestjs-rate-limit` - The main NestJS rate limiting package
- `docs` - React documentation application
- `mock-server` - Mock API server for testing and demonstrating rate limiting

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

### Mock Server

```bash
cd mock-server
npm install
npm run dev
```

The mock server runs on `http://localhost:3001` and provides example endpoints demonstrating different rate limiting strategies.

## Features

- 🎯 Multiple rate limiting algorithms (Sliding Window, Leaky Bucket, Token Bucket)
- 🔧 Flexible configuration (Global, Controller, Route level)
- 🚀 Priority system (Route > Controller > Global)
- 💾 Storage options (In-memory, Redis)
- 📝 Fully typed with TypeScript
- 🎨 Simple decorator-based API

## License

MIT

