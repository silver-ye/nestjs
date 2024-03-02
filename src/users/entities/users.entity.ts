import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RolesEnum } from '../const/roles.const';
import { PostsModel } from 'src/posts/entities/post.entity';
import { BaseModel } from 'src/common/entities/base.entity';

@Entity()
export class UsersModel extends BaseModel {
  @Column({
    length: 20, // 1. 최대 길이가 20
    unique: true, // 2. 중복 불가
  })
  nickname: string;

  @Column({
    unique: true, // 1. 중복 불가
  })
  email: string;

  @Column()
  password: string;

  @Column({
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER,
  })
  role: RolesEnum;

  @OneToMany(() => PostsModel, (post) => post.author)
  posts: PostsModel[];
}
