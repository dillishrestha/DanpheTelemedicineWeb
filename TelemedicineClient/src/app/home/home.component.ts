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
    public isAudioCallAccepted = false;
    public liveUserList = [];
    public callee: any;
    public callingInfo = { name: "", content: "", type: "" };
    public userContacts: any;
    public isAddContact = false;
    public userList: any;
    public contactListTodispaly = new Array<{
        username: string,
        id: number,
        sessionid: string,
        live: boolean,
        busy: boolean
    }>();
    public messages = new Array<{
        Message: string,
        Type: string,
        Sender: string,
        Date: string
    }>();
    public isShowChat = false;
    public caller: any;
    public callDetails: any;
    public userType: any;
    public isBusy = false;

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
        this.OnChatEnded();

        this.OnAudioCallRequest();
        this.OnAudioCallAccepted();
        this.OnAudioCallRejected();
    }

    /*****************************************************************
     * Section Common
     *****************************************************************/
    //Add User in socket
    private AddUser() {
        this.socketIOService.SetUserName(this.loggedUserName)
            .subscribe(data => {
                if (data.username) {
                    //user added
                }
            })
    }

    // When user added in socket get it in live user list
    private GetLiveUsers() {
        this.socketIOService
            .GetConnectedUsers()
            .subscribe(data => {
                this.GotLiveUsers(data);
            });
    }
    //handling busy users and contact list to display
    private GotLiveUsers(data) {
        var users = data.filter(a => a.username != this.loggedUserName);
        //below if for handling busy users
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
        this.ShowContacts();
        var calldata = JSON.parse(sessionStorage.getItem("callinginfo"));
        if (calldata) {
            //this.router.navigate(['/Clinical']);
        }
    }
    private ShowContacts() {
        try {
            //below if for handling user list to display on ui
            if (this.userContacts) {
                if (this.userContacts.length > 0) {
                    for (let i = 0; i < this.userContacts.length; i++) {
                        var live = false;
                        var busy = false;
                        var sessionid = "";
                        //checking live user is in current user contact list 
                        //if yes then show video call button
                        if (this.liveUserList.length > 0) {
                            var liveusr = this.liveUserList.find(a => a.username == this.userContacts[i].ContactName);
                            if (liveusr.id) {
                                live = true;
                                sessionid = liveusr.id;
                                busy = liveusr.busy;
                            }
                        }
                        var usr = this.contactListTodispaly.find(a => a.username == this.userContacts[i].ContactName);
                        //if contact user is not in display data then add it
                        //else update his status
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
        } catch (ex) {
            console.log(ex);
        }
    }

    //when user set to busy detect it as busy
    private GetBusyUsers() {
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

    //show add contact popup
    public ShowAddContact() {
        this.isAddContact = true;
    }
    //close add contact popup
    public CloseAddContact() {
        this.isAddContact = false;
    }

    /*****************************************************************
     * Section Chat
     *****************************************************************/
    //currently showing only chat history on home page
    //there is hidden button for chat on home page without making call
    //if required then need to do proper ui for that 
    private OnChatRequest() {
        this.socketIOService
            .OnChatRequest()
            .subscribe(data => {
                if (data) {
                    this.isChat = true;
                    sessionStorage.setItem("callinginfo", JSON.stringify({ userType: '', caller: data }));
                    this.caller = data;
                }
            });
    }

    public Chat(callee) {
        this.isChat = true;
        var calee = this.liveUserList.find(a => a.username == callee.username);
        sessionStorage.setItem("callinginfo", JSON.stringify({ userType: '', caller: calee.id }));
        this.caller = calee.id;
        this.socketIOService.SendChatRequest(calee.id);
    }

    //get and show old messages
    public LoadOldChat(row) {
        this.isShowChat = true;
        this.GetOldChat(row.id);
    }
    //hide message in ui
    public CloseChat() {
        this.isShowChat = false;
    }
    //
    CloseMessaging(){
        this.isChat = false;
        this.socketIOService.ChatEnded(this.caller);
    }
    private OnChatEnded() {
        this.socketIOService
            .OnChatEnded()
            .subscribe(data => {
                if (data) {
                    this.isChat = false;
                }
            });
    }
    /*****************************************************************
     * Section Video
     *****************************************************************/
    //after receiving video call request show video call popup with accept or reject button
    private OnVideoCallRequest() {
        this.socketIOService
            .OnVideoCallRequest()
            .subscribe(data => {
                this.callingInfo.name = data.fromname;
                this.callingInfo.content = "Calling....";
                this.callingInfo.type = "receiver";
                this.globalService.sessionid = data.sessionid;
                this.globalService.sessionUserDbId = data.userid;
                this.isVideoCall = true;
            });
    }
    //after video call accepted by other user add to busy user and navigate to clinical page
    //clinical page includes video call as well as chat
    private OnVideoCallAccepted() {
        this.socketIOService
            .OnVideoCallAccepted()
            .subscribe(data => {
                var calee = this.liveUserList.find(a => a.username == this.callingInfo.name);
                sessionStorage.setItem("callinginfo", JSON.stringify({ userType: 'dialer', caller: calee.id }));
                this.globalService.sessionid = data.sessionid;
                this.globalService.sessionUserDbId = data.userid;
                //save session info to db
                this.SaveNewSession();
                this.socketIOService.BusyNow();
                this.isBusy = true;
                this.Close();
                this.router.navigate(['/Clinical']);
            });
    }
    //if video call rejected by receiver then notify to caller
    private OnVideoCallRejected() {
        this.socketIOService
            .OnVideoCallRejected()
            .subscribe(data => {
                this.callingInfo.content = "Call Rejected ..";
                setTimeout(() => {
                    this.Close();
                }, 1000);
            });
    }
    //caller calls to another user(reciver)
    //here callee is receiver
    public VideoCall(callee) {
        //find callee in live user list if found then send call request
        var calee = this.liveUserList.find(a => a.username == callee.username);
        if (calee) {
            var sessionid = moment(new Date()).format('YYYYMMDDHHmmss');
            this.socketIOService.VideoCallRequest(this.loggedUserName, calee.id, sessionid, this.globalService.loggedUserInfo.UserId);
        } else {
            return;
        }
        this.callee = callee;
        this.callingInfo.name = callee.username;
        this.callingInfo.content = "Dialing....";
        this.callingInfo.type = "dialer";
        this.isVideoCall = true;
    }
    //accept video call and notify to dialer that call is accepted
    public AcceptVideoCall() {
        var calee = this.liveUserList.find(a => a.username == this.callingInfo.name);
        if (calee) {
            this.socketIOService.VideoCallAccepted(this.loggedUserName, calee.id, this.globalService.sessionid, this.globalService.loggedUserInfo.UserId);
            sessionStorage.setItem("callinginfo", JSON.stringify({ userType: 'receiver', caller: calee.id }));
            this.socketIOService.BusyNow();
            this.isBusy = true;
            this.router.navigate(['/Clinical']);
        } else {
            this.RejectVideoCall();
        }
        this.Close();
    }
    //if video call request is rejected then notify to dialer that call is rejected
    public RejectVideoCall() {
        sessionStorage.removeItem("callinginfo");
        var calee = this.liveUserList.find(a => a.username == this.callingInfo.name);
        if (calee) {
            this.socketIOService.VideoCallRejected(this.loggedUserName, calee.id);
        }
        this.Close();
    }
    //close video call popup
    public Close() {
        this.isVideoCall = false;
        this.changeDetector.detectChanges();
    }

    /*****************************************************************
     * Section Audio
     *****************************************************************/
    public AudioCall(callee) {
        //find callee in live user list if found then send call request
        var calee = this.liveUserList.find(a => a.username == callee.username);
        if (calee) {
            var sessionid = moment(new Date()).format('YYYYMMDDHHmmss');
            this.socketIOService.AudioCallRequest(this.loggedUserName, calee.id, sessionid, this.globalService.loggedUserInfo.UserId);
        } else {
            return;
        }
        this.callee = callee;
        this.callingInfo.name = callee.username;
        this.callingInfo.content = "Dialing....";
        this.callingInfo.type = "dialer";
        this.userType = 'dialer';
        this.isAudioCall = true;
    }
    //after receiving audio call request show audio call popup with accept or reject button
    private OnAudioCallRequest() {
        this.socketIOService
            .OnAudioCallRequest()
            .subscribe(data => {
                this.callingInfo.name = data.fromname;
                this.callingInfo.content = "Calling....";
                this.callingInfo.type = "receiver";
                this.userType = 'receiver';
                this.globalService.sessionid = data.sessionid;
                this.globalService.sessionUserDbId = data.userid;
                this.isAudioCall = true;
            });
    }
    public AcceptAudioCall() {
        var calee = this.liveUserList.find(a => a.username == this.callingInfo.name);
        if (calee) {
            this.socketIOService.AudioCallAccepted(this.loggedUserName, calee.id, this.globalService.sessionid, this.globalService.loggedUserInfo.UserId);
            sessionStorage.setItem("callinginfo", JSON.stringify({ userType: 'receiver', caller: calee.id }));
            this.caller = calee.id;
            this.socketIOService.BusyNow();
            this.isBusy = true;
            this.isAudioCallAccepted = true;
        } else {
            this.isAudioCallAccepted = false;
            this.RejectAudioCall();
        }
        this.CloseAudioCallPopup();
    }
    public RejectAudioCall() {
        sessionStorage.removeItem("callinginfo");
        var calee = this.liveUserList.find(a => a.username == this.callingInfo.name);
        if (calee) {
            this.socketIOService.AudioCallRejected(this.loggedUserName, calee.id);
            this.isAudioCallAccepted = false;
        }
        this.CloseAudioCallPopup();
    }
    private OnAudioCallAccepted() {
        this.socketIOService
            .OnAudioCallAccepted()
            .subscribe(data => {
                var calee = this.liveUserList.find(a => a.username == this.callingInfo.name);
                sessionStorage.setItem("callinginfo", JSON.stringify({ userType: 'dialer', caller: calee.id }));
                this.globalService.sessionid = data.sessionid;
                this.globalService.sessionUserDbId = data.userid;
                this.caller = calee.id;
                this.socketIOService.BusyNow();
                this.isBusy = true;
                this.isAudioCallAccepted = true;
                this.CloseAudioCallPopup();
            });
    }
    //if audio call rejected by receiver then notify to caller
    private OnAudioCallRejected() {
        this.socketIOService
            .OnAudioCallRejected()
            .subscribe(data => {
                this.callingInfo.content = "Call Rejected ..";
                this.isAudioCallAccepted = false;
                setTimeout(() => {
                    this.CloseAudioCallPopup();
                }, 1000);
            });
    }

    private CloseAudioCallPopup() {
        this.isAudioCall = false;
    }
    public Callback(e) {
        this.isAudioCallAccepted = false;
        this.isAudioCall = false;
        this.isBusy = false;
        location.reload();
    }

    /*****************************************************************
     * Section UI methods
     *****************************************************************/
    //for switching tab content
    public SwitchTabContent(eleid) {
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


    /*****************************************************************
     * Section Database methods
     *****************************************************************/
    //get current user contacts
    private GetUserContacts() {
        try {
            this.blService.GetUserContacts(this.globalService.loggedUserInfo.UserId)
                .subscribe(res => {
                    if (res.Status == 'OK') {
                        this.userContacts = res.Results;
                        this.changeDetector.detectChanges;
                        this.ShowContacts();
                    } else {
                        console.log(res.ErrorMessgae);
                    }
                });
        } catch (ex) {
            console.log(ex);
        }
    }
    //get all users for add contacts
    private GetUserList() {
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
    //get old chat between users
    private GetOldChat(uid) {
        try {
            this.blService.GetOldChat(this.globalService.loggedUserInfo.UserId + "," + uid)
                .subscribe(res => {
                    if (res.Status == "OK") {
                        var data = res.Results;
                        this.messages = [];
                        this.callDetails = data.call;
                        data.chat.forEach(c => {
                            var type = '';
                            var sendername = '';
                            if (this.loggedUserName == c.SenderName) {
                                type = 'sent';
                                sendername = 'Me';
                            } else {
                                type = "received";
                                sendername = c.SenderName;
                            }
                            this.messages.push({
                                Message: c.SentText,
                                Type: type,
                                Sender: sendername,
                                Date: moment(c.SentTime).format('MMM DD h:mm A')
                            });
                        });
                    } else {
                        console.log(res.ErrorMessgae);
                    }
                })
        } catch (ex) {
            console.log(ex);
        }
    }
    //after video call is accpted by receiver save session info to db
    private SaveNewSession() {
        var data = {
            SessionId: this.globalService.sessionid,
            CreatedBy: this.globalService.loggedUserInfo.UserId,
            CallingTo: this.globalService.sessionUserDbId,
            CreatedOn: new Date()
        };
        this.blService.SaveNewSession(data)
            .subscribe(res => {
                if (res.Status == 'OK') {
                    //var data = res.Results;
                    //console.log("session saved");
                }
            });
    }
}
