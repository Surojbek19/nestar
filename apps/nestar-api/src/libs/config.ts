import { ObjectId } from "bson";

export const availableAgentSorts = ["createdAt", "updatedAt", "memberLikes", "memberViews", "memberRank" ]


/** IMAGE CONFIGURATION **/ 
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

export const validMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
export const getSerialForImage = (filename: string) => {
	const ext = path.parse(filename).ext;
	return uuidv4() + ext;
};


export const availableMemberSorts = ["createdAt", "updatedAt", "memberLikes", "memberViews" ]

export const shapeIntoMongoObjectId = (tager: any) => {
    return typeof tager === "string" ? new ObjectId(tager) : tager;
}