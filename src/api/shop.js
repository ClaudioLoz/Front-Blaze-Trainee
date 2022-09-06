import { apiPost, apiGet, apiDelete, apiPut, getHeaders, generateUrl } from "../utils/api";

//Update apis
export const updateShopAPI = (data) => {
  return apiPost(`mgmt/shops/${data.id}`, data);
};

export const updateShopContractAPI = (contract) => {
  return apiPost(`mgmt/contracts/${contract.id}`, contract);
};

export const updateShopFeatureAPI = (data) => {
  return apiPost(`mgmt/shops/features/update`, data);
};

export const updateSpecificShopDataAPI = (data) => {
  return apiPost(`mgmt/shops/updateShop/${data.shopId}`, data);
};

export const updateAssignedShopIdListAPI = (id, assignedShopIds) => {
  return apiPut(`mgmt/labelmaker/${id}`, { assignedShopIds }).then(response => response.data);
}

// get apis

export const getCurrentStoreKeyAPI = () => {
  return apiGet(`mgmt/storekeys/current`);
};

export const getShopListAPI = () => {
  return apiGet("mgmt/shops");
};

export const getShopTerminalsAPI = (shopId) => {
  return apiGet(`mgmt/terminals/${shopId}/shopTerminal`);
};

export const getTerminalsByShopsAPI = (shopIds) => {
  return apiPost(`mgmt/terminals/terminalsByShops`, shopIds);
};

export const getContractsAPI = () => {
  return apiGet(`mgmt/contracts/`);
};

export const getCompanyFeaturesAPI = () => {
  return apiGet(`mgmt/company/features`);
};

export const getFeeListAPI = (feeType) => {
  return apiGet(`mgmt/shop/fee/${feeType}`);
};

export const getShopFeaturesAPI = () => {
  return apiGet(`mgmt/shops/features`);
};

export const getShopLabelsAPI = (shopId) => {
  return apiGet(`mgmt/labelmaker`);
};

// export const getLabelImageAPI = (templateId) => {
//   return apiGet(`mgmt/labelmaker/${templateId}thumbnail`).then(
//     (response) => response.data
//   );
// }

export const getLabelThumbnailAPI = async (productId) => {
  var response = await fetch(generateUrl(`mgmt/labelmaker/${productId}/thumbnail`), {
    headers: getHeaders(),
    method: "GET"
  });
  return response.blob();
}

export const getLabelImageAPI = async (productId) => {
  var response = await fetch(generateUrl(`mgmt/labelmaker/${productId}/image`), {
    headers: getHeaders(),
    method: "GET"
  });
  return response.blob();
}

export const getLabelTemplatesAPI = (data) => {
  return apiGet("mgmt/labelmaker", data);
}

export const getLabelTemplateByIdAPI = (id) => {
  return apiGet(`mgmt/labelmaker/${id}`).then((response) => response.data);
}

export const getIsLabelMakerEnabled = () => {
  return apiGet("mgmt/labelmaker/enabled")
}

//Add APIs

export const addShopAPI = (shop) => {
  return apiPost(`mgmt/shops`, shop);
};

export const addShopContractAPI = (contract) => {
  return apiPost(`mgmt/contracts/`, contract);
};

export const generateKeyAPI = () => {
  return apiPost(`mgmt/storekeys`);
};

export const addUpdateFeeAPI = (feeType, data) => {
  return apiPost(`mgmt/shop/fee/${feeType}`, data);
};

//Delete Apis
export const deleteProductsAPI = (data) => {
  return apiPost(`mgmt/reset/delete/products`, data);
};

export const deleteProductStockAPI = (data) => {
  return apiPost(`mgmt/reset/delete/product/stock`, data);
};

export const getPaymentOptionsAPI = () => {
  return apiGet(`mgmt/settings/admin/paymentoptions`);
};

export const savePaymentOptionsAPI = (data) => {
  return apiPost("mgmt/settings/paymentoptions", data);
};

export const getPaymentProvidersAPI = () => {
  return apiGet(`mgmt/settings/paymentproviders`);
};

export const savePaymentProvidersAPI = (data) => {
  return apiPost("mgmt/settings/paymentproviders", data);
};

export const getPartnersAPI = () => {
  return apiGet(`mgmt/settings/partnerkeys`);
};

//Notifications

export const getNotificationsListAPI = (data) => {
  return apiGet("mgmt/notification/list", data);
};

export const addNotificationAPI = (data) => {
  return apiPost("mgmt/notification", data);
};

export const updateNotificationAPI = (notification) => {
  return apiPut(`mgmt/notification/${notification.id}`, notification);
};

export const deleteNotificationAPI = (notificationId) => {
  return apiDelete(`mgmt/notification/${notificationId}`);
};

export const updateNotificationListAPI = (notifications) => {
  return apiPut(`mgmt/notification/list`, notifications);
};

export const getDeliveryTaxRateAPI = (shopId) => {
  return apiGet(`mgmt/deliveryTaxRate?shopId=${shopId}`);
};

export const postDeliveryTaxRateAPI = (data) => {
  return apiPost(`mgmt/deliveryTaxRate`, data);
};

export const updateDeliveryTaxRateAPI = (data) => {
  return apiPut(`mgmt/deliveryTaxRate/${data.id}`, data);
};

export const deleteDeliveryTaxRateAPI = (id) => {
  return apiDelete(`mgmt/deliveryTaxRate/${id}`);
};

export const getShopTaxesDisplayNamesAPI = () => {
  return apiGet(`mgmt/shops/taxes`);
};

export const updateShopTaxesDisplayNamesAPI = (data) => {
  return apiPost(`mgmt/shops/taxes`, data);
};

export const getShopUtilsAPI = shopId => {
    return apiGet(`mgmt/shops/${shopId}/utils`);
}
