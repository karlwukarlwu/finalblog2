import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schema"
import { Query,Profile,Post,User} from "./resolvers";
import { Mutation } from "./resolvers/Mutation/Mutation"
import { PrismaClient, Prisma } from ".prisma/client";
import { getUserFromToken } from "./utils/getUserFromToken";
// import { Jwt } from "jsonwebtoken";
import { JWT_SIN } from "./resolvers/Mutation/keys";

export const prisma = new PrismaClient()
// 用这个操作接下来的数据库
// 这个export来连接 userloaders


// prisma.post.create

export interface Context {
    prisma: PrismaClient<
    Prisma.PrismaClientOptions,
        never, 
        Prisma.RejectOnNotFound |
        Prisma.RejectPerOperation | undefined>,
    userInfo: {
        userId: number;
    } | null
}
// 写这行的意义是让Mutation 那些文件不用在 context里面费劲的定义，只要掉个包就行




// const resolvers = {

// }
//抽到文件夹里面去了 然后用index目录导航

const server = new ApolloServer({
    typeDefs,
    resolvers: {
        Query,
        Mutation,
        Profile,
        Post,
        User,
    },
    context: async ({ req }: any): Promise<Context> => {
        //这一步会取回很多prisma传回来的数据。
        // 我们将拿到的req.header 拿到utils里面

        // 逻辑上每个登录的都有一个token 那这个token解析然后得到userId
        // 拿这个userId去和post 的userId去碰

    const userInfo = await getUserFromToken(req.headers.authorization);
    // console.log(userInfo)
    // console.log(333)

    return {
      prisma,
      userInfo,
    };
    }
});
//把typeDefs 扔到schema里面去了



server.listen().then(({ url }) => {
    console.log(`server ready on ${url}`);
})
//监听看是不是正常