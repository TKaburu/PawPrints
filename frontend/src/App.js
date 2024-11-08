import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import {
  Navbar,
  ProtectedRoute,
  Footer,
} from "./components";

import {
  Home,
  PetOwnerRegistration,
  VetRegistration,
  VetClinicRegistration,
  WelfareOrgRegistration,
  PetOwnerLogin,
  VetClinicLogin,
  WelfareOrgLogin,
  PetSearch,
  NotFound,
  PetOwnerDashboard,
  TransferPetOwnership,
  RegisterPet,
} from "./pages";

function Logout() {
  localStorage.clear();
  return <Navigate to="/" />;  
}

// function RegisterandLogout() {
//   localStorage.removeItem("token");
//   return <Register />;
// }

const Layout = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/register", "/logout"];

  return (
    <>
      <Navbar />
      {/* {!hideNavbarRoutes.includes(location.pathname) && <Navbar />} */}
      <section className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
              path="/register/pet-owner"
              element={<PetOwnerRegistration />}
            />

          <Route path="/register/vet" element={<VetRegistration />} />
          <Route
            path="/register/vet-clinic"
            element={<VetClinicRegistration />}
          />
          <Route
            path="/register/welfare-organization"
            element={<WelfareOrgRegistration />}
          />

          <Route path="/login/pet-owner" element={<PetOwnerLogin />} />
          <Route path="/login/vet-clinic" element={<VetClinicLogin />} />
          <Route path="/login/welfare-orginization" element={<WelfareOrgLogin />} />

          <Route path="/logout" element={<Logout />} />
          <Route path="/search-pet" element={<PetSearch />} />
          <Route
            path="/:username"
            element={
              <ProtectedRoute>
                <PetOwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transfer-pet-ownership/:slug"
            element={
              <ProtectedRoute>
                <TransferPetOwnership />
              </ProtectedRoute>
            }
          />
        
          <Route
            path="/register-pet"
            element={
              <ProtectedRoute>
                <RegisterPet />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
          
        </Routes>
      </section>
      {/* {!hideNavbarRoutes.includes(location.pathname) && <Footer />} */}
      <Footer />
    </>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </div>
  );
}

export default App;
