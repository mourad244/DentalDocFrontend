import React from "react";
import { Redirect } from "react-router-dom";
import Joi from "joi-browser";
import Form from "../common/form";
import { toast, ToastContainer } from "react-toastify";
import logo from "../assets/images/logo-dental-doc.png";

import auth from "../services/authService";

class LoginForm extends Form {
  state = {
    data: { email: "", password: "" },
    errors: {},
  };

  schema = {
    email: Joi.string().required().label("email"),
    password: Joi.string().required().label("Password"),
  };

  doSubmit = async () => {
    try {
      const { email, password } = this.state.data;
      await auth.login(email, password);

      this.props.isLogged(true);
      // const { state } = this.props.location;
      // window.location = state ? state.from.pathname : "/accueil";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.nom = ex.response.data;
        this.setState({ errors });
        toast.error(errors.nom);
      }
    }
  };

  render() {
    if (auth.getCurrentUser()) {
      return <Redirect to="/accueil" />;
    }
    return (
      <div className="w-full min-w-fit">
        <p className="mt0 pt-4 text-center text-3xl font-bold text-[#23887a]">
          Application de gestion du cabinet dentaire
        </p>
        <div className="flex w-full justify-center py-8">
          <div className="w-fit">
            <p className="text-center text-xl  font-bold text-[#0f2b27]">
              Authentification
            </p>

            <form onSubmit={this.handleSubmit}>
              <div className="mt-3">{this.renderInput("email", "email")}</div>
              <div className="mt-3">
                {this.renderInput("password", "Password", 170, 35, "password")}
              </div>

              <div className="mt-3">{this.renderButton("Login")}</div>
              <ToastContainer />
            </form>
          </div>
          <img className="h-44" src={logo} alt="" />
        </div>
      </div>
    );
  }
}

export default LoginForm;
