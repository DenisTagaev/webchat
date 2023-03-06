import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './components/context/AuthContext';

import Register from './pages/registration/Register';
import Login from './pages/Sign-In/Login';
import PassReset from './pages/forgot-pass/PassReset';
import Profile from './pages/profile/Profile';
import Home from './pages/Home';

import './index.scss';

// // react bootstrap styling 
// import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  //getting the data about the user from the firebase
  const { currentUser } = useContext(AuthContext);

  //if the user is not logged in or does not exist return him to login
  const GuardRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />
    }
    //if the user exists - allow him to view any protected route
    return children;
  }

  return (
    <BrowserRouter>
      {/* creating basic routing */}
      <Routes>
        <Route path="/">
          {/* basic path '/' should render home component, all nested routes shouldn't contain '/' */}
          <Route index element={
            //protecting user page from being viewed if not a user
            <GuardRoute>
              <Home />
            </GuardRoute>
          } />
          <Route path='/profile' element={
            //protecting user page from being viewed if not a user
            <GuardRoute>
              <Profile />
            </GuardRoute>
          } />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="passReset" element={<PassReset />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
