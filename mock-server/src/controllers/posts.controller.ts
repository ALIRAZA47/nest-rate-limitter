import { Controller, Get } from '@nestjs/common';
import { RateLimit, SlidingWindowStrategy } from '../../../packages/nestjs-rate-limit/src';

@Controller('posts')
export class PostsController {
  @Get()
  findAll() {
    return {
      posts: [
        { id: 1, title: 'Post 1', content: 'Content 1' },
        { id: 2, title: 'Post 2', content: 'Content 2' },
        { id: 3, title: 'Post 3', content: 'Content 3' },
      ],
      message: 'All posts retrieved successfully',
    };
  }

  @RateLimit(new SlidingWindowStrategy(5, 60))
  @Get('popular')
  getPopularPosts() {
    return {
      posts: [
        { id: 1, title: 'Popular Post 1', views: 1000 },
        { id: 2, title: 'Popular Post 2', views: 800 },
      ],
      message: 'Popular posts retrieved successfully',
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return {
      id: parseInt(id, 10),
      title: 'Post Title',
      content: 'Post content here',
      message: `Post ${id} retrieved successfully`,
    };
  }
}

