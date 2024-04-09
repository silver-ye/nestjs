import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RolesEnum } from '../const/roles.const';
import { PostsModel } from 'src/posts/entity/post.entity';
import { BaseModel } from 'src/common/entity/base.entity';
import { IsEmail, IsString, Length } from 'class-validator';
import { ValidationArguments } from 'class-validator';
import { lengthValidationMessage } from 'src/common/validation-message/length-validation.message';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { emailValidationMessage } from 'src/common/validation-message/email-validation.message';
import { Exclude, Expose } from 'class-transformer';
import { ChatsModel } from 'src/chats/entity/chats.entity';
import { MessagesModel } from 'src/chats/messages/entity/messages.entity';
import { CommentsModel } from 'src/posts/comments/entity/comments.entity';

@Entity()
// @Exclude() // 클래스 전체에도 exclude 가능하고, 원하는 것만 expose하면 됨
export class UsersModel extends BaseModel {
  @Column({
    length: 20, // 1. 최대 길이가 20
    unique: true, // 2. 중복 불가
  })
  @IsString({
    message: stringValidationMessage,
  })
  @Length(1, 20, {
    message: lengthValidationMessage,
  })
  nickname: string;

  // @Expose() // 보여주고 싶을 때 사용
  // get nicknameAndEmail() {
  //   return this.nickname + '/' + this.email;
  // }

  @Column({
    unique: true, // 1. 중복 불가
  })
  @IsString({
    message: stringValidationMessage,
  })
  @IsEmail(
    {},
    {
      message: emailValidationMessage,
    },
  )
  email: string;

  @Column()
  @IsString({
    message: stringValidationMessage,
  })
  @Length(3, 8, {
    message: lengthValidationMessage,
  })
  /**
   * Request
   * frontend -> backend
   * plain object(JSON) -> class instance(dto)
   *
   * Response
   * backend -> frontend
   * class instance(dto) -> plain object(JSON)
   *
   * toClassOnly -> class instance로 변환될때만
   * toPlainOnly -> plain object로 변환될때만
   */
  @Exclude({
    toPlainOnly: true,
  })
  password: string;

  @Column({
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER,
  })
  role: RolesEnum;

  @OneToMany(() => PostsModel, (post) => post.author)
  posts: PostsModel[];

  @ManyToMany(() => ChatsModel, (chat) => chat.users)
  @JoinTable()
  chats: ChatsModel[];

  @OneToMany(() => MessagesModel, (message) => message.author)
  messages: MessagesModel;

  @OneToMany(() => CommentsModel, (comment) => comment.author)
  postComments: CommentsModel[];
}
