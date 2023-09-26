import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleResponse } from './helpers/handleResponse';
import Error from './views/common/Error';
import UserProfile from './views/common/UserProfile';

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState('');

  const onChange = (event, setFunction) => {
    setFunction(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const url = "/api/signup";

    if (name.length == 0 || email.length == 0 || password.length == 0 || passwordConfirmation.length == 0 || password.length != passwordConfirmation.length)
      return;

    const body = {
      user: {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      }
    };

    document.querySelectorAll('.is-invalid').forEach(function (input) {
      input.classList.remove('is-invalid');
    })

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then(res => {
        handleResponse(res, (r) => {
          if (r.status == 'error') {
            const data = JSON.parse(r.data)
            let errorMessages = [];
            Object.keys(data).forEach(function (key) {
              var message = data[key];
              errorMessages.push(
                <Error key={key} message={key.replace(/_/g, ' ') + " " + message} />
              );
              const inputField = document.getElementById(key);
              inputField.classList.add('is-invalid');
            })
            setMessage(errorMessages);
          } else {
            secureLocalStorage.setItem("authorization", res.headers.get("Authorization"))
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
          <h1 className="display-4">Sign Up Page</h1>
          <p className="lead text-muted">
            Here is the form to sign up
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
                  <label htmlFor="name">name</label>
                  <input type="text" name="name" id="name" className="form-control" required onChange={(event) => onChange(event, setName)} />
                </div>
                <div className="form-group">
                  <label htmlFor="name">email</label>
                  <input type="text" name="email" id="email" className="form-control" required onChange={(event) => onChange(event, setEmail)} />
                </div>
                <div className="form-group">
                  <label htmlFor="name">password</label>
                  <input type="password" name="password" id="password" className="form-control" required onChange={(event) => onChange(event, setPassword)} />
                </div>
                <div className="form-group">
                  <label htmlFor="name">confirm password</label>
                  <input type="password" name="password_confirmation" id="password_confirmation" className="form-control" required onChange={(event) => onChange(event, setPasswordConfirmation)} />
                </div>
                <button type="submit" className="btn btn-primary mt-3">
                  Save
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default SignUp;