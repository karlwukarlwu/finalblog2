import { Context } from "..";
import { userLoader } from "../loaders/userLoader";

// 直接从profile里面复制过来的
interface PostParentType {
  authorId: number;
 
}

export const Post = {
  user: (parent: PostParentType, __: any, {  prisma }: Context) => {
    return userLoader.load(parent.authorId)
  },
};