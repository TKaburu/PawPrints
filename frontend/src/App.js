import './App.css';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar, Home, Login, Register, NotFound, Footer, ProtectedRoute } from './components';

function Logout() {
  localStorage.removeItem('token');
  return <Navigate to="/login" />;
}

// function RegisterandLogout() {
//   localStorage.removeItem('token');
//   // return <Navigate to="/register" />;
//   return <Register />;
// }

// function App() {
//   const location = useLocation();
//   const hideNavbarRoutes = ['/login', '/register', '/logout'];

//   return (
//     <div className="App">
//       <BrowserRouter>
//       {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
//         <Routes>
//           <Route path="/" element={
//               <ProtectedRoute>
//                 <Home />
//               </ProtectedRoute>
//           } />  
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<RegisterandLogout />} />
//           <Route path="/logout" element={<Logout />} />
//           {/* <Route path="/registerandlogout" element={<RegisterandLogout />} /> */}
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//         <Footer />
//       </BrowserRouter>
//     </div>
//   );
// }

// export default App;

function RegisterandLogout() {
  localStorage.removeItem('token');
  return <Register />;
}

const Layout = () => {
  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/register', '/logout'];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar /> && <Footer />} 
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterandLogout />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
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
