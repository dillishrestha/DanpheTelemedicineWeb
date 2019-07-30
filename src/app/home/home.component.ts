import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { SocketIOService } from '../services/socket.io.service';
import { GlobalService } from '../services/global.service';
import { BLService } from '../shared/bl.service';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    public loggedUserName;
    public isChat = false;
    public isVideoCall = false;
    public isAudioCall = false;
    public liveUserList = [];
    public callee: any;
    public callingInfo = { name: "", content: "", type: "" };
    public userContacts: any;
    public isAddContact = false;
    public userList: any;
    public contactListTodispaly = new Array<{ username: string, id: number, sessionid: string, live: boolean, busy: boolean }>();

    constructor(
        private router: Router,
        private changeDetector: ChangeDetectorRef,
        private socketIOService: SocketIOService,
        private globalService: GlobalService,
        private blService: BLService) {
        this.loggedUserName = sessionStorage.getItem("username");
        if (!this.loggedUserName) {
            this.globalService.isUserLoggedin = false;
            this.router.navigate(['/Login']);
        } else {
            this.globalService.isUserLoggedin = true;
            this.globalService.loggedUserInfo = JSON.parse(sessionStorage.getItem('loggeduser'));
            /**
             * after user login success
             * add user in socket.io for handling user events
             */
            this.AddUser();

            /**
             * Database calls
             */
            this.GetUserContacts();
        }
    }

    ngOnInit() {
        /**
         * Methods for handling socket event
         * below methods accepts data from socket
         * after emitting data below methods are invoked automatically
         */
        this.GetLiveUsers();
        this.OnVideoCallRequest();
        this.OnVideoCallAccepted();
        this.GetBusyUsers();
        this.OnVideoCallRejected();
        this.OnChatRequest();
    }

    AddUser() {
        this.socketIOService.SetUserName(this.loggedUserName)
            .subscribe(data => {
                if (data.username) {
                    //user added
                }
            })
    }
    GetLiveUsers() {
        this.socketIOService
            .GetConnectedUsers()
            .subscribe(data => {
                this.GotLiveUsers(data);
            });
    }
    GotLiveUsers(data) {
        var users = data.filter(a => a.username != this.loggedUserName);
        if (this.liveUserList.length > 0) {
            var count = 0;
            for (var i in users) {
                if (this.liveUserList.indexOf(data[i]) === -1) {
                    count++;
                }
            }
            if (count != this.liveUserList.length) {
                this.liveUserList = users;
                this.socketIOService.connectedusers = users;
                this.GetBusyUsers();
            }
        } else {
            this.socketIOService.connectedusers = users;
            this.liveUserList = users;
        }
        if (this.userContacts) {
            if (this.userContacts.length > 0) {
                for (let i = 0; i < this.userContacts.length; i++) {
                    var live = false;
                    var busy = false;
                    var sessionid = "";
                    if (this.liveUserList.length > 0) {
                        var liveusr = this.liveUserList.find(a => a.username == this.userContacts[i].ContactName);
                        if (liveusr.id) {
                            live = true;
                            sessionid = liveusr.id;
                            busy = liveusr.busy;
                        }
                    }
                    var usr = this.contactListTodispaly.find(a => a.username == this.userContacts[i].ContactName);
                    if (usr == undefined) {
                        this.contactListTodispaly.push({
                            username: this.userContacts[i].ContactName,
                            id: this.userContacts[i].ContactId,
                            sessionid: sessionid,
                            live: live,
                            busy: busy
                        });
                    } else {
                        usr.live = live;
                        usr.sessionid = sessionid;
                        usr.busy = busy;
                    }
                }
            }
        }
    }
    OnChatRequest() {
        this.socketIOService
            .OnChatRequest()
            .subscribe(data => {
                if (data) {
                    this.isChat = true;
                    this.globalService.caller = data;
                }
            });
    }

    Chat(callee) {
        this.isChat = true;
        var calee = this.liveUserList.find(a => a.username == callee.username);
        this.globalService.caller = calee.id;
        this.socketIOService.SendChatRequest(calee.id);
    }

    OnVideoCallRequest() {
        this.socketIOService
            .OnVideoCallRequest()
            .subscribe(data => {
                this.callingInfo.name = data.fromname;
                this.callingInfo.content = "Calling....";
                this.callingInfo.type = "receiver";
                this.isVideoCall = true;
            });
    }
    OnVideoCallAccepted() {
        this.socketIOService
            .OnVideoCallAccepted()
            .subscribe(data => {
                var calee = this.liveUserList.find(a => a.username == this.callingInfo.name);
                this.globalService.callType = 'dialer';
                this.globalService.caller = calee.id;
                this.router.navigate(['/Clinical']);
                this.socketIOService.BusyNow();
                this.Close();
            });
    }
    GetBusyUsers() {
        this.socketIOService
            .GetBusyUsers()
            .subscribe(data => {
                this.liveUserList.forEach(a => { a.busy = false; });
                data.forEach(a => {
                    var usr = this.liveUserList.find(b => b.username == a.username);
                    if (usr) {
                        usr.busy = true;
                    }
                });
            })
    }
    OnVideoCallRejected() {
        this.socketIOService
            .OnVideoCallRejected()
            .subscribe(data => {
                this.callingInfo.content = "Call Rejected ..";
                setTimeout(() => {
                    this.Close();
                }, 1000);
            });
    }
    VideoCall(callee) {
        //this.router.navigate(['/Clinical']);
        //return;
        var calee = this.liveUserList.find(a => a.username == callee.username);
        if (calee) {
            this.socketIOService.VideoCallRequest(this.loggedUserName, calee.id);
        }
        this.callee = callee;
        this.callingInfo.name = callee.username;
        this.callingInfo.content = "Dialing....";
        this.callingInfo.type = "dialer";
        this.isVideoCall = true;
    }

    AcceptVideoCall() {
        var calee = this.liveUserList.find(a => a.username == this.callingInfo.name);
        if (calee) {
            this.socketIOService.VideoCallAccepted(this.loggedUserName, calee.id);
            this.globalService.callType = 'receiver';
            this.globalService.caller = calee.id;
            this.router.navigate(['/Clinical']);
            this.socketIOService.BusyNow();
        }
        this.Close();
    }

    RejectVideoCall() {
        var calee = this.liveUserList.find(a => a.username == this.callingInfo.name);
        if (calee) {
            this.socketIOService.VideoCallRejected(this.loggedUserName, calee.id);
        }
        this.Close();
    }
    AudioCall() {
        this.isAudioCall = true;
    }

    CallBack(event) {
        this.isChat = false;
        this.isVideoCall = false;
        this.isAudioCall = false;
        this.changeDetector.detectChanges();
        location.reload();
    }

    Close() {
        this.isVideoCall = false;
        this.changeDetector.detectChanges();
    }

    ShowAddContact() {
        this.isAddContact = true;
    }
    CloseAddContact() {
        this.isAddContact = false;
    }
    /**
     * UI methods
     */
    SwitchTabContent(eleid) {
        var idlist = ['nav-contacts', 'nav-meeting'];

        idlist.forEach(id => {
            var tab = document.getElementById(id + '-tab');
            var tabcontent = document.getElementById(id);
            var tabclass = "btn btn-info custom-tabs nav-item nav-link";
            var tabcontentclass = "tab-pane fade show";
            if (id == eleid) {
                tabclass += " active";
                tabcontentclass += " active";
            }
            tab.className = tabclass;
            tabcontent.className = tabcontentclass;
        });
    }
    /**
     * Database methods
     */
    //get current user contacts
    public GetUserContacts() {
        try {
            this.blService.GetUserContacts(this.globalService.loggedUserInfo.UserId)
                .subscribe(res => {
                    if (res.Status == 'OK') {
                        this.userContacts = res.Results;
                    } else {
                        console.log(res.ErrorMessgae);
                    }
                });
        } catch (ex) {
            console.log(ex);
        }
    }
    //get all users for add contacts
    public GetUserList() {
        try {
            this.blService.GetUserList()
                .subscribe(res => {
                    if (res.Status == 'OK') {
                        this.userList = res.Results;
                    } else {
                        console.log(res.ErrorMessgae);
                    }
                })
        } catch (ex) {
            console.log(ex);
        }
    }
}
