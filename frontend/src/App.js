import './App.css';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar, Home, Login, Register, PetSearch, NotFound, Footer, ProtectedRoute } from './components';

function Logout() {
  localStorage.removeItem('token');
  return <Navigate to="/login" />;
}

function RegisterandLogout() {
  localStorage.removeItem('token');
  return <Register />;
}

const Layout = () => {
  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/register', '/logout'];

  return (
    <>
      {/* <Navbar /> */}
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />} 
      <Routes>
        <Route path="/" element={<Home /> } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterandLogout />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/search" element={<PetSearch />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      
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
