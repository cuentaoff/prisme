import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Dashboard from "../components/Dashboard/Index.jsx";
import Login from "../components/Login.jsx";
import Profile from "../components/Profile.jsx";
import Index from "../components/analyse/Index.jsx";
import Data from "../components/charts/Data.jsx";
import Users from "../components/users/Users.jsx";
import AddUser from "../pages/AddUser";
import UpdateUser from "../pages/UpdateUser";
import AdminRoutes from "./AdminRoutes";
import AuthRoute from "./AuthRoute";
import LoginRoute from "./LoginRoute";
import Secteurs from "../components/Secteurs/Secteurs.jsx";
import Markowitz from "../components/Markowitz/Markowitz.jsx";
import Opcvm from "../components/OPCVM/Index.jsx";
import Backtest from "../components/Backtest/Backtest.jsx";
import Portefeuilles from "../components/portefeuilles/Index.jsx";

function RouterProvider() {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<AuthRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/rapports" element={<Data />} />
            <Route path="/markowitz" element={<Markowitz />} />
            <Route path="/analyses" element={<Index />} />
            <Route path="/sectorial" element={<Secteurs />} />
            <Route path="/opcvm" element={<Opcvm />} />
            <Route path="/backtest" element={<Backtest />} />
            <Route path="/portefeuilles" element={<Portefeuilles />} />
          </Route>
          <Route element={<AdminRoutes />}>
            <Route path="/users" element={<Users />} />
            <Route path="/users/:username/edit" element={<UpdateUser />} />
            <Route path="/users/create" element={<AddUser />} />
          </Route>
          <Route element={<LoginRoute />}>
            <Route element={<Login />} path="/login" />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default RouterProvider;
