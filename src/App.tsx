import "./App.css";

import { } from "@babylonjs/loaders";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { VrFlood } from "./pages/VrFlood";
import { Ar } from "./pages/Ar";


const App = () => (
  <Router>
    <Routes>
      <Route
        element={<VrFlood />}
        path="/"
      ></Route>
      <Route
        path="/ar"
        element={<Ar />}
      ></Route>
    </Routes>
  </Router>
);

export default App;
