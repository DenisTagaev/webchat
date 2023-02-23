import Register from './pages/registration/Register';
import Login from './pages/Sign-In/Login';
import PassReset from './pages/forgot-pass/PassReset';
import Home from './pages/Home';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './index.scss';

export default function App() {
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}