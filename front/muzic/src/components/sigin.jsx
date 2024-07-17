import React, { Component } from "react";
import * as yup from "yup";
import axios from "axios";

class SignIn extends Component {
  state = {
    user: {
      username: "",
      email: "",
      password: "",
      password2: "",
    },
    errors: [],
  };

  // بخش راستی ازمایی اطلاعات
  schema = yup.object().shape({
    username: yup.string().required("username field is required"),
    email: yup
      .string()
      .email("please enter a valid email")
      .required("email field is required"),
    password: yup.string().required("password field is required"),
    password2: yup
      .string()
      .oneOf([yup.ref("password"), null], "passwords must match")
      .required("confirm password field is required"),
  });

  validate = async () => {
    try {
      const result = await this.schema.validate(this.state.user, {
        abortEarly: false,
      });
      this.setState({ errors:[]});
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
          "http://127.0.0.1:8080/signin/",
          result
        );
        const token = response.data.token;
        if (localStorage.getItem("token")) {
          localStorage.removeItem("token");
        }
        localStorage.setItem("token", token);
        this.setState({ errors:[]});
        window.location = "/album"
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        this.setState({ errors: ["user name or email is already in use"] });
      } else {
        this.setState({ errors: ["somthings wrong try again later"] });
      }
    }
  };
  // تابع برای ارسال اطلاعات به سرور

  render() {
    return (
      <div className="container mt-5">
        <h1>Sign In</h1>
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
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={this.state.user.email}
              onChange={this.handleChange}
              placeholder="Enter email"
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
          <div className="form-group mt-3">
            <label htmlFor="password2">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              id="password2"
              name="password2"
              value={this.state.user.password2}
              onChange={this.handleChange}
              placeholder="Confirm password"
            />
          </div>

          {/* کنترل ارور ها */}
          {this.state.errors != 0 ?  (<ul className="alert alert-danger mt-3">{this.state.errors.map((m,i)=> <li key={i}>{m}</li>)}</ul>) : null }
          {/* کنترل ارور ها */}
          
          <button type="submit" className="btn btn-primary mt-3">
            Sign In
          </button>
        </form>
      </div>
    );
  }
}

export default SignIn;
