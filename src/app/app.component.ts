import {APP_INITIALIZER, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {GameBoardService} from "./services/game-board.service";
import {GunService} from "./services/gun.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  providers: [GameBoardService, GunService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor() {
  }
}
