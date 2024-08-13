import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameBoardService} from "../../services/game-board.service";
import PlayerType from "../../enums/player-type";
import {ElementFormatPipe} from "../../pipes/element-format.pipe";
import {GunService, MessageType} from "../../services/gun.service";

@Component({
  selector: 'app-tictac',
  standalone: true,
  imports: [
    ElementFormatPipe
  ],
  templateUrl: './tictac.component.html',
  styleUrl: './tictac.component.css',
})
export class TictacComponent implements OnInit {
  protected elements: (PlayerType | null)[] = [];


  @Input({required: true}) public index!: number;

  constructor(private readonly _gameBoardService: GameBoardService, private readonly _gunService: GunService) {
  }

  ngOnInit(): void {
    this.elements = this._gameBoardService.getSubBoard(this.index);
  }

  protected async handlePlayClick(index: number): Promise<void> {
    if (!this._gameBoardService.interactInBoard(this.index, index))
      return;
    await this._gunService.sendEvent({
      messageType: MessageType.Play,
      data: JSON.stringify({
        player: this._gameBoardService.myPlayer,
        position: {
          board: this.index,
          element: index
        }
      })
    })
    this.elements = this._gameBoardService.getSubBoard(this.index);
  }
}
