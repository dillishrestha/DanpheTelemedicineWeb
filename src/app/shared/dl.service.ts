import { Injectable, Directive } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
//import * as config from '../../../config.json';

@Injectable()
export class DLService {
    private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }) };

    //public apiurl = config.apiurl;
    public apiurl = 'https://192.168.0.141:8080';
    constructor(private httpClient: HttpClient) {
        this.apiurl = this.apiurl + "/api/DanpheTelemedicine";
    }

    /**
     * Get Clinical
     */
    //get uploaded document by document id
    public GetDocument(docid) {
        try {
            return this.httpClient.get(this.apiurl + "?reqType=get-document&documentid=" + docid, this.httpOptions);
        } catch (ex) {
            throw ex;
        }
    }


    /**
     * POST Clinical
     */
    //upload file
    UploadFile(sessionid, senderid, filedata) {

        const uploadReq = new HttpRequest('POST', this.apiurl + `/uploadfile?sessionid=` + sessionid + `&senderid=` + senderid, filedata, {
            reportProgress: true,
        });
        return this.httpClient.request(uploadReq);
    }
}
