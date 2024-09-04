import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { APICall } from "../../Helpers/APICalls";
import axios from 'axios';
import {
  
  InsertUpdateJob,
  getJobFormId,
  updateJob
} from "../../Helpers/APIEndPoints/EndPoints";
import InputForm from "../../Components/InputForm/InputForm";
import notify from "../../Helpers/ToastNotification";
import SelectForm from "../../Components/SelectForm/SelectForm";
const UserEdit = () => {
  const { state } = useLocation();
  let navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [companyName, setCompanyName] = useState("");
  const [position, setPosition] = useState("");
  const [contract, setContract] = useState(null);
  const [location, setLocation] = useState("");
  const [contractOptions,setContractOptions] = useState([{label:"Full-Time",value:"Full-Time"}, {label:"Part-Time",value:"Part-Time"}, {label:"Contract",value:"Contract"},{label:"Temporary",value:"Temporary"},{label:"Internship",value:"Internship"}])

  const selectOnChange = (event, name) => {
    switch (name) {
      case "companyName":
        setCompanyName(event.target.value);
        break;
      case "position":
        setPosition(event.target.value);
        break;
      case "contract":
        setContract(event);
        break;
      case "location":
        setLocation(event.target.value);
        break;
      default:
        break;
    }
  };

  const Validation = () => {
    let isError = false;
    setFormErrors({});

    if (!companyName) {
      setFormErrors(prev => ({ ...prev, companyName: "Company Name is required" }));
      isError = true;
    }
    if (!position) {
      setFormErrors(prev => ({ ...prev, position: "Position is required" }));
      isError = true;
    }
    if (!contract) {
      setFormErrors(prev => ({ ...prev, contract: "Contract is required" }));
      isError = true;
    }
    if (!location) {
      setFormErrors(prev => ({ ...prev, location: "Location is required" }));
      isError = true;
    }

    return isError;
  };

  const getUserDetails = async () => {
    const url = `${getJobFormId}/${state.id}`;
    const data = await axios.get(url);
    console.log(data)
    if (data) {
      setCompanyName(data.data.name || "");
      setPosition(data.data.position || "");
      setContract(data.data.contract ? {label:data.data.contract,value:data.data.contract} : null);
      setLocation(data.data.location || "");
    
    }
  };

  useEffect(() => {
    if (state && state.id) {
      getUserDetails();
    }
  }, [state]);

  const onClickFunction = async (event, name) => {
    if (name === "Cancel") {
      navigate("/JobFormDisplay");
    }
    if (name === "Submit") {
      const error = Validation();
      if (!error) {
        await InsertUpdateUsers();
      }
    }
    if (name === "Reset") {
      setCompanyName("");
      setPosition("");
      setContract("");
      setLocation("");
  
      setFormErrors({});
    }
  };

  const InsertUpdateUsers = async () => {
    let requestParams = {
      name:companyName,
      position:position,
      location:location,
      contract:contract ? contract.value : "",
      
      
    };
    var data = null
    if(state){
      var url = `${updateJob}/${state.id}`
       data = await axios.put(url, requestParams);
    }
     else {
      
     data = await axios.post(InsertUpdateJob, requestParams);
     }
     console.log(data)
    if (data.data.Message) {
      console.log('a')
      notify(0, state ? "Job updated successfully." : "Job added successfully.");

      navigate("/JobFormDisplay"); 
      //navigate(-1);
    } else {
      // data.message === "mapped"
      //   ? setFormErrors({ role_isEmpty: "Role is mapped" })
      //   :
         notify(1, "Something went wrong, Try again later.");
    }
  };

  return (
    <>
      <div className="form-main px-3">
        <div className="page-title w-100">
          <div className="col-lg-12 p-0">
            <div className="row">
              <div className="col-lg-4 col-md-4">
                <h4>User Role</h4>
              </div>
              <div className="col-lg-4 col-md-2"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-12 col-md-12 px-3 py-2 page_heading">
        <div className="row align-items-center">
          <div className="col-lg-4 col-sm-3 col-xs-4 ">
            <div className="form-group">
              <label className="col-form-label">Company Name</label>
              <sup>*</sup>
              <InputForm
              isDisabled={false}
                className="form-control form-control-lg input_form_height "
                placeholder={"Company Name"}
                value={companyName}
                textArea={false}
                onChange={(e) => selectOnChange(e, 'companyName')}
              />
              <p style={{ color: "red" }}>{formErrors["companyName"]}</p>
            </div>
          </div>

          <div className="col-lg-4 col-sm-3 col-xs-4 ">
            <div className="form-group">
              <label className="col-form-label">Position</label>
              <sup>*</sup>
              <InputForm
              textArea={false}
              isDisabled={false}
                className="form-control form-control-lg input_form_height "
                placeholder={"Position"}
                value={position}
                onChange={(e) => selectOnChange(e, 'position')}
              />
              <p style={{ color: "red" }}>{formErrors["position"]}</p>
            </div>
          </div>

          <div className="col-lg-4 col-sm-3 col-xs-4 ">
            <div className="form-group">
              <label className="col-form-label">Contract</label>
              <sup>*</sup>
           
              <SelectForm
               options={contractOptions}
               value={contract}
               placeholder={"Contract"}
               onChange={(e) => selectOnChange(e, 'contract')}
              />
              <p style={{ color: "red" }}>{formErrors["contract"]}</p>
            </div>
          </div>

          <div className="col-lg-4 col-sm-3 col-xs-4 ">
            <div className="form-group">
              <label className="col-form-label">Location</label>
              <sup>*</sup>
              <InputForm
              isDisabled={false}
              textArea={false}
                className="form-control form-control-lg input_form_height "
                placeholder={"Location"}
                value={location}
                onChange={(e) => selectOnChange(e, 'location')}
              />
              <p style={{ color: "red" }}>{formErrors["location"]}</p>
            </div>
          </div>

          <div className="col-lg-8 col-md-4">
            <div className="float-right">
              <button
                className="btn btn-success"
                style={{ marginLeft: 5 }}
                onClick={(e) => onClickFunction(e, "Submit")}
              >
                <i className="fa fa-save"></i> Submit
              </button>
              <button
                className="btn btn-info"
                style={{ marginLeft: 5 }}
                onClick={(e) => onClickFunction(e, "Reset")}
              >
                Reset
              </button>
              <button
                className="btn btn-cancel"
                style={{ marginLeft: 5 }}
                onClick={(e) => onClickFunction(e, "Cancel")}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserEdit;
