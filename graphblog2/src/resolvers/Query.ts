
import { Context } from "..";

export const Query= {

    me:(_:any,__:any,{userInfo,prisma}:Context)=>{
        // 只要调用userInfo 实际上就是拿着cookie走了一边
        // 因为userInfo 是通过getUserFromToken 来获取的
        if(!userInfo) return null;
        return prisma.user.findUnique({
            where:{
                id:userInfo?.userId
            }
        })
    },

    profile: async (_:any,{userId}:{userId:string},{prisma,userInfo}:Context)=>{
        const isMyProfile = Number(userId)===userInfo?.userId
        // 加上这行 判断这个是不是你发的
        // 下面这行就是之前判断是不是本人的profile的代码 他改成这样了
        const profile = await prisma.profile.findUnique({
            where:{
                userId:Number(userId)
            }
        })
        
        if(!profile) return null

        return{
            ...profile,
            isMyProfile
        };
        // 

        // return prisma.profile.findUnique({
        //     where:{
        //         userId:Number(userId)
        //     }
        // })
    },
    // posts: async (_:any,__:any,{prisma}:Context)=>{
    //     const posts = await prisma.post.findMany({
    //         orderBy:[
    //             // 按顺序展示
    //             {
    //                 createdAt:"desc"
    //             },
    //             // {
    //             //     title:"asc"
    //             // }
    //         ],
    //     });
    //     return posts
    // }

    // 上面的简化版
    posts:(_:any,__:any,{prisma}:Context)=>{
        return prisma.post.findMany({
            orderBy:[{
                createdAt:"desc"
            }],
        })
    }
}
//把这个独立出来