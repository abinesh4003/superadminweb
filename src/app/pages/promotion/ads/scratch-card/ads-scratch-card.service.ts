import { Injectable } from '@angular/core';
import { ApiService } from '@app/core/services/api.service';
import { RewardModalComponent } from '@app/pages/promotion/ads/reward-modal/reward-modal.component';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { empty } from 'rxjs/observable/empty';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
import { mergeMap } from 'rxjs/operators/mergeMap';

@Injectable()
export class AdsScratchCardService {
  constructor(
    private api: ApiService,
    private modalService: ModalService
  ) {
  }

  getScardSettings() {
    return this.api.configureScardSettings({action: 1});
  }

  updateSettings(data) {
    return this.api.configureScardSettings({action: 2, ...data});
  }

  openMoneyRewardModal() {
    return this.api.configureScardMoney({action: 1})
      .pipe(
        mergeMap((resp) => {
          if (!resp || !resp.data) {
            return empty();
          }
          return this.modalService.open(RewardModalComponent, {
            title: 'Money Reward',
            data: {
              inputType: 'number',
              list: resp.data.random_array
            }
          });
        }),
        map(items => {
          return items.filter(val => {
            if (typeof val === 'number') {
              return true;
            }
            return !!val && !isNaN(Number(val));
          });
        }),
        mergeMap((num_array) => this.api.configureScardMoney({action: 2, num_array})),
        catchError(() => empty())
      );
  }

  openOfferCodeRewardModal() {
    return this.api.configureScardOffer({action: 1})
      .pipe(
        mergeMap((resp) => {
          if (!resp || !resp.data) {
            return empty();
          }
          return this.modalService.open(RewardModalComponent, {
            title: 'Offer Code Reward',
            data: {
              inputType: 'text',
              list: resp.data.random_offers_array
            }
          });
        }),
        map(items => items.filter(val => !!val)),
        mergeMap((offer_array) => this.api.configureScardOffer({action: 2, offer_array})),
        catchError(() => empty())
      );
  }
}
