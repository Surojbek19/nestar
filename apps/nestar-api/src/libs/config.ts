import { ObjectId } from "bson";
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';


export const availableAgentSorts = ["createdAt", "updatedAt", "memberLikes", "memberViews", "memberRank" ]
export const availableMemberSorts = ["createdAt", "updatedAt", "memberLikes", "memberViews" ]

export const availableOptions = ['propertyBarter', 'propertyRent'];
export const availablePropertySorts = [
	"createdAt", 
	"updatedAt",
	"propertyLikes", 
	"propertyViews", 
	"propertyRank",
	"propertyPrice", 
];

export const availableABoardArticleSorts = ['createdAt', 'updatedAt', 'articleLikes', 'articleViews']

/** IMAGE CONFIGURATION **/ 

export const validMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
export const getSerialForImage = (filename: string) => {
	const ext = path.parse(filename).ext;
	return uuidv4() + ext;
};




export const shapeIntoMongoObjectId = (tager: any) => {
    return typeof tager === "string" ? new ObjectId(tager) : tager;
}

export const lookupMember = {
	$lookup:{
		from: "members",
		localField: "memberId",
		foreignField: "_id",
		as: "memberData"
	}
}