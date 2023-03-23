import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthContextProvider } from './components/context/AuthContext';
import { ChatContextProvider } from './components/context/ChatContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //context will share across the app if a user is logged in/exists
  <AuthContextProvider>
    <ChatContextProvider>
      <React.StrictMode>
        <App />
        <footer>
          <h3>A&D&D design 2023</h3>
          <p>© All rights reserved</p>
        </footer>
      </React.StrictMode>
    </ChatContextProvider>
  </AuthContextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
