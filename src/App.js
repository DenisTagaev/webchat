import Register from './pages/registration/Register';
import Login from './pages/Sign-In/Login';
import PassReset from './pages/forgot-pass/PassReset';
import Home from './pages/Home';
import Profile from './pages/profile/Profile';
import { AuthContext } from './context/AuthContext';
import { useContext } from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { useNavigate, Navigate } from 'react-router-dom';

import './index.scss';

export default function App() {

  // using context hook to fetch the current user
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);

  /*
  
  Creation of protected root while user is logged in.
  
  */

  // const ProtectedRoute = ({ children }) => {
  //   if (!currentUser) {
  //     return <Navigate to="/" replace />;
  //   }
  //   return children;
  // }

  return (
    <BrowserRouter>
      {/* creating basic routing */}
      <Routes>
        <Route path="/">
          {/* basic path '/' should render home component, all nested routes shouldn't contain '/' */}
          <Route index element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="passReset" element={<PassReset />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}