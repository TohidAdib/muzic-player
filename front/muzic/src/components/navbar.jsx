import { Component } from "react";
import { NavLink } from "react-router-dom";

class NavBar extends Component {
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
      <nav className="nav justify-content-center">
        <NavLink className="nav-link" to="/">
          Audio
        </NavLink>
        <NavLink className="nav-link" to="/album">
          Album
        </NavLink>
        {/* رندر کردن در صورت وجود توکن */}
        {this.state.token ? (
          <>
            <NavLink className="nav-link" to="/uploadfile">new muzic</NavLink>
            <NavLink className="nav-link" to="/logout">
              Logout
            </NavLink>
          </>
        ) : (
          <NavLink className="nav-link" to="/signin-login">
            Login/Signin
          </NavLink>
        )}
        {/* رندر کردن در صورت وجود توکن */}
      </nav>
    );
  }
}

export default NavBar;
