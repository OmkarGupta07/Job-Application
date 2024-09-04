import axios from 'axios';

export const signup = (userData) => async (dispatch) => {
  try {
    const response = await axios.post('/api/users/register', userData);
    dispatch({ type: 'SIGNUP_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({ type: 'SIGNUP_FAIL', payload: error.response.data });
  }
};

export const login = (credentials) => async (dispatch) => {
  try {
    const response = await axios.post('/api/users/login', credentials);
    var userId = null;
    userId = response.data ? response.data.data.data[0]['_id'] : "";
    dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
    return userId;
  } catch (error) {
    dispatch({ type: 'LOGIN_FAIL', payload: error.response.data });
  }
};
export const fetchJobs = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/JobList');
    console.log(res,'data')
    dispatch({ type: 'FETCH_JOBS_SUCCESS', payload: res.data.data });
  } catch (error) {
    dispatch({ type: 'FETCH_JOBS_FAIL', payload: error.data.Message });
  }
};

// Apply for a job
export const applyJob = (jobId,userid) => async (dispatch) => {
  try {
    await axios.post('/api/ApplyJobs', { jobid: jobId, userid: userid });
    
    dispatch({ type: 'APPLY_JOB_SUCCESS', payload: jobId });
  } catch (error) {
    dispatch({ type: 'APPLY_JOB_FAIL', payload: error.data.Message});
  }
};

// Fetch applied jobs
export const fetchAppliedJobs = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/MyJobs');
    console.log(res,'data')
    dispatch({ type: 'FETCH_APPLIED_JOBS_SUCCESS', payload: res.data.data.data });
  } catch (error) {
    dispatch({ type: 'FETCH_APPLIED_JOBS_FAIL', payload: error.data.Message });
  }
};
export const filterJobs = (filters) => (dispatch) => {
  dispatch({ type: 'FILTER_JOBS', payload: filters });
};