// 在这里建立新的一个mutation文件夹 把post 全部扔进去
import { authResolves } from "./auth"
import{postResolvers} from "./post"
export const Mutation = {
    ...postResolvers,
    // 又是解构。。。
    ...authResolves,
}