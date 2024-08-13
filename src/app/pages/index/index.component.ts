import {Component} from '@angular/core';
import {GunService} from "../../services/gun.service";
import {CardModule} from "primeng/card";
import {SelectButtonModule} from "primeng/selectbutton";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {Button} from "primeng/button";
import {Router} from "@angular/router";
import {GameBoardService} from "../../services/game-board.service";
import PlayerType from "../../enums/player-type";

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [
    CardModule,
    SelectButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    Button
  ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {
  protected readonly form: FormGroup = new FormGroup({
    connectionType: new FormControl('1'),
    password: new FormControl(''),
    room: new FormControl(''),
  });

  protected readonly connectionTypes: Record<string, string>[] = [
    {value: '1', label: 'Entrar na sala'},
    {value: '2', label: 'Criar sala'}
  ];

  constructor(private readonly _gun: GunService,
              private readonly _router: Router,
              private readonly _game: GameBoardService) {
  }

  protected async handleFormSubmit(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    const {connectionType, password, room} = this.form.value;
    if(connectionType === '1') {
      this._game.myPlayer = PlayerType.Circle;
      await this._gun.enterGameBoard(room, password);
      await this._router.navigate(['game']);
      return;
    }

    this._game.myPlayer = PlayerType.Cross;
    const boardName = this._gun.createGameBoard(password);
    alert(`Envie para seus amigos: ${boardName}`);
    await this._router.navigate(['game']);
  }

  protected get disableSubmit(): boolean {
    const controls = this.form.controls;
    const connType = controls['connectionType'].value;
    return !((connType === '1' && controls['password'].value && controls['room'].value) ||
      (connType === '2' && controls['password'].value));
  }

}
