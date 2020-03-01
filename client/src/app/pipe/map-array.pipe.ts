import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mapArray'
})
export class MapArrayPipe implements PipeTransform {

  transform(value: any[], keyName): any[] {
    return value.map(val => val[keyName]);
  }

}
