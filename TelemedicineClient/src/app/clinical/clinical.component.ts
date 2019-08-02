import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { SocketIOService } from '../services/socket.io.service';
import { GlobalService } from '../services/global.service';
import { BLService } from '../shared/bl.service';
import { HttpEventType } from '@angular/common/http';

@Component({
    templateUrl: './clinical.component.html',
    styleUrls: ['./clinical.css']
})
export class ClinicalComponent implements OnInit {

    public isDoctor = true;
    public isVideoCall = false;
    public userType: string;
    public caller: any;
    public consult: string = '';
    public consults: string[] = new Array<string>();
    public complain: string;
    public complains: string[] = new Array<string>();
    public examination: string;
    public examinations: string[] = new Array<string>();
    public assessment: string;
    public assessments: string[] = new Array<string>();
    public plan: string;
    public plans: string[] = new Array<string>();
    public order: string;
    public orders: string[] = new Array<string>();
    public fileuploadprogress: number;
    public fileUploadMessage: string;
    public sessionDocList = new Array<any>();
    public isChat = false;
    public showMsgSuccess = false;
    public showMsgError = false;
    public boxMessage = '';
    public remoteUserDetails = { username: '', role: '' };

    constructor(private blService: BLService,
        private globalService: GlobalService,
        private changeDetector: ChangeDetectorRef,
        private router: Router,
        private socketIOService: SocketIOService) {
        if (this.globalService.callType) {
            this.userType = this.globalService.callType;
        }
        if (this.globalService.caller) {
            this.caller = this.globalService.caller;
        }
        this.GetDocumnetList(this.globalService.loggedUserInfo.UserId + "," + this.globalService.sessionUserDbId);
        this.GetRemoteUserDetails(this.globalService.sessionUserDbId);

        if (this.caller && this.userType) {
            setTimeout(() => {
                this.isChat = true;
                this.isVideoCall = true;
            }, 1000);
        } else {
            alert("something wrong!! Try again!!");
            this.router.navigate(['/']);
        }
    }
    ngOnInit() {
        this.OnDocumentReceived();
    }
    private SendDocument(d) {
        var data = {
            toid: this.caller,
            fromname: this.globalService.loggedUserInfo.UserName,
            documentid: d.SessionDocumentId,
            filename: d.FileName
        };
        this.socketIOService.SendDocument(data);
    }
    private OnDocumentReceived() {
        this.socketIOService.GetDocument()
            .subscribe(data => {
                this.sessionDocList.push({
                    SessionDocumentId: data.documentid,
                    FileName: data.filename
                });
                this.ScrollToBottom("div-file");
            });
    }

    //showing msg 
    private ShowMessage(isSuccess, msg) {
        this.boxMessage = msg;
        if (isSuccess) {
            this.showMsgSuccess = true;
        } else {
            this.showMsgError = true;
        }
        setTimeout(() => {
            this.showMsgSuccess = false;
            this.showMsgError = false;
        }, 5000);
    }
    //close MsgBox
    public CloseMsgBox() {
        this.showMsgSuccess = false;
        this.showMsgError = false;
    }

    /*******************************************
     * Video Call Methods
     *******************************************/
    public CallBack(event) {
        this.isVideoCall = false;
        this.isChat = false;
        this.changeDetector.detectChanges();
        this.CallEnded();
        location.reload();
    }

    /******************************************
     * Clinical methods
     ******************************************/
    public ConsultRequest() {
        if (this.consult == '') {
            return;
        }
        this.consults.push(this.consult);
        this.consult = '';
        this.ScrollToBottom("div-consult");
    }

    //saving clinical data
    //currently not in db only ui 
    public Save(val) {
        var id = '';
        if (val == 'Complain') {
            if (this.complain != "") {
                this.complains.push(this.complain);
                this.complain = '';
                id = 'div-complain';
            }
        } else if (val == "Examination") {
            if (this.examination != '') {
                this.examinations.push(this.examination);
                this.examination = '';
                id = 'div-examination';
            }
        } else if (val == "Assessment") {
            if (this.assessment != '') {
                this.assessments.push(this.assessment);
                this.assessment = '';
                id = 'div-assessment';
            }
        } else if (val == "Plan") {
            if (this.plan != '') {
                this.plans.push(this.plan);
                this.plan = '';
                id = 'div-plan';
            }
        } else if (val == "Orders") {
            if (this.order != '') {
                this.orders.push(this.order);
                this.order = '';
                id = 'div-order';
            }
        }
        if (id != '') {
            this.ScrollToBottom(id);
        }
    }
    ///Scroll to bottom => handling ui
    public ScrollToBottom(id) {
        this.changeDetector.detectChanges();
        var div = document.getElementById(id);
        div.scrollTop = div.clientHeight;
        div.scrollTop = div.scrollHeight - div.scrollTop;
    }

    /*******************************************
     * database call methods
     ********************************************/

    /*** Upload File ***/
    UploadFile(files) {
        if (files.length === 0)
            return;
        const formData = new FormData();
        for (let file of files) {
            //setting file size limit 10 10MB
            if (file.size > 10000000) {
                alert("File must be less than 10MB");
                return;
            }
            formData.append(file.name, file);
        }
        //Uploading file to db
        this.blService.UploadFile(this.globalService.sessionid, this.globalService.loggedUserInfo.UserId, formData)
            .subscribe(event => {
                if (event.type === HttpEventType.UploadProgress) {
                    this.fileuploadprogress = Math.round(100 * event.loaded / event.total);
                    this.ShowMessage(true, "Uploading....");
                }
                else if (event.type === HttpEventType.Response) {
                    var jsondata = event.body.toString();
                    var res = JSON.parse(jsondata);
                    if (res.Status == 'OK') {
                        var data = res.Results;
                        //send received data to other user
                        this.sessionDocList.push(data);
                        this.SendDocument(data);
                        this.ShowMessage(true, "Upload Successful.");
                        //this.fileUploadMessage = "Upload Successful.";
                        this.ScrollToBottom("div-file");
                    } else {
                        this.ShowMessage(false, "File uploading error");
                        //this.fileUploadMessage = res.ErrorMessage;
                    }
                    setTimeout(() => {
                        this.fileUploadMessage = '';
                    }, 2000);
                }
            });
    }
    //get document by document id
    public GetDocument(docid) {
        this.blService.GetDocument(docid)
            .subscribe(resData => {
                var res = JSON.parse(resData);
                if (res.Status == 'OK') {
                    var data = res.Results;
                    this.globalService.DownloadDoc(data.FileName, data.FileByteArray);
                }
            });
    }
    //get document list
    private GetDocumnetList(useridlist) {
        this.blService.GetDocumnetList(useridlist)
            .subscribe(res => {
                if (res.Status == 'OK') {
                    var data = res.Results;
                    if (data.length > 0) {
                        this.sessionDocList = data;
                        this.ScrollToBottom("div-file");
                    }
                }
            });
    }
    //get other user details for display
    private GetRemoteUserDetails(userid) {
        this.blService.GetRemoteUserDetails(userid)
            .subscribe(res => {
                if (res.Status == 'OK') {
                    var data = res.Results;
                    if (data) {
                        this.remoteUserDetails.username = data.UserName;
                        this.remoteUserDetails.role = data.Role;
                    }
                }
            });
    }
    //call ended
    private CallEnded() {
        //after call ended setting call end time in db
        var data = {
            SessionId: this.globalService.sessionid,
            EndTime: new Date()
        };
        this.blService.EndVideoCall(data)
            .subscribe(res => {
                if (res.Status == "OK") {

                }
            });
    }

    /**
     * UI methods
     */
    SwitchTabContent(eleid, type) {
        var idlist = [];
        if (type == 'finance') {
            //idlist contains id's of tab
            idlist = ['nav-finance', 'nav-clinical', 'nav-visit'];
        } else if (type == 'clinical') {
            idlist = ['nav-chief', 'nav-examination', 'nav-assessment', 'nav-plan', 'nav-orders'];
        }
        idlist.forEach(id => {
            var tab = document.getElementById(id + '-tab');
            var tabcontent = document.getElementById(id);
            var tabclass = "custom-tabs nav-item nav-link";
            var tabcontentclass = "tab-pane fade show";
            if (id == eleid) {
                tabclass += " active";
                tabcontentclass += " active";
            }
            if (type == 'clinical') {
                tabclass = "btn btn-info " + tabclass;
            }
            tab.className = tabclass;
            tabcontent.className = tabcontentclass;
        });
    }
}