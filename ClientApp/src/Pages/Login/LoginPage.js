import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../Actions/AuthAction';
import { useNavigate } from 'react-router-dom';
import InputForm from "../../Components/InputForm/InputForm";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(''); // State to manage email error
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, error } = useSelector((state) => state.auth);
  var userId = null;
  const validateEmail = (email) => {
    // Regular expression for basic email validation
    const re = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return re.test(email);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    // Validate email
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    } else {
      setEmailError(''); // Clear error if email is valid
    }

    userId = await dispatch(login({ email, password }));
  };

  if (isAuthenticated) {
    if (email.endsWith('@alphaware.com')) {
      navigate('/admin');
    } else {
      navigate('/jobs', { state:  userId  });
    }
  //  navigate(email.endsWith('@alphaware.com') ? '/admin' : '/jobs' ,{loginid : id});
  }

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="row align-items-center">
        <div className="col-lg-4 col-sm-3 col-xs-4">
          <div className="form-group">
            <label className="col-form-label">Email</label>
            <sup>*</sup>
            <InputForm
              className="form-control form-control-lg input_form_height"
              placeholder="Email"
              isDisabled={false}
              textArea={false}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
            />
            {emailError && <p style={{ color: 'red' }}>{emailError}</p>} {/* Show email error */}
          </div>
        </div>
        <div className="col-lg-4 col-sm-3 col-xs-4">
          <div className="form-group">
            <label className="col-form-label">Password</label>
            <sup>*</sup>
            <InputForm
              className="form-control form-control-lg input_form_height"
              placeholder="Password"
              isDisabled={false}
              textArea={false}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              type="password"
            />
          </div>
        </div>
        <div className="col-lg-4 col-sm-3 col-xs-4">
          <button
            className="btn btn-success"
            style={{ marginLeft: 5 }}
            onClick={handleSubmit} // Ensure the button triggers the handleSubmit function
          >
            <i className="fa fa-save"></i> Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
