import { retailLogo, distributionLogo, growLogo, dispatchLogo, insightsLogo, BlazeInsightsIcon } from "../assets";

import {
    Home,
    LocalGroceryStore,
    Link,
    GridOn,
    Loyalty,
    Payment,
    Tv,
    Settings,
    Store,
    Work,
    Group,
    LocalOffer,
    Person,
    VpnKey,
    LockOpen,
    ShoppingCart,
    EventNote,
    LibraryBooks,
    Description,
    Receipt,
    InsertChart,
    Assessment,
    DeviceHub,
    GraphicEq,
    Apps,
    MonetizationOn,
    CreditCard,
    ViewList,
    Sms,
    Terrain,
    AddShoppingCart,
    Reorder,
    TabletMac,
    People,
    AccessAlarm,
    Toll,
    CheckBox,
    SettingsInputComponent,
    Warning,
    List,
    SelectAll,
    DirectionsCar,
    CastConnected,
    LabelOutlined,
    AccessTime
} from '@material-ui/icons';

import { forEveryKey } from "./array";
import ListIcon from "../components/common/ExpandableList/ListIcon";
import config from "../config/config";

export const apiUrl = `${config.api}api/v1/`;
export const apiUrlV2 = `${config.api}api/v2/`;
export const reportApiUrl = `${config.report_api}api/v1/`;

export const Appcues = window.Appcues;

export const logoConstants = {
    'Retail': retailLogo,
    'Distribution': distributionLogo,
    'Grow': growLogo,
    'Dispatch': dispatchLogo,
    'Insights': insightsLogo
}

export const settingsTabs = [
    {
        title: 'BLAZE Apps',
        icon: Apps,
        url: 'switch',
        childrenList: []
    },
    {
        title: 'Current Shop Settings',
        icon: LocalGroceryStore,
        url: 'shop',
        childrenList: [
            {
                title: 'Shop Information',
                url: '',
                icon: Store
            },
            {
                title: 'Tax Option',
                url: 'taxoption',
                icon: ShoppingCart
            },
            {
                title: 'Delivery Tax Rates',
                url: 'deliverytax',
                icon: AddShoppingCart
            },
            {
                title: 'Terminals',
                url: 'terminals',
                icon: Work
            },
            {
                title: 'Inventories',
                url: 'inventory',
                icon: EventNote
            },
            {
                title: 'Contracts',
                url: 'contracts',
                icon: LibraryBooks
            },
            {
                title: 'Online Store',
                url: 'onlinestore',
                icon: ShoppingCart
            },
            /*{
                title: 'Reset',
                url: 'reset',
                icon: Autorenew
            },*/
            {
                title: 'Shop Documents',
                url: 'documents',
                icon: Description,
                Receipt
            },
            {
                title: 'Invoices & Orders',
                url: 'invoices',
                icon: Receipt
            },
            {
                title: 'Purchase Order',
                url: 'posetting',
                icon: Receipt
            },
            {
                title: 'Manage Receipts',
                url: 'receipts',
                icon: InsertChart
            },
            {
                title: 'Fee Minimums',
                url: 'feeminimums',
                icon: MonetizationOn
            },
            {
                title: 'Pricing Templates',
                url: 'pricingtemplate',
                icon: ViewList
            },
            {
                title: 'Payment Options',
                url: 'paymentOptions',
                icon: Payment
            },
            {
                title: 'Payment Providers',
                url: 'paymentProviders',
                icon: Payment
            },
            {
                title: "BLAZEPAY Settings",
                icon: Payment,
                url: "blazePay",
            },
            {
                title: 'Notifications',
                url: 'notifications',
                icon: Sms
            },
            {
                title: 'Adjustments',
                url: 'adjustments',
                icon: Reorder
            }
        ]
    },
    {
        title: 'Manage Employees',
        url: 'manage',
        icon: Person,
        childrenList: [{
              title: 'All Employees',
              url: 'employees',
              icon: People
            },
            {
              title: 'Clocked In Employees',
              url: 'clocked_in',
              icon: AccessAlarm
            },
            {
              title: 'Timecards',
              url: 'timecards',
              icon: AccessTime
            },
            {
                title: 'Invited Employees',
                url: 'invitedemployees',
                icon: People
            }]
    },
    {
        title: 'Company Settings',
        icon: Settings,
        url: 'company',
        childrenList: [
            {
                title: 'Company Info',
                url: '',
                icon: Home
            },
            {
                title: 'Shops',
                url: 'shops',
                icon: Store
            },
            {
                title: 'Terminals',
                url: 'terminals',
                icon: Work
            },
            {
                title: 'Memberships',
                url: 'memberships',
                icon: Group
            },
            /* {
                title: 'Member Profile',
                url: 'memberprofile',
                icon: Group
            }, */
            {
                title: 'Weight Tolerances',
                url: 'weight',
                icon: LocalOffer
            },
            {
                title: 'Vehicles',
                url: 'vehicles',
                icon: DirectionsCar
            },
            {
                title: 'Third Party Accounts',
                url: 'thirdParty',
                icon: Person
            },
            {
                title: 'Developer Keys',
                url: 'keys',
                icon: VpnKey
            },
            {
                title: 'Loyalty Rewards',
                url: 'loyalty',
                icon: Loyalty
            },
            {
                title: "Labels",
                url: "labels",
                icon: LabelOutlined
            },
            /*{
                title: 'Reset',
                url: 'reset',
                icon: Autorenew
            },*/
            {
                title: 'Roles and Permissions',
                url: 'roles',
                icon: LockOpen
            },
            {
                title: 'Regions',
                url: 'regions',
                icon: Terrain
            },
            {
                title: 'Reporting',
                url: 'reporting',
                icon: Assessment
            }
        ]
    },
    {
      title: 'Manufacturing Settings',
      icon: SettingsInputComponent,
      url: 'manufacturing',
      childrenList: [
        {
          title: 'Component Types',
          url: 'componenttypes',
          icon: ''
        },
        {
          title: 'Component Groups',
          url: 'componentgroups',
          icon: ''
        },
        {
          title: 'Activity Types',
          url: 'activitytypes',
          icon: ''
        },
        {
          title: 'Loss Reasons',
          url: 'lossreasons',
          icon: Warning
        },
        {
          title: 'Checklist',
          url: 'checklists',
          icon: CheckBox
        },
      ]
    },
    {
      title: "Master Catalog",
      url: "master-catalog",
      icon: List,
      childrenList: [
          {
              title: "Master Categories",
              url: "categories",
              icon: GridOn,
          },
          {
              title: "Master Products",
              url: "products",
              icon: SelectAll,
          },
      ],
    },
    {
        title: "BLAZE Insights",
        url: "insights",
        icon: BlazeInsightsIcon,
        customIcon: true,
        childrenList: [
            {
                title: "Reporting Broadcast",
                url: "broadcast",
                icon: CastConnected,
            }
        ],
    },
    {
        title: 'Integration Settings',
        icon: Link,
        url: 'integration',
        childrenList: [
            {
                title: 'Third Party',
                url: '',
                icon: Person
            },
            {
                title: 'Weedmaps',
                url: 'weedmaps',
                icon: ListIcon
            },
            {
                title: 'Leafly',
                url: 'leafly',
                icon: ListIcon
            },
            {
                title: 'Compliance',
                url: 'compliance',
                icon: Toll
            },
            {
                title: 'Webhook Management',
                url: 'webhooks',
                icon: DeviceHub
            },
            {
                title: 'Onfleet',
                url: 'onfleet',
                icon: GraphicEq
            },
            {
                title: 'springbig',
                url: 'springbig',
                icon: ListIcon,
                src: '/'
            },
            {
                title: 'Tookan',
                url: 'tookan',
                icon: CreditCard
            },
            {
                title: 'Spence',
                url: 'spence',
                icon: ListIcon
            },
            {
                title: 'Stronghold',
                url: 'stronghold',
                icon: ListIcon
            }
        ]
    },
    {
        title: 'Plugin Options',
        icon: GridOn,
        url: 'plugins',
        childrenList: [
            {
                title: 'TV Display',
                url: '',
                icon: Tv
            },
            {
                title: 'Check-In',
                url: 'check_in',
                icon: TabletMac
            }
        ]
    }
]

export const usStates = {
  AL: "Alabama",
  AK: "Alaska",
  AS: "American Samoa",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  DC: "District Of Columbia",
  FM: "Federated States Of Micronesia",
  FL: "Florida",
  GA: "Georgia",
  GU: "Guam",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MH: "Marshall Islands",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  MP: "Northern Mariana Islands",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PW: "Palau",
  PA: "Pennsylvania",
  PR: "Puerto Rico",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VI: "Virgin Islands",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming"
};

export const caStates = {
  QN: "QN",
  QC: "QC",
  NS: "NS",
  NB: "NB",
  MB: "MB",
  BC: "BC",
  PE: "PE",
  SK: "SK",
  AB: "AB",
  NL: "NL"
};

export const getUsStates = () => {
  let states = [];

  for (let state in usStates) {
    states.push({
      label: usStates[state],
      value: state
    });
  }

  return states;
};

export const getCaStates = () => {
  let states = [];

  for (let state in caStates) {
    states.push({
      label: caStates[state],
      value: state
    });
  }

  return states;
};

export const EnableRewardsOptions = [
    {
        label: 'BLAZE',
        value: 'Blaze'
    },
    {
        label: 'springbig',
        value: 'SpringBig'
    }
]

export const LoyaltyAccrueOptions = [
  {
    label: "Subtotal",
    value: "Subtotal"
  },
  {
    label: "Subtotal With Discounts",
    value: "SubtotalWithDiscount"
  },
  {
    label: "Final Total",
    value: "FinalTotal"
  }
];

export const permissionsGroupOrder = [
    'Members',
    'POS',
    'Employees',
    'Vendors',
    'Transactions',
    'Inventory',
    'Master Catalog',
    'Cash Drawers',
    'Others',
    'Invoice',
    'Dashboard',
    'Data Export',
    'Insights',
    'Purchase order',
    'Expense',
    'Manufacturing',
    'BLAZE Capital'
];

export const shopTypes = [
  {
    label: "Recreational",
    value: "Recreational"
  },
  {
    label: "Medicinal",
    value: "Medicinal"
  },
  {
    label: "Both",
    value: "Both"
  }
];

export const TimeZones = [
  { label: "Eastern Standard Time", value: "America/New_York" },
  { label: "Central Standard Time ", value: "America/Chicago" },
  { label: "Mountain Standard Time", value: "America/Denver" },
  { label: "Pacific Standard Time", value: "America/Los_Angeles" },
  { label: "Alaskan Standard Time", value: "America/Anchorage" },
  { label: "Hawaiian Standard Time", value: "Pacific/Honolulu" }
];

export const taxOptionList = ["Regular", "Complex"];

export const TaxProcessingOrderOptions = {
  PostTaxed: "Post-Taxed",
  PreTaxed: "Pre-Taxed"
};

export const weedMapList = [
  "Indica",
  "Sativa",
  "Hybrid",
  "Edible",
  "Concentrate",
  "Drink",
  "Clone",
  "Seed",
  "Tincture",
  "Gear",
  "Topicals",
  "Preroll",
  "Wax"
];

export const WebhookTypes = {
  "New Consumer Order": "NEW_CONSUMER_ORDER",
  "New Consumer Signup": "NEW_CONSUMER_SIGNUP",
  "Update Consumer Order": "UPDATE_CONSUMER_ORDER",
  "New Member": "NEW_MEMBER",
  "Update Member": "UPDATE_MEMBER",
  "Complete Transaction": "COMPLETE_TRANSACTION",
  "Update Product": "UPDATE_PRODUCT"
};

export const WebhookTypesArray = forEveryKey(WebhookTypes, (key, value) => ({
  label: key,
  value
}));

export const appTargets = {
    "Retail": config.retailUrl
}

export const priceBreaksValues = [
  { name: "None", value: "None" },
  { name: "1 each", value: "HalfGramUnit" },
  { name: "1 each", value: "OneGramUnit" },
  { name: "2 each", value: "TwoGramUnits" },
  { name: "3 each", value: "ThreeGramUnits" },
  { name: "4 each", value: "FourGramUnits" },
  { name: "5 each", value: "FiveGramUnits" },
  { name: "6 each", value: "SixGramUnits" },
  { name: "7 each", value: "SevenGramUnits" },
  { name: "8 each", value: "EightGramUnits" }
];

export const environmentOptions = [
  { label: "Development", value: "Development" },
  { label: "Production", value: "Production" }
];

//BIOTRACK START

export const biotrackEnvironmentOptions = [
    { label: 'Development', value: 'Development' },
    { label: 'Production', value: 'Production' },
    { label: 'UAT', value: 'UAT'}
];

export const biotrackModeOptions = [
    { label: 'Training', value: 'Training' },
    { label: 'Live', value: 'Live' },
]
//BIOTRACK FINISH

export const weightPerUnitOptions = [
    { label: 'Each', value: 'EACH' },
    { label: 'Half Gram Unit', value: 'HALF_GRAM' },
    { label: 'Whole Gram Unit', value: 'FULL_GRAM' },
    { label: 'Eighth Per Unit', value: 'EIGHTH' },
    { label: 'Custom Weight', value: 'CUSTOM_GRAMS' }
]

export const memberNotifications = {
  Consumer_New_Order: "Notify Members on online order submission",
  Consumer_Update_Order: "Notify Members on online order acceptance",
  Consumer_Accept_Order: "Notify Members on online order updates/modifications"
};

export const companyNotifications = {
  Company_Licence_Expiration: "Notify about company license expiration"
};

export const adjustmentTypes = [
  { label: "Tax", value: "TAX" },
  { label: "Fee", value: "FEE" },
  { label: "Discount", value: "DISCOUNT" },
  { label: "Other", value: "OTHER" }
];

export const checkoutTypes = [
  { label: "Direct", value: "Direct" },
  { label: "Fulfillment", value: "Fulfillment" },
  { label: "Fulfillment Three Steps", value: "FulfillmentThreeStep" }
];

export const paymentTerms = [
  {
    value: "NET_30",
    label: "Net 30"
  },
  {
    value: "COD",
    label: "COD"
  },
  {
    value: "NET_45",
    label: "Net 45"
  },
  {
    value: "NET_60",
    label: "Net 60"
  },
  {
    value: "NET_15",
    label: "Net 15"
  },
  {
    value: "NET_7",
    label: "Net 7"
  },
  {
    value: "CUSTOM_DATE",
    label: "Custom Date"
  }
];

export const flowerTypes = [
  { label: "Indica", value: "Indica" },
  { label: "Sativa", value: "Sativa" },
  { label: "Hybrid", value: "Hybrid" },
  { label: "CBD", value: "CBD" },
  { label: "Indica-Dominant", value: "Indica-Dominant" },
  { label: "Sativa-Dominant", value: "Sativa-Dominant" }
];


export const uniqueMemberAttributes = {
    "EMAIL":"Email",
    "PHONE": 'Phone',
    "DRIVINGLICENSE": 'Driving License'
};

export const leaflyCategoryList = ['Accessory', 'Cartridge', 'Clone', 'Concentrate', 'Edible', 'Flower', 'Other', 'PreRoll', 'Seeds', 'Topical']

export const roleLevels = {
    ADMIN: {level:1, enableManageEmployee:true, canManageSameRole:true},
    MANAGER: {level:2, enableManageEmployee:true, canManageSameRole:false},
    SHOP_MANAGER_AND_DISPATCHER: {level:3, enableManageEmployee:true, canManageSameRole:false},
    OTHER: {level:4, enableManageEmployee:false, canManageSameRole:false},
    INACTIVE: {level:5, enableManageEmployee:false, canManageSameRole:false}
}

export const roles = {
    MANAGER: "Manager",
    ADMIN: "Admin",
    DISPATCHER: "Dispatcher",
    SHOP_MANAGER: "Shop Manager",
    SHOP_DISPATCHER: "Shop Dispatcher",
    FRONT_DESK: "Front Desk",
    DELIVERY_DRIVER: "Delivery Driver",
    BUDTENDER: "Budtender",
    INACTIVE: "Inactive"
}

export const regionZoneTypes = [
    { label: "ZipCode", value :"zipCode"},
    { label: "KML", value :"kml"},
]

export const pennyTransactionOptions = [
    { label: 'Disabled', value: 'DISABLED' },
    { label: 'Per Quantity', value: 'PER_QUANTITY' },
    { label: 'Overall Transaction', value: 'OVERALL_TRANSACTION' },
]

export const catalogTestingViews = {
    MASTER_CATEGORIES: {value: 'MASTER_CATEGORIES'},
    CATALOG_TESTING: {value: 'CATALOG_TESTING'},
    TEST_SAMPLES: {value: 'TEST_SAMPLES'}
}
