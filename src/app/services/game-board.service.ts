import {Injectable} from '@angular/core';
import PlayerType from "../enums/player-type";
import playerType from "../enums/player-type";
import {Observable, Subscriber} from "rxjs";

export interface SubscribeMessage {
  board: number,
  element: number
}

@Injectable({
  providedIn: 'root'
})
export class GameBoardService {
  private _myPlayer: PlayerType | null = null;
  private readonly _subscribe: Observable<SubscribeMessage>;
  private _subscribeEmit: Subscriber<SubscribeMessage> | null = null;
  private _currentPlayer: PlayerType = PlayerType.Circle;
  private _currentBoardIndex: number | null = null;
  private readonly _board: (PlayerType | null)[][] = [
    [
      null, null, null,
      null, null, null,
      null, null, null
    ],
    [
      null, null, null,
      null, null, null,
      null, null, null
    ],
    [
      null, null, null,
      null, null, null,
      null, null, null
    ],
    [
      null, null, null,
      null, null, null,
      null, null, null
    ],
    [
      null, null, null,
      null, null, null,
      null, null, null
    ],
    [
      null, null, null,
      null, null, null,
      null, null, null
    ],
    [
      null, null, null,
      null, null, null,
      null, null, null
    ],
    [
      null, null, null,
      null, null, null,
      null, null, null
    ],
    [
      null, null, null,
      null, null, null,
      null, null, null
    ],
  ];

  constructor() {
    this._subscribe = new Observable((sub) => {
      this._subscribeEmit = sub;
    })
  }

  private readonly _winBoard: (PlayerType | null)[] = [
    null, null, null,
    null, null, null,
    null, null, null
  ];

  public get currentBoardIndex(): number | null {
    return this._currentBoardIndex;
  }

  public set myPlayer(playerType: PlayerType) {
    this._myPlayer = playerType;
  }

  public get currentPlayer(): PlayerType {
    return this._currentPlayer;
  }

  private get nextPlayer(): PlayerType {
    return this._currentPlayer === PlayerType.Circle ? PlayerType.Cross : PlayerType.Circle;
  }

  private nextBoardIndex(playIndex: number): number | null {
    if(this._winBoard[playIndex] === null)
      return playIndex;
    return null
  }

  public getSubBoard(boardIndex: number): (PlayerType | null)[] {
    return this._board[boardIndex];
  }

  public get myPlayer(): PlayerType | null {
    return this._myPlayer;
  }

  public interactInBoard(boardIndex: number, elementIndex: number, remotePlayer: PlayerType | null = null): boolean {
    const player = remotePlayer ?? this._myPlayer;

    if(player !== this._currentPlayer) return false;

    if(this._winBoard[boardIndex] !== null) return false;
    if(this._currentBoardIndex !== null && this._currentBoardIndex !== boardIndex)
      return false;


    this._board[boardIndex][elementIndex] = this._currentPlayer;
    this._currentPlayer = this.nextPlayer;
    this._winBoard[boardIndex] = this.checkWin(boardIndex);

    this._currentBoardIndex = this.nextBoardIndex(elementIndex);

    this._subscribeEmit?.next({
      board: boardIndex,
      element: elementIndex
    });
    return true;
  }

  public get subscribe(): Observable<SubscribeMessage> {
    return this._subscribe;
  }

  private checkWin(boardIndex: number): PlayerType | null {
    const sub = this._board[boardIndex];
    for (let i = 0; i <= 6; i += 3) {
      if(sub[i] !== null && sub[i] === sub[i + 1] && sub[i] === sub[i + 2])
        return sub[i];
    }
    for(let i = 0; i <= 2; i++) {
      if(sub[i] !== null && sub[i] === sub[i + 3] && sub[i] === sub[i + 6])
        return sub[i];
    }
    if(sub[0] !== null && sub[0] === sub[4] && sub[0] === sub[8])
      return sub[0];
    if(sub[2] !== null && sub[2] === sub[4] && sub[2] === sub[6])
      return sub[2];

    if(sub.findIndex(x => x === null) === -1)
      return PlayerType.CrossCircle;

    return null;
  }

  public get winBoard(): (playerType | null)[] {
    return this._winBoard;
  }
}
