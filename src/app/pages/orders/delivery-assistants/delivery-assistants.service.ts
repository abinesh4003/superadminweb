import {Injectable} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PagesService} from "@app/pages/pages.service";
import {ConstantsService} from "@app/core/services/constants.service";
import {catchError} from "rxjs/operators/catchError";
import {of} from "rxjs/observable/of";
import {ApiService} from "@app/core/services/api.service";
import {Observable, Subject} from "rxjs";
import {ProductExpiryDetailsModalComponent} from "@app/pages/orders/product-expiry-details-modal/product-expiry-details-modal.component";
import {mergeMap} from "rxjs/operators/mergeMap";
import {ModalService} from "@app/shared/components/modal/modal.service";
import {RejectAssistantModalComponent} from "@app/pages/orders/delivery-assistants/reject-assistant-modal/reject-assistant-modal.component";
import {
  ALL_DELIVERY_ASSISTANTS,
  ONLINE_DELIVERY_ASSISTANTS
} from "@app/core/constants";
import {
  DeliveryAssistantsAllPermissionsConstants,
  DeliveryAssistantsOnlinePermissionsConstants
} from "@app/pages/orders/orders-permissions.constants";

@Injectable()
export class DeliveryAssistantsService {

  constructor(private pagesService: PagesService,
              private api: ApiService,
              private modalService: ModalService,
              private constantsService: ConstantsService) {
  }


  getTabs(route: ActivatedRoute) {
    const url = this.pagesService.getComponentRoute(route);

    const tabsData = this.constantsService
      .getListByKey('delivery_assistants_tabs')
      .map((tab) => {
        let permissions;

        switch (tab.id) {
          case ONLINE_DELIVERY_ASSISTANTS:
            permissions = DeliveryAssistantsOnlinePermissionsConstants;
            break;
          case ALL_DELIVERY_ASSISTANTS:
            permissions = DeliveryAssistantsAllPermissionsConstants;
            break;
        }

        return {
          title: tab.name,
          route: tab.id,
          skip: !this.pagesService.hasPermissions(permissions.PATH)
        };
      })
      .filter(item => !item.skip);

    return this.pagesService.getRoutedTabsData(tabsData, url);
  }

  getInitFiltersData() {
    return {
      location: 'All',
      searchtxt: '',
      filter: -1,
      merchant: ''
    }
  }

  getFiltersObj(filtersObj) {
    const {location, searchtxt, filter, merchant} = filtersObj;

    const obj = {
      filter_status: filter,
      location_name: location
    };
    if (searchtxt) {
      obj['search_key'] = searchtxt;
    }
    if (merchant) {
      obj['merchant_id'] = merchant;
    }
    return obj;
  }

  searchAgencies(search_key) {
    return this.api.searchAgencies({search_key})
      .pipe(
        catchError(() => of([]))
      );
  };

  getOnlineAssistants(queryObj) {
    return this.api.getOnlineAssistants(queryObj);
  }

  getAllAssistants(queryObj) {
    return this.api.getAllAssistants(queryObj);
  }


  getAssistantInfo(assistantId) {
    return this.api.getAssistantInfo(assistantId);
  }

  getOnlineAssistantInfo(assistantId, orderId) {
    return this.api.getOnlineAssistantInfo(assistantId, orderId);
  }

  updateAssistantStatus(queryObj) {
    return this.api.updateAssistantStatus(queryObj);
  }

  public openRejectAssistantModal(status) {
    return this.modalService.open(RejectAssistantModalComponent, {data: {status}}).pipe(
      mergeMap(message => {
        return of(message);
      })
    );
  }
}
