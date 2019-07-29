import { Component } from '@angular/core';
import { SocketIOService } from './services/socket.io.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { GlobalService } from './services/global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chatApp';
  public globalService: GlobalService;

  constructor(private socketIOService: SocketIOService,
    private router: Router,
    private _serv: GlobalService) {
    this.router.navigate(['/']);
    this.globalService = _serv;
  }
  Logout() {
    this.socketIOService.RemoveUser();
    sessionStorage.clear();
    this._serv.isUserLoggedin = false;
    this.router.navigate(['/Login']);
  }
}
