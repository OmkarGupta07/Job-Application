import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../../Actions/AuthAction';
import InputForm from "../../Components/InputForm/InputForm";
import { useNavigate } from 'react-router-dom';
import BaseModal from '../../Components/BaseModel/BaseModel';
function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [confirmationMessage, setConfirmationMessage] = useState(''); // For confirmation
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const { error } = useSelector((state) => state.auth);
  const [openModal, setOpenModal] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validation logic
    let errors = {};
    if (name === 'name' && value.trim().length < 3) {
      errors.name = 'Username must be at least 3 characters long';
    } else if (name === 'email' && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
      errors.email = 'Invalid email address';
    } else if (name === 'password' && value.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    setFormErrors(errors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(formErrors).length === 0 && formData.name && formData.email && formData.password) {
      dispatch(signup(formData)).then(() => {
        // On successful signup
        setOpenModal(true);
        setTimeout(() => {
          navigate('/Login');
        }, 3000); // Redirect to login after 3 seconds
      }).catch((err) => {
        // Handle any signup errors here
        console.error(err);
      });
    } else {
      // Handle form validation errors before submitting
      alert("Please correct the errors in the form.");
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {confirmationMessage && <p style={{ color: "green" }}>{confirmationMessage}</p>} {/* Show confirmation */}
      <div className="row align-items-center">
        <div className="col-lg-4 col-sm-3 col-xs-4">
          <div className="form-group">
            <label className="col-form-label">User Name</label>
            <sup>*</sup>
            <InputForm
              className="form-control form-control-lg input_form_height"
              placeholder="User Name"
              isDisabled={false}
              textArea={false}
              value={formData.name}
              onChange={handleChange}
              name="name"
            />
            {formErrors.name && <p style={{ color: "red" }}>{formErrors.name}</p>}
          </div>
        </div>
        <div className="col-lg-4 col-sm-3 col-xs-4">
          <div className="form-group">
            <label className="col-form-label">Email</label>
            <sup>*</sup>
            <InputForm
              className="form-control form-control-lg input_form_height"
              placeholder="Email"
              isDisabled={false}
              textArea={false}
              value={formData.email}
              onChange={handleChange}
              name="email"
            />
            {formErrors.email && <p style={{ color: "red" }}>{formErrors.email}</p>}
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
              value={formData.password}
              onChange={handleChange}
              name="password"
              type="password"
            />
            {formErrors.password && <p style={{ color: "red" }}>{formErrors.password}</p>}
          </div>
        </div>
        <button
          className="btn btn-success"
          style={{ marginLeft: 5 }}
          onClick={handleSubmit} // Ensure the button submits the form
        >
          <i className="fa fa-save"></i> Submit
        </button>
      </div>
       {/* Modal for Confirmation */}
       {openModal && (
        <BaseModal
          content={<h4>Signup successful! Redirecting to login...</h4>}
          buttonText=""
        />
      )}
    </div>
  );
}

export default SignUp;
