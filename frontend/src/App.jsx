import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "../pages/Dashboard";
import Students from "../pages/Students";
import Analytics from "../pages/Analytics";
import Explainability from "../pages/Explainability";
import Reports from "../pages/Reports";
function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          element={<MainLayout />}
        >

          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/students"
            element={<Students />}
          />

          <Route
            path="/analytics"
            element={<Analytics />}
          />

          <Route
            path="/explainability"
            element={<Explainability />}
          />

          <Route
            path="/reports"
            element={<Reports />}
          />

        </Route>

      </Routes>

    </BrowserRouter>

  );
}

export default App;