import { Route, Routes } from "react-router-dom";

import Posts from "./pages/Posts/Posts";
import Profile from "./pages/Profile/Profile";
import "bootstrap/dist/css/bootstrap.min.css";
import Signup from "./pages/Signup/Signup";
import Signin from "./pages/Signin/Signin";
import { Provider } from '@lyket/react';

function App() {
  return (
    <div className="App" >
      <Provider apiKey="pt_32a225168c1d8277ae56fbd6d90643">
        <Routes>
          <Route strict exact path="/posts" element=<Posts /> />
          <Route strict exact path="/signup" element=<Signup /> />
          <Route strict exact path="/" element=<Signin /> />
          <Route strict exact path="/profile/:id" element=<Profile /> />
        </Routes>
      </Provider>
    </div>
  );
}

export default App;
