import {Component, OnInit} from '@angular/core';
import {TictacComponent} from "../tictac/tictac.component";
import {GameBoardService} from "../../services/game-board.service";
import {NgClass} from "@angular/common";
import PlayerType from "../../enums/player-type";
import {ElementFormatPipe} from "../../pipes/element-format.pipe";

@Component({
  selector: 'app-utimate-tictac',
  standalone: true,
  imports: [
    TictacComponent,
    NgClass,
    ElementFormatPipe
  ],
  templateUrl: './utimate-tictac.component.html',
  styleUrl: './utimate-tictac.component.css'
})
export class UtimateTictacComponent implements OnInit {
  protected boards: number[] = [...Array(9).keys()];
  private _playableBoard: number | null;
  protected winBoard: (PlayerType | null)[];


  constructor(private readonly _gameBoardService: GameBoardService) {
    this._playableBoard = _gameBoardService.currentBoardIndex;
    this.winBoard = _gameBoardService.winBoard;
  }

  ngOnInit(): void {
    this._gameBoardService.subscribe.subscribe({
      next: () => {
        this._playableBoard = this._gameBoardService.currentBoardIndex;
        this.winBoard = this._gameBoardService.winBoard;
      }
    })
  }

  protected isPlayableBoard(index: number): boolean {
    return this._playableBoard === null || this._playableBoard === index;
  }
}
