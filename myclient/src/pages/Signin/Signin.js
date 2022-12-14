import React, { useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import { Form } from "react-bootstrap";
import Button from "@restart/ui/esm/Button";
import { Link } from "react-router-dom";

// 这个mutation后面的名字是你自己定的
const SINGIN = gql`

  mutation Signup($email: String!, $password: String!) {
    signin(credentials: { email: $email, password: $password }) {
      userErrors {
        message
      }
      token
      Myuserid
    }
  }
`;
// 我怀疑对应的是下面
export default function Signin() {
  const [signin, { data, loading }] = useMutation(SINGIN);

  console.log(data)
//这是在干什么
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleClick = () => {
    signin({
      variables: {
        email,
        password,
      },
    });
  };

  const [error, setError] = useState(null);

  useEffect(() => {
    if (data) {
      if (data.signin.userErrors.length) {
        setError(data.signin.userErrors[0].message);
      }
      if (data.signin.token) {
        localStorage.setItem("token", data.signin.token);
        localStorage.setItem("userId",data.signin.Myuserid)
      }
    }
    // console.log(data.signin.Myuserid)
  }, [data]);
  

  return (
    <div>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="text"
            placeholder=""
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        {error && <p>{error}</p>}
        <Button onClick={handleClick}>Signin</Button>
        <br/>
        <Link to={"/signup"}>don't have an account</Link>
        <br/>
        {localStorage.getItem('userId')?<Link to= {`/profile/${localStorage.getItem('userId')}`}>go to profile</Link>:<label></label>}
        <br/>
        <Link to={"/posts"}> go to posts</Link>
     
      </Form>
    </div>
  );
}