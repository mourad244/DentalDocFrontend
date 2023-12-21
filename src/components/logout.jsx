import auth from "../services/authService";

export const logout = () => {
  auth.logout();
  window.location = "/";
};
