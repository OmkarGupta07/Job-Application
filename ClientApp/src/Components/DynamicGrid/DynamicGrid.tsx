import React from "react";
import MUIDataTable from "mui-datatables";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import "./DynamicGrid.css"
declare module "@mui/material/styles" {
  interface Components {
    [key: string]: any;
  }
}

const DynamicGrid = (props: any, ...rest: any) => {
  const muiCache = createCache({
    key: "mui",
    prepend: true,
  });

  const getMuiTheme = () =>
    createTheme({
      components: {
        MUIDataTableToolbar: {
          styleOverrides: {
            root: {
              backgroundColor: "#3c3c3c",
              color: "white",
            },
            icon: {
              color: "white",
              "&:hover": {
                color: "white",
              },
            },
            iconActive: {
              color: "white",
            },
          },
        },
        MUIDataTableSearch: {
          styleOverrides: {
            searchIcon: {
              color: "white",
            },
            searchText: {
              "& input": {
                color: "white",
              },
            },
            clearIcon: {
              color: "white",
            },
          },
        },
        MUIDataTableHeadCell: {
          styleOverrides: {
            root: {
              backgroundColor: "#3c3c3c",
              color: "white",
            },
            sortActive: {
              color: "white",
            },
          },
        },
        MUIDataTableSelectCell: {
          styleOverrides: {
            headerCell: {
              backgroundColor: "#3c3c3c",
              color: "white",
            },
            sortActive: {
              color: "white",
            },
          },
        },
        MuiButtonBase: {
          styleOverrides: {
            root: {
              "& .MuiTableSortLabel-root.Mui-active .MuiTableSortLabel-icon": {
                color: "white",
              },
            },
          },
        },
        MUIDataTableBodyRow: {
          styleOverrides: {
            root: {
              ":nth-of-type(odd)": {
                backgroundColor: "#ececec",
              },
            },
          },
        },
      },
    });

  // const data = [
  //   { name: "Joe James", company: "Test Corp", city: "Yonkers", state: "NY" },
  //   { name: "John Walsh", company: "Test Corp", city: "Hartford", state: "CT" },
  //   { name: "Bob Herm", company: "Test Corp", city: "Tampa", state: "FL" },
  //   {
  //     name: "James Houston",
  //     company: "Test Corp",
  //     city: "Dallas",
  //     state: "TX",
  //   },
  // ];

  // const columns = [
  //   {
  //     name: "Id",
  //     label: "Id",
  //     options: {
  //       filter: false,
  //       sort: false,
  //       display: false,
  //     },
  //   },
  //   {
  //     name: "name",
  //     label: "Name",
  //     options: {
  //       filter: false,
  //       sort: true,
  //       sortDescFirst: true,
  //     },
  //   },
  //   {
  //     name: "company",
  //     label: "ABR",
  //     options: {
  //       filter: false,
  //       sort: true,
  //       sortDescFirst: true,
  //     },
  //   },
  //   {
  //     name: "",
  //     label: "Action",
  //     options: {
  //       filter: false,
  //       sort: false,
  //       customBodyRender: (value, tableMeta) => {
  //         let EncryptedParam =
  //           tableMeta.tableData[tableMeta.rowIndex].EncryptedParam;
  //         let SPHostUrl =
  //           "https://prosaressolutions.sharepoint.com/sites/LegaDoxV2/";
  //         let actionUrl = `/Organization/Edit?PSId=${EncryptedParam}&SPHostUrl=${SPHostUrl}`;

  //         return (
  //           <>
  //             <a href={actionUrl}>
  //               <i className="fa fa-pencil" aria-hidden="true"></i>
  //             </a>
  //           </>
  //         );
  //       },
  //     },
  //   },
  // ];

  return (
    <div className="px-3 box-shdw">
      <CacheProvider value={muiCache}>
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable className="text-align-center"
            title={props.title}
            data={props.data}
            columns={props.columns}
            options={props.options}
            components={props.components}
          />
        </ThemeProvider>
      </CacheProvider>
    </div>
  );
};

export default DynamicGrid;
