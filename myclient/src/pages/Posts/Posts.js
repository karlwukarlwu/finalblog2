import React from 'react';

import Post from '../../components/Post/Post';
import { gql, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';

import { Provider, LikeButton } from "@lyket/react"


// 我们想要查的query模板
const GET_POST = gql`
    query{
        posts{
            title
            content
            createdAt
            user{
                name
            }
        }
    }
`
// console.log(333)

function Posts() {
    // console.log(3306)
    const { data, error, loading } = useQuery(GET_POST)
    // console.log({
    //     data,
    //     error,
    //     loading
    // });
    // 这里拿到数据

    if (error) return <div>Error Page</div>
    // 检查错误

    if (loading) return <div>Spinner ...</div>
    // loading 的时候显示的

    // console.log(data)
    const { posts } = data
    // console.log(localStorage.getItem("userId")===null)

    return <div>
        <Link to="/">log in</Link>
        <br/>
        <Link to={`/profile/${localStorage.getItem("userId")}`}>go to profile</Link>
       
        {
            posts.map(post => {
                return (<Post 
                    key={post.id}
                    title={post.title}
                    content={post.content}
                    date={post.createdAt}
                    id={post.id}
                    user={post.user.name} />
                )
            }
            )}
    </div>

};
console.log(3334)

export default Posts

