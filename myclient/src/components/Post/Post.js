
import "./Post.css"
import React from 'react'
import { gql, useMutation } from "@apollo/client"
import { Provider, LikeButton } from "@lyket/react";



// mutation 后面的名字的下面定义的
//  postPublish(postId: $postId) 这个对应的是schema 的
const PUBLISH_POST = gql`
mutation PublishPost($postId: ID!) {
  postPublish(postId: $postId) {
    post {
      title
    }
  }
}
`
const UNPUBLISH_POST = gql`
mutation postUnpublish($postId: ID!) {
  postUnpublish(postId: $postId) {
    post {
      title
    }
  }
}
`

function Post({
  title,
  content,
  date,
  user,
  published,
  id,
  isMyProfile,
}) {
  // 开始在这里修改了

  // const {data,loding,error}= useMutation(PUBLISH_POST)
  const [publishPost, { data, loading }] = useMutation(PUBLISH_POST)

  // 我说实话我没看懂这个怎么拿到的
  const [unpublishPost, { data:unpublishData, loading:unpublishLoading }] = useMutation(UNPUBLISH_POST)





  const formatedDate = new Date(Number(date));
  return (
    (
      <div className="Post" style={published === false ? { backgroundColor: "hotpink" } : {}}>

        {isMyProfile && published === false && <p className="Post__publish"
          onClick={() => {
            publishPost({
              variables: {
                postId: id
              }
            })
          }}

        >publish</p>}

        {isMyProfile && published === true && <p className="Post__publish"
        onClick={() => {
          unpublishPost({
            variables: {
              postId: id
            }
          })
        }}
        
        >unpublish</p>}
        <Provider apiKey="acc0dbccce8e557db5ebbe6d605aaa">
          <LikeButton
            namespace="testing-react"
            id="everybody-like-now"
          />
        </Provider>

        <div className="Post__header-container" >
          <h2>{title}</h2>
          {/* 拿到上面的title */}
          <h4>createdAt {`${formatedDate}`.split(" ").splice(0, 4).join(" ")} <br />
            by  {user}
          </h4>

        </div>
        <p>{content}</p>
      </div>
    )
  );
}

export default Post