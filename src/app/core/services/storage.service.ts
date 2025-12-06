import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';

export const USER_DETAILS = 'user_details';
export const USER_SUPER_ADMIN = 'user_super_admin';
export const ROWS_PER_PAGE = 'rows_per_page';

@Injectable()
export class StorageService {

  constructor(
    private storage: LocalStorageService
  ) {}

  /***
   ** Logged user Super Admin
   */
  isLoggedUserSuperAdmin() {
    return this.get(USER_SUPER_ADMIN);
  }

  setLoggedUserSuperAdmin(data) {
    return this.set(USER_SUPER_ADMIN, data);
  }

  /***
   ** User Details
   */
  getUserDetails() {
    return this.get(USER_DETAILS);
  }

  observeUserDetails() {
    return this.observe(USER_DETAILS);
  }

  setUserDetails(data) {
    this.set(USER_DETAILS, data);
  }

  clearUserDetails() {
    this.clear(USER_DETAILS);
  }

  /***
   ** Rows per page
   */
  getRowsPerPage() {
    return this.get(ROWS_PER_PAGE);
  }

  setRowsPerPage(data) {
    this.set(ROWS_PER_PAGE, data);
  }

  observeRowsPerPage() {
    return this.observe(ROWS_PER_PAGE);
  }

  private get(key) {
    return this.storage.retrieve(key);
  }

  private observe(key) {
    return this.storage.observe(key);
  }

  private set(key, data) {
    this.storage.store(key, data);
  }

  private clear(key) {
    this.storage.clear(key);
  }
}
