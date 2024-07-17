import React, { Component } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/navbar";
import SignInLog from "./components/signinlogin";
import LogIn from "./components/login";
import SignIn from "./components/sigin";
import Album from "./components/album";
import LogOut from "./components/logout";
import Player from "./components/player";
import UploadFile from "./components/uoploadfile";

class App extends Component {
  state = {
    token: "",
  };
  
  // گرفتن و دخیره توکن
  componentDidMount() {
    const token = localStorage.getItem("token");
    this.setState({ token });
  }
  // گرفتن و دخیره توکن

  render() {
    return (
      <>
        <NavBar />
        <Routes>

          {/* رندر کردن در صورت وجود توکن */}
          {!this.state.token ? (
            <>
              <Route path="signin-login" element={<SignInLog />}>
                <Route path="login" element={<LogIn />} />
                <Route path="signin" element={<SignIn />} />
              </Route>
            </>
          ) : (
            <>
              <Route path="logout" element={<LogOut />} />
              <Route path="uploadfile" element={<UploadFile />} />
            </>
          )}
          {/* رندر کردن در صورت وجود توکن */}

          <Route path="album" element={<Album />} />
          <Route path="" element={<Player />} />
        </Routes>
      </>
    );
  }
}

export default App;
