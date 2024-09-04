const prod = {
  url: "",
};
const dev = {
  url: "http://localhost:5000",
};
export const { url } = dev
export const getJobForm = url + "/api/JobList"
export const getJobFormId = url + "/api/JobListId"
export const InsertUpdateJob = url + "/api/JobFrom"
export const updateJob = url + "/api/JobList"

