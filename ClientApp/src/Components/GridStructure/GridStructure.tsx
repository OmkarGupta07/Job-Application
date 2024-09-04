import React, { useState, useEffect } from "react";
import DynamicGrid from "../DynamicGrid/DynamicGrid";
import { useNavigate } from "react-router-dom";
import BaseModal from "../BaseModel/BaseModel";
import FormStructure from "../FromStructure/FormStructure";
import SelectForm from "../SelectForm/SelectForm";
import "./GridStructure.css";
import Collapse from "react-bootstrap/Collapse";
import { APICall } from "../../Helpers/APICalls";

const GridStructure = () => {
  const [selectedTab, setSelectedTab] = useState(null);
  const [gridData, setGridData] = useState(null);
  // const [tabs, setTabs] = useState([]);
  // const [activetab, setActivetab] = useState<string>(null);
  const navigate = useNavigate();


  // useEffect(() => {
  //   debugger;
  //   (async () => {
  //     const tabs = await APICall("/api/Tabs/getTabs", "POST", {
  //       MN: "EmployeeCentral",
  //       IN: "Form",
  //     });

  //     if (tabs.data !== null && tabs.data.length > 0) {
  //       setTabs(tabs.data);
  //       setActivetab(tabs.data[0].TN);
  //     } else {
  //       console.log("No tabs found!", tabs);
  //       setTabs([]);
  //     }
  //   })();
  // }, []);

  useEffect(() => {
    getGridStructure();
  }, []);

  const getGridStructure = async () => {
    //debugger;
    const gridDataResponse = await APICall(
      "/api/Interface/getInterfaceDetailsForGrid",
      "POST",
      {
        MN: "EmployeeCentral",
        IN: "Grid",
        TN: "Personal",
      }
    );

    if (gridDataResponse.data !== null) {
      return setGridData(gridDataResponse.data.d);
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <button onClick={()=> navigate('/profile',{state:0})} className= "btn btn-primary mt-3">
            New Add +
        </button>
      </div>
        {/* <div className="row">
          <div className="col-lg-12 col-md-10 col-sm-12 ">
            <div className="tabBtn">
              <ul>
                {tabs.length > 0 &&
                  tabs.map((eachTab, index) => (
                    <li key={`${index}-${eachTab.TN}`}>
                      <button
                        onClick={() => setActivetab(eachTab.TN)}
                        className={
                          eachTab.TN === activetab ? "bttn active" : "bttn"
                        }
                      >
                        {eachTab.TDN}
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div> */}
        <div className="row">
          {gridData && (
            <GridSection data={gridData} selectedTab={selectedTab} />
          )}
        </div>
    </div>
  );
};

const GridSection = ({ data, selectedTab }) => {
  // debugger;
  const [sectionData, setSectionData] = useState({});
  const [filteredData, setFilteredData] = useState(data?.s[0]?.rowData);
  const [columnData, setColumnData] = useState(data?.s[0]?.columnData);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setFilteredData(data?.s[0]?.rowData);
    setColumnData(data?.s[0]?.columnData);
  }, [data]);

  const navigate = useNavigate();
  const centerStyles = {
    display: "flex",
    justifyContent: "start",
    alignItems: "center",
    padding: "0px 8px"
  };

  // function sort() {
  //   // if (name) {
  //   //   name;
  //   //   company;
  //   // }
  // }
  const view = (value, tableMeta) => {
    const url = value;
    // window.location.href = url;
    window.open(url);
  };

  const edit = (value, tableMeta, url) => {
    // debugger;
   const Tid = (tableMeta.rowData[0]);
    
    // navigate(url[1].editUrl);
    navigate('/profile',{state:Tid});
    
    //need to add state with id.
    //  navigate(url.editUrl)
  };

  const copy = (value, tableMeta) => {
    // debugger;
    alert("copy");
  };

  const modal = (value, tableMeta) => {
    // debugger;
    alert("modal");
  };

  const options = {
    filterType: "checkbox",
    showEmptyDataSourceMessage: true,
    selectableRows: "none",
    // count: dashboardCount,
    // rowsPerPage: dashboardPageSize,
    // page: page,
    serverSide: true,
    rowsPerPageOptions: [],
    download: false,
    print: false,
    viewColumns: false,
    filter: false,
    search: false,
    responsive: "standard",
  };
//option which is from backend if needed we use it 
  // const getOption = (attribute) => {
  //   const faData = data?.fa;
  //   if (faData && attribute.filn === "city") {
  //     return cityData.map((city) => ({ value: city.label, label: city.label }));
  //   } else {
  //     return [];
  //   }
  // };

  // Need to add custom logics here....
  const columnsWithCustomRender = data?.s[0]?.columnData.map((column) => {
    // debugger;
    if (column.name === "action") {
      return {
        ...column,
        options: {
          ...column.options,
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <>
                <div style={centerStyles}>
                  <i
                    style={{ marginRight: "15px" }}
                    onClick={() => view(value, tableMeta)}
                    className="fas fa-eye"
                  ></i>
                  <i
                    style={{ marginRight: "15px" }}
                    onClick={() => copy(value, tableMeta)}
                    className="fas fa-copy"
                  ></i>
                  <i
                    style={{ marginRight: "15px" }}
                    onClick={() => {
                      // navigate("/gridEdit")
                      edit(value, tableMeta, column.url);
                    }}
                    className="fas fa-edit"
                  ></i>
                  <BaseModal
                    buttonText={<i className="fa-solid fa-paper-plane"></i>}
                    content={<FormStructure />}
                  />
                </div>
              </>
            );
          },
        },
      };
    }
    return column;
  });

  const myInlineStyle = {
    backgroundColor: '#3c5464',
  };

  const onFilterChange = (event, type) => {
    //debugger;
    if (type === "city") {
      const selectedCityLabel = event?.label; // Add a null check here
      if (selectedCityLabel) {
        const newData = data?.s[0]?.rowData.filter(
          (item) => item.city === selectedCityLabel
        );
        setFilteredData(newData);
      } else {
        setFilteredData(data?.s[0]?.rowData);
      }
    }
  };

  return (
    <div className="container-fluid">
      <ul className="filters bg-grey">
        <li className="row d-flex mr-3 justify-content-end">
          {data.fa.map((cFilter, index) => (
            <>
              {cFilter.filt === "dropdown" ? (
                <>
                  <div className="col-lg-3 col-sm-10 col-xs-12 ml-3 mobile-view top-m">
                    <div className="">
                      <div className="form-group">
                        <span
                          className="mr-2"
                          style={{ float: "left", color: "white" }}
                        >
                          <label className="col-form-label">
                            {cFilter.filn}
                          </label>
                        </span>
                        <SelectForm
                          isClearable
                          options={[]}
                          // options={getOption(cFilter)}
                          placeholder={cFilter.filn}
                          isDisabled={false}
                          value={
                            sectionData[cFilter.code] !== undefined
                              ? {
                                  value: sectionData[cFilter.code],
                                  label: sectionData[cFilter.code],
                                }
                              : null
                          }
                          onChange={(selectedCity) => {
                            const newSectionData = {
                              ...sectionData,
                              [cFilter.code]: selectedCity
                                ? selectedCity.value
                                : null,
                            };
                            setSectionData(newSectionData);
                            onFilterChange(selectedCity, cFilter.filn);
                          }}
                          isMulti={false}
                          noIndicator={false}
                          noSeparator={false}
                        />
                      </div>
                    </div>
                  </div>
                  <ul className="float-right filter-icon-wel ml-2">
                    <li>
                      <a
                        href="javascript:void(0);"
                        onClick={() => setOpen(!open)}
                        aria-controls="example-collapse-text"
                        aria-expanded={open}
                        className="filter-btn"
                      >
                        <i className="fa fa-filter"></i>
                      </a>
                    </li>
                  </ul>
                </>
              ) : cFilter.filt === "text" ? (
                <></>
              ) : null}
            </>
          ))}
          {/* <div className="col-lg-3 col-sm-3 col-xs-12 p-0 ml-3 mobile-view top-m">
                  <div className="form-group">
                    <span className="mr-2" style={{ float: "left" }}>
                      <label className="col-form-label">Status</label>
                    </span>
                    <SelectForm
                      options={[]}
                      placeholder="Status"
                      isDisabled={false}
                      value={null}
                      onChange={(event) => {
                        {}
                      }}
                      // filterOption={(option) =>
                      //   tabClickValue === "Request-tab"
                      //     ? option.label !== "Approved"
                      //     : option
                      // }
                      isMulti={false}
                      noIndicator={false}
                      noSeparator={false}
                    />
                  </div>
                </div>

                <div className="col-lg-3 col-sm-3 col-xs-10 p-0 ml-2 mobile-view top-m  searchInput ">
                  <InputForm
                    value={''}
                    placeholder={"Search"}
                    isDisabled={false}
                    textArea={false}
                    onChange={(e) => {
                     {}
                    }}
                  />
                  <i className="fa fa-search ml-2 mt-1" aria-hidden="true"></i>
                </div>
                */}
        </li>
      </ul>
      <>
        <Collapse in={open}>
          <div id="example-collapse-text grid-wrapper">
            <div className="row mx-auto p-0"  style={myInlineStyle}>
              <div className="col-lg-3 col-md-3 col-sm-3">
                <div className="form-group">
                  {/* <!-- <label for="" className="">Meeting Date From</label> --> */}
                  <div className="input-group date selectdate">
                    <input
                      type="text"
                      placeholder="Meeting Date From"
                      className="form-control"
                    />
                    <span className="input-group-addon">
                      <span className="fa fa-calendar"></span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-3 col-sm-3">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by Owner"
                  />
                </div>
              </div>
            </div>
          </div>
        </Collapse>
        {console.log("columnsWithCustomRender", columnsWithCustomRender)}
      </>
      <DynamicGrid
        data={filteredData}
        columns={columnsWithCustomRender}
        options={options}
      />
    </div>
  );
};

export default GridStructure;
