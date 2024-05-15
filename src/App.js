import React, { useState, useEffect, useRef } from "react";
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
import Articles from "./components/pharmacie/articles/articles";
import ArticleForm from "./components/pharmacie/articles/articleForm";
import BonCommandes from "./components/pharmacie/bonCommandes/bonCommandes";
import BonCommandeForm from "./components/pharmacie/bonCommandes/bonCommandeForm";
import ReceptionBCs from "./components/pharmacie/receptionBonCommandes/receptionBCs";
import ReceptionBCForm from "./components/pharmacie/receptionBonCommandes/receptionBCForm";

import { ToastContainer } from "react-toastify";
import logo from "./assets/icons/icon-dental.png";
import { IoMdNotificationsOutline } from "react-icons/io";

import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import Notifications from "./components/notifications";
import { getCountLowStockItems } from "./services/pharmacie/articleService";

function App() {
  const [user, setUser] = useState();
  const [roles, setRoles] = useState([]);
  const [logged, setLogged] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [lowStockCount, setLowStockCount] = useState(0);
  const notificationsRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: roles } = await getRoles();
      setRoles(roles);
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchNotificationCounts = async () => {
      try {
        const { data } = await getCountLowStockItems();
        setLowStockCount(data.lowStockCount);
      } catch (error) {
        console.error("Failed to fetch notification counts", error);
      }
    };
    fetchNotificationCounts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        // showNotifications &&
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };
    // Add the event listener to the document
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Clean up the event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
  const toggleNotifications = (event) => {
    event.stopPropagation();
    setShowNotifications((prev) => !prev);
  };

  if (!user) {
    return <LoginForm isLogged={isLogged} />;
  }

  return (
    <React.Fragment>
      <ToastContainer />
      <div className="w-auto min-w-fit">
        <div className="m-0 flex h-24  bg-gradient-radial p-1 shadow-xl ">
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

            <IoMdNotificationsOutline
              className="cursor-pointer self-center"
              size="45"
              color="#424746"
              onClick={toggleNotifications}
            />
            {showNotifications && <Notifications ref={notificationsRef} />}
            <div className="bg ml-[-14px] mt-[16px] h-4 w-5 cursor-pointer self-center rounded-lg bg-red-600">
              <p
                className="text-center text-[10px] font-bold text-white"
                onClick={toggleNotifications}
              >
                {lowStockCount}
              </p>
            </div>
            <RiLogoutCircleRLine
              className="ml-2 mr-1 cursor-pointer self-center"
              size="45"
              onClick={logOut}
              color="#FF4D4D"
            />
          </div>
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
                  path="/devis/:deviid/:patientid/:rdvid/:acteid"
                  exact
                  component={DeviForm}
                />
              ) : (
                ""
              )}
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
              {/* articles */}
              {user.role === "admin" ? (
                <Route path="/articles/:id" exact component={ArticleForm} />
              ) : (
                ""
              )}
              {user.role === "admin" ? (
                <Route path="/articles" exact component={Articles} />
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
              {/* bon commandes */}
              {user.role === "admin" ? (
                <Route
                  path="/boncommandes/:id"
                  exact
                  component={BonCommandeForm}
                />
              ) : (
                ""
              )}
              {user.role === "admin" ? (
                <Route path="/boncommandes" component={BonCommandes} />
              ) : (
                ""
              )}
              {/* receptio bon commandes */}
              {user.role === "admin" ? (
                <Route
                  path="/receptionbcs/new/:boncommandeid"
                  exact
                  component={ReceptionBCForm}
                />
              ) : (
                ""
              )}
              {user.role === "admin" ? (
                <Route
                  path="/receptionbcs/:receptionbcid"
                  exact
                  component={ReceptionBCForm}
                />
              ) : (
                ""
              )}
              {user.role === "admin" ? (
                <Route path="/receptionbcs" component={ReceptionBCs} />
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
      </div>
    </React.Fragment>
  );
}

export default App;
