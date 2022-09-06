import moment from "moment";
import { settingsTabs } from './constants';
import _ from "lodash";

export function partial(fn, ...presetArgs) {
  return function partiallyApplied(...laterArgs) {
    return fn(...presetArgs, ...laterArgs);
  };
}

export function actionCreatorUtil(type) {
  return payload => ({
    type,
    payload
  });
}

export const onChangeEditHOF = fn => {
  let memoizedFunctions = {};

  return (key, isCheckBox) => {
    if (memoizedFunctions[key]) {
      return memoizedFunctions[key];
    } else {
      memoizedFunctions[key] = e => {
        const value = isCheckBox ? e.target.checked : e.target.value;

        fn(key, value);
      };

      return memoizedFunctions[key];
    }
  };
};

export const toLocalDate = (date, format = "MM/DD/YYYY") => {
  return moment(date).format(format);
};

export function toCurrencyLocale(num) {
  return `$${convertToFixed(parseFloat(num), 2)}`;
}

export function toPercentage(num, precision = 2) {
	return `${convertToFixed(parseFloat(num), precision)}%`
}

export function convertToFixed(num = 0, precision = 2) {
  const parsedNum = parseFloat(num);

  if (parsedNum || parsedNum == 0) {
    // eslint-disable-line
    return `${parsedNum.toFixed(precision).toLocaleString()}`;
  } else {
    return `${parsedNum.toLocaleString()}`;
  }
}

export function tryConvertToFixed(num = 0, precision = 2) {
  const parsedNum = parseFloat(num);

  if (parsedNum) {
    return `${parsedNum.toFixed(precision).toLocaleString()}`;
  } else {
    return `${num}`;
  }
}

export function convertShopToOnFleetShop(shop = {}, hubList = [], organization = {}) {
    let onFleetShop = {};

    let shopId = shop.id, apiKey = '', organizationId = '', organizationName = '', hubName = '', hubId = '',
        enableOnFleet = false, resetOnFleetInfo = true;
    let onFleetTwoWay = false, onFleetTwoWayUpdateSchedule = false, onFleetTwoWayRevert = false;
    let onFleetAllowEmptyOrders = false, onFleetTwoAutoPack = false;

    if (!shop.resetOnFleetInfo) {
        apiKey = shop.onFleetApiKey;
        organizationId = organization.id || '';
        organizationName = organization.name || '';
        hubName = shop.hubName || '';
        hubId = shop.hubId || '';
        enableOnFleet = shop.enableOnFleet;
        resetOnFleetInfo = shop.resetOnFleetInfo;
        onFleetTwoWay = shop.onFleetTwoWay;
        onFleetTwoWayUpdateSchedule = shop.onFleetTwoWayUpdateSchedule;
        onFleetTwoWayRevert = shop.onFleetTwoWayRevert;
        onFleetAllowEmptyOrders = shop.onFleetAllowEmptyOrders;
        onFleetTwoAutoPack = shop.onFleetTwoAutoPack;
    }

    return {
        ...onFleetShop,
        shopId,
        apiKey,
        organizationId,
        organizationName,
        hubName,
        hubId,
        enableOnFleet,
        resetOnFleetInfo,
        onFleetTwoWay,
        onFleetTwoWayUpdateSchedule,
        onFleetTwoWayRevert,
        onFleetAllowEmptyOrders,
        onFleetTwoAutoPack
    };

}

export const createCopy = data => {
  if (data instanceof Array) {
    return [...data];
  }

  if (Object.prototype.toString.call(data) === "[object Object]") {
    return { ...data };
  }
};

/************** Filtering Google Places Address **************/

export const filterAddressComponents = (keys, components) => {
  let foundItem = null;

  if (!keys.length) {
    return;
  }

  if (keys.length === 1) {
    return findAddressItem(keys[0].name, components);
  }

  let sortedKeys = [...keys].sort(
    (key1, key2) => key1.priority - key2.priority
  );

  for (let i = 0, len = sortedKeys.length; i < len; i++) {
    if (foundItem) break;

    const key = sortedKeys[i];

    const item = findAddressItem(key.name, components);

    if (item) {
      foundItem = item;
    }
  }

  return foundItem;
};

export const findAddressItem = (name, components) => {
  return components.find(({ types }) =>
    types.find(
      type => type == name // eslint-disable-line
    )
  );
};

export const findPostalCode = components => {
  return filterAddressComponents(
    [
      {
        name: "postal_code"
      }
    ],
    components
  );
};

export const findCity = components => {
  return filterAddressComponents(
    [
      {
        name: "locality",
        priority: 0
      },
      {
        name: "administrative_area_level_3",
        priority: 1
      },
      {
        name: "sublocality",
        priority: 2
      },
      {
        name: "neighborhood",
        priority: 3
      }
    ],
    components
  );
};

export const findState = components => {
  return filterAddressComponents(
    [
      {
        name: "administrative_area_level_1"
      }
    ],
    components
  );
};

export const findCountry = components => {
  return filterAddressComponents(
    [
      {
        name: "country"
      }
    ],
    components
  );
};

export const findDescription = components => {
  const street_number = filterAddressComponents(
    [
      {
        name: "street_number"
      }
    ],
    components
  );
  const route = filterAddressComponents(
    [
      {
        name: "route"
      }
    ],
    components
  );

  const neighborhood = filterAddressComponents(
    [
      {
        name: "neighborhood"
      }
    ],
    components
  );
  const description = `${(street_number && street_number.long_name) ||
    ""} ${(route && route.long_name) || ""} ${(neighborhood &&
    neighborhood.long_name) ||
    ""}`;
  return description;
};

const emptyTaxInfo = {
	cityTax: 0,
	stateTax: 0,
	federalTax: 0
}

const emptyTaxTables = [
	{
		consumerType: "AdultUse",
		name: "Adult Use",
		cityTax: {
			active: false,
			taxRate: 0,
			compound: false,
			taxOrder: 'PostTaxed',
			activeExciseTax: false,
			territory: 'City'
		},
		countyTax: {
			active: false,
			taxRate: 0,
			compound: false,
			taxOrder: 'PostTaxed',
			activeExciseTax: false,
			territory: 'County'
		},
		stateTax: {
			active: false,
			taxRate: 0,
			compound: false,
			taxOrder: 'PostTaxed',
			activeExciseTax: false,
			territory: 'State'
		},
		federalTax: {
			active: false,
			taxRate: 0,
			compound: false,
			taxOrder: 'PostTaxed',
			activeExciseTax: false,
			territory: 'Federal'
		}
	},
	{
		consumerType: "MedicinalState",
		name: "Medicinal - MMIC",
		cityTax: {
			active: false,
			taxRate: 0,
			compound: false,
			taxOrder: 'PostTaxed',
			activeExciseTax: false,
			territory: 'City'
		},
		countyTax: {
			active: false,
			taxRate: 0,
			compound: false,
			taxOrder: 'PostTaxed',
			activeExciseTax: false,
			territory: 'County'
		},
		stateTax: {
			active: false,
			taxRate: 0,
			compound: false,
			taxOrder: 'PostTaxed',
			activeExciseTax: false,
			territory: 'State'
		},
		federalTax: {
			active: false,
			taxRate: 0,
			compound: false,
			taxOrder: 'PostTaxed',
			activeExciseTax: false,
			territory: 'Federal'
		}
	},
	{
		consumerType: "MedicinalThirdParty",
		name: "Medicinal - Third Party",
		cityTax: {
			active: false,
			taxRate: 0,
			compound: false,
			taxOrder: 'PostTaxed',
			activeExciseTax: false,
			territory: 'City'
		},
		countyTax: {
			active: false,
			taxRate: 0,
			compound: false,
			taxOrder: 'PostTaxed',
			activeExciseTax: false,
			territory: 'County'
		},
		stateTax: {
			active: false,
			taxRate: 0,
			compound: false,
			taxOrder: 'PostTaxed',
			activeExciseTax: false,
			territory: 'State'
		},
		federalTax: {
			active: false,
			taxRate: 0,
			compound: false,
			taxOrder: 'PostTaxed',
			activeExciseTax: false,
			territory: 'Federal'
		}
	}
]


export const emptyNonCannabisDeliveryTaxOption = {
	nonCannabisUseComplexTax: false,
	nonCannabisTaxOrder: 'PostTaxed',
	nonCannabisTaxInfo: {...emptyTaxInfo},
	nonCannabisTaxTables: [...emptyTaxTables]
}

export const emptyDeliveryTaxOption = {
	active: false,
	name: '',
	useComplexTax: false,
	taxOrder: 'PostTaxed',
	taxInfo: {...emptyTaxInfo},
	taxTables: [...emptyTaxTables],
	regionIds: [],
	...emptyNonCannabisDeliveryTaxOption
}

export const checkIsAppTargetRoute = (appTarget, route) => {
  let isAppTargetRoute = true;

  for (let i in settingsTabs) {
    const tab = settingsTabs[i];

    if (tab.childrenList.length) {
      let filteredList = [];
      if (appTarget === "Distribution") {
        filteredList =
          tab.childrenList.filter(child =>
            [
              "OnFleet",
              "Terminals",
              "Manage Receipts",
              "Memberships",
              "Contracts",
              "Weedmaps",
              "Webhook Management",
              "Loyalty Rewards"
            ].includes(child.title)
          ) || [];
      }
      if (appTarget === "Retail") {
        filteredList =
          tab.childrenList.filter(child =>
            ["Invoices & Purchase Orders"].includes(child.title)
          ) || [];
      }
      if (appTarget === "Grow") {
        //console.log(tab.childrenList, "childrenList")
        filteredList =
          tab.childrenList.filter(child =>
            ["Memberships"].includes(child.title)
          ) || [];
      }
      if (filteredList.find(item => item.url === route)) {
        isAppTargetRoute = false;
        break;
      }
    }
  }
  return isAppTargetRoute;
};

export const scrollElementIntoView = element_id => {
  var element = document.getElementById(element_id);
  element &&
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "start"
    });
};

export const throttle = (func, delay, intervalId) => {
  if (intervalId) {
    clearTimeout(intervalId);
  }
  return setTimeout(func, delay);
};

export const SourceType = {
  ACH: "ach_credit_transfer",
  Card: "card"
};

export const getPaymentStatus = status => {
  let statusName = "Not Defined";
  Object.keys(PaymentStatus).forEach(function(key, index) {
    const property = PaymentStatus[key];
    // key: the name of the object key
    // index: the ordinal position of the key within the object
    if (property.value === status) {
      statusName = property.name;
    }
  });
  return statusName;
};

export const PaymentStatus = {
  requires_payment_method: {
    value: "requires_payment_method",
    name: "Incomplete"
  },
  canceled: { value: "canceled", name: "Canceled" },
  processing: { value: "processing", name: "Processing" },
  succeeded: { value: "succeeded", name: "Succeeded" },
  requires_confirmation: {
    value: "requires_confirmation",
    name: "Requires Confirmation"
  },
  requires_action: { value: "requires_action", name: "Requires Action" },
  requires_capture: { value: "requires_capture", name: "Requires Capture" }
};

export const SubscriptionCollectionMethod = {
  Charge: "charge_automatically",
  Invoice: "send_invoice"
};

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const formatErrors = ({ graphQLErrors, networkError, message }) => {
  let retError = ``;
  if (graphQLErrors) {
    // eslint-disable-next-line array-callback-return
    graphQLErrors.map(({ message, locations, path }) => {
      retError += `${retError}
		[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`;
    });
  }
  if (networkError) {
    retError += `${retError}
	  [Network error]: ${networkError}`;
  }
  if (message) {
    retError += `${retError}
	  Message: ${message}`;
  }
  retError = "Something went wrong..!";
  return retError;
};

export function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

export function stringFormatter(string) {
	return string.trim().toLowerCase();
}

export const hasKeys = (obj) => {
    if (!_.isEmpty(obj)) {
        return true;
    } else {
        return false;
    }
}

export const cannabisTypeOptions = {
    DEFAULT: "Default",
    NON_CANNABIS: "Non-Cannabis",
    CBD: "CBD",
    CBD_CANNABIS: "CBD-Cannabis",
    CBD_CANNABIS_FLOWER: "CBD-Cannabis-Flower",
    PRE_ROLL_CBD: "CBD-Pre-Roll",
    CONCENTRATE: "Concentrate",
    NON_CONCENTRATE: "Non-Concentrate",
    PLANT: "Plant",
    EDIBLE: "Edible",
    EXTRACT: "Extract",
    DRY_FLOWER: "Dry Flower",
    KIEF: "Kief",
    DRY_LEAF: "Dry Leaf",
    LIQUID: "Liquid",
    SUPPOSITORY: "Suppository",
    TINCTURE: "Tincture",
    TOPICAL: "Topical",
    OIL: "Oil",
    SEEDS: "Seeds",
    PRE_ROLL: "Pre-Roll",
};

export const productTypes = [
    {
        label: "Regular",
        value: "REGULAR",
    },
    {
        label: "Derived",
        value: "DERIVED",
    },
	/* {
		label: "Bundle",
		value: "BUNDLE",
	}, */
];

export const archivedOption = [
    {
        label: "Yes",
        value: true,
    },
    {
        label: "No",
        value: false,
    },
];

export const status = [
    {
        label: "Active",
        value: true,
    },
    {
        label: "Inactive",
        value: false,
    },
];

export const sellTypes = [
    {
        label: "Recreational",
        value: "Recreational",
    },
    {
        label: "Medicinal",
        value: "Medicinal",
    },
    {
        label: "Both",
        value: "Both",
    },
];

export const weightPerUnits = [
    {
        label: "Each",
        value: "EACH",
    },
    {
        label: "Half Gram Unit",
        value: "HALF_GRAM",
    },
    {
        label: "Whole Gram Unit",
        value: "FULL_GRAM",
    },
    {
        label: "Eighth Per Unit",
        value: "EIGHTH",
    },
	{
		label: "Custom",
        value: "CUSTOM_GRAMS",
	},
];

export const customWeightPerUnits = [
    {
        label: "Grams",
        value: "GRAM",
    },
    {
        label: "Milligrams",
        value: "MILLIGRAM",
    },
];

export const wmBrands = [
    {
        label: "Custom",
        value: "CUSTOM",
    },
];

export const categoryTypes = [
    {
        label: "Cannabis",
        value: true
    },
    {
        label: "Non-Cannabis",
        value: false
    },
];

export const unitTypes = [
    {
        label: "Units",
        value: "units"
    },
    {
        label: "Grams",
        value: "grams"
    },
];

export const topLevelCategories = [
    {
        label: "Accessories",
        value: "Accessories",
    },
    {
        label: "Concentrate",
        value: "Concentrate",
    },
    {
        label: "Flowers",
        value: "Flowers",
    },
    {
        label: "Preroll",
        value: "Preroll",
    },
    {
        label: "Topicals",
        value: "Topicals",
    },
    {
        label: "Cultivation",
        value: "Cultivation",
    },
    {
        label: "Edibles",
        value: "Edibles",
    },
    {
        label: "VapePens",
        value: "VapePens",
    },
];

export const archivedCategories = [
    {
        label: "Yes",
        value: true
    },
    {
        label: "No",
        value: false
    },
];

export const statusTypes = [
    {
        label: "Active",
        value: "active",
    },
    {
        label: "Inactive",
        value: "inactive",
    },
    {
        label: "Archived",
        value: "archived",
    },
];

export const taxesTypeList = [
	{
		id: 'Inherit',
		name: 'Inherit from shop'
	},
	{
		id: 'Custom',
		name: 'Custom'
	},
	{
		id: 'Exempt',
		name: 'Exempt'
	}
];

export const customerTypeList = [
	{
		id: 'AdultUse',
		name: 'Adult Use'
	},
	{
		id: 'MedicinalState',
		name: 'Medicinal - MMC'
	},
	{
		id: 'MedicinalThirdParty',
		name: 'Medicinal - Third Party'
	}
];

export const taxProcessingOrderOptions = [
	{
		id: 'PostTaxed',
		name: 'Post-Taxed'
	},
	{
		id: 'PreTaxed',
		name: 'Pre-Taxed'
	}
]

export const EventEmitter = {
    events: {},
    emit: function (event, data) {
        if (!this.events[event]) return;
        this.events[event].forEach((callback) => callback(data));
    },
    subscribe: function (event, callback) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(callback);
    },
};

export function hideButtonToSupport() {
    let element = document.getElementById("launcher");
    element.style.display = "none";
}

export function showButtonToSupport() {
    let element = document.getElementById("launcher");
    element.style.display = "block";
}

export function manualSearch(term, list) {
    if (term && list) {
        const tokenizeArray = term.split(' ').filter(token => token);
    
        return list.filter(item => {
          for (let j = 0; j < tokenizeArray.length; j++) {
            const token = tokenizeArray[j].toLowerCase();
            var found = false;
            for (var key in item) {
              const matched =
                item[key] &&
                item[key]
                  .toString()
                  .toLowerCase()
                  .indexOf(token) > -1;
              if (matched) {
                found = true;
                break;
              }
            }
            if (!found) {
              return false;
            }
          }
          return true;
        });
      }
      return list;
  }

export const searchStringInArray = (str, strArray) => {
    try {
        return strArray.find(value => {
            var name = value.name || "";
            return str && name.toLowerCase().match(str.toLowerCase());
        });
    } catch (err) {
        return null;
    }

}

export const removeDuplicates = (inArray) => {
    var arr = inArray.concat()
    for(var i=0; i<arr.length; ++i) { 
        for(var j=i+1; j<arr.length; ++j) { 
            if(arr[i] === arr[j]) {
                arr.splice(j, 1);
            }
        }
    }
    return arr;
}

export function isVehicleCompliance(complianceType) {
	return complianceType === "BIOTRACK";
}

export const bulkUpdateOptions = {
  Archived: {
      name: "Archived",
      field: "archived",
      action: "ARCHIVE_MASTER_PRODUCT",
  },
  "Retail Price": {
      name: "Retail Price",
      field: "unitPrice",
      action: "RETAIL_PRICE",
  },
  Status: {
      name: "Active",
      field: "active",
      action: "ACTIVE",
  },
  "Product Type": {
      name: "Product Type",
      field: "productType",
      action: "PRODUCT_TYPE",
  },
  "Show Online Widget": {
      name: "Show Online Widget",
      field: "showInWidget",
      action: "SHOW_IN_WIDGET",
  },
  Vendor: {
      name: "Vendor",
      field: "vendorId",
      action: "VENDOR",
  },
  "Sync to 3rd Party Menus": {
      name: "Sync to 3rd Party Menus",
      field: "enableWeedmap",
      action: "THIRD_PART_MENUS",
  },
  "Same Price Mix & Match": {
      name: "Same Price Mix & Match",
      field: "enableMixMatch",
      action: "SAME_PRICE_MIX_MATCH",
  },
  "Weedmaps Inventory Threshold": {
      name: "Weedmaps Inventory Threshold",
      field: "wmThreshold",
      action: "WEEDMAPS_INVENTORY_THRESHOLD",
  },
  "Wholesale Price": {
      name: "Wholesale Price",
      field: "salesPrice",
      action: "WHOLESALE_PRICE",
  },
  LowThreshold: {
      name: "LowThreshold",
      field: "lowThreshold",
      action: "LOWTHRESHOLD",
  },
  "WM Online Sellable": {
      name: "WM Online Sellable",
      field: "wmOnlineSellable",
      action: "WM_ONLINE_SELLABLE",
  },
};