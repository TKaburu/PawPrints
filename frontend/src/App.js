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
  Home,
  Login,
  Register,
  PetSearch,
  PetOwnerDashboard,
  RegisterPet,
  TransferPetOwnership,
  ProtectedRoute,
  NotFound,
  Footer,
} from "./components";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterandLogout() {
  localStorage.removeItem("token");
  return <Register />;
}

const Layout = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/register", "/logout"];

  return (
    <>
      {/* <Navbar /> */}
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <section className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterandLogout />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/search" element={<PetSearch />} />
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
      {!hideNavbarRoutes.includes(location.pathname) && <Footer />}
      {/* <Footer /> */}
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
