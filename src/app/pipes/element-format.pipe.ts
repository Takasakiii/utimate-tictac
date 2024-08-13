import { Pipe, PipeTransform } from '@angular/core';
import PlayerType from "../enums/player-type";
import formatPlayerType from "../utils/formatPlayerType";

@Pipe({
  name: 'elementFormat',
  standalone: true
})
export class ElementFormatPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return formatPlayerType(value);
  }

}
