import React from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import {HomeLayout, Landing, Register, Login, DashboardLayout, Error, AddJob, Stats, AllJobs, Profile, Admin,EditJob} from './pages';

import { action as registerAction} from "./pages/Register";
import {action as loginAction} from './pages/Login'
import {action as addJobAction} from './pages/AddJob.jsx'
import {loader as dashboardLoader} from './pages/DashboardLayout.jsx'
import {loader as allJobsLoader} from './pages/AllJobs.jsx';

import { loader as editJobLoader } from './pages/EditJob';
import { action as editJobAction } from './pages/EditJob';
import { action as deleteJobAction } from './pages/DeleteJob.jsx';
import { loader as adminLoader } from './pages/Admin';

import {action as profileUpdateAction} from './pages/Profile.jsx';
import {loader as statsLoader} from "./pages/Stats.jsx"


export const checkDefaultTheme = () => {
  const isDarkTheme =
    localStorage.getItem('darkTheme') === 'true'
  document.body.classList.toggle('dark-theme', isDarkTheme);
  return isDarkTheme;
};

checkDefaultTheme();


const router=createBrowserRouter([
  {
    path:'/',
    element:<HomeLayout/>,
    errorElement:<Error/>,
    // all the children path is going to relative to parent "/" path
    children:[
      // whenever we goto Home layout page or parent page  landing page will be shown
      {
        index:true,
        element:<Landing/>,
      },
      {
        path:'register',
        element:<Register/>,
        action:registerAction
      },
      {
        path:'login',
        element:<Login/>,
        action:loginAction
      },
      {
        path:'dashboard',
        element:<DashboardLayout />,
        loader:dashboardLoader,
        // action:
        children:[
          {
            index:true,
            element:<AddJob/>,
            action:addJobAction
          },
          {
            path:'stats',
            element:<Stats/>,
            loader:statsLoader,
          },
          {
            path:'all-jobs',
            element:<AllJobs/>,
            loader:allJobsLoader,
          },
          {
            path:'profile',
            element:<Profile/>,
            action:profileUpdateAction,
          },
          {
            path: 'admin',
            element: <Admin />,
            loader: adminLoader,
          },
          {
            path:'edit-job/:id',
            element:<EditJob/>,
            loader: editJobLoader,
            action: editJobAction,
          },
          {
            path:'delete-job/:id',
            action:deleteJobAction,
          }
        ]
      },
    ]
  },  

]);

const App = () => {
  return <RouterProvider router={router} />;
}

export default App
