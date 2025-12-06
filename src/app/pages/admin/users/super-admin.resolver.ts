import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { UsersService } from '@app/pages/admin/users/users.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SuperAdminResolver implements Resolve<Observable<boolean>> {
  constructor(
    private usersService: UsersService
  ) {}

  resolve() {
    return this.usersService.isLoggedUserSuperAdmin();
  }
}
