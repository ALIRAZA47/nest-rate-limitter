import { Controller, Post, Body } from '@nestjs/common';
import { RateLimit, LeakyBucketStrategy } from '../../../packages/nestjs-rate-limit/src';

@Controller('upload')
export class UploadController {
  @RateLimit(new LeakyBucketStrategy(5, 0.1))
  @Post('file')
  uploadFile(@Body() body: { filename?: string; size?: number; mimetype?: string }) {
    return {
      filename: body?.filename || 'test-file.txt',
      size: body?.size || 1024,
      mimetype: body?.mimetype || 'text/plain',
      message: 'File uploaded successfully',
    };
  }

  @RateLimit(new LeakyBucketStrategy(2, 0.05))
  @Post('large-file')
  uploadLargeFile(@Body() body: { filename?: string; size?: number; mimetype?: string }) {
    return {
      filename: body?.filename || 'large-file.bin',
      size: body?.size || 10485760,
      mimetype: body?.mimetype || 'application/octet-stream',
      message: 'Large file uploaded successfully',
    };
  }
}

