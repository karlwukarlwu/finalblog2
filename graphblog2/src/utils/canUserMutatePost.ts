import { Context } from ".."

interface CanUserMutatePost {
    userId: number,
    postId: number,
    prisma: Context["prisma"]
}

// getUser是看你是否登录 另一个是直接核对token的
// 这个文件是看你登录后是不是发帖的人，有没有操作权限

export const canUserMutatePost = async ({
    userId,
    postId,
    prisma,
}: CanUserMutatePost) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },

    })
    

    if(!user){
        return{
            userErrors:[{
                message:"NO USER"
            }],
            post: null
        }
    }
    // 看用户是否存在

    const post = await prisma.post.findUnique({
        where:{
            id:postId
        }
    })
    // 看id是否一致
    if(post?.authorId!==user.id){
        return{
            userErrors:[{
                message:"WRONG USER"
            }],
            post: null
        }
    }
}