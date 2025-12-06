import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '@app/pages/admin/users/user/user.service';
import { UsersPermissionsConstants } from '@app/pages/admin/users/users-permissions.constants';
import { AppState, getActiveUser, getActiveUserId, getUserPageType } from '@app/store/root-reducer';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { zip } from 'rxjs/observable/zip';
import { concatMap } from 'rxjs/operators/concatMap';
import { take } from 'rxjs/operators/take';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { skipWhile } from 'rxjs/operators/skipWhile';
import { tap } from 'rxjs/operators/tap';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'pkz-user-locations',
  templateUrl: 'user-locations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserLocationsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  countrySubject$: BehaviorSubject<any> = new BehaviorSubject<any>('');
  countries$: Observable<any>;
  states: any[];
  selectedStates: any[] = [];
  cities: any[];
  selectedCities: any[] = [];
  origLocationData;
  pageType: string;
  userId: string;
  perms = UsersPermissionsConstants;

  constructor(
    private userService: UserService,
    private store: Store<AppState>,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.initBreadcrumb();

    zip(
      this.store.select(getActiveUserId),
      this.store.select(getUserPageType)
    )
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(([userId, page]) => {
          this.pageType = page;
          this.userId = userId;
        }),
      )
      .subscribe(() => {
        this.countries$ = this.userService.getUsersUserLocation(this.userId);
      });

    this.store.select(getActiveUser)
      .pipe(
        take(2),
        skipWhile(user => !user),
        tap((user) => this.initSelectedItems(user)),
        concatMap(() => this.countrySubject$),
        mergeMap((country) => this.getFilteredLocationsList(country)),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((data) => {
        this.origLocationData = data;
        this.states = this.getStates(this.origLocationData);
        this.cities = this.getCities(this.origLocationData);

        this.cd.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSelectStates(states) {
    this.selectedStates = states;
    this.cities = this.getCities(this.origLocationData);
  }

  onSelectCities(cities) {
    this.selectedCities = cities;
  }

  onSave() {
    const location = this.selectedCities.map(({_id}) => _id);

    this.userService.updateUser(this.userId, { location })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  onChangeCountry(country) {
    this.countrySubject$.next(country);
  }

  locationValueToName(loc) {
    return loc.split('_')
      .map(item => item.charAt(0).toUpperCase() + item.slice(1))
      .join(' ');
  }

  isViewPage() {
    return this.pageType === 'view';
  }

  private initSelectedItems(user) {
    const userLocations = (user && user.location || []);
    this.selectedStates = this.getStates(userLocations);
    this.selectedCities = this.getCities(userLocations);

    const selectedCountry = userLocations[0] ? userLocations[0].country : '';

    this.countrySubject$.next(selectedCountry);
  }

  private getCities(states) {
    if (!states || !states.length) {
      return [];
    }

    const stateValues = this.selectedStates.map(({value}) => value);
    const filteredCities = states.filter(state => stateValues.includes(state.state));

    if (!filteredCities.length) {
      return [];
    }

    return filteredCities.map(item => {
      return {
        name: this.locationValueToName(item.name),
        value: item.name,
        _id: item._id
      };
    });
  }

  private getStates(data, checked = false) {
    if (!data || !data.length) {
      return [];
    }

    const obj = {};
    const states = data.map(({state}) => state);

    for (const state of states) {
      obj[state] = null;
    }

    return Object.keys(obj)
      .filter(key => !!key)
      .map(value => ({
        name: this.locationValueToName(value),
        value,
        checked
      }));
  }

  private initBreadcrumb() {
    this.userService.dispatchBreadcrumb(false)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  private getFilteredLocationsList(country) {
    if (!country) {
      return of([]);
    }

    return this.userService.getUsersUserLocationFilter(this.userId, country);
  }

}
