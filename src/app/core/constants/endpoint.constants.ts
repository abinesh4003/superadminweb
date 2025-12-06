import {environment} from '@env/environment';

const apiUrl = environment.apiUrl;

export const endpointConstants = {
  DASHBOARD_MAIN: `${apiUrl}/dsbd`,
  get dbCategoryList() {
    return `${this.DASHBOARD_MAIN}/sc/vw`;
  },
  get dbData() {
    return `${this.DASHBOARD_MAIN}/mn`;
  },

  DASHBOARD_INVENTORY: `${apiUrl}/inv`,
  get dbInventoryProducts() {
    return `${this.DASHBOARD_INVENTORY}/:id/:inventory/vw`;
  },
  get dbInventoryProductTemplate() {
    return `${this.DASHBOARD_INVENTORY}/:id/:inventory/tmp/vw`;
  },
  get dbInventoryProductCategories() {
    return `${this.DASHBOARD_INVENTORY}/:id/chk/ctg`;
  },
  get dbInventoryProductKeywords() {
    return `${this.DASHBOARD_INVENTORY}/:id/chk/kyw`;
  },
  get dbInventoryProductAdd() {
    return `${this.DASHBOARD_INVENTORY}/:id/:inventory/ad`;
  },
  get dbInventoryProductView() {
    return `${this.DASHBOARD_INVENTORY}/:categoryId/:inventory/:productId/vw`;
  },
  get dbInventoryProductEdit() {
    return `${this.DASHBOARD_INVENTORY}/:categoryId/:inventory/:productId/ed`;
  },
  get dbInventoryProductApprove() {
    return `${this.DASHBOARD_INVENTORY}/:categoryId/:inventory/:productId/lv`;
  },
  get dbInventoryProductApproveMerchant() {
    return `${this.DASHBOARD_INVENTORY}/:categoryId/:inventory/:productId/lvs`;
  },
  get dbInventoryProductReject() {
    return `${this.DASHBOARD_INVENTORY}/:categoryId/:inventory/:productId/rj`;
  },
  get dbInventoryProductSuspend() {
    return `${this.DASHBOARD_INVENTORY}/:categoryId/:inventory/:productId/sp`;
  },
  get dbInventoryProductTerminate() {
    return `${this.DASHBOARD_INVENTORY}/:categoryId/:inventory/:productId/tr`;
  },
  get dbInventoryProductsDelete() {
    return `${this.DASHBOARD_INVENTORY}/:id/:inventory/dl`;
  },
  get dbInventoryProductsDownload() {
    return `${this.DASHBOARD_INVENTORY}/:id/:inventory/dw`;
  },
  get dbInventorySampleDownload() {
    return `${this.DASHBOARD_INVENTORY}/:id/:inventory/blk/dwl`;
  },
  get dbInventoryBulkUpload() {
    return `${this.DASHBOARD_INVENTORY}/:id/:inventory/blk/upl`;
  },
  get dbInventoryDraftUsers() {
    return `${this.DASHBOARD_INVENTORY}/:categoryId/:inventory/asg/dr/vw`;
  },
  get dbInventoryMDraftUsers() {
    return `${this.DASHBOARD_INVENTORY}/:categoryId/:inventory/asg/mdr/vw`;
  },
  get dbInventoryReviewUsers() {
    return `${this.DASHBOARD_INVENTORY}/:categoryId/:inventory/asg/rv/vw`;
  },
  get dbInventoryAssignProductsDraft() {
    return `${this.DASHBOARD_INVENTORY}/:categoryId/:inventory/asg/dr`;
  },
  get dbInventoryAssignProductsMDraft() {
    return `${this.DASHBOARD_INVENTORY}/:categoryId/:inventory/asg/mdr`;
  },
  get dbInventoryAssignProductsReview() {
    return `${this.DASHBOARD_INVENTORY}/:categoryId/:inventory/asg/rv`;
  },
  get dbInventoryDeleteImage() {
    return `${this.DASHBOARD_INVENTORY}/:categoryId/:productId/dl`;
  },

  DASHBOARD_SHOPS: `${apiUrl}/shop`,
  get dbShopsStores() {
    return `${this.DASHBOARD_SHOPS}/:categoryId/vw`;
  },
  get dbShopsActiveStores() {
    return `${this.DASHBOARD_SHOPS}/:categoryId/activeShops/view`;
  },
  get dbShopsReviewUsers() {
    return `${this.DASHBOARD_SHOPS}/:categoryId/store/asg/vw`;
  },
  get dbShopsAssignStoresReview() {
    return `${this.DASHBOARD_SHOPS}/:categoryId/store/asg`;
  },
  get dbShopsStoresDelete() {
    return `${this.DASHBOARD_SHOPS}/store/delete`;
  },
  get dbShopsLocation() {
    return `${this.DASHBOARD_SHOPS}/locationList`;
  },
  get dbShopsStoresView() {
    return `${this.DASHBOARD_SHOPS}/:categoryId/:storeId/vw`;
  },
  get dbShopApprove() {
    return `${this.DASHBOARD_SHOPS}/:storeId/store/rv/approve`;
  },
  get dbShopReject() {
    return `${this.DASHBOARD_SHOPS}/:storeId/store/rv/reject`;
  },
  get dbShopStoreEditSettings() {
    return `${this.DASHBOARD_SHOPS}/settings/info`;
  },
  get dbShopStoreResetFee() {
    return `${this.DASHBOARD_SHOPS}/settings/resetServiceFee`;
  },
  get dbShopStoreEdit() {
    return `${this.DASHBOARD_SHOPS}/:storeId/edit/info`;
  },
  get dbShopStoreSuspend() {
    return `${this.DASHBOARD_SHOPS}/:storeId/store/rv/suspend`;
  },
  get dbShopStoreTerminate() {
    return `${this.DASHBOARD_SHOPS}/:storeId/store/rv/terminate`;
  },
  get dbShopDeliveryTypes() {
    return `${this.DASHBOARD_SHOPS}/view/delivery/type`;
  },
  get dbShopInventory() {
    return `${this.DASHBOARD_SHOPS}/:categoryId/view/:storeId/inventory`;
  },
  get dbProductCategoryList() {
    return `${this.DASHBOARD_SHOPS}/:categoryId/list/product/category`;
  },
  get searchAgencies() {
    return `${this.DASHBOARD_SHOPS}/settings/agency/search`;
  },
  get agencySettings() {
    return `${this.DASHBOARD_SHOPS}/settings/agency/view`;
  },
  get saveAgencySettings() {
    return `${this.DASHBOARD_SHOPS}/settings/agency/save`;
  },

  DELIVERY_ASSISTANTS: `${apiUrl}/delivery`,
  get onlineAssistants() {
    return `${this.DELIVERY_ASSISTANTS}/assistants/online`;
  },
  get allAssistants() {
    return `${this.DELIVERY_ASSISTANTS}/assistants/list`;
  },
  get assistantInfo() {
    return `${this.DELIVERY_ASSISTANTS}/assistants/:id/info`;
  },
  get onlineAssistantInfo() {
    return `${this.DELIVERY_ASSISTANTS}/assistants/online/:a_id/:o_id/info`
  },
  get updateAssistantStatus() {
    return `${this.DELIVERY_ASSISTANTS}/review/action`
  },

  FINANCE: `${apiUrl}/finance`,
  get financeViewWithdrawRequests() {
    return `${this.FINANCE}/request/view`;
  },
  get financeGetRemittance() {
    return `${this.FINANCE}/remit/list`;
  },
  get financeGetRemittanceInfo() {
    return `${this.FINANCE}/remit/info`;
  },
  get financeUpdateRemittance() {
    return `${this.FINANCE}/remit/update`;
  },
  get financeGetCodHistory() {
    return `${this.FINANCE}/remit/order/history`;
  },
  get financeGetLocationsList() {
    return `${this.FINANCE}/userLocationList`;
  },
  get financeTransferRequest() {
    return `${this.FINANCE}/request/transfer`;
  },
  get financeRejectRequest() {
    return `${this.FINANCE}/request/reject`;
  },
  get financeViewManageOffersSettings() {
    return `${this.FINANCE}/viewoffer`;
  },
  get financeUpdateManageOffersSettings() {
    return `${this.FINANCE}/manageoffers`;
  },


  ADMIN_STORE_CATEGORY: `${apiUrl}/sc`,
  get scCategoryTypes() {
    return `${this.ADMIN_STORE_CATEGORY}/tp/vw`;
  },
  get scCategoryList() {
    return `${this.ADMIN_STORE_CATEGORY}/vw`;
  },
  get scCheckDuplicates() {
    return `${this.ADMIN_STORE_CATEGORY}/chk`;
  },
  get scCreateCategory() {
    return `${this.ADMIN_STORE_CATEGORY}/cs`;
  },
  get scEditTemplate() {
    return `${this.ADMIN_STORE_CATEGORY}/:id/tmp/ed`;
  },
  get scViewCategory() {
    return `${this.ADMIN_STORE_CATEGORY}/:id/vw`;
  },
  get scEditCategory() {
    return `${this.ADMIN_STORE_CATEGORY}/:id/ed`;
  },
  get scDeleteImage() {
    return `${this.ADMIN_STORE_CATEGORY}/:id/img/dl`;
  },

  ADMIN_ROLES: `${apiUrl}/spad`,
  get rolesList() {
    return `${this.ADMIN_ROLES}/rl/vw`;
  },
  get rolesAddRole() {
    return `${this.ADMIN_ROLES}/rl/ad`;
  },
  get rolesViewPrivileges() {
    return `${this.ADMIN_ROLES}/rl/:id/prv/vw`;
  },
  get rolesEditRole() {
    return `${this.ADMIN_ROLES}/rl/:id/ed`;
  },
  get rolesCheckRole() {
    return `${this.ADMIN_ROLES}/rl/chk`;
  },
  get rolesDeleteRole() {
    return `${this.ADMIN_ROLES}/rl/:id/dl`;
  },
  get rolesRoleSearchUsers() {
    return `${this.ADMIN_ROLES}/rl/usr/srh`;
  },
  get rolesRoleAssignUsers() {
    return `${this.ADMIN_ROLES}/rl/:id/usr/asg`;
  },
  get rolesRoleUnassignUsers() {
    return `${this.ADMIN_ROLES}/rl/:id/usr/uns`;
  },

  ADMIN_USERS: `${apiUrl}/spad`,
  get usersList() {
    return `${this.ADMIN_USERS}/us/vw`;
  },
  get usersDeleteUser() {
    return `${this.ADMIN_USERS}/us/:id/dl`;
  },
  get usersAddUser() {
    return `${this.ADMIN_USERS}/us/ad`;
  },
  get usersCheckEmail() {
    return `${this.ADMIN_USERS}/us/chk`;
  },
  get usersUpdateUserProfile() {
    return `${this.ADMIN_USERS}/us/:id/ed`;
  },
  get usersUpdateUser() {
    return `${this.ADMIN_USERS}/us/:id/ed`;
  },
  get usersViewUser() {
    return `${this.ADMIN_USERS}/us/:id/vw`;
  },
  get usersUserRoles() {
    return `${this.ADMIN_USERS}/us/:id/rl/vw`;
  },
  get usersUserCategories() {
    return `${this.ADMIN_USERS}/us/:id/sc/vw`;
  },
  get usersUserCategoryTypes() {
    return `${this.ADMIN_USERS}/us/:id/sc/tp/vw`;
  },
  get usersUserLocation() {
    return `${this.ADMIN_USERS}/us/:id/lo/vw`;
  },
  get usersUserSuspend() {
    return `${this.ADMIN_USERS}/us/:id/sp`;
  },
  get usersUserUnsuspend() {
    return `${this.ADMIN_USERS}/us/:id/usp`;
  },
  get usersUserDeleteImage() {
    return `${this.ADMIN_USERS}/us/:userId/img/dl`;
  },

  SETTINGS: `${apiUrl}/setting`,
  get stServiceTypes() {
    return `${this.SETTINGS}/service`;
  },
  get stFrameTypes() {
    return `${this.SETTINGS}/frame`;
  },
  get stViewCategorySettings() {
    return `${this.SETTINGS}/:categoryId/vw`;
  },
  get stViewCategorySettingsTooltips() {
    return `${this.SETTINGS}/:categoryId/tooltip`;
  },
  get stUpdateCategorySettings() {
    return `${this.SETTINGS}/:categoryId/ed`;
  },
  get stViewCommonChargesSettings() {
    return `${this.SETTINGS}/commonCharges/view`;
  },
  get stUpdateCommonChargesSettings() {
    return `${this.SETTINGS}/commonCharges/update`;
  },

  PROMOTION: `${apiUrl}/promotion`,
  get promotionRequestList() {
    return `${this.PROMOTION}/request/list`;
  },
  get promotionRequestView() {
    return `${this.PROMOTION}/request/view`;
  },
  get promotionRequestApprove() {
    return `${this.PROMOTION}/request/approve`;
  },
  get promotionRequestReject() {
    return `${this.PROMOTION}/request/reject`;
  },
  get promotionSendTestSMS() {
    return `${this.PROMOTION}/request/sendTestSms`;
  },
  get promotionSendTestPush() {
    return `${this.PROMOTION}/request/sendTestPush`;
  },
  get promotionSendTestEmail() {
    return `${this.PROMOTION}/request/sendTestEmail`;
  },
  get promotionSendPrevEmail() {
    return `${this.PROMOTION}/request/sendPrevEmail`;
  },
  get promotionAnnouncementCustomerCount() {
    return `${this.PROMOTION}/pub/count`;
  },
  get promotionAnnouncementSendSMS() {
    return `${this.PROMOTION}/pub/sms`;
  },
  get promotionAnnouncementSendPush() {
    return `${this.PROMOTION}/pub/push`;
  },
  get promotionAnnouncementSendEmail() {
    return `${this.PROMOTION}/pub/email`;
  },
  get promoCodesList() {
    return `${this.PROMOTION}/promo/list`;
  },
  get generatePromoCode() {
    return `${this.PROMOTION}/promo/code/generate`;
  },
  get promoCodeDropdownValues() {
    return `${this.PROMOTION}/promo/dropDown/list`;
  },
  get promoCodeExists() {
    return `${this.PROMOTION}/promo/code/exist`;
  },
  get createPromoCode() {
    return `${this.PROMOTION}/promo/create`;
  },
  get editPromoCode() {
    return `${this.PROMOTION}/promo/edit`;
  },
  get promoCodeToggleActivation() {
    return `${this.PROMOTION}/promo/active-deactive`;
  },
  get viewPromoCode() {
    return `${this.PROMOTION}/promo/view`;
  },

  PROMOTION_SPONSOR: `${apiUrl}/sponsor`,
  get scardSettings() {
    return `${this.PROMOTION_SPONSOR}/scard`;
  },
  get scardMoneyReward() {
    return `${this.PROMOTION_SPONSOR}/scard/money`;
  },
  get scardOfferReward() {
    return `${this.PROMOTION_SPONSOR}/scard/offers`;
  },
  get merchantsAdsList() {
    return `${this.PROMOTION_SPONSOR}/ad/list`;
  },
  get merchantsAdsUpdateText() {
    return `${this.PROMOTION_SPONSOR}/ad/saveTextAd`;
  },
  get merchantsAdsUpdateBanner() {
    return `${this.PROMOTION_SPONSOR}/ad/saveBannerAd`;
  },
  get merchantsAdsDeactivate() {
    return `${this.PROMOTION_SPONSOR}/ad/deactivateAd`;
  },
  get merchantsAdsStoreList() {
    return `${this.PROMOTION_SPONSOR}/ad/storelist`;
  },
  get viewMerchantsAds() {
    return `${this.PROMOTION_SPONSOR}/ad/view`;
  },

  ORDERS_DASHBOARD: `${apiUrl}/order`,
  get orderStatus() {
    return `${this.ORDERS_DASHBOARD}/dashboard`
  },
  get customerStatus() {
    return `${this.ORDERS_DASHBOARD}/customer/status`
  },
  get topOrderLocations() {
    return `${this.ORDERS_DASHBOARD}/topOrdersLoc`
  },
  get graphData() {
    return `${this.ORDERS_DASHBOARD}/graph`
  },

  COMMON: `${apiUrl}/common`,
  get publicCategoryList() {
    return `${this.COMMON}/category/1`
  },

  SUBSCRIPTION: `${apiUrl}/subs`,
  get subList() {
    return `${this.SUBSCRIPTION}/list/data`;
  },
  get subCount() {
    return `${this.SUBSCRIPTION}/list/count`;
  },
  get subTypeList() {
    return `${this.SUBSCRIPTION}/list/type`;
  },
  get subscriptionsInfo() {
    return `${this.SUBSCRIPTION}/subInfo`;
  },
  get pauseUnsubscribeSubs() {
    return `${this.SUBSCRIPTION}/action`;
  },
  get transferAmount() {
    return `${this.SUBSCRIPTION}/ed/amt`;
  },
  get editStartDate() {
    return `${this.SUBSCRIPTION}/edit/date`;
  },
  get subsOrderHistory() {
    return `${this.SUBSCRIPTION}/view/order/history`;
  },
  get subsRechargeLog() {
    return `${this.SUBSCRIPTION}/view/recharge/history`;
  },
  get subsSendReminder() {
    return `${this.SUBSCRIPTION}/ed/reminder`;
  },
  get subsSupportMessages() {
    return `${this.SUBSCRIPTION}/support/msg`;
  },

  ORDERS_LIST: `${apiUrl}/order`,
  get list() {
    return `${this.ORDERS_LIST}/v2/view/orders/list`
  },
  get ordersCount() {
    return `${this.ORDERS_LIST}/v2/view/orders/c`
  },
  get allOrdersCount() {
    return `${this.ORDERS_LIST}/unread/count`
  },
  get orderInfo() {
    return `${this.ORDERS_LIST}/v2/order/:r_id/info`
  },
  get orderContactInfo() {
    return `${this.ORDERS_LIST}/v2/order/:r_id/contacts`
  },
  get cancelOrder() {
    return `${this.ORDERS_LIST}/cancelOrder`
  },
  get dispatchOrder() {
    return `${this.ORDERS_LIST}/dispatched`
  },
  get shipOrder() {
    return `${this.ORDERS_LIST}/shipping`
  },
  get acceptOrder() {
    return `${this.ORDERS_LIST}/acceptOrder`
  },
  get deliverOrder() {
    return `${this.ORDERS_LIST}/deliverOrder`
  },
  get updateDeliveryTime() {
    return `${this.ORDERS_LIST}/editDeliveryTime`
  },
  get supportMessages(){
    return `${this.ORDERS_LIST}/v2/support/msg`
  },
  get productReplacementChat() {
    return `${this.ORDERS_LIST}/viewCorrespondence`
  },
  get resolveReplacement() {
    return `${this.ORDERS_LIST}/escalated/resolve`
  },
  get availableDeliveryAssociates() {
    return `${this.ORDERS_LIST}/assistant/active/list`
  },
  get assignToAssociate() {
    return `${this.ORDERS_LIST}/assistant/assign`
  },
  get deliveryAssistantInfo() {
    return `${this.ORDERS_LIST}/v2/user/:u_id/info`
  }
};
