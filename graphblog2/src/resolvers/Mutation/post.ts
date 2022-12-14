import { Post, Prisma } from '.prisma/client'
import { Context } from '../../index'
import { canUserMutatePost } from '../../utils/canUserMutatePost';
// index 定义Context 的意义
interface PostArgs {
    post: {
        // title: string;
        title?: string
        content?: string;
    }
}
// 在这里把类型定义好，防止在下面出现类型错误

//因为在后面把这些封装在input里面了，因此要加上一个post 说的是post的 
// 加上？表示这个可以是固定类型，也可以是undefined

interface PostPayloadType {
    userErrors: {
        message: string
    }[],
    post: Post | Prisma.Prisma__PostClient<Post, never> | null
    // 从'@prisma/client'这里导入的
}

export const postResolvers = {
    // 这里加上postId
    postCreate: async (_: any, { post }: PostArgs ,
        // 加上userInfo 这样就是创造post的时候直接给userId 这个给authID 赋值 这样才能到时候比对删除
        { prisma, userInfo }: Context): 
        Promise<PostPayloadType> => {


        //我说实话 上面我没看懂这里,这个好像是确定类型

        //检验，标题和content不能为空
        // 为空就not null


        if (!userInfo) {
            return {
                userErrors: [{
                    message: "UNLOGIN CREATE"
                }],
                post: null
            }
        }

        const { title, content } = post

        if (!title || !content) {
            return {
                userErrors: [{
                    message: "NOT NULL CREATE"
                }],
                post: null
            }
        }
        // 不为空就开始正常create
        // const post = await prisma.post.create({
        //     data: {
        //         title,
        //         content,
        //         authorId: 1
        //     }
        // })
        // 然后返回不为空的新东西
        return {
            userErrors: [],
            // post: post
            // 把上面那段拿到这里来了，然后要给post加上这个类型 在interface里 Prisma__PostClient<Post, never>
            post: prisma.post.create({
                data: {
                    title,
                    content,
                    //    authorId: 
                    authorId: userInfo.userId
                    // 这次开始自动赋值
                }
            })
        }
        // const number = title/content
    },

    // 很诡异的语法，好像是["post"]这样可以拿到post里面的属性，还能再放个postId进来
    postUpdate: async (_: any, { post, postId }: 
        { postId: string, post: PostArgs["post"] },
        { prisma, userInfo }: Context): Promise<PostPayloadType> => {
        // const a = post.content
        // cosnt a = post.post.content
        //有无["post"]的区别

        if (!userInfo) {
            return {
                userErrors: [{
                    message: "UNLOGIN UPDATE"
                }],
                post: null
            }
        }

        const error = await canUserMutatePost({
            userId: userInfo.userId,
            postId: Number(postId),
            prisma
        });

        if (error) return error;

        const {title,content}=post

        if (!title && !content) {
            return {
                userErrors: [
                    {
                        message: "NOT ALL NULL UPDATE"
                    }
                ],
                post: null
            }
        }

        // 这一步是查是不是帖子存在
        const existingPost = await prisma.post.findUnique({
            where: {
                id: Number(postId)

            }
        })


        if (!existingPost) {
            return {
                userErrors: [
                    {
                        message: "NOT EXIST UPDATE"
                    }
                ],
                post: null
            }
        }

        

        // 说实话我不喜欢这个方法
        let payloadToUpdate = {
            title,
            content
        }
        if (!title) delete payloadToUpdate.title;
        if (!content) delete payloadToUpdate.content;
        // 如果更新的是空 就删除原有内容，
        // 不是都空，有一个空，执行上面的代码，都空会在上面if拦截的

        return {
            userErrors: [],
            post: prisma.post.update({
                data: {
                    ...payloadToUpdate,
                },
                // 看不懂的语法，好像又是解构
                where: {
                    id: Number(postId),
                },
            }),
        }

        // prisma.post.update
    },
    postDelete: async (_: any, { postId }: { postId: string }, { prisma, userInfo }: Context): Promise<PostPayloadType> => {
        //和update一个逻辑
        if (!userInfo) {
            return {
                userErrors: [
                    {
                        message: "WRONG TOKEN DELETE",
                    },
                ],
                post: null,
            };
        }

        const error = await canUserMutatePost({
            userId: userInfo.userId,
            postId: Number(postId),
            prisma,
        });

        if (error) return error;



        const post = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        })

        if (!post) {
            return {
                userErrors: [
                    {
                        message: "NOT EXIST DELETE"
                    }
                ],
                post: null
            }
        }

        await prisma.post.delete({
            where: {
                id: Number(postId)
            }
        })
        // 我说实话跟node.js调用mysql好像

        return {
            userErrors: [],
            post,
        }

    },

    // 崩了就是这里 我敲不动了 这是复制粘贴的
    postPublish: async (
        _: any,
        { postId }: { postId: string },
        { prisma, userInfo }: Context
      ): Promise<PostPayloadType> => {
        if (!userInfo) {
          return {
            userErrors: [
              {
                message: "Forbidden access (unauthenticated)",
              },
            ],
            post: null,
          };
        }
    
        const error = await canUserMutatePost({
          userId: userInfo.userId,
          postId: Number(postId),
          prisma,
        });
    
        if (error) return error;
    
        return {
          userErrors: [],
          post: prisma.post.update({
            where: {
              id: Number(postId),
            },
            data: {
              published: true,
            },
          }),
        };
      },
      postUnpublish: async (
        _: any,
        { postId }: { postId: string },
        { prisma, userInfo }: Context
      ): Promise<PostPayloadType> => {
        if (!userInfo) {
          return {
            userErrors: [
              {
                message: "Forbidden access (unauthenticated)",
              },
            ],
            post: null,
          };
        }
    
        const error = await canUserMutatePost({
          userId: userInfo.userId,
          postId: Number(postId),
          prisma,
        });
    
        if (error) return error;
    
        return {
          userErrors: [],
          post: prisma.post.update({
            where: {
              id: Number(postId),
            },
            data: {
              published: false,
            },
          }),
        };
      },
}