import React, { useContext, useEffect, useState } from "react";
import notify from "../../Helpers/ToastNotification";
import axios from 'axios';
import fileDownload from "js-file-download";
import moment from "moment";
import { LoaderContext, getContext } from "../../Helpers/Context/Context";
import { useNavigate } from "react-router-dom";
import { APICall } from "../../Helpers/APICalls";
import { Tooltip } from "@mui/material";
import DynamicGrid from "../../Components/DynamicGrid/DynamicGrid";
import InputForm from "../../Components/InputForm/InputForm";
import {

  getJobForm
} from "../../Helpers/APIEndPoints/EndPoints";

import SelectForm from "../../Components/SelectForm/SelectForm";
//import AccessDenied from "../AccessDenied/AccessDenied";

const UserDashboard = () => {
  // const { showLoader, hideLoader } = useContext(LoaderContext);
  let navigate = useNavigate();
  const context = getContext();
  const [dashboardData, setDashboardData] = useState<any>([]);
  const [dashboardPageSize, setDashboardPageSize] = useState(10);
  const [dashboardStart, setDashboardStart] = useState(0);
  const [dashboardSortColumn, setDashboardSortColumn] = useState<any>("");
  const [dashboardSortDirection, setDashboardSortDirection] = useState("");
  const [dashboardCount, setDashboardCount] = useState(0);
  const [searchText, setSearchText] = useState<any>("");
  const [page, setPage] = useState(0);

  // const [, setRoleOptions] = useState([]);
  // const [roleVal, setRoleVal] = useState<any>([]);

  const gridColumns = [
    {
      name: "_id",
      label: "Id",
      options: {
        display: false,
      },
    },
    {
      name: "name",
      label: "Company Name",
      options: {
        filter: false,
        sort: true,
        sortDescFirst: true,
      },
    },
    {
      name: "position",
      label: "Position",
      options: {
        filter: false,
        sort: true,
        sortDescFirst: true,
      },
    },
    {
      name: "location",
      label: "Location",
      options: {
        filter: false,
        sort: false,
        sortDescFirst: true,
      },
    },
    {
      name: "contract",
      label: "Contract",
      options: {
        filter: false,
        sort: false,
        sortDescFirst: true,
      },
    },
   
    {
      name: "action",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        display: true,
        setCellProps: () => ({
          style: { textAlign: "center" },
        }),
        setCellHeaderProps: () => ({
          style: { textAlign: "center" },
        }),
        customBodyRender: (value, tableMeta) => {
          let id = tableMeta.tableData[tableMeta.rowIndex]['_id'];
          return (
            <div className="d-flex justify-content-center">
              <Tooltip title="edit">
                <a
                  className="mr-2"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/JobForm", {
                      state: { id },
                    });
                  }}>
                  <i className="fas fa-edit"></i>
                </a>
              </Tooltip>
            </div>
          );
        },
      },
    },
  ];

  useEffect(() => {
    // console.log(context);
    (async () => {
  //     showLoader();
  //  //   await GetRoleOptions();
  //     hideLoader();
    })();
  }, []);




  const LoadDashboard = async () => {
    await setDashboardData([]);
    await setDashboardCount(0);

    let requestParams = {
      pageSize: dashboardPageSize,
      pageStart: dashboardStart,
      SortOrder: dashboardSortDirection,
      SortColumn: dashboardSortColumn,
      SearchText: searchText,
    //  RoleName: role.toString(),
    };
    const  data  = await axios.get(getJobForm);
    console.log(data,'data')
    
    if (data !== null && data != undefined ) {
      await setDashboardData(data.data.data);
      setDashboardCount(data.data.data.length);
    }
  };
  useEffect(() => {
    // console.log("searchText", searchText.length);
    if (searchText.length !== 0) {
      setSearchText(searchText);
      setDashboardStart(0);
      setPage(0);
    } else {
      setDashboardStart(0);
      setPage(0);
    }
  }, [searchText]);

  useEffect(() => {
    LoadDashboard();
  }, [
    dashboardStart,
    dashboardSortColumn,
    dashboardSortDirection,
    dashboardCount,
    searchText,
  ]);


  const dashboardOptions = {
    showEmptyDataSourceMessage: true,
    selectableRows: "none",
    count: dashboardCount,
    rowsPerPage: dashboardPageSize,
    page: page,
    serverSide: true,
    rowsPerPageOptions: [],
    download: false,
    print: false,
    viewColumns: false,
    filter: false,
    search: false,
    responsive: "standard",

    //standard | vertical | simple
    onChangeRowsPerPage: (num) => {
      //   setLimit(num);
      //   setNxtPgInfo("");
      //   setPrevPgInfo("");
      //   setIsPrevOrNext("");
    },
    onSearchChange: (searchText) => {
      if (searchText !== null) {
        setSearchText(searchText);
      } else {
        setSearchText("");
      }
    },
    onColumnSortChange: async (sortColumn, sortDirection) => {
      if (sortDirection === "asc") {
        await setDashboardSortColumn(sortColumn);
        await setDashboardSortDirection(sortDirection);
      }
      if (sortDirection === "desc") {
        await setDashboardSortColumn(sortColumn);
        await setDashboardSortDirection(sortDirection);
      }
    },
    onChangePage: async (page) => {
      await setPage(page);
      await setDashboardStart(page * dashboardPageSize);
    },
    textLabels: {
      body: {
        noMatch: "No data found",
      },
    },
  };

  return (
    <>
      {true ? (
        <>
          <div className="form-main px-3">
            <div className="page-title w-100">
              <div className="col-lg-12 p-0">
                <div className="row">
                  <div className="col-lg-4 col-md-4">
                    <h4>Applied Jobs</h4>
                  </div>
                  <div className="col-lg-4 col-md-2"></div>
           
                </div>
              </div>
            </div>
          </div>

          <div className="page-content row filter-row-container m-0">
            <div className="transformer-tabs col-lg-12 col-md-12">
              <div className="meeting-tabs tabs-main col-lg-12 pl-0">
                <ul className="filters">
                  <li className="row d-flex mr-3">
                    

                    <div className="align-self-end col-lg-3 col-sm-3 col-xs-10 p-0 ml-2 mobile-view top-m  searchInput ">
                      <InputForm
                        value={searchText}
                        placeholder={"Search"}
                        isDisabled={false}
                        textArea={false}
                        onChange={(e) => {
                          setSearchText(e.target.value);
                        }}
                      />
                      <i
                        className="fa fa-search ml-2 mt-1"
                        aria-hidden="true"></i>
                    </div>
                    {/* 
                <div className="ml-3">
                  <button className="btn btn-save">Apply</button>
                  <button className="btn btn-reset">reset</button>
                </div> */}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <DynamicGrid
              options={dashboardOptions}
              data={dashboardData}
              columns={gridColumns}
            />
          </div>
        </>
       ) : ""
      // : (
      //   <AccessDenied />
      // )
      }
    </>
  );
};
export default UserDashboard;
