import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import { AuthProvider } from './api/AuthContext';
import Header from "./components/Header";
import Footer from "./components/Footer";
import Settings from "./Pages/Settings";
import ClaimDetails from "./components/ClaimDetails";
import AddClaim from "./components/AddClaim";
import UpdateClaim from "./components/UpdateClaim";


function App() {
  return (
 <AuthProvider>
      <Router>
        <Header/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/claimDetails/:id" element={<ClaimDetails/>} />
          <Route path="/addClaim" element={<AddClaim/>} />
          <Route path="/claims/update/:id" element={<UpdateClaim/>} />
          <Route path="/Settings" element={<Settings/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login/>} />
        </Routes>
        <Footer/>
      </Router>
      </AuthProvider>
  )
}

export default App;
