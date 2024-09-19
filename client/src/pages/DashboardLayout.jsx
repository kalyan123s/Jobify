import { createContext, useContext, useEffect, useState } from 'react'
import Wrapper from '../assets/wrappers/Dashboard';
import { BigSidebar, SmallSidebar, Navbar } from '../components';
import { checkDefaultTheme } from '../App'; 
import { Outlet, redirect, useLoaderData, useNavigate } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';


export const loader = async () => {
  try {
    const { data } = await customFetch('/users/current-user');
    return data;
  } catch (error) {
    return redirect('/');
  }
};


// this is used to send value to all the child components written inside this const.Provider
const DashboardContext = createContext();


const DashboardLayout = ({queryClient}) => {

  // dashboard loader ka code
  // as i get the user we have to change the functionality of dashboard
  const { user } = useLoaderData();

  const navigate = useNavigate();

  const [showSidebar,setShowSidebar]= useState(false)
  const [isDarkTheme,setIsDarkTheme]= useState(checkDefaultTheme())

  const toggleDarkTheme = () => {
    const newDarkTheme = !isDarkTheme;
    setIsDarkTheme(newDarkTheme);
    document.body.classList.toggle('dark-theme', newDarkTheme);
    localStorage.setItem('darkTheme', newDarkTheme);
  };

  const toggleSidebar=()=>{
    setShowSidebar(!showSidebar);
  };
  
  const logoutUser= async()=>{
    navigate('/');
    await customFetch.get('/auth/logout');
    toast.success("Logged out!")
  };


  return(
    // whatever value provide in the dashboardContext provider we can access them 
    // in all the child components like in Small-sidebar, big-sidebar etc..components thats why we use 'context.provider'
    <DashboardContext.Provider value={{user, showSidebar, isDarkTheme, toggleDarkTheme, toggleSidebar,logoutUser}}>
      <Wrapper>
        <main className="dashboard">
          <SmallSidebar/>
          <BigSidebar/>
          <div>
            <Navbar/>
            <div className='dashboard-page'>
              <Outlet context={{user}} />
            </div>
          </div>
        </main>
      </Wrapper>
    </DashboardContext.Provider>
  )
}

export const useDashboardContext=()=>useContext(DashboardContext)
export default DashboardLayout
