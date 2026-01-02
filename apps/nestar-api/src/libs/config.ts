import { ObjectId } from "bson";

export const shapeIntoMongoObjectId = (tager: any) => {
    return typeof tager === "string" ? new ObjectId(tager) : tager;
}