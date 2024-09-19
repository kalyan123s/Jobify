import { useDashboardContext } from '../pages/DashboardLayout'
import links from '../utils/links'
import { NavLink } from 'react-router-dom'

const NavLinks = ({isBigSidebar}) => {
    const {toggleSidebar, user}=useDashboardContext();
  return (
    <div className="nav-links">
        {links.map((link)=>{
            const {text,path,icon}=link;
            const { role } = user;
            if (role !== 'admin' && path === 'admin') return;

            return (
                // 'end is basically used to remove active class whenever we come out from that router
                <NavLink to={path} key={text} className="nav-link" onClick={isBigSidebar ? null : toggleSidebar} end>
                    <span className="icon">
                        {icon}
                    </span>
                    {text}
                </NavLink>
            )
        }) }
    </div>
  )
}

export default NavLinks

