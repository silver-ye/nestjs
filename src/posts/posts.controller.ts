import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PostsService } from './posts.service';

interface PostModel {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

let posts: PostModel[] = [
  {
    id: 1,
    author: 'NestJS_official',
    title: 'Base of NestJS',
    content: 'How to use NestJS in service?',
    likeCount: 10000000,
    commentCount: 500000,
  },
  {
    id: 2,
    author: 'NestJS_official',
    title: 'Post of NestJS',
    content: 'How to use Post NestJS in service?',
    likeCount: 90000000,
    commentCount: 600000,
  },
  {
    id: 3,
    author: 'NestJS_official',
    title: 'Get of NestJS',
    content: 'How to use Get NestJS in service?',
    likeCount: 80000000,
    commentCount: 700000,
  },
];

@Controller('posts')
export class PostsController {
  @Get()
  getPosts() {
    return posts;
  }

  @Get(':id')
  getPost(@Param('id') id: string) {
    const post = posts.find((post) => post.id == +id);

    if (!post) {
      throw new NotFoundException();
    } else {
      return post;
    }
  }

  @Post()
  postPosts(
    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    const post = {
      id: posts[posts.length - 1].id + 1,
      author,
      title,
      content,
      likeCount: 0,
      commentCount: 0,
    };

    posts = [...posts, post];

    return post;
  }

  @Patch(':id')
  patchPost(
    @Param('id') id: string,
    @Body('author') author?: string,
    @Body('title') title?: string,
    @Body('content') content?: string,
  ) {
    const post = posts.find((post) => post.id === +id);

    if (!post) {
      throw new NotFoundException();
    }

    if (author) {
      post.author = author;
    }

    if (title) {
      post.title = title;
    }

    if (content) {
      post.content = content;
    }

    posts = posts.map((prevPost) => (prevPost.id === +id ? post : prevPost));

    return post;
  }

  @Delete(':id')
  deletePost(@Param('id') id: string) {
    const post = posts.find((post) => post.id === +id);

    if (!post) {
      throw new NotFoundException();
    }

    posts = posts.filter((post) => post.id !== +id);

    return id;
  }
}
