import { Module } from '@nestjs/common';
import { BoardArticleResolver } from './board-article.resolver';
import { BoardArticleService } from './board-article.service';
import { MongooseModule } from '@nestjs/mongoose';
import BoardArticleSchema from '../../schemas/BoardArticle.model';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import { ViewModule } from '../view/view.module';
import { LikeModule } from '../like/like.module';

@Module({
  imports: [
      MongooseModule.forFeature([{name: "BoardArticle", schema: BoardArticleSchema}]), //This code for BoardArticleSchema model integration
      AuthModule,
      ViewModule,
      MemberModule,
      LikeModule,
    ],
  providers: [BoardArticleResolver, BoardArticleService],
  exports: [BoardArticleService] //This is a NestJS dependency-injection export, not TypeScript. “If another module imports BoardArticleModule, it can use BoardArticleService”
})
export class BoardArticleModule {} //This is a TypeScript export. It allows other files to import it's module
