import { ObjectId } from "bson";

export const availableAgentSorts = ["createdAt", "updatedAt", "memberLikes", "memberViews", "memberRank" ]

export const availableMemberSorts = ["createdAt", "updatedAt", "memberLikes", "memberViews" ]

export const shapeIntoMongoObjectId = (tager: any) => {
    return typeof tager === "string" ? new ObjectId(tager) : tager;
}