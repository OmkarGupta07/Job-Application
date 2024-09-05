import React, { useEffect, useState } from "react";
import { apiResp, cityData, stateData } from "./formData";
import ButtonForm from "../ButtonForm/ButtonForm";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import SelectForm from "../SelectForm/SelectForm";
import InputForm from "../InputForm/InputForm";
import DynamicGrid from "../DynamicGrid/DynamicGrid";

const FormStructure = () => {
  const [formData, setFormData] = useState<any>(apiResp);
  const [activetab, setActivetab] = useState<string>(apiResp.t[0].tn);

  const Section = ({ formData, setFormData, section }) => {
    const [accordion, setAccordion] = useState(true);
    const [formErrors, setFormErrors] = useState<any>({});
    const [optionsObj, setOptionsObj] = useState<any>({});

    // value Object for section
    const [sectionData, setSectionData] = useState<any>({
      // mn: formData.mn,
      // in: formData.in,
      // tn: formData.t[0].tn,
      // SN: section.SN,
      // Attributes: [],
    });

    useEffect(() => {
      //add attribute in sectionData

      let attributes = {};
      let dropdownObj = {};
      section.Attributes.map((eachAttribute) => {
        if (eachAttribute.AT === "Attribute") {
          // const attribute = {
          //   Key: eachAttribute.AC,
          //   Value: "1deven",
          //   AT: eachAttribute.AT,
          // };
          // attributes.push(attribute);

          //change value according to dt
          attributes = { ...attributes, [eachAttribute.AC]: "deven" };

          if (eachAttribute.DT === "Dropdown") {
            // api call for each dropdown option

            if (eachAttribute.AC === "SA_Title") {
              dropdownObj = { ...dropdownObj, SA_Title: stateData };
            } else {
              dropdownObj = { ...dropdownObj, [eachAttribute.AC]: [] };
            }
          }
        } else if (eachAttribute.AT === "AttributeSet") {
          // let sub = {
          //   Key: eachAttribute.AC,
          //   Value: "",
          //   AT: eachAttribute.AT,
          //   Details: [],
          // };
          // const detailsSub = [];
          eachAttribute.Attributes.map((subAttribute) => {
            // let subData = {
            //   [subAttribute.AC]: "",
            // };
            // detailsSub.push(subData);

            // sub = { ...sub, Details: detailsSub };

            //change value according to dt
            attributes = { ...attributes, [subAttribute.AC]: "deven" };

            if (subAttribute.DT === "Dropdown") {
              dropdownObj = { ...dropdownObj, [subAttribute.AC]: [] };
            }
          });
          // attributes.push(sub);
        }
      });
      setSectionData((prev) => ({
        ...prev,
        ...attributes,
      }));

      setOptionsObj((prev) => ({ ...prev, ...dropdownObj }));

      //save in state
      return () => {};
    }, []);

    // console.log(sectionData);

    console.log(optionsObj);

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

    // const getOptions = (attribute) => {
    //   //condtion for parent and child dropdown
    //   if (attribute.AC === "SA_Title") {
    //     return stateData;
    //   } else {
    //     return [];
    //   }
    // };

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
              <p>{section.SDN}</p>
              <button
                className="btn btn-accordion"
                style={{ marginLeft: 5 }}
                onClick={(e) => {
                  e.stopPropagation();
                  let errorObj = {};
                  section.Attributes.map((eachAttribute) => {
                    if (eachAttribute.AT === "Attribute") {
                      if (eachAttribute.V.ISM) {
                        if (sectionData[eachAttribute.AC] === "") {
                          // setFormErrors((err) => ({
                          //   ...err,
                          //   [eachAttribute.AC]: "Required",
                          // }));
                          errorObj = {
                            ...errorObj,
                            [eachAttribute.AC]: "Required",
                          };
                        } else if (
                          sectionData[eachAttribute.AC]?.length <
                          eachAttribute.V.MinC
                        ) {
                          // setFormErrors((err) => ({
                          //   ...err,
                          //   [eachAttribute.AC]: `Min ${eachAttribute.V.MinC} characters required`,
                          // }));
                          errorObj = {
                            ...errorObj,
                            [eachAttribute.AC]: `Min ${eachAttribute.V.MinC} characters required`,
                          };
                        } else if (
                          sectionData[eachAttribute.AC]?.length >
                          eachAttribute.V.MaxC
                        ) {
                          // setFormErrors((err) => ({
                          //   ...err,
                          //   [eachAttribute.AC]: `Max ${eachAttribute.V.MaxC} characters allowed`,
                          // }));

                          errorObj = {
                            ...errorObj,
                            [eachAttribute.AC]: `Max ${eachAttribute.V.MaxC} characters allowed`,
                          };
                        } else {
                          // setFormErrors((err) => ({
                          //   ...err,
                          //   [eachAttribute.AC]: "",
                          // }));
                          errorObj = {
                            ...errorObj,
                            [eachAttribute.AC]: "",
                          };
                        }
                      }
                    } else if (eachAttribute.AT === "AttributeSet") {
                      eachAttribute.Attributes.map((subAttribute) => {
                        if (subAttribute.AT === "Attribute") {
                          if (subAttribute.V.ISM) {
                            if (sectionData[subAttribute.AC] === "") {
                              errorObj = {
                                ...errorObj,
                                [subAttribute.AC]: "Required",
                              };
                            } else if (
                              sectionData[subAttribute.AC]?.length <
                              subAttribute.V.MinC
                            ) {
                              errorObj = {
                                ...errorObj,
                                [subAttribute.AC]: `Min ${subAttribute.V.MinC} characters required`,
                              };
                            } else if (
                              sectionData[subAttribute.AC]?.length >
                              subAttribute.V.MaxC
                            ) {
                              errorObj = {
                                ...errorObj,
                                [subAttribute.AC]: `Max ${subAttribute.V.MaxC} characters allowed`,
                              };
                            } else {
                              errorObj = {
                                ...errorObj,
                                [subAttribute.AC]: "",
                              };
                            }
                          }
                        }
                      });
                    }

                    // if (eachAttribute?.V?.ISM) {
                    //   console.log(eachAttribute);

                    //   if (sectionData[eachAttribute.AC] === "") {
                    //     setFormErrors((err) => ({
                    //       ...err,
                    //       [eachAttribute.AC]: "Required",
                    //     }));
                    //   } else if (
                    //     sectionData[eachAttribute.AC]?.length <
                    //     eachAttribute.V.MinC
                    //   ) {
                    //     setFormErrors((err) => ({
                    //       ...err,
                    //       [eachAttribute.AC]: `Min ${eachAttribute.V.MinC} characters required`,
                    //     }));
                    //   } else if (
                    //     sectionData[eachAttribute.AC]?.length >
                    //     eachAttribute.V.MaxC
                    //   ) {
                    //     setFormErrors((err) => ({
                    //       ...err,
                    //       [eachAttribute.AC]: `Max ${eachAttribute.V.MaxC} characters allowed`,
                    //     }));
                    //   } else {
                    //     setFormErrors((err) => ({
                    //       ...err,
                    //       [eachAttribute.AC]: "",
                    //     }));
                    //   }
                    // }
                  });

                  setFormErrors((err) => ({
                    ...err,
                    ...errorObj,
                  }));
                }}>
                <i className="fa fa-save"></i> Submit
              </button>
            </div>
          </AccordionSummary>

          <AccordionDetails className="page_heading">
            <div className="row">
              {section.Attributes.length > 0 &&
                section.Attributes.map((eachAttribute) => (
                  <>
                    {eachAttribute.AT === "Attribute" ? (
                      <>
                        {eachAttribute.DT === "Dropdown" ? (
                          <>
                            <div className="col-lg-3 col-sm-3 col-xs-4 ">
                              <div className="form-group">
                                <label className="col-form-label">
                                  {eachAttribute.AN}
                                </label>
                                {eachAttribute.V.ISM && <sup>*</sup>}
                                <SelectForm
                                  isClearable
                                  isSearchable
                                  options={
                                    optionsObj[eachAttribute.AC]
                                      ? optionsObj[eachAttribute.AC]
                                      : []
                                  }
                                  placeholder={eachAttribute.AN}
                                  isDisabled={false}
                                  value={
                                    // (sectionData.Attributes.length > 0 &&
                                    //   sectionData.Attributes.find(
                                    //     (attribute) =>
                                    //       attribute.Key === eachAttribute.AC
                                    //   ).Value) ||
                                    // {}

                                    sectionData[eachAttribute.AC]
                                      ? sectionData[eachAttribute.AC]
                                      : {}
                                  }
                                  onChange={(event) => {
                                    // let attribute = [];

                                    // if (sectionData.Attributes.length > 0) {
                                    //   attribute = sectionData.Attributes.map(
                                    //     (attribute) => {
                                    //       if (
                                    //         attribute.Key === eachAttribute.AC
                                    //       ) {
                                    //         return {
                                    //           ...attribute,
                                    //           Value: event,
                                    //         };
                                    //       }
                                    //       return attribute;
                                    //     }
                                    //   );
                                    // }

                                    setSectionData((prev) => ({
                                      ...prev,
                                      [eachAttribute.AC]: event,
                                    }));

                                    if (eachAttribute.CC.length > 0) {
                                      eachAttribute.CC.map((childDropdown) => {
                                        setSectionData((prev) => ({
                                          ...prev,
                                          [childDropdown]: {},
                                        }));

                                        if (childDropdown === "SA_SubTitle") {
                                          setOptionsObj((prev) => ({
                                            ...prev,
                                            [childDropdown]: cityData,
                                          }));
                                        }
                                      });
                                    }

                                    // if (eachAttribute.CC.length > 0) {
                                    //   if (
                                    //     eachAttribute.CC[0] === "SA_SubTitle"
                                    //   ) {
                                    //     setOptionsObj((prev) => ({
                                    //       ...prev,
                                    //       SA_SubTitle: cityData,
                                    //     }));
                                    //   }
                                    // }
                                  }}
                                  isMulti={false}
                                  noIndicator={false}
                                  noSeparator={false}
                                />
                                {/* {formErrors[attri.code] && (
                            <p style={{ color: "red" }}>
                              {formErrors[attri.code]}
                            </p>
                          )} */}
                              </div>
                            </div>
                          </>
                        ) : eachAttribute.DT === "Text" ? (
                          <>
                            <div className="col-lg-3 col-sm-3 col-xs-4 ">
                              <div className="form-group">
                                <label className="col-form-label">
                                  {eachAttribute.AN}
                                </label>
                                {eachAttribute.V.ISM && <sup>*</sup>}
                                <InputForm
                                  className="form-control"
                                  placeholder={eachAttribute.AN}
                                  isDisabled={false}
                                  textArea={false}
                                  value={
                                    // (sectionData.Attributes.length > 0 &&
                                    //   sectionData.Attributes.find(
                                    //     (attribute) =>
                                    //       attribute.Key === eachAttribute.AC
                                    //   ).Value) ||
                                    // ""

                                    sectionData[eachAttribute.AC]
                                      ? sectionData[eachAttribute.AC]
                                      : ""

                                    // sectionData[attri.code] !== undefined
                                    //   ? sectionData[attri.code]
                                    //   :
                                  }
                                  onChange={(e) => {
                                    // let attribute = [];

                                    // if (sectionData.Attributes.length > 0) {
                                    //   attribute = sectionData.Attributes.map(
                                    //     (attribute) => {
                                    //       if (
                                    //         attribute.Key === eachAttribute.AC
                                    //       ) {
                                    //         return {
                                    //           ...attribute,
                                    //           Value: e.target.value,
                                    //         };
                                    //       }
                                    //       return attribute;
                                    //     }
                                    //   );
                                    // }

                                    setSectionData((prev) => ({
                                      ...prev,
                                      [eachAttribute.AC]: e.target.value,
                                    }));
                                    //   setSectionData((prev) => ({
                                    //     ...prev,
                                    //     [attri.code]: e.target.value,
                                    //   }));
                                  }}
                                  maxLength="255"
                                />
                                {formErrors[eachAttribute.AC] && (
                                  <p style={{ color: "red" }}>
                                    {formErrors[eachAttribute.AC]}
                                  </p>
                                )}
                              </div>
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                      </>
                    ) : eachAttribute.AT === "AttributeSet" &&
                      eachAttribute.DT === "AttributeSet" ? (
                      <div className="col-lg-12">
                        <div className="row">
                          {eachAttribute.Attributes.length > 0 &&
                            eachAttribute.Attributes.map((subAttribute) => (
                              <>
                                {subAttribute.DT === "Dropdown" ? (
                                  <>
                                    <div className="col-lg-3 col-sm-3 col-xs-4 ">
                                      <div className="form-group">
                                        <label className="col-form-label">
                                          {subAttribute.AN}
                                        </label>
                                        {subAttribute.V.ISM && <sup>*</sup>}
                                        <SelectForm
                                          isClearable
                                          isSearchable
                                          options={[]}
                                          placeholder={subAttribute.AN}
                                          isDisabled={false}
                                          value={
                                            sectionData[subAttribute.AC]
                                              ? sectionData[subAttribute.AC]
                                              : {}
                                          }
                                          onChange={(event) => {
                                            setSectionData((prev) => ({
                                              ...prev,
                                              [subAttribute.AC]: event,
                                            }));

                                            if (subAttribute.CC.length > 0) {
                                              subAttribute.CC.map(
                                                (childDropdown) => {
                                                  setSectionData((prev) => ({
                                                    ...prev,
                                                    [childDropdown]: {},
                                                  }));

                                                  if (
                                                    childDropdown ===
                                                    "SA_SubTitle"
                                                  ) {
                                                    setOptionsObj((prev) => ({
                                                      ...prev,
                                                      [childDropdown]: cityData,
                                                    }));
                                                  }
                                                }
                                              );
                                            }
                                          }}
                                          isMulti={false}
                                          noIndicator={false}
                                          noSeparator={false}
                                        />
                                        {/* {formErrors[attri.code] && (
                            <p style={{ color: "red" }}>
                              {formErrors[attri.code]}
                            </p>
                          )} */}
                                      </div>
                                    </div>
                                  </>
                                ) : subAttribute.DT === "Text" ? (
                                  <>
                                    <div className="col-lg-3 col-sm-3 col-xs-4 ">
                                      <div className="form-group">
                                        <label className="col-form-label">
                                          {subAttribute.AN}
                                        </label>
                                        {subAttribute.V.ISM && <sup>*</sup>}
                                        <InputForm
                                          className="form-control"
                                          placeholder={subAttribute.AN}
                                          isDisabled={false}
                                          textArea={false}
                                          value={
                                            sectionData[subAttribute.AC]
                                              ? sectionData[subAttribute.AC]
                                              : ""
                                          }
                                          onChange={(e) => {
                                            //   setSectionData((prev) => ({
                                            //     ...prev,
                                            //     [attri.code]: e.target.value,
                                            //   }));

                                            setSectionData((prev) => ({
                                              ...prev,
                                              [subAttribute.AC]: e.target.value,
                                            }));
                                          }}
                                          maxLength="255"
                                        />
                                        {formErrors[subAttribute.AC] && (
                                          <p style={{ color: "red" }}>
                                            {formErrors[subAttribute.AC]}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <></>
                                )}
                              </>
                            ))}
                        </div>

                        <div className="row">
                          <div className="col-lg-3">
                            <button
                              onClick={() => {
                                // setAttributeSetData((prev) => [
                                //   ...prev,
                                //   { id: uuid(), ...attributeSetObj },
                                // ]);
                              }}>
                              Add Record
                            </button>
                          </div>

                          <div className="col-lg-12 p-0">
                            <DynamicGrid
                              options={gridOptions}
                              data={[]}
                              columns={[]}
                            />
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </>
                ))}
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  };
  return (
    <>
      <h1>HRMS Form Structure</h1>
      <div className="container-fluid">
        {/* tabs row */}
        <div className="row">
          <div className="col-lg-12">
            <div className="row mb-2">
              {formData.t.length > 0 &&
                formData.t.map((eachTab, index) => (
                  <div key={index} className="col-lg-1">
                    <div className="col-lg-12">
                      <ButtonForm
                        onClick={() => setActivetab(eachTab.tn)}
                        value={eachTab.tdn}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        {/* section row */}
        <div className="row">
          {formData.t.length > 0 &&
            formData.t.map((currentTab, index) => (
              <>
                {currentTab.tn === activetab &&
                  currentTab.S.length > 0 &&
                  currentTab.S.map((eachSection) => (
                    <>
                      <Section
                        formData={formData}
                        setFormData={setFormData}
                        section={eachSection}
                      />
                    </>
                  ))}
              </>
            ))}
        </div>
      </div>
    </>
  );
};

export default FormStructure;
