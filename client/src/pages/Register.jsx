import { Form, redirect, Link } from 'react-router-dom';
import Wrapper from '../assets/wrappers/RegisterAndLoginPage';
import { FormRow, Logo, SubmitBtn } from '../components';
import customFetch from '../utils/customFetch';

import { toast } from 'react-toastify';


export const action = async({request})=>{
  const formData= await request.formData();
  const data= Object.fromEntries(formData);

  // now we will send all of the register-form users data
  try {
    await customFetch.post('/auth/register', data);
    toast.success('Registration successful');
    return redirect('/login');
    // return null;
  } catch (error) {
    // console.log(error);
    toast.error(error?.response?.data?.msg);
    return error;
  }
}

const Register = () => {

  // const navigation = useNavigation();
  // console.log(navigation);
  // const isSubmitting = navigation.state === 'submitting'

  return(
    <Wrapper>
      <Form method='post'  className='form'>
        <Logo/>
        <h4>Register</h4>

        {/* since we need number of input text tag so we made a component.  */}
        <FormRow type='text' name='name' />
        <FormRow type='text' name='lastName' labelText='last name' />
        <FormRow type='text' name='location' />
        <FormRow type='email' name='email' />
        <FormRow type='password' name='password' />
        
        <SubmitBtn/>
        <p>
          Already a member?
          <Link to="/login" className='member-btn'>Login</Link>
        </p>
      </Form>
     
    </Wrapper>
  )
}

export default Register
