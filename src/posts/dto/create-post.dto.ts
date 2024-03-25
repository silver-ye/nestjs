import { IsString } from 'class-validator';
import { PostsModel } from '../entities/post.entity';
import { PickType } from '@nestjs/mapped-types';

// Pick, Omit, Parital -> Type 반환
// PickType, OmitType, PartialType -> 값을 반환

export class CreatePostDto extends PickType(PostsModel, ['title', 'content']) {}
