import { lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const Vehicles = lazy(() => import("./pages/vehicles/VehiclesPage"));
const Users = lazy(() => import("./pages/users/UsersPage"));

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </Router>
  );
}
