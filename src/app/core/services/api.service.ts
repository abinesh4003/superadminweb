import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {
  DB_INV_STATUS_LIVE,
  DB_INV_STATUS_REJECTED,
  DB_INV_STATUS_SUSPENDED,
  DB_INV_STATUS_TERMINATED,
  endpointConstants
} from '@app/core/constants';
import {
  GetDashboardProductCategoryListInterface,
  GetDashboardShopInventoryInterface,
  GetStoreCategoryListInterface
} from '@app/core/interfaces';
import {
  GetRolesListInterface,
  GetScViewInterface,
  GetUsersListInterface, GetUsersUserProfileInterface
} from '@app/core/interfaces/admin.interfaces';
import {
  GetDashboardInterface,
  GetDashboardInventoryProductsInterface,
  GetDashboardInventoryProductTemplateInterface,
  GetDashboardInventoryProductViewInterface,
  GetDashboardStoreCategoryListInterface,
  GetDashboardShopsStoresInterface,
  GetDashboardShopsStoreViewInterface,
  GetShopsLocationListInterface
} from '@app/core/interfaces/dashboard.interfaces';
import {Category, Dashboard, Role, User} from '@app/core/models';
import {ScTemplateItem} from '@app/core/models/admin.models';
import {DashboardInventoryProduct} from '@app/core/models/dashboard.models';
import {ApiHelperService} from '@app/core/services/api-helper.service';
import {Observable} from 'rxjs/Observable';
import {pluck} from 'rxjs/operators/pluck';
import {catchError} from 'rxjs/operators/catchError';
import {map} from 'rxjs/operators/map';

@Injectable()
export class ApiService {
  constructor(
    private http: HttpClient,
    private apiHelper: ApiHelperService
  ) {
  }

  /************************ Dashboard - Main *************************/
  // TODO: create ngrx effect for this
  getDashboardStoreCategoryList(): Observable<Category[]> {
    const url = endpointConstants.dbCategoryList;

    return this.http.get<GetDashboardStoreCategoryListInterface>(url)
      .pipe(
        map(resp => resp.data.map(item => new Category(item))),
        catchError(this.apiHelper.handleError)
      );
  }

  getDashboardData(): Observable<Dashboard> {
    const url = endpointConstants.dbData;

    return this.http.get<GetDashboardInterface>(url)
      .pipe(
        map(resp => resp.data),
        catchError(this.apiHelper.handleError)
      );
  }

  /************************ Dashboard Inventory *************************/
  getDashboardInventoryProducts(
    isUpc,
    id,
    {status = null, text = '', user_id = '', skip = 0, limit = 10, added_by = '', rejected_by = ''}
      : { status: any[], text: string, user_id: string, skip?: number, limit?: number, added_by?: string, rejected_by?: string }
  ): Observable<{ count: number, docs: DashboardInventoryProduct[] }> {

    const url = this.replaceInventory(endpointConstants.dbInventoryProducts, isUpc).replace(':id', id);
    let params = this.apiHelper.getQueryParams('status', status);
    params = this.apiHelper.getQueryParams('text', text, params);
    params = this.apiHelper.getQueryParams('user_id', user_id, params);
    params = this.apiHelper.getQueryParams('skip', skip, params);
    params = this.apiHelper.getQueryParams('limit', limit, params);
    params = this.apiHelper.getQueryParams('added_by', added_by, params);
    params = this.apiHelper.getQueryParams('rejected_by', rejected_by, params);

    return this.http.get<GetDashboardInventoryProductsInterface>(url, {params})
      .pipe(
        map(resp => resp.data),
        catchError(this.apiHelper.handleError)
      );
  }

  getDashboardInventoryProductTemplate(isUpc, id): Observable<ScTemplateItem[]> {
    const url = this.replaceInventory(endpointConstants.dbInventoryProductTemplate, isUpc).replace(':id', id);

    return this.http.get<GetDashboardInventoryProductTemplateInterface>(url)
      .pipe(
        map(resp => resp.data),
        catchError(this.apiHelper.handleError)
      );
  }

  addDashboardInventoryProduct(isUpc, id, data) {
    const url = this.replaceInventory(endpointConstants.dbInventoryProductAdd, isUpc).replace(':id', id);

    return this.http.post(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  getDashboardInventoryProductView(isUpc, categoryId, productId, {status} = {status: null}): Observable<DashboardInventoryProduct> {
    const url = this.replaceInventory(endpointConstants.dbInventoryProductView, isUpc)
      .replace(':categoryId', categoryId)
      .replace(':productId', productId);
    const params = this.apiHelper.getQueryParams('status', status);

    return this.http.get<GetDashboardInventoryProductViewInterface>(url, {params})
      .pipe(
        map(resp => resp.data),
        catchError(this.apiHelper.handleError)
      );
  }

  updateDashboardInventoryProduct(isUpc, categoryId, productId, data) {
    const url = this.replaceInventory(endpointConstants.dbInventoryProductEdit, isUpc)
      .replace(':categoryId', categoryId)
      .replace(':productId', productId);

    return this.http.patch(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  changeStatusDashboardInventoryProduct(
    isUpc,
    categoryId,
    productId,
    added_by,
    data: { status: number, feedback?: string, rejected_by?: string }
  ) {
    let pathUrl = '';
    switch (data.status) {
      case DB_INV_STATUS_LIVE:
        pathUrl = added_by === 'merchant'
          ? endpointConstants.dbInventoryProductApproveMerchant
          : endpointConstants.dbInventoryProductApprove;
        break;
      case DB_INV_STATUS_REJECTED:
        pathUrl = endpointConstants.dbInventoryProductReject;
        break;
      case DB_INV_STATUS_SUSPENDED:
        pathUrl = endpointConstants.dbInventoryProductSuspend;
        break;
      case DB_INV_STATUS_TERMINATED:
        pathUrl = endpointConstants.dbInventoryProductTerminate;
        break;
    }

    const url = this.replaceInventory(pathUrl, isUpc)
      .replace(':categoryId', categoryId)
      .replace(':productId', productId);

    return this.http.patch(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  deleteDashboardInventoryProducts(isUpc, categoryId, data) {
    const url = this.replaceInventory(endpointConstants.dbInventoryProductsDelete, isUpc)
      .replace(':id', categoryId);

    return this.http.post(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  getDashboardInventoryProductCategories(id) {
    const url = endpointConstants.dbInventoryProductCategories.replace(':id', id);

    return this.http.get<any>(url)
      .pipe(
        map(resp => resp.data),
        catchError(this.apiHelper.handleError)
      );
  }

  getDashboardInventoryProductKeywords(id) {
    const url = endpointConstants.dbInventoryProductKeywords.replace(':id', id);

    return this.http.get<any>(url)
      .pipe(
        map(resp => resp.data),
        catchError(this.apiHelper.handleError)
      );
  }

  getDashboardInventoryProductsDownload(isUpc, id, data) {
    const url = this.replaceInventory(endpointConstants.dbInventoryProductsDownload, isUpc)
      .replace(':id', id);

    return this.http.post(url, data, {observe: 'response', responseType: 'blob'})
      .pipe(
        map(({body, headers}) => {
          const filename = this.apiHelper.getFilenameFromHeaders(headers);

          return {blob: body, filename};
        }),
        catchError(this.apiHelper.handleError)
      );
  }

  getDashboardInventorySampleDownload(isUpc, id) {
    const url = this.replaceInventory(endpointConstants.dbInventorySampleDownload, isUpc)
      .replace(':id', id);

    return this.http.get(url, {responseType: 'blob', observe: 'response'})
      .pipe(
        map(({body, headers}) => {
          const filename = this.apiHelper.getFilenameFromHeaders(headers);

          return {blob: body, filename};
        }),
        catchError(this.apiHelper.handleError)
      );
  }

  makeDashboardInventoryBulkUpload(isUpc, id, data) {
    const url = this.replaceInventory(endpointConstants.dbInventoryBulkUpload, isUpc)
      .replace(':id', id);

    return this.apiHelper.handleUploadProgress('POST', url, data);
  }

  getDashboardInventoryDraftUsers(isUpc, categoryId) {
    const url = this.replaceInventory(endpointConstants.dbInventoryDraftUsers, isUpc)
      .replace(':categoryId', categoryId);

    return this.http.get<any>(url)
      .pipe(
        map(resp => resp.assignee),
        catchError(this.apiHelper.handleError)
      );
  }

  getDashboardInventoryMDraftUsers(isUpc, categoryId) {
    const url = this.replaceInventory(endpointConstants.dbInventoryMDraftUsers, isUpc)
      .replace(':categoryId', categoryId);

    return this.http.get<any>(url)
      .pipe(
        map(resp => resp.assignee),
        catchError(this.apiHelper.handleError)
      );
  }

  getDashboardInventoryReviewUsers(isUpc, categoryId) {
    const url = this.replaceInventory(endpointConstants.dbInventoryReviewUsers, isUpc)
      .replace(':categoryId', categoryId);

    return this.http.get<any>(url)
      .pipe(
        map(resp => resp.assignee),
        catchError(this.apiHelper.handleError)
      );
  }

  assignDashboardInventoryDraftProducts(isUpc, categoryId, data) {
    const url = this.replaceInventory(endpointConstants.dbInventoryAssignProductsDraft, isUpc)
      .replace(':categoryId', categoryId);

    return this.http.post(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  assignDashboardInventoryMDraftProducts(isUpc, categoryId, data) {
    const url = this.replaceInventory(endpointConstants.dbInventoryAssignProductsMDraft, isUpc)
      .replace(':categoryId', categoryId);

    return this.http.post(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  assignDashboardInventoryReviewProducts(isUpc, categoryId, data) {
    const url = this.replaceInventory(endpointConstants.dbInventoryAssignProductsReview, isUpc)
      .replace(':categoryId', categoryId);

    return this.http.post(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  deleteInventoryImage(categoryId, productId, key, value) {
    const url = endpointConstants.dbInventoryDeleteImage
      .replace(':categoryId', categoryId)
      .replace(':productId', productId);

    let params = this.apiHelper.getQueryParams('key', key);
    params = this.apiHelper.getQueryParams('value', value, params);

    return this.http.delete(url, {params})
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  private replaceInventory(url, isUpc) {
    return url.replace(':inventory', isUpc ? 'upc' : 'sku');
  }

  /************************ Admin - Store Category *************************/
  getStoreCategoryList({type = null, status = null, text = '', skip = 0, limit = 10}: {
    type: number,
    status: any[],
    text: string,
    skip: number,
    limit: number
  }): Observable<{ count: number, docs: Category[] }> {
    const url = endpointConstants.scCategoryList;
    let params = this.apiHelper.getQueryParams('type', type);
    params = this.apiHelper.getQueryParams('status', status, params);
    params = this.apiHelper.getQueryParams('text', text, params);
    params = this.apiHelper.getQueryParams('skip', skip, params);
    params = this.apiHelper.getQueryParams('limit', limit, params);

    return this.http.get<GetStoreCategoryListInterface>(url, {params})
      .pipe(
        map(resp => resp.data),
        catchError(this.apiHelper.handleError)
      );
  }

  getStoreCategoryTypes() {
    const url = endpointConstants.scCategoryTypes;

    return this.http.get<any>(url)
      .pipe(
        map(resp => resp.type),
        map(types => this.formatCategoryTypes(types)),
        catchError(this.apiHelper.handleError)
      );
  }


  private formatCategoryTypes(types) {
    return types.map(({number, display_name}) => {
      return {
        id: number,
        name: display_name
      };
    });
  }

  checkDuplicateCategoryName(data) {
    const url = endpointConstants.scCheckDuplicates;

    return this.http.post(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  createStoreCategory(data) {
    const url = endpointConstants.scCreateCategory;

    return this.http.post<any>(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  viewStoreCategory(id): Observable<any> {
    const url = endpointConstants.scViewCategory.replace(':id', id);

    return this.http.get<GetScViewInterface>(url)
      .pipe(
        map(resp => resp.data),
        catchError(this.apiHelper.handleError)
      );
  }

  updateStoreCategory(id, data) {
    const url = endpointConstants.scEditCategory.replace(':id', id);

    return this.http.patch<any>(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  updateStoreCategoryViewTemplate(categoryId, data) {
    const url = endpointConstants.scEditTemplate.replace(':id', categoryId);

    return this.http
      .patch(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  deleteStoreCategoryImage(id) {
    const url = endpointConstants.scDeleteImage.replace(':id', id);

    return this.http.delete(url)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  /************************ Admin - Roles *************************/
  getRolesList(): Observable<Role[]> {
    const url = endpointConstants.rolesList;

    return this.http.get<GetRolesListInterface>(url)
      .pipe(
        map(resp => resp.roles),
        catchError(this.apiHelper.handleError)
      );
  }

  addRolesRole(data) {
    const url = endpointConstants.rolesAddRole;

    return this.http.post<any>(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  checkRolesRole(data) {
    const url = endpointConstants.rolesCheckRole;

    return this.http.post(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  deleteRolesRole(roleId) {
    const url = endpointConstants.rolesDeleteRole.replace(':id', roleId);

    return this.http.delete(url)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  updateRolesRole(id, data) {
    const url = endpointConstants.rolesEditRole.replace(':id', id);

    return this.http.patch<any>(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  searchRolesRoleUsers(data) {
    const url = endpointConstants.rolesRoleSearchUsers;

    return this.http.post<any>(url, data)
      .pipe(
        map(resp => resp.users),
        catchError(this.apiHelper.handleError)
      );
  }

  assignRolesRoleUsers(id, data) {
    const url = endpointConstants.rolesRoleAssignUsers.replace(':id', id);

    return this.http.post<any>(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  unassignRolesRoleUsers(id, data) {
    const url = endpointConstants.rolesRoleUnassignUsers.replace(':id', id);

    return this.http.post<any>(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  getRolesRolePrivileges(id) {
    const url = endpointConstants.rolesViewPrivileges.replace(':id', id);

    return this.http.get<any>(url)
      .pipe(
        map(resp => resp.privileges),
        map(({_id, name, ...rest}) => rest),
        catchError(this.apiHelper.handleError)
      );
  }

  /************************ Admin - Users *************************/
  getUsersList({status = '', text = '', role = ''}: { status: string, text: string, role: string }): Observable<User[]> {
    const url = endpointConstants.usersList;
    let params = this.apiHelper.getQueryParams('status', status);
    params = this.apiHelper.getQueryParams('text', text, params);
    params = this.apiHelper.getQueryParams('role', role, params);

    return this.http.get<GetUsersListInterface>(url, {params})
      .pipe(
        map(resp => resp.users),
        catchError(this.apiHelper.handleError)
      );
  }

  deleteUsersUser(userId) {
    const url = endpointConstants.usersDeleteUser.replace(':id', userId);

    return this.http.delete(url)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  addUsersUser(data) {
    const url = endpointConstants.usersAddUser;

    return this.http.post<any>(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  usersCheckEmail(data) {
    const url = endpointConstants.usersCheckEmail;

    return this.http.post(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  updateUsersUserProfile(id, data) {
    const url = endpointConstants.usersUpdateUserProfile.replace(':id', id);

    return this.http.post<any>(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  updateUsersUser(id, data) {
    const url = endpointConstants.usersUpdateUser.replace(':id', id);

    return this.http.patch<any>(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  getUsersUser(id) {
    const url = endpointConstants.usersViewUser.replace(':id', id);

    return this.http.get<GetUsersUserProfileInterface>(url)
      .pipe(
        map(resp => resp.user),
        catchError(this.apiHelper.handleError)
      );
  }

  getUsersUserRoles(id) {
    const url = endpointConstants.usersUserRoles.replace(':id', id);

    return this.http.get<any>(url)
      .pipe(
        map(resp => resp.roles),
        catchError(this.apiHelper.handleError)
      );
  }

  getUsersUserLocation(id) {
    const url = endpointConstants.usersUserLocation.replace(':id', id);

    return this.http.get<any>(url)
      .pipe(
        map(resp => resp.location),
        catchError(this.apiHelper.handleError)
      );
  }

  getUsersUserLocationFilter(id, country = '') {
    const url = endpointConstants.usersUserLocation.replace(':id', id);
    const params = this.apiHelper.getQueryParams('country', country);

    return this.http.get<any>(url, {params})
      .pipe(
        map(resp => resp.location),
        catchError(this.apiHelper.handleError)
      );
  }

  getUsersUserCategories(id, {type = null, status = null, text = '', skip = 0, limit = 10}: {
    type?: number,
    status: any[],
    text?: string,
    skip?: number,
    limit?: number
  }) {
    const url = endpointConstants.usersUserCategories.replace(':id', id);
    let params = this.apiHelper.getQueryParams('type', type);
    params = this.apiHelper.getQueryParams('status', status, params);
    params = this.apiHelper.getQueryParams('text', text, params);
    params = this.apiHelper.getQueryParams('skip', skip, params);
    params = this.apiHelper.getQueryParams('limit', limit, params);

    return this.http.get<GetStoreCategoryListInterface>(url, {params})
      .pipe(
        map(resp => resp.data),
        catchError(this.apiHelper.handleError)
      );
  }

  getUsersUserCategoryTypes(id) {
    const url = endpointConstants.usersUserCategoryTypes.replace(':id', id);

    return this.http.get<any>(url)
      .pipe(
        map(resp => resp.type),
        map(types => this.formatCategoryTypes(types)),
        catchError(this.apiHelper.handleError)
      );
  }

  usersUserSuspend(id) {
    const url = endpointConstants.usersUserSuspend.replace(':id', id);

    return this.http.get<any>(url)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  usersUserUnsuspend(id) {
    const url = endpointConstants.usersUserUnsuspend.replace(':id', id);

    return this.http.get<any>(url)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  deleteUsersUserImage(id) {
    const url = endpointConstants.usersUserDeleteImage.replace(':userId', id);

    return this.http.delete(url)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  /************************ Dashboard Shops *************************/

  getDashboardShopsStores(
    categoryId,
    {status = null, text = '', user_id = '', skip = 0, limit = 10, location = ''}
      : { status: any[], text: string, user_id: string, skip?: number, limit?: number, location: string }
  ): Observable<{ count: number, docs: any[] }> {

    const url = endpointConstants.dbShopsStores.replace(':categoryId', categoryId);
    let params = this.apiHelper.getQueryParams('status', status);
    params = this.apiHelper.getQueryParams('text', text, params);
    params = this.apiHelper.getQueryParams('user_id', user_id, params);
    params = this.apiHelper.getQueryParams('skip', skip, params);
    params = this.apiHelper.getQueryParams('limit', limit, params);
    params = this.apiHelper.getQueryParams('location', location, params);

    return this.http.get<GetDashboardShopsStoresInterface>(url, {params})
      .pipe(
        map(resp => resp.data),
        catchError(this.apiHelper.handleError)
      );
  }

  getDashboardShopsActiveStores(
    categoryId,
    {
      type = null,
      text = '',
      status = null,
      isPrivate = false,
      skip = 0,
      limit = 10,
      location = '',
      longitude = null,
      latitude = null,
      distance = null
    }:
      {
        type: number,
        text: string,
        status: any[],
        isPrivate: boolean,
        skip?: number,
        limit?: number,
        location: string,
        longitude: number,
        latitude: number,
        distance: number
      }
  ): Observable<{ count: number, docs: any[] }> {

    const url = endpointConstants.dbShopsActiveStores.replace(':categoryId', categoryId);
    let params = this.apiHelper.getQueryParams('type', type);
    params = this.apiHelper.getQueryParams('text', text, params);
    params = this.apiHelper.getQueryParams('status', status, params);
    params = this.apiHelper.getQueryParams('location', location, params);
    params = this.apiHelper.getQueryParams('skip', skip, params);
    params = this.apiHelper.getQueryParams('limit', limit, params);
    params = this.apiHelper.getQueryParams('isPrivate', isPrivate, params);
    params = this.apiHelper.getQueryParams('longitude', longitude, params);
    params = this.apiHelper.getQueryParams('latitude', latitude, params);
    params = this.apiHelper.getQueryParams('distance', distance, params);

    return this.http.get<GetDashboardShopsStoresInterface>(url, {params})
      .pipe(
        map(resp => resp.data),
        catchError(this.apiHelper.handleError)
      );
  }

  getDashboardShopsReviewUsers(categoryId) {
    const url = endpointConstants.dbShopsReviewUsers
      .replace(':categoryId', categoryId);

    return this.http.get<any>(url)
      .pipe(
        map(resp => resp.assignee),
        catchError(this.apiHelper.handleError)
      );
  }

  assignDashboardShopsReview(categoryId, data) {
    const url = endpointConstants.dbShopsAssignStoresReview
      .replace(':categoryId', categoryId);

    return this.http.post(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  deleteDashboardShopsStores(data) {
    const url = endpointConstants.dbShopsStoresDelete;

    return this.http.request('delete', url, {body: data})
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  getShopsLocationList(): Observable<string[]> {
    const url = endpointConstants.dbShopsLocation;

    return this.http.get<GetShopsLocationListInterface>(url)
      .pipe(
        map(resp => resp.locations),
        catchError(this.apiHelper.handleError)
      );
  }

  getDashboardShopsStoreView(categoryId, storeId): Observable<any> {
    const url = endpointConstants.dbShopsStoresView
      .replace(':categoryId', categoryId)
      .replace(':storeId', storeId);

    return this.http.get<GetDashboardShopsStoreViewInterface>(url)
      .pipe(
        map(resp => resp.data),
        catchError(this.apiHelper.handleError)
      );
  }

  resetServiceFee(data) {
    const url = endpointConstants.dbShopStoreResetFee;

    return this.http.post<any>(url, data)
      .pipe(
        map(resp => resp.data),
        catchError(this.apiHelper.handleError)
      );
  }

  shopStoreApproved(storeId) {
    const url = endpointConstants.dbShopApprove.replace(':storeId', storeId);

    return this.http.get<any>(url)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  shopStoreRejected(storeId, data) {
    const url = endpointConstants.dbShopReject.replace(':storeId', storeId);

    return this.http.patch(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  getDashboardShopDeliveryTypes() {
    const url = endpointConstants.dbShopDeliveryTypes;

    return this.http.get(url)
      .pipe(
        map((resp: any) => resp.data.type),
        catchError(this.apiHelper.handleError)
      );
  }

  updateDashboardShopStore(storeId, data) {
    const url = endpointConstants.dbShopStoreEdit.replace(':storeId', storeId);

    return this.http.patch(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  deleteShopIconImage(storeId) {
    const url = endpointConstants.dbShopStoreEdit.replace(':storeId', storeId);

    return this.http.delete(url)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  updateDashboardShopStoreSettings(data) {
    const url = endpointConstants.dbShopStoreEditSettings;

    return this.http.post(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  suspendDashboardShopStore(storeId, data) {
    const url = endpointConstants.dbShopStoreSuspend.replace(':storeId', storeId);

    return this.http.patch<any>(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  terminateDashboardShopStore(storeId, data) {
    const url = endpointConstants.dbShopStoreTerminate.replace(':storeId', storeId);

    return this.http.patch<any>(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  getShopInventoryList(categoryId, storeId, {type = null, text = '', category = '', skip = 0, limit = 10}: {
    type?: number,
    text?: string,
    category?: string,
    skip?: number,
    limit?: number
  }) {
    const url = endpointConstants.dbShopInventory
      .replace(':categoryId', categoryId)
      .replace(':storeId', storeId);

    let params = this.apiHelper.getQueryParams('type', type);
    params = this.apiHelper.getQueryParams('text', text, params);
    params = this.apiHelper.getQueryParams('category', category, params);
    params = this.apiHelper.getQueryParams('skip', skip, params);
    params = this.apiHelper.getQueryParams('limit', limit, params);

    return this.http.get<GetDashboardShopInventoryInterface>(url, {params})
      .pipe(
        map(resp => resp.data),
        catchError(this.apiHelper.handleError)
      );
  }

  getProductCategoryList(categoryId) {
    const url = endpointConstants.dbProductCategoryList.replace(':categoryId', categoryId);

    return this.http.get<GetDashboardProductCategoryListInterface>(url)
      .pipe(
        map(resp => resp && resp.data && resp.data.product_category || []),
        catchError(this.apiHelper.handleError)
      );
  }

  searchAgencies(data) {
    const url = endpointConstants.searchAgencies;

    return this.http.post(url, data)
      .pipe(
        map((resp: any) => resp.data || []),
        catchError(this.apiHelper.handleError)
      );
  }

  getAgencySettings(data) {
    const url = endpointConstants.agencySettings;

    return this.http.post(url, data)
      .pipe(
        map((resp: any) => resp.data),
        catchError(this.apiHelper.handleError)
      );
  }

  getOnlineAssistants({skip, limit, search_key, filter_status, location_name, merchant_id}) {
    const url = endpointConstants.onlineAssistants;

    let params = this.apiHelper.getQueryParams('skip', skip);
    params = this.apiHelper.getQueryParams('limit', limit, params);
    const data = {search_key, location_name, merchant_id};
    if (filter_status >= 0) {
      data['filter_status'] = filter_status;
    }
    return this.http.post(url, data, {params})
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  getAllAssistants({skip, limit, search_key, filter_status, location_name, merchant_id}) {
    const url = endpointConstants.allAssistants;

    let params = this.apiHelper.getQueryParams('skip', skip);
    params = this.apiHelper.getQueryParams('limit', limit, params);
    const data = {search_key, location_name, merchant_id};
    if (filter_status >= 0) {
      data['filter_status'] = filter_status;
    }
    return this.http.post(url, data, {params})
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  getAssistantInfo(assistantId) {
    const url = endpointConstants.assistantInfo.replace(':id', assistantId);

    return this.http.get(url)
      .pipe(
        map((resp: any) => resp.data),
        catchError(this.apiHelper.handleError)
      );
  }

  getOnlineAssistantInfo(assistantId, orderId) {
    const url = endpointConstants.onlineAssistantInfo.replace(':a_id', assistantId).replace(':o_id', orderId);

    return this.http.get(url)
      .pipe(
        map((resp: any) => resp.data),
        catchError(this.apiHelper.handleError)
      );
  }

  updateAssistantStatus(queryObj) {
    const url = endpointConstants.updateAssistantStatus;

    return this.http.post(url, queryObj)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  saveAgencySettings(data) {
    const url = endpointConstants.saveAgencySettings;

    return this.http.post(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  /************************ Dashboard Settings *************************/
  getCategoryCartTypes() {
    const url = endpointConstants.stServiceTypes;

    return this.http.get<any>(url)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  getServiceTypes() {
    const url = endpointConstants.stFrameTypes;

    return this.http.get<any>(url)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  getCategorySettings(categoryId) {
    const url = endpointConstants.stViewCategorySettings
      .replace(':categoryId', categoryId);

    return this.http.get<any>(url)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  getCategorySettingTooltips(categoryId) {
    const url = endpointConstants.stViewCategorySettingsTooltips
      .replace(':categoryId', categoryId);

    return this.http.get<any>(url)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  updateCategorySetting(categoryId, data, type) {
    const url = endpointConstants.stUpdateCategorySettings.replace(':categoryId', categoryId);
    const params = this.apiHelper.getQueryParams('type', type);

    return this.http.post(url, data, {params})
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  /************************ Admin Settings *************************/
  getCommonChargesSettings() {
    const url = endpointConstants.stViewCommonChargesSettings;

    return this.http.get(url)
      .pipe(
        pluck('data'),
        catchError(this.apiHelper.handleError)
      );
  }

  updateCommonChargesSettings(data) {
    const url = endpointConstants.stUpdateCommonChargesSettings;

    return this.http.post(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  /************************ Finance *************************/
  getWithdrawRequests({location = '', status = null, name = '', skip = 0, limit = 10}: {
    location: string,
    status: any[],
    name: string,
    skip: number,
    limit: number
  }) {
    const url = endpointConstants.financeViewWithdrawRequests;
    let params = this.apiHelper.getQueryParams('location', location);
    params = this.apiHelper.getQueryParams('status', status, params);
    params = this.apiHelper.getQueryParams('name', name, params);
    params = this.apiHelper.getQueryParams('skip', skip, params);
    params = this.apiHelper.getQueryParams('limit', limit, params);

    return this.http.get<any>(url, {params})
      .pipe(
        pluck('data'),
        catchError(this.apiHelper.handleError),
      );
  }

  getRemittance(queryObj) {
    const url = endpointConstants.financeGetRemittance;

    return this.http.post<any>(url, queryObj)
        .pipe(
            pluck('data'),
            catchError(this.apiHelper.handleError),
        );
  }

  getRemittanceInfo(queryObj) {
    const url = endpointConstants.financeGetRemittanceInfo;

    return this.http.post<any>(url, queryObj)
        .pipe(
            pluck('data'),
            catchError(this.apiHelper.handleError),
        );
  }

  updateRemittance(queryObj) {
    const url = endpointConstants.financeUpdateRemittance;

    return this.http.post<any>(url, queryObj)
        .pipe(
            pluck('data'),
            catchError(this.apiHelper.handleError),
        );
  }

  getCodHistory(queryObj) {
    const url = endpointConstants.financeGetCodHistory;

    return this.http.post<any>(url, queryObj)
        .pipe(
            pluck('data'),
            catchError(this.apiHelper.handleError),
        );
  }

  getFinanceLocationsList() {
    const url = endpointConstants.financeGetLocationsList;

    return this.http.get<any>(url)
      .pipe(
        pluck('locations'),
        catchError(this.apiHelper.handleError)
      );
  }

  makeFinanceTransferRequest(data) {
    const url = endpointConstants.financeTransferRequest;

    return this.http.post(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  makeFinanceRejectRequest(data) {
    const url = endpointConstants.financeRejectRequest;

    return this.http.post(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  getManageOffersSettings() {
    const url = endpointConstants.financeViewManageOffersSettings;

    return this.http.post(url, {})
      .pipe(
        pluck('data'),
        catchError(this.apiHelper.handleError)
      );
  }

  updateManageOffersSettings(data) {
    const url = endpointConstants.financeUpdateManageOffersSettings;

    return this.http.post(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  /************************ Promotion Promo Code *************************/
  generatePromoCode() {
    const url = endpointConstants.generatePromoCode;
    return this.http.get(url)
      .pipe(
        pluck('data'),
        catchError(this.apiHelper.handleError)
      );
  }

  getPromoCodeDropdownValues() {
    const url = endpointConstants.promoCodeDropdownValues;
    return this.http.get(url)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  checkPromoCodeExistence(promo_code) {
    const url = endpointConstants.promoCodeExists;
    return this.http.post(url, {promo_code})
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  createPromoCode(data) {
    const url = endpointConstants.createPromoCode;
    return this.http.post(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  editPromoCode(data) {
    const url = endpointConstants.editPromoCode;
    return this.http.post(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  togglePromoCodeActivation(data) {
    const url = endpointConstants.promoCodeToggleActivation;
    return this.http.post(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  getPromoCodeDetails(data) {
    const url = endpointConstants.viewPromoCode;
    return this.http.post(url, data)
      .pipe(
        pluck('data'),
        catchError(this.apiHelper.handleError)
      );
  }

  getPromoCodesList({searchtxt = '', location = '', status = null, skip = 0, limit = 10}: {
    searchtxt: string,
    location: string,
    status: number,
    skip: number,
    limit: number
  }) {
    const url = endpointConstants.promoCodesList;
    let params = this.apiHelper.getQueryParams('location', location);
    params = this.apiHelper.getQueryParams('searchtxt', searchtxt, params);
    params = this.apiHelper.getQueryParams('status', status, params);
    params = this.apiHelper.getQueryParams('skip', skip, params);
    params = this.apiHelper.getQueryParams('limit', limit, params);

    return this.http.get(url, {params})
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }


  /************************ Promotion Broadcast *************************/
  getPromotionList({location = '', status = null, skip = 0, limit = 10}: {
    location: string,
    status: number,
    skip: number,
    limit: number
  }) {
    const url = endpointConstants.promotionRequestList;
    let params = this.apiHelper.getQueryParams('location', location);
    params = this.apiHelper.getQueryParams('status', status, params);
    params = this.apiHelper.getQueryParams('skip', skip, params);
    params = this.apiHelper.getQueryParams('limit', limit, params);

    return this.http.get(url, {params})
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  viewPromotionRequest(data) {
    const url = endpointConstants.promotionRequestView;

    return this.http.post(url, data)
      .pipe(
        pluck('data'),
        catchError(this.apiHelper.handleError)
      );
  }

  approvePromotionRequest(data) {
    const url = endpointConstants.promotionRequestApprove;

    return this.http.post(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  rejectPromotionRequest(data) {
    const url = endpointConstants.promotionRequestReject;

    return this.http.post(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  promotionSendTestSMS(data) {
    const url = endpointConstants.promotionSendTestSMS;

    return this.http.post(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  promotionSendTestPush(data) {
    const url = endpointConstants.promotionSendTestPush;

    return this.http.post(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  promotionSendTestEmail(data) {
    const url = endpointConstants.promotionSendTestEmail;

    return this.http.post(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  promotionSendPrevEmail(data) {
    const url = endpointConstants.promotionSendPrevEmail;

    return this.http.post(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  /************************ Promotion Sponsor Ads *************************/
  configureScardSettings(data) {
    const url = endpointConstants.scardSettings;

    return this.http.post(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  configureScardMoney(data) {
    const url = endpointConstants.scardMoneyReward;

    return this.http.post(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  configureScardOffer(data) {
    const url = endpointConstants.scardOfferReward;

    return this.http.post(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  getMerchantsAdsList({location_id = '', status = null, skip = 0, limit = 10}: {
    location_id: string,
    status: number,
    skip: number,
    limit: number
  }) {
    const url = endpointConstants.merchantsAdsList;
    const data = {status, skip, limit};

    if (location_id) {
      data['location_id'] = location_id;
    }

    return this.http.post(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  updateMerchantsAdsUpdateText(data) {
    const url = endpointConstants.merchantsAdsUpdateText;

    return this.http.post(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  updateMerchantsAdsUpdateBanner(data) {
    const url = endpointConstants.merchantsAdsUpdateBanner;

    return this.http.post(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  deactivateMerchantsAds(data) {
    const url = endpointConstants.merchantsAdsDeactivate;

    return this.http.post(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  searchAdsStoreList(data) {
    const url = endpointConstants.merchantsAdsStoreList;

    return this.http.post(url, data)
      .pipe(
        map((resp: any) => resp.data || []),
        catchError(this.apiHelper.handleError)
      );
  }

  viewMerchantsAds(id) {
    const url = endpointConstants.viewMerchantsAds;
    const params = this.apiHelper.getQueryParams('ad_id', id);

    return this.http.get(url, {params})
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  getPromotionAnnouncementCustomerCount(data) {
    const url = endpointConstants.promotionAnnouncementCustomerCount;
    return this.http.post(url, data)
      .pipe(
        pluck('count'),
        catchError(this.apiHelper.handleError)
      );
  }

  sendAnnouncementSMS(data) {
    const url = endpointConstants.promotionAnnouncementSendSMS;

    return this.http.post(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  sendAnnouncementPush(data) {
    const url = endpointConstants.promotionAnnouncementSendPush;

    return this.http.post(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  sendAnnouncementEmail(data) {
    const url = endpointConstants.promotionAnnouncementSendEmail;

    return this.http.post(url, data)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  /************************ Orders Dashboard *************************/

  getOrderStatus(body) {
    const url = endpointConstants.orderStatus;
    return this.http.post(url, body)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  getCustomerStatus(body) {
    const url = endpointConstants.customerStatus;
    return this.http.post(url, body)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  getTopOrderLocations(body) {
    const url = endpointConstants.topOrderLocations;
    return this.http.post(url, {...body, country: "India"})
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  getGraphData(body) {
    const url = endpointConstants.graphData;
    return this.http.post(url, body)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }


  /************************ Common *************************/
  getPublicCategoryList() {
    const url = endpointConstants.publicCategoryList;
    return this.http.get(url)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  /************************ Subscriptions List *************************/
  getSubscriptions({search_key, location_name, category_id, filter, subscription_type, store_id, skip, limit, status, filter_date}): Observable<any> {
    let url = endpointConstants.subList;
    url = `${url}?skip=${skip}&limit=${limit}`;
    const body = {
      status,
      category_id,
      location_name,
      subscription_type
    };
    if (filter_date) {
      body['filter_date'] = filter_date;
    }
    if (store_id) {
      body['store_id'] = store_id;
    }
    if (search_key && search_key.toString().length > 0) {
      body['search_key'] = search_key;
    }
    return this.http.post<any>(url, body, {})
        .pipe(
            catchError(this.apiHelper.handleError)
        );
  }

  public getSubscriptionsCount({search_key, location_name, category_id, filter, subscription_type, store_id, status, filter_date}): Observable<any> {
    const url = endpointConstants.subCount;
    const body = {
      status,
      category_id,
      location_name,
      subscription_type,
    };
    if (filter_date) {
      body['filter_date'] = filter_date;
    }
    if (store_id) {
      body['store_id'] = store_id;
    }
    if (search_key && search_key.toString().length > 0) {
      body['search_key'] = search_key;
    }
    return this.http.post<any>(url, body, {})
        .pipe(
            map(resp => resp.count),
            catchError(this.apiHelper.handleError)
        );
  }

  getSubscriptionList() {
    const url = endpointConstants.subTypeList;
    return this.http.get(url)
        .pipe(
            catchError(this.apiHelper.handleError)
        );
  }

  public getSubscriptionsInfo(id): Observable<any> {
    const url = endpointConstants.subscriptionsInfo.replace(':r_id', id);
    const body = {
      _id: id
    };
    return this.http.post<any>(url, body, {})
        .pipe(
            catchError(this.apiHelper.handleError)
        );
  };

  public subsActions(body) {
    const url = endpointConstants.pauseUnsubscribeSubs;
    return this.http.post<any>(url, body)
        .pipe(
            map(res => {
              res.status = body.flag;
              return res;
            }),
            catchError(this.apiHelper.handleError)
        );
  }

  public transferAmount(body) {
    const url = endpointConstants.transferAmount;
    return this.http.post<any>(url, body)
        .pipe(
            map(res => {
              res.transferedAmount = body.amount;
              return res;
            }),
            catchError(this.apiHelper.handleError)
        );
  }

  public editStartDate(body) {
    const url = endpointConstants.editStartDate;
    return this.http.post<any>(url, body)
        .pipe(
            map(res => {
              res.startDate = body.startDate;
              res.deliveryTime = body.deliveryTime;
              return res;
            }),
            catchError(this.apiHelper.handleError),
        );
  }

  public getSubsOrderHistory(body) {
    const url = endpointConstants.subsOrderHistory;
    return this.http.post<any>(url, body)
        .pipe(
            catchError(this.apiHelper.handleError),
        );
  }

  public getSubsRechargeLog(body) {
    const url = endpointConstants.subsRechargeLog;
    return this.http.post<any>(url, body)
        .pipe(
            catchError(this.apiHelper.handleError),
        );
  }

  public sendReminder(body) {
    const url = endpointConstants.subsSendReminder;
    return this.http.post<any>(url, body)
        .pipe(
            catchError(this.apiHelper.handleError),
        );
  }

  public getSubsSupportMessages(body) {
    const url = endpointConstants.subsSupportMessages;
    return this.http.post<any>(url, body)
        .pipe(
            map(resp => {
                  if (resp.data && resp.data.message) {
                    return resp.data.message;
                  }
                  return [];
                }
            ),
            catchError(this.apiHelper.handleError)
        );
  }

  public sendSubsSupportMessage(body) {
    const url = endpointConstants.subsSupportMessages;
    return this.http.post<any>(url, body)
        .pipe(
            catchError(this.apiHelper.handleError)
        );
  }

  /************************ Orders List *************************/

  getOrders({search_key, location_name, category_id, filter, order_type, store_id, skip, limit, status, filter_date}): Observable<any> {
    let url = endpointConstants.list;
    url = `${url}?skip=${skip}&limit=${limit}`;
    const body = {
      status,
      category_id,
      location_name,
      order_type,
      filter
    };
    if (filter_date) {
      body['filter_date'] = filter_date;
    }
    if (store_id) {
      body['store_id'] = store_id;
    }
    if (search_key && search_key.toString().length > 0) {
      body['search_key'] = search_key;
    }
    return this.http.post<any>(url, body, {})
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  public getOrdersCount({search_key, location_name, category_id, filter, order_type, store_id, status, filter_date}): Observable<any> {
    const url = endpointConstants.ordersCount;
    const body = {
      status,
      category_id,
      location_name,
      order_type,
      filter
    };
    if (filter_date) {
      body['filter_date'] = filter_date;
    }
    if (store_id) {
      body['store_id'] = store_id;
    }
    if (search_key && search_key.toString().length > 0) {
      body['search_key'] = search_key;
    }
    return this.http.post<any>(url, body, {})
      .pipe(
        map(resp => resp.count),
        catchError(this.apiHelper.handleError)
      );
  }

  public getAllOrdersCount(): Observable<any> {
    const url = endpointConstants.allOrdersCount;
    return this.http.get<any>(url)
      .pipe(
        map(resp => resp.data),
        catchError(this.apiHelper.handleError)
      );
  }

  public getOrderInfo(id): Observable<any> {
    const url = endpointConstants.orderInfo.replace(':r_id', id);
    return this.http.get<any>(url)
      .pipe(
        map(resp => resp.data),
        catchError(this.apiHelper.handleError)
      );
  };

  public getDeliveryAssistantInfo(id): Observable<any> {
    const url = endpointConstants.deliveryAssistantInfo.replace(':u_id', id);
    return this.http.get<any>(url)
      .pipe(
        map(resp => resp.data),
        catchError(this.apiHelper.handleError)
      );
  };

  public getOrderContactInfo(id): Observable<any> {
    const url = endpointConstants.orderContactInfo.replace(':r_id', id);
    return this.http.get<any>(url)
      .pipe(
        map(resp => resp.data),
        catchError(this.apiHelper.handleError)
      );
  };

  public cancelOrder(body) {
    const url = endpointConstants.cancelOrder;
    return this.http.post<any>(url, body)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  public dispatchOrder(body) {
    const url = endpointConstants.dispatchOrder;
    return this.http.post<any>(url, body)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  public shipOrder(body) {
    const url = endpointConstants.shipOrder;
    return this.http.post<any>(url, body)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  public acceptOrder(body) {
    const url = endpointConstants.acceptOrder;
    return this.http.post<any>(url, body)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  public updateDeliveryTime(body) {
    const url = endpointConstants.updateDeliveryTime;
    return this.http.post<any>(url, body)
      .pipe(
        map(resp => body),
        catchError(this.apiHelper.handleError)
      );
  }

  public getSupportMessages(body) {
    const url = endpointConstants.supportMessages;
    return this.http.post<any>(url, body)
      .pipe(
        map(resp => {
            if (resp.data && resp.data.message) {
              return resp.data.message;
            }
            return [];
          }
        ),
        catchError(this.apiHelper.handleError)
      );
  }

  public sendSupportMessage(body) {
    const url = endpointConstants.supportMessages;
    return this.http.post<any>(url, body)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  public deliverOrder(body) {
    const url = endpointConstants.deliverOrder;
    return this.http.post<any>(url, body)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  public getProductReplacementChat(body) {
    const url = endpointConstants.productReplacementChat;
    return this.http.post<any>(url, body)
      .pipe(
        map(resp => resp.data),
        catchError(this.apiHelper.handleError)
      );
  }

  public resolveReplacement(body) {
    const url = endpointConstants.resolveReplacement;
    return this.http.post<any>(url, body)
      .pipe(
        catchError(this.apiHelper.handleError)
      );
  }

  public getAvailableDeliveryAssociates(order_id, maxDistance) {
    const url = endpointConstants.availableDeliveryAssociates;
    return this.http.post<any>(url, {order_id, maxDistance})
      .pipe(
        map(resp => resp.data),
        catchError(this.apiHelper.handleError)
      );
  }

  public assignDeliveryBoy(order_id, assistant_id) {
    const url = endpointConstants.assignToAssociate;
    return this.http.post<any>(url, {order_id, assistant_id})
      .pipe(
        map(resp => resp.data),
        catchError(this.apiHelper.handleError)
      );
  }
}
