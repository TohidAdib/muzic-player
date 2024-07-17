import React, { Component } from 'react';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';

class SignInLog extends Component {
  render() {
    return (
      <div className='container'>
        <div className='row'>
          <div className='d-flex justify-content-center align-items-center'>
            <Link className='btn btn-primary my-2 mx-2' to="login">Login</Link>
            <Link className='btn btn-secondary my-2 mx-2' to="signin">Sign In</Link>
          </div>
        </div>
        <div className='col-12 d-flex flex-row justify-content-center align-items-center'>
          <Outlet/>
        </div>
      </div>
    );
  }
}

export default SignInLog;
