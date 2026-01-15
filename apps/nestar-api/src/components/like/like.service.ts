import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like } from '../../libs/dto/like/like';
import { Model } from 'mongoose';
import { LikeInput } from '../../libs/dto/like/like.input';
import { T } from '../../libs/types/common';
import { Message } from '../../libs/enums/common.enum';

@Injectable()
export class LikeService {
    constructor(@InjectModel('Like') private readonly likeModel: Model<Like>) {}

    public async toggleLike(input: LikeInput): Promise<number> { //****** i changed "Like" to "number" *******//
        const search: T = {
             memberId: input.memberId, 
             likeRefId: input.likeRefId }, 
            exist = await this.likeModel.findOne(search).exec();
            let modifier = 1;

            if(exist) {
                await this.likeModel.findOneAndDelete(search).exec();
            modifier = -1;
            } else {
                try {
                    await this.likeModel.create(input);
                } catch (err) {
                    console.log('Error, Service.model:', err.message)
                    throw new BadRequestException(Message.CREATE_FAILED);
                }
            }

        return modifier;
    }
}
