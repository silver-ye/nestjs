import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostsModel } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { updatePostDto } from './dto/update-post.dto';

export interface PostModel {
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

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postRepository: Repository<PostsModel>,
  ) {}

  async getAllPosts() {
    return this.postRepository.find({
      relations: ['author'],
    });
  }

  async getPostById(postId: number) {
    const post = await this.postRepository.findOne({
      where: {
        id: postId,
      },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException();
    }

    return post;
  }

  async creatPost(authorId: number, postDto: CreatePostDto) {
    const post = this.postRepository.create({
      author: {
        id: authorId,
      },
      ...postDto,
      likeCount: 0,
      commentCount: 0,
    });

    const newPost = await this.postRepository.save(post);

    return newPost;
  }

  async updatePost(postId: number, postDto: updatePostDto) {
    const { title, content } = postDto;
    const post = await this.postRepository.findOne({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundException();
    }

    if (title) {
      post.title = title;
    }

    if (content) {
      post.content = content;
    }

    const newPost = await this.postRepository.save(post);

    return newPost;
  }

  async deletePost(postId: number) {
    const post = await this.postRepository.findOne({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundException();
    }

    await this.postRepository.delete(postId);

    return postId;
  }
}
