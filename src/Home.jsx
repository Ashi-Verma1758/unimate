import { HashRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
export const Home = () => {
  return (
    <Router>
      <Routes>
        <Route path="/App" element={<App />} />
      </Routes>
    </Router>
  );
};
