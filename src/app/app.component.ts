import { Component } from '@angular/core';
import { SocketIOService } from './services/socket.io.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { GlobalService } from './services/global.service';
import { BLService } from './shared/bl.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'chatApp';
  public isUserRegister = false;
  public globalService: GlobalService;
  public username = '';
  public password = '';
  public cnfPassword = '';
  public usertype = 'doctor';

  constructor(private socketIOService: SocketIOService,
    private router: Router,
    private _serv: GlobalService,
    private blService: BLService) {
    this.router.navigate(['/']);
    this.globalService = _serv;
  }

  public RegisterUser() {
    if (this.username == '' || this.password == '' || this.cnfPassword == '') {
      alert("All Fields are mandatory!!")
      return;
    }
    if (this.password != this.cnfPassword) {
      alert("password not match!!");
      return;
    }
    this.SaveNewUser();
    this.ClosePopUp();
  }

  public ShowPopUp() {
    this.username = this.password = this.cnfPassword = '';
    this.usertype = 'doctor';

    this.isUserRegister = true;
  }

  public ClosePopUp() {
    this.isUserRegister = false;
  }

  public Logout() {
    this.socketIOService.RemoveUser();
    sessionStorage.clear();
    this._serv.isUserLoggedin = false;
    this.router.navigate(['/Login']);
  }

  private SaveNewUser() {
    var data = {
      UserName: this.username,
      Password: this.password,
      CreatedOn: new Date(),
      Role: this.usertype,
      IsActive: true
    };
    this.blService.RegisterNewUser(data)
      .subscribe(res => {
        if (res.Status == 'OK') {
          alert("User Registered");
        } else {
          alert("provided username '"+this.username + "' already used, Please try different!!");
          console.log(res.ErrorMessage);
        }
      }, err => { console.log(err); })
  }
}
