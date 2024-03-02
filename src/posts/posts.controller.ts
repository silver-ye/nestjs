import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get()
  getPosts() {
    return this.postService.getAllPosts();
  }

  @Get(':id')
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postService.getPostById(id);
  }

  @Post()
  postPosts(
    @Body('authorId') authorId: number,
    @Body('title') title: string,
    @Body('content') content: string,
    // @Body('isPublic', new DefaultValuePipe(true)) isPublic: boolean,
  ) {
    return this.postService.creatPost(authorId, title, content);
  }

  @Patch(':id')
  patchPost(
    @Param('id', ParseIntPipe) id: number,
    @Body('title') title?: string,
    @Body('content') content?: string,
  ) {
    return this.postService.updatePost(id, title, content);
  }

  @Delete(':id')
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postService.deletePost(id);
  }
}
