import { Field, Int, ObjectType } from "@nestjs/graphql";
import type { ObjectId } from "mongoose"; /// Check it later this could cause a error later
import { ViewGroup } from "../../enums/view.enum";

@ObjectType()
export class View {
    @Field(() => String)
    _id: ObjectId;

    @Field(() => ViewGroup)
    viewGroup: ViewGroup;

    @Field(() => String)
    viewRefId: ObjectId;

    @Field(() => String)
    memberId: ObjectId;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;
}
