import { Module } from '@nestjs/common';
import { CommentResolver } from './comment.resolver';
import { CommentService } from './comment.service';
import CommentSchema from '../../schemas/Comment.model';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { ViewModule } from '../view/view.module';
import { MemberModule } from '../member/member.module';
import { PropertyModule } from '../property/property.module';
import { BoardArticleModule } from '../board-article/board-article.module';

@Module({
  imports: [
        MongooseModule.forFeature([{name: "Comment", schema: CommentSchema}]), //This code for BoardArticleSchema model integration
        AuthModule,
        MemberModule,
        PropertyModule,
        BoardArticleModule,
        ViewModule,
      ],
  providers: [CommentResolver, CommentService]
})
export class CommentModule {}
