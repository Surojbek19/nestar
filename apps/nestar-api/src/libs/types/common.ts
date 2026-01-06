import { ObjectId } from "mongoose";

export interface T {
    [key: string]: any;
}

export interface StatisticModifier {  // this interface can change documents of any collection
    _id: ObjectId;
    targetKey: string;
    modifier: number;
}