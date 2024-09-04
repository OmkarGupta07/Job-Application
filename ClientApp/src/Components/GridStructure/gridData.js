export const gridData1 = {
  moduleName: "Employee",
  moduleId: 1,
  tabName: "Personal",
  tabId: 1,
   "fa": [
    {
      "filn": "city",
      "filt": "dropdown",
      "filAN": "city"
    },
    {
      "filn": "name",
      "filt": "text",
      "filAN": ""
    }
  ],
  "s": [
    {
      "sn": "Second Section",
      "id": 2,

      "columnData": [
        {
          "name": "name",
          "label": "Name",
          "options": {
            "filter": true,
            "sort": true
          }
        },
        {
          "name": "company",
          "label": "Company",
          "options": {
            "filter": true,
            "sort": false
          }
        },
        {
          "name": "city",
          "label": "City",
          "options": {
            "filter": true,
            "sort": false
          }
        },
        {
          "name": "state",
          "label": "State",
          "options": {
            "filter": true,
            "sort": false
          }
        },
        {
          "name": "action",
          "label": "Action",
          "type": ["view", "edit"],
          "options": {
            "filter": true,
            "sort": false
          }
        }
      ],

      "rowData": [
        {
          "name": "Joe James",
          "company": "Test Corp",
          "city": "Yonkers",
          "state": "NY"
        },
        {
          "name": "John Walsh",
          "company": "Test Corp",
          "city": "Hartford",
          "state": "CT"
        },
        {
          "name": "Bob Herm",
          "company": "Test Corp",
          "city": "Tampa",
          "state": "FL"
        },
        {
          "name": "James Houston",
          "company": "Test Corp",
          "city": "Dallas",
          "state": "TX"
        }
      ]
    },
  ],
};

export const cityData = [
  { value: 1, label: "Yonkers" },
  { value: 2, label: "Hartford" },
  { value: 3, label: "Tampa" },
  { value: 4, label: "Dallas" }
];

export const tabsData = [
  { id: 1, name: "Personal" },
  { id: 2, name: "Employment" },
  { id: 3, name: "Performance" },
  { id: 4, name: "Learning" },
];

// ==================================================================

export const gridData2 = {
  moduleName: "Employee",
  moduleId: 2,
  tabName: "Employment",
  tabId: 2,
  "fa": [
    {
      "filn": "city",      //filterName
      "filt": "dropdown",  //dataType
      "filAN": "city"     //apiName
    },
    {
      "filn": "name",
      "filt": "text",
      "filAN": ""
    }
  ],
  "s": [
    {
      "sn": "Second Section",
      "id": 2,

      "columnData": [
        {
          "name": "name",
          "label": "Name2",
          "options": {
            "filter": true,
            "sort": true
          }
        },
        {
          "name": "company",
          "label": "test",
          "options": {
            "filter": true,
            "sort": false
          }
        },
        {
          "name": "city",
          "label": "City2",
          "options": {
            "filter": true,
            "sort": false
          }
        },
        {
          "name": "state",
          "label": "State2",
          "options": {
            "filter": true,
            "sort": false
          }
        },
        {
          "name": "action",
          "label": "Action",
          "type": ["view", "edit"],
          "options": {
            "filter": true,
            "sort": false
          }
        }
      ],

      "rowData": [
        {
          "name": "omkar",
          "company": "Test Corp",
          "city": "Yonkers",
          "state": "NY"
        },
        {
          "name": "Varsh",
          "company": "Test Corp",
          "city": "Hartford",
          "state": "CT"
        },
        {
          "name": "Sanket",
          "company": "Test Corp",
          "city": "Tampa",
          "state": "FL"
        },
        {
          "name": "Nilesh",
          "company": "Test Corp",
          "city": "Dallas",
          "state": "TX"
        }
      ]
    },
  ],
};