import {Injectable} from '@angular/core';
import Gun, {IGunInstance, ISEA} from "gun";
import * as Cuid from '@paralleldrive/cuid2';
import {Observable} from "rxjs";
import 'gun/sea';

export enum MessageType {
  Join,
  Play
}

export interface GameMessage {
  messageType: MessageType,
  data: string,
}

@Injectable({
  providedIn: 'root'
})
export class GunService {
  private _boardPassword: string | null = null;
  private _boardName: string | null = null;
  private _subscribe: Observable<GameMessage> | null = null;
  private readonly _gun?: IGunInstance;
  private readonly _sea?: ISEA;

  constructor() {
    if (typeof window !== 'undefined') {
      this._gun = Gun([
        'https://gun-manhattan.herokuapp.com/gun',
        'https://gun.1998.social/gun',
        'https://peer.wallie.io/gun',
        'https://relay.peer.ooo/gun',
      ]);

      this._sea = Gun.SEA;
    }
  }

  public createGameBoard(password: string): string {
    this._boardPassword = password;
    this._boardName = `uttt-${Cuid.createId()}`;

    this.handleSubscribeRoom();

    return this._boardName;
  }

  private handleSubscribeRoom(): void {
    this._subscribe = new Observable<GameMessage>((sub) => {
      this._gun?.get(this._boardName!).on(async (value) => {
        if (!this._boardPassword) return;
        const content = await this._sea?.decrypt(value.message, this._boardPassword);
        sub.next(content);
      });
    })
  }

  public async enterGameBoard(boardName: string, password: string): Promise<void> {
    this._boardPassword = password;
    this._boardName = boardName;
    await this.sendEvent({
      messageType: MessageType.Join,
      data: ''
    });

    this.handleSubscribeRoom();
  }

  public async sendEvent(message: GameMessage): Promise<void> {
    if (!this._boardName || !this._boardPassword) return;
    const encMessage = await this._sea?.encrypt(message, this._boardPassword);
    this._gun?.get(this._boardName).put({
      message: encMessage
    });
  }

  public get subscriber(): Observable<GameMessage> | null {
    return this._subscribe;
  }


}
