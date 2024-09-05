import React, { useContext, useEffect, useState } from "react";
import { apiResp, cityData, stateData } from "./formData";
import ButtonForm from "../ButtonForm/ButtonForm";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Tooltip,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import SelectForm from "../SelectForm/SelectForm";
import InputForm from "../InputForm/InputForm";
import DynamicGrid from "../DynamicGrid/DynamicGrid";
import uuid from "react-uuid";
import DateForm from "../DateForm/DateForm";
import moment from "moment";
import "./FormStructure.css";
// import profileImg from "../../Assets/Images/profile.jpeg";
import { APICall } from "../../Helpers/APICalls";
import { LoaderContext } from "../../Helpers/Context/Context";
import {
  getAttributeValueDetails,
  getDropdowns,
  getInterfaceDetails,
  getTabsData,
  postAttributeValueDetails,
} from "../../Helpers/APIEndPoints/EndPoints";
import notify from "../../Helpers/ToastNotification";

const Section = ({ formData, setFormData, section }) => {
  const [accordion, setAccordion] = useState(true);
  const [formErrors, setFormErrors] = useState<any>({});
  const [optionsObj, setOptionsObj] = useState<any>({});
  const [gridData, setGridData] = useState([]);
  const [displayGrid, setDisplayGrid] = useState([]);
  const [gridColumns, setGridColumns] = useState([]);
  const [ogAttributeSet, setOgAttributeSet] = useState({});
  const [ogFilledAttributeSet, setOgFilledAttributeSet] = useState([]);
  const [currentGridId, setCurrentGridId] = useState(null);
  const [deleteGridId, setDeleteGridId] = useState(null);

  // value Object for section
  const [attributesData, setAttributesData] = useState<any>({
    // mn: formData.mn,
    // in: formData.in,
    // tn: formData.t[0].tn,
    // SN: section.SN,
    // Attributes: [],
  });

  const [attributeSetData, setAttributeSetData] = useState<any>({});

  const [attributeSetCode, setAttributeSetCode] = useState(null);
  const [isOnce, setIsOnce] = useState(true);

  const getDropdownsData = async (AC, PID) => {
    const dropdownData = await APICall(getDropdowns, "POST", {
      AC,
      PID,
    });

    if (dropdownData.data !== null && dropdownData.data.length > 0) {
      return dropdownData.data;
    } else {
      return [];
    }
  };

  const [fileDemo, setFileDemo] = useState(null);
  useEffect(() => {
    //add attribute in attributesData

    let attributes = {};
    let attributeSet = {};
    const gridColumnsArr = [];

    section.Attribute.forEach(async (eachAttribute) => {
      if (eachAttribute.AT === "Attribute") {
        //change value according to dt
        attributes = {
          ...attributes,
          [eachAttribute.AC]:
            eachAttribute.DT === "DropdownSingle" || eachAttribute.DT === "Date"
              ? null
              : eachAttribute.DT === "Text"
              ? ""
              : eachAttribute.DT === "Checkbox"
              ? false
              : "",
        };

        if (eachAttribute.DT === "DropdownSingle") {
          // api call for each dropdown option

          const options = await getDropdownsData(eachAttribute.AC, null);

          setOptionsObj((prev) => ({ ...prev, [eachAttribute.AC]: options }));
        }
      } else if (eachAttribute.AT === "AttributeSet") {
        setAttributeSetCode(eachAttribute.AC);

        // Id for grid
        gridColumnsArr.push({
          name: "Id",
          label: "Id",
          options: { display: false },
        });

        eachAttribute.Attribute.forEach(async (subAttribute) => {
          //grid columns
          gridColumnsArr.push({
            name: subAttribute.AC,
            label: subAttribute.AN,
            options: { sort: false },
          });

          //change value according to dt
          attributeSet = {
            ...attributeSet,
            [subAttribute.AC]:
              subAttribute.DT === "DropdownSingle" || subAttribute.DT === "Date"
                ? null
                : subAttribute.DT === "Text"
                ? ""
                : subAttribute.DT === "Checkbox"
                ? false
                : "",
          };

          if (subAttribute.DT === "DropdownSingle") {
            const options = await getDropdownsData(subAttribute.AC, null);

            setOptionsObj((prev) => ({ ...prev, [subAttribute.AC]: options }));
          }
        });
      }
    });

    setAttributesData((prev) => ({
      ...prev,
      ...attributes,
    }));

    setAttributeSetData((prev) => ({
      ...prev,
      ...attributeSet,
    }));

    setOgAttributeSet(attributeSet);

    setGridColumns((prev) => [...prev, ...gridColumnsArr, action]);

    //save in state
    // return () => {};
  }, []);

  // console.log(gridColumns);

  // console.log(attributesData);

  // console.log(attributeSetData);

  // console.log(optionsObj);

  // console.log(ogFilledAttributeSet);
  // console.log(gridData);

  useEffect(() => {
    if (isOnce) {
      //fetch attributes/set data

      //check if not first time then call api
      let attributesRes = null;
      let bodyObj = {
        mn: "EmployeeCentral",
        in: "Form",
        tn: formData.tn,
        SN: section.SN,
        TID: "1",
      };
      (async () => {
        const response = await APICall(
          getAttributeValueDetails,
          "POST",
          bodyObj
        );
        if (response.data !== null && response.data.attributes.length > 0) {
          attributesRes = response.data.attributes;
          // handle data

          //Attributes

          if (
            Object.keys(attributesData).length > 0 &&
            attributesRes !== null &&
            attributesRes[0].details === null &&
            attributesRes.length > 0 &&
            Object.keys(optionsObj).length > 0
          ) {
            let newAttributeData = { ...attributesData };

            Object.keys(newAttributeData).forEach((attribute) => {
              if (
                Object.keys(optionsObj).find(
                  (option) => option.toLowerCase() === attribute.toLowerCase()
                )
              ) {
                const valueForDropdown = attributesRes.find(
                  (attri) => attri.key === attribute
                ).value;

                const options = optionsObj[attribute];
                if (options !== undefined && options.length > 0) {
                  const option = options.find(
                    (attri) => attri.value == valueForDropdown
                  );

                  newAttributeData = {
                    ...newAttributeData,
                    [attribute]: option === undefined ? null : option,
                  };
                }
              } else {
                let valueForField = attributesRes.find(
                  (attri) => attri.key === attribute
                ).value;

                //check type later when actual data

                valueForField =
                  typeof valueForField === "string" &&
                  valueForField.toLowerCase() === "true"
                    ? true
                    : typeof valueForField === "string" &&
                      valueForField.toLowerCase() === "false"
                    ? false
                    : valueForField !== null
                    ? valueForField.toString()
                    : valueForField;

                newAttributeData = {
                  ...newAttributeData,
                  [attribute]: valueForField,
                };
              }
            });

            setAttributesData(newAttributeData);
            setIsOnce(false);
          }

          //AttributesSet

          if (
            Object.keys(attributeSetData).length > 0 &&
            attributesRes !== null &&
            attributesRes.length > 0 &&
            attributesRes[0].details !== null &&
            attributesRes[0].details.length > 0 &&
            Object.keys(optionsObj).length > 0
          ) {
            setAttributeSetCode(attributesRes[0].key);

            const details = attributesRes[0].details;

            if (details.length > 0) {
              let newAttributeSetData = { ...attributeSetData };
              let newAttributeSetDataForGrid = { ...attributeSetData };
              const filledData = [];
              const gridData = [];
              details.forEach((detail) => {
                Object.entries(detail).forEach((attribute) => {
                  const [Code, Value]: any = attribute;

                  if (
                    Object.keys(optionsObj).find(
                      (option) => option.toLowerCase() === Code.toLowerCase()
                    )
                  ) {
                    const options = optionsObj[Code];
                    if (options !== undefined && options.length > 0) {
                      const option = options.find(
                        (attri) => attri.value == Value
                      );

                      newAttributeSetDataForGrid = {
                        ...newAttributeSetDataForGrid,
                        [Code]: option === undefined ? null : option?.label,
                      };

                      newAttributeSetData = {
                        ...newAttributeSetData,
                        [Code]: option === undefined ? null : option,
                      };
                    }
                  } else {
                    //check type later when actual data

                    let valueForGrid =
                      typeof Value === "string" &&
                      Value.toLowerCase() === "true"
                        ? true
                        : typeof Value === "string" &&
                          Value.toLowerCase() === "false"
                        ? false
                        : Value !== null
                        ? Value.toString()
                        : Value;

                    let valueForField =
                      typeof Value === "string" &&
                      Value.toLowerCase() === "true"
                        ? true
                        : typeof Value === "string" &&
                          Value.toLowerCase() === "false"
                        ? false
                        : typeof Value === "boolean"
                        ? Value
                        : Value !== null
                        ? Value.toString()
                        : Value;

                    newAttributeSetDataForGrid = {
                      ...newAttributeSetDataForGrid,
                      [Code]: valueForGrid,
                    };

                    newAttributeSetData = {
                      ...newAttributeSetData,
                      [Code]: valueForField,
                    };
                  }
                });
                gridData.push(newAttributeSetDataForGrid);
                filledData.push(newAttributeSetData);
              });

              // console.log(filledData);
              // console.log(gridData);
              setDisplayGrid(gridData);
              setGridData(gridData);
              setOgFilledAttributeSet(filledData);
            }

            setIsOnce(false);
          }
        }
      })();
    }
  }, [attributesData, attributeSetData, optionsObj]);

  const action = {
    name: "Id",
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
        let Id = tableMeta.tableData[tableMeta.rowIndex].Id;

        return (
          <div className="d-flex justify-content-center">
            <Tooltip title="edit">
              <a
                className="mr-2"
                onClick={(e) => {
                  e.preventDefault();
                  setFormErrors({});
                  setCurrentGridId(Id);
                }}
              >
                <i className="fas fa-edit"></i>
              </a>
            </Tooltip>
            <Tooltip title="delete">
              <a
                className="mr-2"
                onClick={(e) => {
                  e.preventDefault();
                  setFormErrors({});
                  setDeleteGridId(Id);
                }}
              >
                <i className="fa fa-trash" aria-hidden="true"></i>
              </a>
            </Tooltip>
          </div>
        );
      },
    },
  };

  useEffect(() => {
    if (currentGridId) {
      let attributeSetData = ogFilledAttributeSet.find(
        (record) => record.Id === currentGridId
      );

      setAttributeSetData(attributeSetData);
    }
  }, [currentGridId]);

  useEffect(() => {
    if (deleteGridId) {
      setGridData((prev) => {
        const newState = prev.map((record) => {
          if (record.Id === deleteGridId) {
            return {
              ...record,
              IsActive: false,
            };
          }
          return record;
        });
        return newState;
      });

      setOgFilledAttributeSet((prev) => {
        const newState = prev.map((record) => {
          if (record.Id === deleteGridId) {
            return {
              ...record,
              IsActive: false,
            };
          }
          return record;
        });
        return newState;
      });

      setDisplayGrid((prev) =>
        prev.filter((record) => record.Id !== deleteGridId)
      );
    }
    setDeleteGridId(null);
  }, [deleteGridId]);

  const gridOptions = {
    showEmptyDataSourceMessage: true,
    selectableRows: "none",
    // count: gridData.length,
    rowsPerPage: gridData.length,
    // page: page,
    serverSide: true,
    rowsPerPageOptions: [],
    download: false,
    print: false,
    viewColumns: false,
    filter: false,
    search: false,
    responsive: "vertical",

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

  return (
    <div className="col-lg-12">
      <Accordion
        className="mb-2"
        expanded={accordion}
        onChange={() => setAccordion((prev) => !prev)}
      >
        <AccordionSummary
          className="text-white acc_close"
          style={{ background: "#3C5464", height: "20px", minHeight: "45px" }}
          expandIcon={<ExpandMore />}
        >
          <div className="d-flex align-items-center justify-content-between w-100">
            <p>{section.SDN}</p>
            <div className="acc_btn">
              <button
                className="btn btn-accordion"
                style={{ marginLeft: 5 }}
                onClick={(e) => {
                  e.stopPropagation();
                  //clear data

                  section.Attribute.forEach(async (eachAttribute) => {
                    if (eachAttribute.AT === "Attribute") {
                      //change value according to dt

                      setAttributesData((prev) => ({
                        ...prev,
                        [eachAttribute.AC]:
                          eachAttribute.DT === "DropdownSingle" ||
                          eachAttribute.DT === "Date"
                            ? null
                            : eachAttribute.DT === "Text"
                            ? ""
                            : eachAttribute.DT === "Checkbox"
                            ? false
                            : "",
                      }));
                    } else if (eachAttribute.AT === "AttributeSet") {
                      setAttributeSetData(ogAttributeSet);
                    }
                  });

                  //clear error
                  setFormErrors({});
                }}
              >
                <i className="fas fa-times-circle"></i>
              </button>
              <button
                className="btn btn-accordion"
                style={{ marginRight: 5 }}
                onClick={async (e) => {
                  e.stopPropagation();
                  let errorObj = {};
                  section.Attribute.map((eachAttribute) => {
                    if (eachAttribute.AT === "Attribute") {
                      const validation = JSON.parse(eachAttribute.V);

                      if (validation.ISM.toLowerCase() === "true") {
                        if (eachAttribute.DT === "Text") {
                          if (attributesData[eachAttribute.AC] === "") {
                            errorObj = {
                              ...errorObj,
                              [eachAttribute.AC]: "Required",
                            };
                          } else if (
                            attributesData[eachAttribute.AC]?.length >
                            validation.MaxC
                          ) {
                            errorObj = {
                              ...errorObj,
                              [eachAttribute.AC]: `Max ${validation.MaxC} characters allowed`,
                            };
                          } else {
                            errorObj = {
                              ...errorObj,
                              [eachAttribute.AC]: "",
                            };
                          }
                        } else if (eachAttribute.DT === "DropdownSingle") {
                          if (attributesData[eachAttribute.AC] === null) {
                            errorObj = {
                              ...errorObj,
                              [eachAttribute.AC]: "Required",
                            };
                          } else {
                            errorObj = {
                              ...errorObj,
                              [eachAttribute.AC]: "",
                            };
                          }
                        } else if (eachAttribute.DT === "Date") {
                          if (attributesData[eachAttribute.AC] === null) {
                            errorObj = {
                              ...errorObj,
                              [eachAttribute.AC]: "Required",
                            };
                          } else if (
                            moment(
                              validation.MaxV === "CurrentDate" &&
                                attributesData[eachAttribute.AC]
                            ).isAfter(new Date())
                          ) {
                            errorObj = {
                              ...errorObj,
                              [eachAttribute.AC]:
                                "Only till current date allowed",
                            };
                          } else {
                            errorObj = {
                              ...errorObj,
                              [eachAttribute.AC]: "",
                            };
                          }
                        } else if (eachAttribute.DT === "Number") {
                          //change with regex
                          if (isNaN(attributesData[eachAttribute.AC])) {
                            errorObj = {
                              ...errorObj,
                              [eachAttribute.AC]: "Only numbers are allowed",
                            };
                          } else if (
                            Number(attributesData[eachAttribute.AC]) >
                            validation.Maxv
                          ) {
                            errorObj = {
                              ...errorObj,
                              [eachAttribute.AC]: `Max ${validation.Maxv} allowed`,
                            };
                          } else if (
                            Number(attributesData[eachAttribute.AC]) <
                            validation.Minv
                          ) {
                            errorObj = {
                              ...errorObj,
                              [eachAttribute.AC]: `Min ${validation.Minv} required`,
                            };
                          } else {
                            errorObj = {
                              ...errorObj,
                              [eachAttribute.AC]: "",
                            };
                          }
                        }
                      } else {
                        // for num and date

                        if (eachAttribute.DT === "Number") {
                          if (attributesData[eachAttribute.AC] !== "") {
                            //change with regex
                            if (isNaN(attributesData[eachAttribute.AC])) {
                              errorObj = {
                                ...errorObj,
                                [eachAttribute.AC]: "Only numbers are allowed",
                              };
                            } else if (
                              Number(attributesData[eachAttribute.AC]) >
                              validation.Maxv
                            ) {
                              errorObj = {
                                ...errorObj,
                                [eachAttribute.AC]: `Max ${validation.Maxv} allowed`,
                              };
                            } else if (
                              Number(attributesData[eachAttribute.AC]) <
                              validation.Minv
                            ) {
                              errorObj = {
                                ...errorObj,
                                [eachAttribute.AC]: `Min ${validation.Minv} required`,
                              };
                            } else {
                              errorObj = {
                                ...errorObj,
                                [eachAttribute.AC]: "",
                              };
                            }
                          }
                        } else if (eachAttribute.DT === "Date") {
                          if (attributesData[eachAttribute.AC] !== null) {
                            if (
                              moment(
                                validation.MaxV === "CurrentDate" &&
                                  attributesData[eachAttribute.AC]
                              ).isAfter(new Date())
                            ) {
                              errorObj = {
                                ...errorObj,
                                [eachAttribute.AC]:
                                  "Only till current date allowed",
                              };
                            } else {
                              errorObj = {
                                ...errorObj,
                                [eachAttribute.AC]: "",
                              };
                            }
                          }
                        }
                      }
                    } else {
                      //submit attributeSet
                    }
                  });

                  const isEmpty = Object.values(errorObj).every(
                    (s) => s === ""
                  );

                  if (isEmpty && attributeSetCode === null) {
                    // post data attribute
                    const postAttributes = [];

                    Object.entries(attributesData).forEach((attributeData) => {
                      const [Code, Value]: any[] = attributeData;

                      let attribute = {
                        Type: "Attribute",
                        Code,
                        Value:
                          typeof Value === "object"
                            ? Value?.value.toString() || null
                            : typeof Value === "string" ||
                              typeof Value === "boolean"
                            ? Value
                            : null,
                      };
                      postAttributes.push(attribute);
                    });

                    let postObj = {
                      MN: "EmployeeCentral",
                      IN: "Form",
                      TN: formData.tn,
                      SN: section.SN,
                      Tid: 1, //will be based
                      Attributes: postAttributes,
                    };

                    const postRes = await APICall(
                      postAttributeValueDetails,
                      "POST",
                      postObj
                    );

                    console.log(postRes);

                    notify(postRes.status, postRes.message);
                  } else if (isEmpty && attributeSetCode !== null) {
                    // post data attributeSet
                    // console.log(ogFilledAttributeSet);

                    let details = [...ogFilledAttributeSet];
                    details.map((attributes) =>
                      Object.keys(attributes).forEach((attribute) => {
                        attributes[attribute] =
                          typeof attributes[attribute] === "object"
                            ? attributes[attribute]?.value.toString() || null
                            : typeof attributes[attribute] === "string" ||
                              typeof attributes[attribute] === "boolean"
                            ? attributes[attribute]
                            : null;
                      })
                    );

                    let postObj = {
                      MN: "EmployeeCentral",
                      IN: "Form",
                      TN: formData.tn,
                      SN: section.SN,
                      Tid: 1, //will be based
                      Attributes: [
                        {
                          Code: attributeSetCode,
                          Value: "",
                          Type: "AttributeSet",
                          Details: details,
                        },
                      ],
                    };

                    const postRes = await APICall(
                      postAttributeValueDetails,
                      "POST",
                      postObj
                    );

                    console.log(postRes);
                    notify(postRes.status, postRes.message);
                  }

                  setFormErrors((err) => ({
                    ...err,
                    ...errorObj,
                  }));
                }}
              >
                <i className="fa fa-save"></i>
              </button>
            </div>
          </div>
        </AccordionSummary>

        <AccordionDetails className="page_heading">
          <div className="row">
            {section.Attribute.length > 0 &&
              section.Attribute.map((eachAttribute, index) => (
                <React.Fragment key={`${index}-${eachAttribute.AC}`}>
                  {eachAttribute.AT === "Attribute" ? (
                    <>
                      {eachAttribute.DT === "DropdownSingle" ? (
                        <>
                          <div className="col-lg-3 col-sm-3 col-xs-4 ">
                            <div className="form-group">
                              <label className="col-form-label">
                                {eachAttribute.AN}
                              </label>
                              {JSON.parse(eachAttribute.V).ISM.toLowerCase() ===
                                "true" && <sup>*</sup>}
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
                                  attributesData[eachAttribute.AC]
                                    ? attributesData[eachAttribute.AC]
                                    : null
                                }
                                onChange={(event) => {
                                  setAttributesData((prev) => ({
                                    ...prev,
                                    [eachAttribute.AC]: event,
                                  }));

                                  if (
                                    event !== null &&
                                    eachAttribute.CC !== null
                                  ) {
                                    const CC = eachAttribute.CC.split(",");

                                    CC.forEach(async (childDropdown) => {
                                      setAttributesData((prev) => ({
                                        ...prev,
                                        [childDropdown]: null,
                                      }));

                                      const options = await getDropdownsData(
                                        childDropdown,
                                        event.value
                                      );

                                      setOptionsObj((prev) => ({
                                        ...prev,
                                        [childDropdown]: options,
                                      }));
                                    });
                                  }
                                }}
                                isMulti={false}
                                noIndicator={false}
                                noSeparator={false}
                              />
                              {formErrors[eachAttribute.AC] && (
                                <p style={{ color: "red" }}>
                                  {formErrors[eachAttribute.AC]}
                                </p>
                              )}
                            </div>
                          </div>
                        </>
                      ) : eachAttribute.DT === "Text" ||
                        eachAttribute.DT === "Number" ? (
                        <>
                          <div className="col-lg-3 col-sm-3 col-xs-4 ">
                            <div className="form-group">
                              <label className="col-form-label">
                                {eachAttribute.AN}
                              </label>
                              {JSON.parse(eachAttribute.V).ISM.toLowerCase() ===
                                "true" && <sup>*</sup>}
                              <InputForm
                                className="form-control"
                                placeholder={eachAttribute.AN}
                                isDisabled={false}
                                textArea={false}
                                value={
                                  attributesData[eachAttribute.AC]
                                    ? attributesData[eachAttribute.AC]
                                    : ""
                                }
                                onChange={(e) => {
                                  setAttributesData((prev) => ({
                                    ...prev,
                                    [eachAttribute.AC]: e.target.value,
                                  }));
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
                      ) : eachAttribute.DT === "Date" ? (
                        <>
                          <div className="col-lg-3 col-sm-3 col-xs-4 ">
                            <div className="form-group">
                              <label className="col-form-label">
                                {eachAttribute.AN}
                              </label>
                              {JSON.parse(eachAttribute.V).ISM.toLowerCase() ===
                                "true" && <sup>*</sup>}
                              <DateForm
                                isDisabled={false}
                                value={
                                  attributesData[eachAttribute.AC]
                                    ? attributesData[eachAttribute.AC]
                                    : null
                                }
                                onChange={(date) => {
                                  setAttributesData((prev) => ({
                                    ...prev,
                                    [eachAttribute.AC]:
                                      moment(date).format("YYYY-MM-DD"),
                                  }));
                                }}
                              />
                              {formErrors[eachAttribute.AC] && (
                                <p style={{ color: "red" }}>
                                  {formErrors[eachAttribute.AC]}
                                </p>
                              )}
                            </div>
                          </div>
                        </>
                      ) : eachAttribute.DT === "Checkbox" ? (
                        <>
                          <div className="col-lg-3 col-sm-3 col-xs-4 ">
                            <div className="form-group">
                              <label
                                htmlFor={eachAttribute.AC}
                                className="col-form-label"
                              >
                                {eachAttribute.AN}
                              </label>
                              {JSON.parse(eachAttribute.V).ISM.toLowerCase() ===
                                "true" && <sup>*</sup>}
                              <div>
                                <input
                                  disabled={false}
                                  type="checkbox"
                                  onChange={(e) => {
                                    setAttributesData((prev) => ({
                                      ...prev,
                                      [eachAttribute.AC]: e.target.checked,
                                    }));
                                  }}
                                  id={eachAttribute.AC}
                                  checked={
                                    attributesData[eachAttribute.AC]
                                      ? attributesData[eachAttribute.AC]
                                      : false
                                  }
                                />
                              </div>
                              {formErrors[eachAttribute.AC] && (
                                <p style={{ color: "red" }}>
                                  {formErrors[eachAttribute.AC]}
                                </p>
                              )}
                            </div>
                          </div>
                        </>
                      ) : eachAttribute.DT === "Textarea" ? (
                        <>
                          <div className="col-lg-3 col-sm-3 col-xs-4 ">
                            <div className="form-group">
                              <label className="col-form-label">
                                {eachAttribute.AN}
                              </label>
                              {JSON.parse(eachAttribute.V).ISM.toLowerCase() ===
                                "true" && <sup>*</sup>}
                              <InputForm
                                className="form-control"
                                placeholder={eachAttribute.AN}
                                isDisabled={false}
                                textArea={true}
                                value={
                                  attributesData[eachAttribute.AC]
                                    ? attributesData[eachAttribute.AC]
                                    : ""
                                }
                                onChange={(e) => {
                                  setAttributesData((prev) => ({
                                    ...prev,
                                    [eachAttribute.AC]: e.target.value,
                                  }));
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
                      ) : eachAttribute.DT === "Document1" ? (
                        <>
                          <div className="col-lg-3 col-sm-3 col-xs-4 ">
                            <div className="form-group">
                              <label className="col-form-label">
                                {eachAttribute.AN}
                              </label>
                              {JSON.parse(eachAttribute.V).ISM.toLowerCase() ===
                                "true" && <sup>*</sup>}

                              <div className="box position-relative">
                                <input
                                  id="files-8"
                                  className="form-control inputfile inputfile-6 multiple-inputfile"
                                  data-multiple-caption="{count} files selected"
                                  multiple
                                  type="file"
                                />
                                <label
                                  htmlFor="files-8"
                                  className="form-control"
                                >
                                  <span></span>{" "}
                                  <strong>
                                    <i
                                      className="fa fa-paperclip rotate90"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    Browse
                                  </strong>{" "}
                                </label>
                              </div>
                              <div className="file-added-list">
                                <ul className="list-unstyle">
                                  <li className="list mt-1">
                                    <div className="media">
                                      <div className="media-body text-truncate">
                                        <a
                                          href="javascript:void(0);"
                                          className="view-more"
                                        >
                                          Archiv1_b.webp
                                        </a>
                                      </div>
                                      <div className="media-right ml-2">
                                        <i
                                          className="fa fa-trash"
                                          aria-hidden="true"
                                        ></i>
                                      </div>
                                    </div>
                                  </li>
                                  <li className="list mt-1">
                                    <div className="media">
                                      <div className="media-body text-truncate">
                                        <a
                                          href="javascript:void(0);"
                                          className="view-more"
                                        >
                                          04.png
                                        </a>
                                      </div>
                                      <div className="media-right ml-2">
                                        <i
                                          className="fa fa-trash"
                                          aria-hidden="true"
                                        ></i>
                                      </div>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                    </>
                  ) : eachAttribute.AT === "AttributeSet" &&
                    eachAttribute.DT === "Custom" ? (
                    <div className="col-lg-12">
                      <div className="row">
                        {eachAttribute.Attribute.length > 0 &&
                          eachAttribute.Attribute.map((subAttribute, index) => (
                            <React.Fragment key={`${index}-${subAttribute.AC}`}>
                              {subAttribute.DT === "DropdownSingle" ? (
                                <>
                                  <div className="col-lg-3 col-sm-3 col-xs-4 ">
                                    <div className="form-group">
                                      <label className="col-form-label">
                                        {subAttribute.AN}
                                      </label>
                                      {JSON.parse(
                                        subAttribute.V
                                      ).ISM.toLowerCase() === "true" && (
                                        <sup>*</sup>
                                      )}
                                      <SelectForm
                                        isClearable
                                        isSearchable
                                        options={
                                          optionsObj[subAttribute.AC]
                                            ? optionsObj[subAttribute.AC]
                                            : []
                                        }
                                        placeholder={subAttribute.AN}
                                        isDisabled={false}
                                        value={
                                          attributeSetData[subAttribute.AC]
                                            ? attributeSetData[subAttribute.AC]
                                            : null
                                        }
                                        onChange={(event) => {
                                          setAttributeSetData((prev) => ({
                                            ...prev,
                                            [subAttribute.AC]: event,
                                          }));

                                          if (
                                            event !== null &&
                                            subAttribute.CC !== null
                                          ) {
                                            const CC =
                                              subAttribute.CC.split(",");

                                            CC.forEach(
                                              async (childDropdown) => {
                                                setAttributeSetData((prev) => ({
                                                  ...prev,
                                                  [childDropdown]: null,
                                                }));

                                                const options =
                                                  await getDropdownsData(
                                                    childDropdown,
                                                    event.value
                                                  );

                                                setOptionsObj((prev) => ({
                                                  ...prev,
                                                  [childDropdown]: options,
                                                }));
                                              }
                                            );
                                          }
                                        }}
                                        isMulti={false}
                                        noIndicator={false}
                                        noSeparator={false}
                                      />
                                      {formErrors[subAttribute.AC] && (
                                        <p style={{ color: "red" }}>
                                          {formErrors[subAttribute.AC]}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </>
                              ) : subAttribute.DT === "Text" ||
                                subAttribute.DT === "Number" ? (
                                <>
                                  <div className="col-lg-3 col-sm-3 col-xs-4 ">
                                    <div className="form-group">
                                      <label className="col-form-label">
                                        {subAttribute.AN}
                                      </label>
                                      {JSON.parse(
                                        subAttribute.V
                                      ).ISM.toLowerCase() === "true" && (
                                        <sup>*</sup>
                                      )}
                                      <InputForm
                                        className="form-control"
                                        placeholder={subAttribute.AN}
                                        isDisabled={false}
                                        textArea={false}
                                        value={
                                          attributeSetData[subAttribute.AC]
                                            ? attributeSetData[subAttribute.AC]
                                            : ""
                                        }
                                        onChange={(e) => {
                                          setAttributeSetData((prev) => ({
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
                              ) : subAttribute.DT === "Date" ? (
                                <>
                                  <div className="col-lg-3 col-sm-3 col-xs-4 ">
                                    <div className="form-group">
                                      <label className="col-form-label">
                                        {subAttribute.AN}
                                      </label>
                                      {JSON.parse(
                                        subAttribute.V
                                      ).ISM.toLowerCase() === "true" && (
                                        <sup>*</sup>
                                      )}
                                      <DateForm
                                        isDisabled={false}
                                        value={
                                          attributeSetData[subAttribute.AC]
                                            ? attributeSetData[subAttribute.AC]
                                            : null
                                        }
                                        onChange={(date) => {
                                          setAttributeSetData((prev) => ({
                                            ...prev,
                                            [subAttribute.AC]:
                                              moment(date).format("YYYY-MM-DD"),
                                          }));
                                        }}
                                      />
                                      {formErrors[subAttribute.AC] && (
                                        <p style={{ color: "red" }}>
                                          {formErrors[subAttribute.AC]}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </>
                              ) : subAttribute.DT === "Checkbox" ? (
                                <>
                                  <div className="col-lg-3 col-sm-3 col-xs-4 ">
                                    <div className="form-group">
                                      <label
                                        htmlFor={subAttribute.AC}
                                        className="col-form-label"
                                      >
                                        {subAttribute.AN}
                                      </label>
                                      {JSON.parse(
                                        subAttribute.V
                                      ).ISM.toLowerCase() === "true" && (
                                        <sup>*</sup>
                                      )}
                                      <div>
                                        <input
                                          disabled={false}
                                          type="checkbox"
                                          onChange={(e) => {
                                            setAttributeSetData((prev) => ({
                                              ...prev,
                                              [subAttribute.AC]:
                                                e.target.checked,
                                            }));
                                          }}
                                          id={subAttribute.AC}
                                          checked={
                                            attributeSetData[subAttribute.AC]
                                              ? attributeSetData[
                                                  subAttribute.AC
                                                ]
                                              : false
                                          }
                                        />
                                      </div>
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
                            </React.Fragment>
                          ))}
                      </div>

                      <div className="row">
                        <div className="col-lg-3">
                          <button
                            id={currentGridId === null ? "0" : "1"}
                            className="btn btn-primary"
                            onClick={(e) => {
                              const targetId = e.currentTarget.id;

                              if (targetId === "0") {
                                //insert
                                const uniqueId = uuid();
                                //validation for empty data before adding in grid
                                let errorObj = {};
                                eachAttribute.Attribute.forEach(
                                  (subAttribute) => {
                                    if (subAttribute.AT === "Attribute") {
                                      const validation = JSON.parse(
                                        subAttribute.V
                                      );

                                      if (
                                        validation.ISM.toLowerCase() === "true"
                                      ) {
                                        if (subAttribute.DT === "Text") {
                                          if (
                                            attributeSetData[
                                              subAttribute.AC
                                            ] === ""
                                          ) {
                                            errorObj = {
                                              ...errorObj,
                                              [subAttribute.AC]: "Required",
                                            };
                                          } else if (
                                            attributeSetData[subAttribute.AC]
                                              ?.length > validation.MaxC
                                          ) {
                                            errorObj = {
                                              ...errorObj,
                                              [subAttribute.AC]: `Max ${validation.MaxC} characters allowed`,
                                            };
                                          } else {
                                            errorObj = {
                                              ...errorObj,
                                              [subAttribute.AC]: "",
                                            };
                                          }
                                        } else if (
                                          subAttribute.DT === "DropdownSingle"
                                        ) {
                                          if (
                                            attributeSetData[
                                              subAttribute.AC
                                            ] === null
                                          ) {
                                            errorObj = {
                                              ...errorObj,
                                              [subAttribute.AC]: "Required",
                                            };
                                          } else {
                                            errorObj = {
                                              ...errorObj,
                                              [subAttribute.AC]: "",
                                            };
                                          }
                                        } else if (subAttribute.DT === "Date") {
                                          if (
                                            attributeSetData[
                                              subAttribute.AC
                                            ] === null
                                          ) {
                                            errorObj = {
                                              ...errorObj,
                                              [subAttribute.AC]: "Required",
                                            };
                                          } else if (
                                            validation.MaxV === "CurrentDate" &&
                                            attributeSetData[subAttribute.AC] >
                                              Date()
                                          ) {
                                            errorObj = {
                                              ...errorObj,
                                              [subAttribute.AC]:
                                                "Only till current date allowed",
                                            };
                                          } else {
                                            errorObj = {
                                              ...errorObj,
                                              [subAttribute.AC]: "",
                                            };
                                          }
                                        } else if (
                                          subAttribute.DT === "Number"
                                        ) {
                                          //change with regex
                                          if (
                                            isNaN(
                                              attributeSetData[subAttribute.AC]
                                            )
                                          ) {
                                            errorObj = {
                                              ...errorObj,
                                              [subAttribute.AC]:
                                                "Only numbers are allowed",
                                            };
                                          } else if (
                                            Number(
                                              attributeSetData[subAttribute.AC]
                                            ) > validation.Maxv
                                          ) {
                                            errorObj = {
                                              ...errorObj,
                                              [subAttribute.AC]: `Max ${validation.Maxv} allowed`,
                                            };
                                          } else if (
                                            Number(
                                              attributeSetData[subAttribute.AC]
                                            ) < validation.Minv
                                          ) {
                                            errorObj = {
                                              ...errorObj,
                                              [subAttribute.AC]: `Min ${validation.Minv} required`,
                                            };
                                          } else {
                                            errorObj = {
                                              ...errorObj,
                                              [subAttribute.AC]: "",
                                            };
                                          }
                                        }
                                      } else {
                                        // for num and date

                                        if (subAttribute.DT === "Number") {
                                          if (
                                            attributeSetData[
                                              subAttribute.AC
                                            ] !== ""
                                          ) {
                                            //change with regex
                                            if (
                                              isNaN(
                                                attributeSetData[
                                                  subAttribute.AC
                                                ]
                                              )
                                            ) {
                                              errorObj = {
                                                ...errorObj,
                                                [subAttribute.AC]:
                                                  "Only numbers are allowed",
                                              };
                                            } else if (
                                              Number(
                                                attributeSetData[
                                                  subAttribute.AC
                                                ]
                                              ) > validation.Maxv
                                            ) {
                                              errorObj = {
                                                ...errorObj,
                                                [subAttribute.AC]: `Max ${validation.Maxv} allowed`,
                                              };
                                            } else if (
                                              Number(
                                                attributeSetData[
                                                  subAttribute.AC
                                                ]
                                              ) < validation.Minv
                                            ) {
                                              errorObj = {
                                                ...errorObj,
                                                [subAttribute.AC]: `Min ${validation.Minv} required`,
                                              };
                                            } else {
                                              errorObj = {
                                                ...errorObj,
                                                [subAttribute.AC]: "",
                                              };
                                            }
                                          }
                                        } else if (subAttribute.DT === "Date") {
                                          if (
                                            attributeSetData[
                                              subAttribute.AC
                                            ] !== null
                                          ) {
                                            if (
                                              moment(
                                                validation.MaxV ===
                                                  "CurrentDate" &&
                                                  attributeSetData[
                                                    subAttribute.AC
                                                  ]
                                              ).isAfter(new Date())
                                            ) {
                                              errorObj = {
                                                ...errorObj,
                                                [subAttribute.AC]:
                                                  "Only till current date allowed",
                                              };
                                            } else {
                                              errorObj = {
                                                ...errorObj,
                                                [subAttribute.AC]: "",
                                              };
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                );

                                const isEmpty = Object.values(errorObj).every(
                                  (s) => s === ""
                                );

                                if (
                                  Object.keys(errorObj).length > 0 &&
                                  !isEmpty
                                ) {
                                  setFormErrors((err) => ({
                                    ...err,
                                    ...errorObj,
                                  }));
                                } else {
                                  //add record in grid

                                  setOgFilledAttributeSet((prev) => [
                                    ...prev,
                                    {
                                      ...attributeSetData,
                                      Id: uniqueId,
                                    },
                                  ]);

                                  let gridData = {};

                                  eachAttribute.Attribute.forEach(
                                    (subAttribute) => {
                                      if (
                                        typeof attributeSetData[
                                          subAttribute.AC
                                        ] === "object"
                                      ) {
                                        gridData = {
                                          ...gridData,
                                          [subAttribute.AC]:
                                            attributeSetData[subAttribute.AC]
                                              ?.label || null, //for date and dropdown
                                        };
                                      } else if (
                                        typeof attributeSetData[
                                          subAttribute.AC
                                        ] === "boolean"
                                      ) {
                                        gridData = {
                                          ...gridData,
                                          [subAttribute.AC]:
                                            attributeSetData[
                                              subAttribute.AC
                                            ] === true
                                              ? "true"
                                              : "false",
                                        };
                                      } else {
                                        gridData = {
                                          ...gridData,
                                          [subAttribute.AC]:
                                            attributeSetData[subAttribute.AC],
                                        };
                                      }
                                    }
                                  );

                                  //reset
                                  setAttributeSetData((prev) => ({
                                    ...prev,
                                    ...ogAttributeSet,
                                  }));

                                  setFormErrors({});

                                  setGridData((prev) => [
                                    ...prev,
                                    {
                                      Id: uniqueId,
                                      ...gridData,
                                      IsActive: true,
                                    },
                                  ]);

                                  setDisplayGrid((prev) => [
                                    ...prev,
                                    {
                                      Id: uniqueId,
                                      ...gridData,
                                      IsActive: true,
                                    },
                                  ]);
                                }
                              } else {
                                //update

                                //validation for empty data before adding in grid
                                let errorObj = {};
                                eachAttribute.Attribute.forEach(
                                  (subAttribute) => {
                                    if (subAttribute.AT === "Attribute") {
                                      const validation = JSON.parse(
                                        subAttribute.V
                                      );

                                      if (
                                        validation.ISM.toLowerCase() === "true"
                                      ) {
                                        if (subAttribute.DT === "Text") {
                                          if (
                                            attributeSetData[
                                              subAttribute.AC
                                            ] === ""
                                          ) {
                                            errorObj = {
                                              ...errorObj,
                                              [subAttribute.AC]: "Required",
                                            };
                                          } else if (
                                            attributeSetData[subAttribute.AC]
                                              ?.length > validation.MaxC
                                          ) {
                                            errorObj = {
                                              ...errorObj,
                                              [subAttribute.AC]: `Max ${validation.MaxC} characters allowed`,
                                            };
                                          } else {
                                            errorObj = {
                                              ...errorObj,
                                              [subAttribute.AC]: "",
                                            };
                                          }
                                        } else if (
                                          subAttribute.DT === "DropdownSingle"
                                        ) {
                                          if (
                                            attributeSetData[
                                              subAttribute.AC
                                            ] === null
                                          ) {
                                            errorObj = {
                                              ...errorObj,
                                              [subAttribute.AC]: "Required",
                                            };
                                          } else {
                                            errorObj = {
                                              ...errorObj,
                                              [subAttribute.AC]: "",
                                            };
                                          }
                                        } else if (subAttribute.DT === "Date") {
                                          if (
                                            attributeSetData[
                                              subAttribute.AC
                                            ] === null
                                          ) {
                                            errorObj = {
                                              ...errorObj,
                                              [subAttribute.AC]: "Required",
                                            };
                                          } else if (
                                            validation.MaxV === "CurrentDate" &&
                                            attributeSetData[subAttribute.AC] >
                                              Date()
                                          ) {
                                            errorObj = {
                                              ...errorObj,
                                              [subAttribute.AC]:
                                                "Only till current date allowed",
                                            };
                                          } else {
                                            errorObj = {
                                              ...errorObj,
                                              [subAttribute.AC]: "",
                                            };
                                          }
                                        } else if (
                                          subAttribute.DT === "Number"
                                        ) {
                                          //change with regex
                                          if (
                                            isNaN(
                                              attributeSetData[subAttribute.AC]
                                            )
                                          ) {
                                            errorObj = {
                                              ...errorObj,
                                              [subAttribute.AC]:
                                                "Only numbers are allowed",
                                            };
                                          } else if (
                                            Number(
                                              attributeSetData[subAttribute.AC]
                                            ) > validation.Maxv
                                          ) {
                                            errorObj = {
                                              ...errorObj,
                                              [subAttribute.AC]: `Max ${validation.Maxv} allowed`,
                                            };
                                          } else if (
                                            Number(
                                              attributeSetData[subAttribute.AC]
                                            ) < validation.Minv
                                          ) {
                                            errorObj = {
                                              ...errorObj,
                                              [subAttribute.AC]: `Min ${validation.Minv} required`,
                                            };
                                          } else {
                                            errorObj = {
                                              ...errorObj,
                                              [subAttribute.AC]: "",
                                            };
                                          }
                                        }
                                      } else {
                                        // for num and date

                                        if (subAttribute.DT === "Number") {
                                          if (
                                            attributeSetData[
                                              subAttribute.AC
                                            ] !== ""
                                          ) {
                                            //change with regex
                                            if (
                                              isNaN(
                                                attributeSetData[
                                                  subAttribute.AC
                                                ]
                                              )
                                            ) {
                                              errorObj = {
                                                ...errorObj,
                                                [subAttribute.AC]:
                                                  "Only numbers are allowed",
                                              };
                                            } else if (
                                              Number(
                                                attributeSetData[
                                                  subAttribute.AC
                                                ]
                                              ) > validation.Maxv
                                            ) {
                                              errorObj = {
                                                ...errorObj,
                                                [subAttribute.AC]: `Max ${validation.Maxv} allowed`,
                                              };
                                            } else if (
                                              Number(
                                                attributeSetData[
                                                  subAttribute.AC
                                                ]
                                              ) < validation.Minv
                                            ) {
                                              errorObj = {
                                                ...errorObj,
                                                [subAttribute.AC]: `Min ${validation.Minv} required`,
                                              };
                                            } else {
                                              errorObj = {
                                                ...errorObj,
                                                [subAttribute.AC]: "",
                                              };
                                            }
                                          }
                                        } else if (subAttribute.DT === "Date") {
                                          if (
                                            attributeSetData[
                                              subAttribute.AC
                                            ] !== null
                                          ) {
                                            if (
                                              moment(
                                                validation.MaxV ===
                                                  "CurrentDate" &&
                                                  attributeSetData[
                                                    subAttribute.AC
                                                  ]
                                              ).isAfter(new Date())
                                            ) {
                                              errorObj = {
                                                ...errorObj,
                                                [subAttribute.AC]:
                                                  "Only till current date allowed",
                                              };
                                            } else {
                                              errorObj = {
                                                ...errorObj,
                                                [subAttribute.AC]: "",
                                              };
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                );

                                const isEmpty = Object.values(errorObj).every(
                                  (s) => s === ""
                                );

                                if (
                                  Object.keys(errorObj).length > 0 &&
                                  !isEmpty
                                ) {
                                  setFormErrors((err) => ({
                                    ...err,
                                    ...errorObj,
                                  }));
                                } else {
                                  //update

                                  setOgFilledAttributeSet((prev) => {
                                    const newState = prev.map((record) => {
                                      if (record.Id === currentGridId) {
                                        return { ...attributeSetData };
                                      }
                                      return record;
                                    });
                                    return newState;
                                  });

                                  let gridData = {};

                                  eachAttribute.Attribute.forEach(
                                    (subAttribute) => {
                                      if (
                                        typeof attributeSetData[
                                          subAttribute.AC
                                        ] === "object"
                                      ) {
                                        gridData = {
                                          ...gridData,
                                          [subAttribute.AC]:
                                            attributeSetData[subAttribute.AC]
                                              ?.label || null, //for date and dropdown
                                        };
                                      } else if (
                                        typeof attributeSetData[
                                          subAttribute.AC
                                        ] === "boolean"
                                      ) {
                                        gridData = {
                                          ...gridData,
                                          [subAttribute.AC]:
                                            attributeSetData[
                                              subAttribute.AC
                                            ] === true
                                              ? "true"
                                              : "false",
                                        };
                                      } else {
                                        gridData = {
                                          ...gridData,
                                          [subAttribute.AC]:
                                            attributeSetData[subAttribute.AC],
                                        };
                                      }
                                    }
                                  );

                                  //reset
                                  setAttributeSetData((prev) => ({
                                    ...prev,
                                    ...ogAttributeSet,
                                  }));

                                  setFormErrors({});

                                  setGridData((prev) => {
                                    const newState = prev.map((record) => {
                                      if (record.Id === currentGridId) {
                                        return {
                                          Id: currentGridId,
                                          ...gridData,
                                        };
                                      }
                                      return record;
                                    });
                                    return newState;
                                  });

                                  setDisplayGrid((prev) => {
                                    const newState = prev.map((record) => {
                                      if (record.Id === currentGridId) {
                                        return {
                                          Id: currentGridId,
                                          ...gridData,
                                        };
                                      }
                                      return record;
                                    });
                                    return newState;
                                  });

                                  setCurrentGridId(null);
                                }
                              }
                            }}
                          >
                            <i
                              className={
                                currentGridId === null
                                  ? "fa fa-plus"
                                  : "fas fa-edit"
                              }
                            ></i>{" "}
                            {currentGridId === null
                              ? "Add Another Record"
                              : "Update Record"}
                          </button>
                        </div>

                        <div className="col-lg-12 p-0">
                          <DynamicGrid
                            options={gridOptions}
                            data={displayGrid}
                            columns={gridColumns}
                          />
                        </div>
                      </div>
                    </div>
                  ) : null}
                </React.Fragment>
              ))}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

const FormStructure = () => {
  const [formData, setFormData] = useState<any>({});
  const [tabs, setTabs] = useState([]);
  const [activetab, setActivetab] = useState<string>(null);
  const { showLoader, hideLoader } = useContext(LoaderContext);

  useEffect(() => {
    (async () => {
      showLoader();
      const tabs = await APICall(getTabsData, "POST", {
        MN: "EmployeeCentral",
        IN: "Form",
      });

      if (tabs.data !== null && tabs.data.length > 0) {
        setTabs(tabs.data);
        setActivetab(tabs.data[0].TN);
      } else {
        console.log("No tabs found!", tabs);
        setTabs([]);
      }
      hideLoader();
    })();
  }, []);

  //tab api here
  useEffect(() => {
    //get section
    if (activetab !== null) {
      (async () => {
        showLoader();

        const section = await APICall(getInterfaceDetails, "POST", {
          MN: "EmployeeCentral",
          IN: "Form",
          TN: activetab,
        });

        if (
          section.data !== null &&
          section.data.t !== undefined &&
          section.data.t.tn === activetab
        ) {
          setFormData(section.data.t);
        } else {
          setFormData({});
        }

        hideLoader();
      })();
    }
  }, [activetab]);

  return (
    <>
      <div className="container-fluid">
        <div className="row prof_bg mb-3">
          <div className="container">
            <div className="row botpad">
              <div className="col-lg-2 col-md-2 col-sm-12">
                <div className="prof_img">
                {/*  <img src={profileImg} />*/}
                </div>
              </div>
              <div className="col-lg-10 col-md-10 col-sm-12 profData">
                <div className="name">
                  <h4>Firtsname Lastname</h4>
                </div>
                <div className="row">
                  <div className="col-lg-4 col-md-4 col-sm-12 profDetail">
                    <ul>
                      <li>
                        <a>
                          <i className="fa-regular fa-address-card"></i> 123456
                        </a>
                      </li>
                      <li>
                        <a>
                          <i className="fa-solid fa-user"></i> Designation Here
                        </a>
                      </li>
                      <li>
                        <a>
                          <i className="fa-solid fa-briefcase"></i> Entity Name
                          Limited
                        </a>
                      </li>
                      <li>
                        <a>
                          <i className="fa-solid fa-location-dot"></i> Location
                          | Funtion | Job Title
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="col-lg-4 col-md-4 col-sm-12 profDetail">
                    <ul>
                      <li>
                        <a>
                          <i className="fa-solid fa-phone"></i> +91 9876543210
                        </a>
                      </li>
                      <li>
                        <a>
                          <i className="fa-solid fa-envelope"></i>{" "}
                          firstname.lastname@welspun.com
                        </a>
                      </li>
                      <li>
                        <a>
                          <i className="fas fa-network-wired"></i> Manager Name
                        </a>
                      </li>
                      <li>
                        <a>
                          <i className="fas fa-tag"></i> Active
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-2"></div>
              <div className="col-lg-10 col-md-10 col-sm-12 ">
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
            </div>
          </div>
        </div>

        {/* section row */}
        <div className="row">
          {formData.S !== undefined &&
            formData.S.length > 0 &&
            formData.S.map((eachSection, index) => (
              <React.Fragment key={`${index}-${eachSection.SN}`}>
                <Section
                  formData={formData}
                  setFormData={setFormData}
                  section={eachSection}
                />
              </React.Fragment>
            ))}
        </div>
      </div>
    </>
  );
};

export default FormStructure;
