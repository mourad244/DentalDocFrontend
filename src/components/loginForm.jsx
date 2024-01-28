import React from "react";
import { Redirect } from "react-router-dom";
import Joi from "joi-browser";
import Form from "../common/form";
import { toast, ToastContainer } from "react-toastify";
import icondental from "../assets/icons/icon-dental.png";
import auth from "../services/authService";

class LoginForm extends Form {
  state = {
    data: { email: "", password: "" },
    errors: {},
  };

  schema = {
    email: Joi.string()
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          if (err.type === "any.empty") {
            err.message = "Le champ email est requis.";
          }
        });
        return errors;
      }),
    password: Joi.string()
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          if (err.type === "any.empty") {
            err.message = "Le champ password est requis.";
          }
        });
        return errors;
      }),
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
      <div className="bg-login-background rounded-login shadow-login m-auto  mt-10 flex h-96 w-[400px] min-w-fit flex-col items-center">
        <img className="m-5 h-20 w-fit" src={icondental} alt="" />
        <p className="  text-center text-5xl font-bold text-[#424746]">
          Dental Doc
        </p>
        <p className="text-center text-xl text-[#424746]">Authentification</p>

        <form className="flex flex-col" onSubmit={this.handleSubmit}>
          <div className="mt-2 flex w-fit flex-col ">
            <input
              className={
                "shadow-login-button-inselectd focus:shadow-login-button-selected rounded-full border-0 bg-[#F8F7F1] pl-3 pr-3 text-xs font-bold text-[#1f2037] transition-all duration-300 ease-in-out focus:outline-none"
              }
              name={"email"}
              id={"email"}
              type={"text"}
              value={this.state.data.email}
              onChange={this.handleChange}
              style={{ width: 176, height: 35 }}
              placeholder="Email"
            />
            {this.state.errors.email && (
              <div
                className={`mt-2 flex font-bold w-[${176}]px text-xs text-red-500`}
              >
                {this.state.errors.email}
              </div>
            )}
          </div>
          <div className="mt-2 flex w-fit flex-col">
            {/* 
     <div style={{ background: 'white', boxShadow: '', borderRadius: 111, border: '1px #CFCFCF solid'}}
            
            */}
            <input
              className={
                "shadow-login-button-inselectd focus:shadow-login-button-selected rounded-full border-0 bg-[#F8F7F1] pl-3 pr-3 text-xs font-bold text-[#1f2037] transition-all duration-300 ease-in-out focus:outline-none"
              }
              name={"password"}
              id={"password"}
              type={"password"}
              value={this.state.data.password}
              onChange={this.handleChange}
              style={{ width: 176, height: 35 }}
              placeholder="Mot de passe"
            />
            {this.state.errors.password && (
              <div
                className={` mt-2 flex font-bold w-max-[${176}]px text-xs text-red-500`}
              >
                {this.state.errors.password}
              </div>
            )}
          </div>
          <button
            className={
              !this.validate()
                ? "bg-authenfier-button shadow-login-button rounded-login my-2 h-10  w-44  cursor-pointer border-0  text-xs font-medium leading-7 text-white "
                : "rounded-login shadow-login-button pointer-events-none my-4 h-10 w-44 cursor-not-allowed bg-grey-ea  text-xs leading-7 text-grey-c0 focus:outline-none"
            }
          >
            S'Authentifier
          </button>
          <ToastContainer />
        </form>
      </div>
    );
  }
}

export default LoginForm;
