import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux'; // Import Provider from react-redux
import { store } from './redux/store'; // Import your Redux store
import "@fontsource/poppins";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from './hooks/msalConfig';
// import GlobalZoomButtons from './components/ZoomController';

const msalInstance = new PublicClientApplication(msalConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <MsalProvider instance={msalInstance}>
{/* <div className='screen_modes'>
    <GlobalZoomButtons />
  </div> */}
  <Provider store={store}>  {/* Wrap App with Provider */}
    <div className='main-app'>
      <App />
    </div>
  </Provider>
  </MsalProvider>

);


reportWebVitals();
