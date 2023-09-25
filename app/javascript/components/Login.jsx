import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleResponse } from './helpers/handleResponse';
import Error from './views/common/Error';
import UserProfile from './views/common/UserProfile';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState('');

  const onChange = (event, setFunction) => {
    setFunction(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const url = "/api/login";

    if (email.length == 0 || password.length == 0)
      return;

    const body = {
      user: {
        email,
        password,
      }
    };

    document.querySelectorAll('.is-invalid').forEach(function (input) {
      input.classList.remove('is-invalid');
    })

    const token = document.querySelector('meta[name="csrf-token"]').content;
    fetch(url, {
      method: "POST",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then(res => {
        handleResponse(res, (r) => {
          if (r.status == 'error') {
            const message = JSON.parse(r.data).message

            setMessage(
              <Error message={message} />
            );
          } else {
            UserProfile.setUser(r.data)
            navigate(`/`);
          }
        })
      })
      .catch((e) => {
        setMessage('Something went wrong. <br/>Error Message: ' + e);
      });
  };

  return (
    <>
      <section className="jumbotron jumbotron-fluid text-center">
        <div className="container">
          <h1 className="display-4">Login Page</h1>
          <p className="lead text-muted">
            Here is the form to login
          </p>
          {message}
        </div>
      </section>
      <div>
        <main className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <form onSubmit={onSubmit}>
                <div className="form-group">
                  <label htmlFor="name">email</label>
                  <input type="text" name="email" id="email" className="form-control" required onChange={(event) => onChange(event, setEmail)} />
                </div>
                <div className="form-group">
                  <label htmlFor="name">password</label>
                  <input type="password" name="password" id="password" className="form-control" required onChange={(event) => onChange(event, setPassword)} />
                </div>
                <button type="submit" className="btn btn-primary mt-3">
                  Login
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Login;