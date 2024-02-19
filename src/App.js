import React, { useState, useEffect } from "react";
import { Route, /*  Redirect, */ Switch } from "react-router-dom";

import { getRoles } from "./services/roleService";
import { RiLogoutCircleRLine } from "react-icons/ri";

import NavBar from "./common/navBar";
import auth from "./services/authService";
import Rdvs from "./components/rdv/rdvs";
import NotFound from "./components/notFound";
import { logout } from "./components/logout";
import Devis from "./components/devis/devis";
import LoginForm from "./components/loginForm";
import RdvForm from "./components/rdv/rdvForm";
import DeviForm from "./components/devis/deviForm";
import Accueil from "./components/accueil/accueil";
import Patients from "./components/patients/patients";
import Settings from "./components/settings/settings";
import Paiements from "./components/paiements/paiements";
import PatientForm from "./components/patients/patientForm";
import PaiementForm from "./components/paiements/paiementForm";

import { ToastContainer } from "react-toastify";

import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import logo from "./assets/icons/icon-dental.png";

function App() {
  const [user, setUser] = useState();
  const [roles, setRoles] = useState([]);
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: roles } = await getRoles();
      setRoles(roles);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (roles.length > 0) {
      const yser = auth.getCurrentUser();
      if (yser)
        yser.role = roles.find((r) => {
          return r._id === yser.roleId;
        }).nom;
      setUser(yser);
    }
  }, [logged, roles]);
  const logOut = () => {
    logout();
  };

  const isLogged = () => {
    setLogged(true);
  };

  if (!user) {
    return <LoginForm isLogged={isLogged} />;
  }
  return (
    <React.Fragment>
      <ToastContainer />
      <div className="m-0 flex h-24 bg-gradient-radial p-1 ">
        <p className=" ml-5 flex w-48 items-center text-center text-xl font-bold text-[#424746]">
          Cabinet dentaire
        </p>
        <img
          // i want that the image be at the center of the header even if the screen is small
          className="z-10 m-auto h-24 "
          src={logo}
          alt=""
        />
        <div className="flex w-48 flex-row">
          <p className="user-name m-auto ml-5 mr-9 flex  items-center text-center text-xl font-bold text-[#424746]">
            {user.role}
          </p>
          <RiLogoutCircleRLine
            className="mr-5 cursor-pointer self-center"
            size="35"
            onClick={logOut}
            color="#FF4D4D"
          />
        </div>
        {/* <svg
          className="cursor-pointer self-center"
          width="30"
          height="30"
          onClick={logOut}
        >
          <path
            d="M10.7583 1.3987V13.2098C11.4755 14.7639 13.4221 14.8675 14.2418 13.2098V1.3987C13.627 -0.46623 11.373 -0.466228 10.7583 1.3987Z"
            fill="#FFAFAF"
          />
          <path
            d="M8.81159 2.43474V6.26817C0.615135 9.68718 2.15197 23.5705 13.0123 23.5705C22.0284 23.5705 24.6923 9.89439 16.1884 6.26817V2.43474C20.3891 3.16001 24.9554 8.53946 24.9996 14.3495C25.0516 21.1886 19.77 26.7091 13.0123 26.9894C5.97197 27.2815 -0.0555108 21.4746 0.000385693 14.3495C0.000385693 8.0295 5.63547 2.74558 8.81159 2.43474Z"
            fill="#FFAFAF"
          />
        </svg> */}
      </div>
      <div className=" flex flex-row">
        <NavBar user={user} />

        <main className=" w-min[1300px] flex w-[100%] flex-col px-2">
          <Switch>
            {/* login */}
            <Route path="/login" exact component={LoginForm} />
            {/* Accueil */}
            {user.role === "autorite" || user.role === "admin" ? (
              <Route path="/accueil" exact component={Accueil} />
            ) : (
              ""
            )}
            {/* Devis */}
            {user.role === "admin" || user.role === "comptable" ? (
              <Route
                path="/devis/:deviid/:patientid/:rdvid"
                exact
                component={DeviForm}
              />
            ) : (
              ""
            )}
            {user.role === "admin" || user.role === "comptable" ? (
              <Route path="/devis/:deviid" exact component={DeviForm} />
            ) : (
              ""
            )}
            {user.role === "admin" || user.role === "comptable" ? (
              <Route path="/devis" exact component={Devis} />
            ) : (
              ""
            )}
            {/* paiements */}
            {user.role === "admin" || user.role === "comptable" ? (
              <Route
                path="/paiements/new/:patientid"
                exact
                component={PaiementForm}
              />
            ) : (
              ""
            )}
            {user.role === "admin" || user.role === "comptable" ? (
              <Route
                path="/paiements/:paiementid"
                exact
                component={PaiementForm}
              />
            ) : (
              ""
            )}
            {user.role === "admin" || user.role === "comptable" ? (
              <Route path="/paiements" exact component={Paiements} />
            ) : (
              ""
            )}
            {/* patients */}
            {user.role === "admin" || user.role === "assistante" ? (
              <Route path="/patients/:id" exact component={PatientForm} />
            ) : (
              ""
            )}
            {user.role === "admin" || user.role === "assistante" ? (
              <Route path="/patients" component={Patients} />
            ) : (
              ""
            )}
            {/* rdvs */}
            {user.role === "admin" || user.role === "assistante" ? (
              <Route path="/rdvs/postpone/:id" exact component={RdvForm} />
            ) : (
              ""
            )}
            {user.role === "admin" || user.role === "assistante" ? (
              <Route path="/rdvs/:id" exact component={RdvForm} />
            ) : (
              ""
            )}
            {user.role === "admin" || user.role === "assistante" ? (
              <Route path="/rdvs" exact component={Rdvs} />
            ) : (
              ""
            )}

            {user.role === "admin" && (
              <Route path="/settings" exact component={Settings} />
            )}
            {/* not found */}
            <Route path="/not-found" exact component={NotFound} />
            {/* <Redirect from="/" exact to="/patients"></Redirect> */}
          </Switch>
        </main>
      </div>
    </React.Fragment>
  );
}

export default App;
