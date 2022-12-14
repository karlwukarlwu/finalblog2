import { useMutation, gql } from "@apollo/client";
import Button from "@restart/ui/esm/Button";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";


// 在注册以后把数据传给signIn 
// 这样拿到数据
const SIGNUP = gql`
  mutation Signup(
    $email: String!
    $password: String!
    $name: String!
    $bio: String!
  ) {
    signup(
      credentials: { email: $email, password: $password }
      name: $name
      bio: $bio
    ) {
      userErrors {
        message
      }
      token
      Myuserid
    }
  }
`;

export default function Signup() {
    const [signup, { data, loading }] = useMutation(SIGNUP);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");

    const handleClick = () => {
        signup({
            variables: {
                email,
                password,
                name,
                bio,
            },
        });
    };

    const [error, setError] = useState(null);

    useEffect(() => {
        if (data) {
            if (data.signup.userErrors.length) {
                setError(data.signup.userErrors[0].message);
            }
            if (data.signup.token) {
                localStorage.setItem("token", data.signup.token);
                // if(typeof(data.signin.Myuserid)===undefined){
                //     data.signin.Myuserid=null
                // }
                // localStorage.setItem("userId",data.signin.Myuserid);
            }
        }
    }, [data]);
    return (
        <div>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder=""
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>
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
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                </Form.Group>
                {error && <p>{error}</p>}
                <Button onClick={handleClick}>Signup</Button>
            </Form>
            <br/>
            <Link to={"/"}>have an account</Link>
            <br/>
            {/* {localStorage.getItem('userId')?<Link to= {`/profile/${localStorage.getItem('userId')}`}>go to profile</Link>:<label></label>} */}
            <br/>
            <Link to={"/posts"}> go to posts</Link>
      
        </div>
    );
}