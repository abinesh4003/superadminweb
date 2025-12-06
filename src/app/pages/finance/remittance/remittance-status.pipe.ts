import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'remittanceStatus'
})
export class RemittanceStatusPipe implements PipeTransform {

  transform(value: number, statusTypes: {id: number, name: string}[]): string {
    return statusTypes.find(status => status.id === value).name;
  }

}
