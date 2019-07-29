import { Component, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
import { SocketIOService } from '../services/socket.io.service';
import { Router } from '@angular/router';
import { GlobalService } from '../services/global.service';

@Component({
    templateUrl: './login.component.html'
})
export class LoginComponent {
    public uname = '';
    public isUserLogged = false;

    constructor(private socketIOService: SocketIOService,
        private router: Router,
        private globalService: GlobalService,
        private changeDetector: ChangeDetectorRef) {
    }

    Login() {
        if (this.uname != '') {
            sessionStorage.setItem('username', this.uname);
            this.isUserLogged = true;
            this.globalService.isUserLoggedin = true;
            this.changeDetector.detectChanges();
            this.router.navigate(['/']);
        }
    }
}
