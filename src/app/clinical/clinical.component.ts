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
export class ClinicalComponent {

    public isDoctor = true;
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
    fileuploadprogress: number;
    fileUploadMessage: string;


    constructor(private blService: BLService) {

    }

    /**
     * Clinical methods
     */
    ConsultRequest() {
        if (this.consult == '') {
            return;
        }
        this.consults.push(this.consult);
        this.consult = '';
    }


    Save(val) {
        if (val == 'Complain') {
            if (this.complain != "") {
                this.complains.push(this.complain);
                this.complain = '';
            }
        } else if (val == "Examination") {
            if (this.examination != '') {
                this.examinations.push(this.examination);
                this.examination = '';
            }
        } else if (val == "Assessment") {
            if (this.assessment != '') {
                this.assessments.push(this.assessment);
                this.assessment = '';
            }
        } else if (val == "Plan") {
            if (this.plan != '') {
                this.plans.push(this.plan);
                this.plan = '';
            }
        } else if (val == "Orders") {
            if (this.order != '') {
                this.orders.push(this.order);
                this.order = '';
            }
        }
    }

    /**
     * Upload File
     */

    UploadFile(files) {
        if (files.length === 0)
            return;

        const formData = new FormData();

        for (let file of files) {
            if (file.size > 10000000) {
                alert("File must be less than 10MB");
                return;
            }
            formData.append(file.name, file);
        }
        this.blService.UploadFile('sessionid', '01', formData)
            .subscribe(event => {
                if (event.type === HttpEventType.UploadProgress)
                    this.fileuploadprogress = Math.round(100 * event.loaded / event.total);
                else if (event.type === HttpEventType.Response) {
                    var jsondata = event.body.toString();
                    var res = JSON.parse(jsondata);
                    if (res.Status == 'OK') {
                        var data = res.Results;
                        //send received data to other user
                        //this.sessionDocList.push(data);
                        console.log(data);
                        this.fileUploadMessage = "Upload Successful."
                    } else {
                        this.fileUploadMessage = res.ErrorMessage;
                    }
                    setTimeout(() => {
                        this.fileUploadMessage = '';
                    }, 2000);
                }
            });
    }

    /**
     * UI methods
     */
    SwitchTabContent(eleid, type) {
        var idlist = [];
        if (type == 'finance') {
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