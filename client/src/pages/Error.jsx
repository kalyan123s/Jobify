import { Link, useRouteError } from 'react-router-dom'
import Wrapper from '../assets/wrappers/ErrorPage';
import img from '../assets/images/not-found.svg';


const Error = () => {

  const error= useRouteError();
  if(error.status===404){
    return(
      <Wrapper>
        <div>
          <img src={img} alt="not found" />
          <h3>Ohh! Page Not Found</h3>
          <p>We can't find the page you are looking for...</p>
          <Link to="/dashboard">Go back</Link>
        </div>
      </Wrapper>
    )
  }

  return(
    <Wrapper>
      <div>
        <h3>OOps! Something went wrong.</h3>
      </div>
    </Wrapper>
  ) 
}

export default Error
