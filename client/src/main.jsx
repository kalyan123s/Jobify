import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

// import customFetch from './utils/customFetch.js';
// const resp=await customFetch.get('/test')
// console.log(resp);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <ToastContainer position='top-center' autoClose='2000'/>
  </StrictMode>,
)
