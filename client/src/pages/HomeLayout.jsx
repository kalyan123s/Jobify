import React from 'react'
import { Outlet } from 'react-router-dom'

const HomeLayout = () => {
  return(
  <>
     {/* All the child elements  are there in Homelayout, Outlet make them visible in same homelayout page*/}
     <Outlet/>
  </>
)
}

export default HomeLayout
