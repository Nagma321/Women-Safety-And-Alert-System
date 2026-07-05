
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'
import './index.css'
import SmoothScrolling from './Components/SmoothScrolling.jsx'
import { Config } from '../API/Config.js'
import UserContextProvider from './Context/UserContextProvider.jsx'


const GOOGLE_CLIENT_ID = Config.GoogleClientId;


createRoot(document.getElementById('root')).render(

  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <SmoothScrolling>
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </SmoothScrolling>
  </GoogleOAuthProvider>

)