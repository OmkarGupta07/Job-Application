import React, { useState, useEffect } from "react";
import InputForm from "../InputForm/InputForm";
import { tabsData, fromData, stateData } from "./formData";
import SelectForm from "../SelectForm/SelectForm";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import DynamicGrid from "../DynamicGrid/DynamicGrid";
import uuid from "react-uuid";

const FormStructure = () => {
  const Section = ({ tabId, moduleId, section }) => {
    const [accordion, setAccordion] = useState(true);
    const [formErrors, setFormErrors] = useState<any>({});
    const [sectionData, setSectionData] = useState<any>({});
    const [attributeSetObj, setAttributeSetObj] = useState<any>({});
    const [attributeSetData, setAttributeSetData] = useState([]);
    const gridColumns = [];
    let attributeSet = section.attributes.find(
      (ele) => ele.hasOwnProperty("attributeSet") && ele.attributeSet !== null
    );
    if (attributeSet !== undefined) {
      attributeSet = attributeSet.attributeSet;
    } else {
      attributeSet = [];
    }

    if (attributeSet.length > 0) {
      gridColumns.push({ name: "id", title: "id" });
      attributeSet.map((attri) => {
        gridColumns.push({ name: `${attri.code}`, title: `${attri.name}` });
      });
    }

    const gridOptions = {
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

      //standard | vertical | simple
      onChangeRowsPerPage: (num) => {
        //   setLimit(num);
        //   setNxtPgInfo("");
        //   setPrevPgInfo("");
        //   setIsPrevOrNext("");
      },
      // onSearchChange: (searchText) => {
      //   if (searchText !== null) {
      //     setSearchText(searchText);
      //   } else {
      //     setSearchText("");
      //   }
      // },
      onColumnSortChange: async (sortColumn, sortDirection) => {
        if (sortDirection === "asc") {
          // await setDashboardSortColumn(sortColumn);
          // await setDashboardSortDirection(sortDirection);
        }
        if (sortDirection === "desc") {
          // await setDashboardSortColumn(sortColumn);
          // await setDashboardSortDirection(sortDirection);
        }
      },
      onChangePage: async (page) => {
        // await setPage(page);
        // await setDashboardStart(page * dashboardPageSize);
      },
      textLabels: {
        body: {
          noMatch: "No data found",
        },
      },
    };

    useEffect(() => {
      if (section.attributes !== null && section.attributes !== undefined) {
        section.attributes.map((attri) => {
          setSectionData((prev) => ({
            ...prev,
            [attri.code]: attri.dataType === "dropdown" ? [] : "",
          }));
        });
      }
    }, []);

    useEffect(() => {
      if (attributeSet.length > 0) {
        attributeSet.map((attri) => {
          setAttributeSetObj((prev) => ({
            ...prev,
            [attri.code]: attri.dataType === "dropdown" ? [] : "",
          }));
        });
      }
    }, []);

    const getOption = (attribute) => {
      //api call to get options
      if (attribute.code === "T") {
        return stateData;
      } else {
        return [];
      }
    };

    return (
      <div className="col-lg-12">
        <Accordion
          className="mb-2"
          expanded={accordion}
          onChange={() => setAccordion((prev) => !prev)}>
          <AccordionSummary
            className="text-white"
            style={{ background: "rgb(151 151 151)", height: "20px" }}
            expandIcon={<ExpandMore />}>
            <div className="d-flex align-items-center">
              <p>{section.name}</p>
              <button
                className="btn btn-accordion"
                style={{ marginLeft: 5 }}
                onClick={(e) => {
                  e.stopPropagation();
                  section.attributes.map((attri) => {
                    if (attri.validation.isMandatory) {
                      if (sectionData[attri.code] === "") {
                        setFormErrors((err) => ({
                          ...err,
                          [attri.code]: "Required",
                        }));
                      } else if (
                        sectionData[attri.code]?.length < attri.validation.min
                      ) {
                        setFormErrors((err) => ({
                          ...err,
                          [attri.code]: `Min ${attri.validation.min} character`,
                        }));
                      } else if (
                        sectionData[attri.code]?.length > attri.validation.max
                      ) {
                        setFormErrors((err) => ({
                          ...err,
                          [attri.code]: `Max ${attri.validation.max} character`,
                        }));
                      } else {
                        setFormErrors((err) => ({
                          ...err,
                          [attri.code]: ``,
                        }));
                      }
                    }
                  });
                }}>
                <i className="fa fa-save"></i> Submit
              </button>
            </div>
          </AccordionSummary>

          <AccordionDetails className="page_heading">
            <div className="row">
              {section.attributes.map((attri) => (
                <>
                  {attri.dataType === "dropdown" ? (
                    <>
                      <div className="col-lg-3 col-sm-3 col-xs-4 ">
                        <div className="form-group">
                          <label className="col-form-label">{attri.name}</label>
                          <sup>*</sup>
                          <SelectForm
                            isClearable
                            isSearchable
                            options={getOption(attri)}
                            placeholder={attri.name}
                            isDisabled={false}
                            value={
                              sectionData[attri.code] !== undefined
                                ? sectionData[attri.code]
                                : []
                            }
                            onChange={(event, attri) => {
                              setSectionData((prev) => ({
                                ...prev,
                                [attri.code]: [...event],
                              }));

                              if (attri.childCascade.length > 0) {
                                //api
                              }
                            }}
                            isMulti={false}
                            noIndicator={false}
                            noSeparator={false}
                          />
                          {formErrors[attri.code] && (
                            <p style={{ color: "red" }}>
                              {formErrors[attri.code]}
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  ) : attri.dataType === "text" ? (
                    <>
                      <div className="col-lg-3 col-sm-3 col-xs-4 ">
                        <div className="form-group">
                          <label className="col-form-label">{attri.name}</label>
                          {attri.validation.isMandatory && <sup>*</sup>}
                          <InputForm
                            className="form-control"
                            placeholder={attri.name}
                            isDisabled={false}
                            textArea={false}
                            value={
                              sectionData[attri.code] !== undefined
                                ? sectionData[attri.code]
                                : ""
                            }
                            onChange={(e) => {
                              setSectionData((prev) => ({
                                ...prev,
                                [attri.code]: e.target.value,
                              }));
                            }}
                            maxLength="255"
                          />
                          {formErrors[attri.code] && (
                            <p style={{ color: "red" }}>
                              {formErrors[attri.code]}
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  ) : attri.dataType === "checkbox" ? (
                    <>
                      <div className="col-lg-3 col-sm-3 col-xs-4 ">
                        <div className="form-group">
                          <label htmlFor="isActive" className="col-form-label">
                            {attri.name}
                          </label>
                          <sup>*</sup>
                          <div>
                            <input
                              disabled={false}
                              type="checkbox"
                              onChange={() => {}}
                              id="isActive"
                              name="isActive"
                              checked={true}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  ) : null}
                </>
              ))}
            </div>

            <>
              {attributeSet.length > 0 && (
                <>
                  <div className="row">
                    {attributeSet.map((attri) => (
                      <>
                        {attri.dataType === "dropdown" ? (
                          <>
                            <div className="col-lg-3 col-sm-3 col-xs-4 ">
                              <div className="form-group">
                                <label className="col-form-label">
                                  {attri.name}
                                </label>
                                <sup>*</sup>
                                <SelectForm
                                  isClearable
                                  isSearchable
                                  options={getOption(attri)}
                                  placeholder={attri.name}
                                  isDisabled={false}
                                  value={
                                    sectionData[attri.code] !== undefined
                                      ? sectionData[attri.code]
                                      : []
                                  }
                                  onChange={(event, attri) => {
                                    setSectionData((prev) => ({
                                      ...prev,
                                      [attri.code]: [...event],
                                    }));
                                  }}
                                  isMulti={false}
                                  noIndicator={false}
                                  noSeparator={false}
                                />
                                {formErrors[attri.code] && (
                                  <p style={{ color: "red" }}>
                                    {formErrors[attri.code]}
                                  </p>
                                )}
                              </div>
                            </div>
                          </>
                        ) : attri.dataType === "text" ? (
                          <>
                            <div className="col-lg-3 col-sm-3 col-xs-4 ">
                              <div className="form-group">
                                <label className="col-form-label">
                                  {attri.name}
                                </label>
                                {attri.validation.isMandatory && <sup>*</sup>}
                                <InputForm
                                  className="form-control"
                                  placeholder={attri.name}
                                  isDisabled={false}
                                  textArea={false}
                                  value={
                                    attributeSetObj[attri.code] !== undefined
                                      ? attributeSetObj[attri.code]
                                      : ""
                                  }
                                  onChange={(e) => {
                                    setAttributeSetObj((prev) => ({
                                      ...prev,
                                      [attri.code]: e.target.value,
                                    }));
                                  }}
                                  maxLength="255"
                                />
                                {formErrors[attri.code] && (
                                  <p style={{ color: "red" }}>
                                    {formErrors[attri.code]}
                                  </p>
                                )}
                              </div>
                            </div>
                          </>
                        ) : attri.dataType === "checkbox" ? (
                          <>
                            <div className="col-lg-3 col-sm-3 col-xs-4 ">
                              <div className="form-group">
                                <label
                                  htmlFor="isActive"
                                  className="col-form-label">
                                  {attri.name}
                                </label>
                                <sup>*</sup>
                                <div>
                                  <input
                                    disabled={false}
                                    type="checkbox"
                                    onChange={() => {}}
                                    id="isActive"
                                    name="isActive"
                                    checked={true}
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        ) : null}
                      </>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setAttributeSetData((prev) => [
                        ...prev,
                        { id: uuid(), ...attributeSetObj },
                      ]);
                    }}>
                    Add Record
                  </button>
                  <DynamicGrid
                    options={gridOptions}
                    data={attributeSetData}
                    columns={gridColumns}
                  />
                </>
              )}
            </>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  };

  return (
    <>
      <h1>HRMS Form Structure</h1>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <div className="row">
              {tabsData.map((tab) => (
                <>
                  <div className="col-lg-2 p-2">
                    <p className="bg-primary rounded p-1">{tab.name}</p>
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
        <div className="row">
          {fromData.sections.map((section) => (
            <>
              <Section
                section={section}
                tabId={fromData.tabId}
                moduleId={fromData.tabId}
              />
            </>
          ))}

          {/* <div className="col-lg-4 col-sm-3 col-xs-4 ">
            <div className="form-group">
              <label className="col-form-label">Role</label>
              <sup>*</sup>
              <SelectForm
                options={[]}
                placeholder="Select role"
                isDisabled={false}
                value={[]}
                onChange={(event) => {
                  {
                  }
                }}
                isMulti={false}
                noIndicator={false}
                noSeparator={false}
              />
              <p style={{ color: "red" }}>{formErrors["role_isEmpty"]}</p>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default FormStructure;
