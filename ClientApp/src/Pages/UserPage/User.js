// src/components/UserPage.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs, applyJob, filterJobs } from '../../Actions/AuthAction';

const UserPage = () => {
  const dispatch = useDispatch();
  const { filteredJobs } = useSelector((state) => state.job);

  const [filters, setFilters] = useState({
    location: '',
    contract: '',
    companyName: '',
  });

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const handleApply = (jobId) => {
    dispatch(applyJob(jobId));
  };

  const handleSearch = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    dispatch(filterJobs({ ...filters, [name]: value }));
  };

  return (
    <div>
      <h1>Job Listings</h1>
      <div>
        <input
          type="text"
          name="companyName"
          placeholder="Search by company"
          onChange={handleSearch}
        />
        <input
          type="text"
          name="location"
          placeholder="Filter by location"
          onChange={handleSearch}
        />
        <select name="contract" onChange={handleSearch}>
          <option value="">Select Contract</option>
          <option value="Full Time">Full Time</option>
          <option value="Part Time">Part Time</option>
        </select>
      </div>
      <div>
        {filteredJobs && filteredJobs.map((job) => (
          <div key={job['_id']}>
            <h3>{job.position} at {job.companyName}</h3>
            <p>{job.location} - {job.contract}</p>
            <button onClick={() => handleApply(job['_id'],"")}>Apply</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPage;
