import axios from "axios";
import React, { Component } from "react";
import * as yup from "yup";

class LogIn extends Component {
  state = {
    user: {
      username: "",
      password: "",
    },
    errors: [],
  };

  // بخش راستی ازمایی اطلاعات
  schema = yup.object().shape({
    username: yup.string().required("username field can not be empty"),
    password: yup.string().required("password field can not be empty"),
  });

  validate = async () => {
    try {
      const result = await this.schema.validate(this.state.user, {
        abortEarly: false,
      });
      this.setState({ errors: []});
      return result;
    } catch (error) {
      this.setState({ errors: error.errors });
    }
  };
  // بخش راستی ازمایی اطلاعات

  // تابع برای دخیره اطلاعات اینپوت در استیت
  handleChange = (e) => {
    const input = e.currentTarget;
    const user = { ...this.state.user };
    user[input.name] = input.value;
    this.setState({ user });
  };
  // تابع برای دخیره اطلاعات اینپوت در استیت

  // تابع برای ارسال اطلاعات به سرور
  handleSubmit = async (e) => {
    e.preventDefault();
    const result = await this.validate();
    try {
      if (result) {
        const response = await axios.post(
          "http://127.0.0.1:8080/login/",
          result
        );
        const token = response.data.token;
        if (localStorage.getItem("token")) {
          localStorage.removeItem("token");
        }
        localStorage.setItem("token", token);
        this.setState({ errors: [],user : {username : "", password : ""}});
        window.location = "/album"
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        this.setState({ errors: ["username or password is incoorect"] });
      } else {
        this.setState({ errors: ["somthings wrong try again later"] });
      }
    }
  };
  // تابع برای ارسال اطلاعات به سرور

  render() {
    return (
      <div className="container mt-5">
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={this.state.user.username}
              onChange={this.handleChange}
              placeholder="Enter username"
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={this.state.user.password}
              onChange={this.handleChange}
              placeholder="Enter password"
            />
          </div>

          {/* کنترل ارور ها */}
          {this.state.errors != 0 ?  (<ul className="alert alert-danger mt-3">{this.state.errors.map((m,i)=> <li key={i}>{m}</li>)}</ul>) : null }
          {/* کنترل ارور ها */}
          
          <button type="submit" className="btn btn-primary mt-3">
            Login
          </button>
        </form>
      </div>
    );
  }
}

export default LogIn;
