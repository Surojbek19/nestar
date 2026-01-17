import { ObjectId } from "bson";
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { T } from "./types/common";
import { pipeline } from "stream";
import { match } from "assert";


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

export const availableABoardArticleSorts = ['createdAt', 'updatedAt', 'articleLikes', 'articleViews'];
export const availableCommentSorts =  [ 'createdAt', 'updatedAt' ]

/** IMAGE CONFIGURATION **/ 

export const validMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
export const getSerialForImage = (filename: string) => {
	const ext = path.parse(filename).ext;
	return uuidv4() + ext;
};




export const shapeIntoMongoObjectId = (tager: any) => {
    return typeof tager === "string" ? new ObjectId(tager) : tager;
}


//** For each property, check whether the logged-in member has liked it, and attach that info as meLiked. **/
export const lookupAuthMemberLiked = (memberId: T, targetRefId: string = '$_id') => {
	return {
		$lookup:{
			from: "likes",
		let: {                      // this part helps conduct "search"
			localLikeRefId: targetRefId,
			localMemberId: memberId,
			localMyFavorite: true
		},
		pipeline: [
			{
				$match: {
					$expr: { //Treat this as a logical expression, not a normal field query.
						$and: [{$eq: ["$likeRefId", "$$localLikeRefId"]}, {$eq: ["$memberId", "$$localMemberId"]}],
					} // "$and" all conditions must be true, "$eq" it means.
				}
			},
			{
				$project: {   // this info that return in meLiked[]
					_id: 0,        // Document itself id
					memberId: 1,
					likeRefId: 1,
					myFavorite: '$$localMyFavorite',
				}
			}
		], 
		as: 'meLiked', // "meLiked[]" at the end of each data
	  }
	}
}

export const lookupMember = {
	$lookup:{
		from: "members",
		localField: "memberId",
		foreignField: "_id",
		as: "memberData"
	}
}

export const lookupFollowingData = {
	$lookup: {
		from: 'members',
		localField: 'followingId',
		foreignField: '_id',
		as: 'followingData'
	}
};

export const lookupFollowerData = {
	$lookup: {
		from: 'members',
		localField: 'followerId',
		foreignField: '_id',
		as: 'followerData'
	}
};