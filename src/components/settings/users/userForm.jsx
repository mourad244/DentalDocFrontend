import React from "react";
import Joi from "joi-browser";
import Form from "../../../common/form";
import { saveUser } from "../../../services/userService";
import _ from "lodash";

class UserForm extends Form {
  state = {
    data: {
      nom: "",
      email: "",
      roleId: "",
      password: "",
    },
    formDisplay: false,
    errors: {},
  };
  schema = {
    _id: Joi.string(),
    nom: Joi.string()
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          if (err.type === "any.empty") {
            err.message = "Le champ utilisateur est requis.";
          }
        });
        return errors;
      }),
    email: Joi.string()
      .email()
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          if (err.type === "any.empty") {
            err.message = "Le champ Email est requis.";
          }
          if (err.type === "string.email") {
            err.message = "Le champ Email doit être une adresse email valide.";
          }
        });
        return errors;
      }),
    password: Joi.string()
      .min(5)
      .max(200)
      .label("Mot de passe")
      .error((errors) => {
        errors.forEach((err) => {
          if (err.type === "any.empty") {
            err.message = "Le champ Mot de passe est requis.";
          }
          if (err.type === "string.min") {
            err.message =
              "Le champ Mot de passe doit avoir au moins 5 caractères.";
          }
          if (err.type === "string.max") {
            err.message =
              "Le champ Mot de passe ne doit pas dépasser 200 caractères.";
          }
        });
        return errors;
      }),

    roleId: Joi.string().required().label("Role"),
  };

  async populateUsers() {
    try {
      const user = this.props.selectedUser;
      if (user)
        this.setState({
          data: this.mapToViewModel(user),
        });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace(":not-found");
    }
  }

  async componentDidMount() {
    await this.populateUsers();
  }
  async componentDidUpdate(prevProps, prevState) {
    if (!this.props.selectedUser && prevState.data._id) {
      this.setState({ data: { nom: "" } });
    }
    if (
      this.props.selectedUser &&
      this.state.data._id !== this.props.selectedUser._id
    ) {
      await this.populateUsers();
    }
    if (prevProps.formDisplay !== this.props.formDisplay) {
      this.setState({ formDisplay: this.props.formDisplay });
    }
  }

  mapToViewModel(user) {
    return {
      _id: user._id,
      nom: user.nom,
      roleId: user.roleId ? user.roleId._id : "",
      email: user.email,
    };
  }
  doSubmit = async () => {
    let { data } = this.state;
    await saveUser(data);
    this.setState({ data: { nom: "" } });
    this.props.updateData();
  };

  render() {
    return (
      <>
        {this.props.formDisplay ? (
          <div className="mt-1 h-[fit-content] w-full rounded-tr-md border border-white bg-white shadow-md">
            <p className="ml-2 mt-2 w-full text-xl font-bold text-[#474a52]">
              Formulaire utilisateur
            </p>
            <form
              className="mb-6 ml-2 mr-2.5 mt-2 flex w-[100%] flex-wrap justify-start"
              onSubmit={this.handleSubmit}
            >
              {this.renderInput("nom", "Nom utilisateur")}
              {this.props && !_.isEmpty(this.props.selectedUser)
                ? ""
                : this.renderInput("password", "Mot de passe", 200)}
              {this.renderInput("email", "Email")}
              {this.renderSelect("roleId", "Rôle", this.props.roles)}
              {this.renderButton("Sauvegarder")}
            </form>
          </div>
        ) : (
          ""
        )}
      </>
    );
  }
}

export default UserForm;

// nom: user.nom,
// roleId: user.roleId,
