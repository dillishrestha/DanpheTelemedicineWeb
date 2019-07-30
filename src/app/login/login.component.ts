import { Component, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
import { SocketIOService } from '../services/socket.io.service';
import { Router } from '@angular/router';
import { GlobalService } from '../services/global.service';
import { BLService } from '../shared/bl.service';

@Component({
    templateUrl: './login.component.html'
})
export class LoginComponent {
    public uname = '';
    public password = '';
    public isUserLogged = false;

    constructor(private socketIOService: SocketIOService,
        private router: Router,
        private globalService: GlobalService,
        private changeDetector: ChangeDetectorRef,
        private blService: BLService) {
    }

    Login() {
        //checking username and password
        if (this.uname === "" || this.password === "") {
            alert("Provide username or password");
            return;
        }
        //getting and checking valid user 
        this.GetLoginUser();
    }


    private GetLoginUser() {
        try {
            this.blService.GetLoginUser(this.uname, this.password)
                .subscribe(res => {;
                    if (res.Status == 'OK') {
                        var data = res.Results;
                        if (data) {
                            this.globalService.loggedUserInfo = data;
                            sessionStorage.setItem("loggeduser",JSON.stringify(data));
                            sessionStorage.setItem('username', this.uname);
                            this.isUserLogged = true;
                            this.globalService.isUserLoggedin = true;
                            this.changeDetector.detectChanges();
                            this.router.navigate(['/']);
                        }else{
                            alert("Invalid Crediantials!!");
                        }
                    }
                    else {
                        alert("Invalid Crediantials!!");
                    }
                });
        } catch (ex) {
            console.log(ex);
        }
    }
}
