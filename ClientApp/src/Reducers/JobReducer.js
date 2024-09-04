// src/reducers/jobReducer.js
const initialState = {
    jobs: [],
    filteredJobs: [],
    appliedJobs: [],
    error: null,
  };
  
  const jobReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_JOBS_SUCCESS':
        return { ...state, jobs: action.payload, filteredJobs: action.payload };
      case 'FETCH_JOBS_FAIL':
        return { ...state, error: action.payload };
      case 'APPLY_JOB_SUCCESS':
        return { ...state, appliedJobs: [...state.appliedJobs, action.payload] };
      case 'FETCH_APPLIED_JOBS_SUCCESS':
        return { ...state, appliedJobs: action.payload };
      case 'FETCH_APPLIED_JOBS_FAIL':
      case 'APPLY_JOB_FAIL':
        return { ...state, error: action.payload };
      case 'FILTER_JOBS':
        const { location, contract, companyName } = action.payload;
        const filteredJobs = state.jobs.filter((job) => {
          return (
            (location ? job.location === location : true) &&
            (contract ? job.contract === contract : true) &&
            (companyName ? job.companyName.includes(companyName) : true)
          );
        });
        return { ...state, filteredJobs };
      default:
        return state;
    }
  };
  
  export default jobReducer;
  