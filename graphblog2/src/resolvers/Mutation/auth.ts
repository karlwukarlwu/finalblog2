import { Context } from '../../index'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import JWT from 'jsonwebtoken';
import { JWT_SIN } from './keys';


interface SingupArgs {
    // email: string;
    // name: string;
    // 又通过包装给弄了个新的input
    credentials: {
        email: string;
        password: string;

    }
    bio: string;
    name: string;

}

interface SinginArgs{
    credentials: {
        email: string;
        password: string;

    }
}

interface UserPayload {
    userErrors: {
        message: string;
    }[];
    // 我不太明白为什么这里要加一个这个[]
    token: String | null
    // 这里对应 的是schema的type定义的类型名 因此要严格对应大小写
    Myuserid:number|null
}
export const authResolves = {
    signup: async (_: any, { credentials, bio,name }: SingupArgs,
        { prisma }: Context): Promise<UserPayload> => {
            
        const { email, password } = credentials
        const isEmail = validator.isEmail(email)
        if (!isEmail) {

            return {
                userErrors: [{
                    message: "EMAIL ERR"
                }],
                token: null,
                Myuserid:null
            }
        }


        const isVpws = validator.isLength(password, {
            min: 4
        });
        if (!isVpws) {

            return {
                userErrors: [{
                    message: "PWS LENGTH ERR"
                }],
                token: null,
                Myuserid:null
            }
        }


        if (!name) {
            return {
                userErrors: [{
                    message: "NAME LENGTH ERR"
                }],
                token: null,
                Myuserid:null
            }
        }

        if (!bio) {
            return {
                userErrors: [{
                    message: "BIO LENGTH ERR"
                }],
                token: null,
                Myuserid:null
            }
        }

        const hasP = await bcrypt.hash(password, 10)
        

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hasP
            }
        });
        
        const token = await JWT.sign({
            userId: user.id,
            
        }, "222", {
            expiresIn: 3600,
        })

        await prisma.profile.create({
            data: {
                bio,
                userId: user.id
            }
        })

       
        // 这一步是造token 通过解析可以拿到token加密的东西

        return {
            userErrors: [],
            token,
            Myuserid:user.id,
        }

        // return prisma.user.create({
        //     data: {

        //         email, name, password,
        //         // 我不知道为什么这里可以不放bio
        //         // 好像是因为这些参数是要给user 类的，user没有bio 所以不能写bio
        //         // { email, name, password, bio }: SingupArgs 这个是要的参数， data是给user的参数，user没有bio 所以不能给他
        //     }
        // })
    },
    signin: async (_: any, {credentials}: SinginArgs,
        { prisma }: Context): Promise<UserPayload> => {
            const {email,password}=credentials

            const user = await prisma.user.findUnique({
                where:{
                    email
                }
            });
            
            if(!user){
                return {
                    userErrors:[
                        {message:"INVALID EMAIL"}                    
                    ],
                    token:null,
                    Myuserid:null,
                }
            }

            const isMathc = bcrypt.compare(password,user.password)

            if(!isMathc){
                return {
                    userErrors:[
                        {message:"INVALID PWS"}                    
                    ],
                    token:null,
                    Myuserid:null,
                }
            }
            return{
                userErrors:[],
                token:JWT.sign({userId:user.id},"222",{
                    expiresIn:3600,
                    //草你妈 这个地方不能写的太大
                }),
                Myuserid:user.id,
                // 这一步因为只用了user.id 加密
                // 因此解析出来只有user.id
                
            }

        }
}