import React, { useState, useContext, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { ResponseTypeInterface } from './interfaces/response_type_interface';
import { handleResponse } from './helpers/handleResponse';
import EventContext from "./views/common/EventContext";
import UserProfile from './views/common/UserProfile';

const Login = () => {
  const navigate = useNavigate();
  const eventEmitter = useContext(EventContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>, setFunction: (value: string) => void): void => {
    setFunction(event.target.value);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
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

    fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    })
      .then(res => {
        handleResponse(res as Response, (r: ResponseTypeInterface) => {
          if (r.status == 'error') {
            eventEmitter.emit("showMessage", { text: JSON.parse(r.data)['message'], type: "failure" });
          } else {
            eventEmitter.emit("showMessage", { text: r.data['message'], type: "success" });
            const authorizationHeader = res.headers.get("Authorization");
            if (authorizationHeader !== null) {
              secureLocalStorage.setItem("authorization", authorizationHeader);
            }
            UserProfile.setUser(JSON.parse(r.data['user']))
            navigate(`/`);
          }
        })
      })
      .catch((e) => {
        eventEmitter.emit("showMessage", { text: 'Something went wrong. <br/>Error Message: ' + e, type: "success" });
      });
  };

  return (
    <>
      <section className="jumbotron jumbotron-fluid text-center">
        <div className="container">
          <h1 className="display-4">Login Page</h1>
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