import React from "react";
import { useParams } from "react-router";
import AddPostModel from "../../components/AddPostModel/AddPostModel"
import Post from "../../components/Post/Post";
import { gql, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";

// 在这里动态传入值来取ID 拿到id以后给传过来
const GET_PROFILE = gql`
query GetProfile($userId: ID!) {
    profile(userId: $userId) {
      bio
      isMyProfile
      user {
        name
        posts {
          id
          title
          content
          createdAt
          published
        }
      }
    }
  }
`

export default function Profile(params) {
    const { id } = useParams();
    console.log(333)

    const { data, error, loading } = useQuery(GET_PROFILE, {
        variables: {
            userId: id
        }
    })
    // 从这里动态拿到id
    console.log(data, error, loading)

    if (error) return <div>Error Page</div>
    // 检查错误

    if (loading) return <div>Spinner ...</div>

    const { profile } = data

    return (
        <div>
          <Link to={"/posts"}> go to posts</Link>
          <br/>
         
            <div style={{
                marginBottom: "2rem",
                display: "flex ",
                justifyContent: "space-between",
            }
            }>
                <div>
                    <h1>{profile.user.name}</h1>
                    <p>{profile.bio}</p>
                </div>
                {/* 通过这个代码 来改变 addPOSTmODEL */}
                <div>{profile.isMyProfile? <AddPostModel /> : null}</div>
            </div>
            <div>
            {profile.user.posts.map((post) => {
          return (<Post
            key={post.id}
          title={post.title}
          content={post.content}
          date={post.createdAt}
          user={profile.user.name}
          published={post.published}
          isMyProfile={profile.isMyProfile}
          id={post.id}
        />);
        })}
            </div>
        </div>


    )
};
