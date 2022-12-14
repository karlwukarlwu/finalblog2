import { Context } from "..";

// 真敲不动了
interface UserParentType {
    id: number;

}

export const User = {
    posts: (parent: UserParentType, __: any, { userInfo, prisma }: Context) => {
        const isOwnProfile = parent.id === userInfo?.userId;
        // 是你的i，则都能看见
        if (isOwnProfile) {
            return prisma.post.findMany({
                where: {
                    authorId: parent.id,
                },
                orderBy: [
                    {
                        createdAt: "desc",
                    },
                ],
            });
        } else {
            // 不是你的
            // 过滤一下 是不是pubilsh的
            return prisma.post.findMany({
                where: {
                    authorId: parent.id,
                    published: true,
                },
                orderBy: [
                    {
                        createdAt: "desc",
                    },
                ],
            });
        }
    }
};