import { Link, Form, redirect, useNavigate} from 'react-router-dom';
import Wrapper from '../assets/wrappers/RegisterAndLoginPage';
import { FormRow, Logo,SubmitBtn } from '../components';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';



export const action = async ({ request }) => {
const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    await customFetch.post('/auth/login', data);
    toast.success('Login successful');
    return redirect('/dashboard');
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};


const Login = () => {
  const navigate=useNavigate();
    
  const loginDemoUser= async () =>{
    const data = {
      email: "test@test.com",
      password: "secret123",
    };
    try {
      await customFetch.post('/auth/login', data);
      toast.success('Take a test drive');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error?.response?.data?.msg);
      return error;
    }
  };

  return (
    <Wrapper>
      <Form method='post' className='form'>
        <Logo/>
        <h4>Login</h4>

        {/* since we need number of input text tag so we made a component.  */}
        <FormRow type='email' name='email' />
        <FormRow type='password' name='password'/>
        <SubmitBtn formBtn/>
        <button type='button' className='btn btn-block' onClick={loginDemoUser} >
          explore the app
        </button>
        <p>
          Not a member yet?
          {/* this Link will allow us to go to register page without rendering complete file */}
          {/* this Link is an example of single page application */}
          <Link to="/register" className='member-btn'>Register</Link>
        </p>
      </Form>
    </Wrapper>
  )
}

export default Login
