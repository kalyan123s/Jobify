import Wrapper from "../assets/wrappers/BigSidebar.js";
import NavLinks from './NavLinks.jsx'
import Logo from "./Logo.jsx";
import { useDashboardContext } from "../pages/DashboardLayout.jsx";


const BigSidebar = () => {
  const {showSidebar}=useDashboardContext();
  
  return (
    <Wrapper>
      <div className={showSidebar?'sidebar-container':'sidebar-container show-sidebar'}>
        <header>
          <Logo/>
        </header>
        <NavLinks isBigSidebar />
      </div>
    </Wrapper>
  )
}

export default BigSidebar
