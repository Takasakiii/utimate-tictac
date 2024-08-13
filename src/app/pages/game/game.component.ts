import {Component, OnInit} from '@angular/core';
import {UtimateTictacComponent} from "../../components/utimate-tictac/utimate-tictac.component";
import {GunService, MessageType} from "../../services/gun.service";
import {Router} from "@angular/router";
import {CardModule} from "primeng/card";
import {GameBoardService} from "../../services/game-board.service";
import formatPlayerType from "../../utils/formatPlayerType";
import PlayerType from "../../enums/player-type";
import {ElementFormatPipe} from "../../pipes/element-format.pipe";

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    UtimateTictacComponent,
    CardModule,
    ElementFormatPipe
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit {
  protected gameStatus: string = 'Aguardando o outro jogador';
  protected canPlay: boolean = false;
  protected readonly playerElement: PlayerType | null = this._game.myPlayer;

  constructor(private readonly _gun: GunService,
              private readonly _router: Router,
              private readonly _game: GameBoardService) {
  }

  async ngOnInit(): Promise<void> {
    if(!this._gun.subscriber) {
      await this._router.navigate(['']);
      return;
    }

    this._gun.subscriber.subscribe({
      next: (value) => {
        if(value.messageType === MessageType.Join) {
          this.canPlay = true;
          this.gameStatus = `As ${formatPlayerType(this._game.currentPlayer)} começam`
          return;
        }

        const {player, position} = JSON.parse(value.data);

        this._game.interactInBoard(position.board, position.element, player);
        this.gameStatus = `Vez das ${formatPlayerType(this._game.currentPlayer)}`;
      }
    });
  }
}
