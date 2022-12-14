import { gql } from "apollo-server";

export const typeDefs = gql`
    type Query{
        me:User
        posts:[Post!]!
        profile(userId:ID!):Profile
    }

   type Mutation{
        postCreate(post:PostInput!):PostPayload!
        postUpdate(postId:ID!,post:PostInput!): PostPayload!
        postDelete(postId:ID!):PostPayload!
        signup(credentials:CredentialsInput!,bio:String!,name:String!):AuthPayload!
        signin(credentials: CredentialsInput!): AuthPayload!
        postPublish(postId: ID!): PostPayload!
        postUnpublish(postId: ID!): PostPayload!

   }

    type Post{
        id: ID!
        title: String!
        content: String!
        createdAt: String!
        published: Boolean!
        user: User!
    }
    type User{
        id: ID!
        name: String!
        email: String!
        
        posts: [Post!]!
    }

    type Profile{
        id: ID!
        bio: String!
        isMyProfile:Boolean!
        user: User!
    }

    type UserError {
        message: String!
    }

    type PostPayload {
        userErrors: [UserError!]!
        post: Post
    }

    input PostInput{
        title:String
        content:String
    }
    
    type AuthPayload{
        userErrors:[UserError!]!
        token:String
        Myuserid:Int
        
    }

    input CredentialsInput {
        email: String!
        password: String!
      }

`
//这里是数据的结构
// 在prisma里面写的是数据库的数据结构
// 这里写的是graphql的数据结构

// 关于query
// 日期是自动生成的，因此Post不用写
// 这里是查，因此query只写你想要让他查的值，这也是就为什么不写User 的 password之类的
// 我是这么想到，但是感觉这么说也不对

// 因为mutation里面的参数重复了，因此提取出来 PostInput
// postUpdate(title:String, content:String): PostPayload!
// 原本是这样

// 他这个好像还不一样，直接也能插入
// 其实是一样的， postCreate(post:PostInput!)通过传值在这里进行操作，看你是过滤还是添加还是删除
