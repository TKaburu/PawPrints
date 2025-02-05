import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  // useLocation,
} from "react-router-dom";
import {
  Navbar,
  ProtectedRoute,
  Footer,
  AuthForm,
} from "./components";

import {
  Home,
  PetOwnerDashboard,
  PetSearch,
  NotFound,
  TransferPetOwnership,
  RegisterPet,
  ContactPage,
} from "./pages";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;  
}

// function RegisterandLogout() {
//   localStorage.removeItem("token");
//   return <Register />;
// }

const Layout = () => {
  // const location = useLocation();
  // const hideNavbarRoutes = ["/login", "/register", "/logout"];

  return (
    <>
      <Navbar />
      {/* {!hideNavbarRoutes.includes(location.pathname) && <Navbar />} */}
      <section className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<AuthForm />} />
          <Route path="/login" element={<AuthForm />} />

          <Route path="/logout" element={<Logout />} />

          <Route 
            path="/pet-owner-dashboard/:username" 
            element={
              <ProtectedRoute>
                <PetOwnerDashboard />
              </ProtectedRoute>
            }
        />

          <Route 
            path="/vet-clinic-dashboard/:username" 
            element={
              <ProtectedRoute>
                <PetOwnerDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/search-pet" element={<PetSearch />} />
          {/* <Route
            path="/:username"
            element={
              <ProtectedRoute>
                <PetOwnerDashboard />
              </ProtectedRoute>
            }
          /> */}
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
          <Route path="/contact" element={<ContactPage />} />
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
