import { Injectable, Directive } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
//import * as config from '../../../config.json';

@Injectable()
export class DLService {
    private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }) };

    //public apiurl = config.apiurl;
    public apiurl = 'https://192.168.0.141:8080';
    constructor(private httpClient: HttpClient) {
        this.apiurl = 'https://localhost:44391';
        this.apiurl = this.apiurl + "/api/DanpheTelemedicine";
    }

    /*****************************************************************
     * START GET
     *****************************************************************/

    /*****************************
     * login GET
     *****************************/
    //Check user name and password is correct or not
    public GetLoginUser(userName, password) {
        try {
            return this.httpClient
                .get(this.apiurl + "?reqType=check-user&username=" + userName + "&password=" + password, this.httpOptions);
        } catch (ex) {
            throw ex;
        }
    }

    /*****************************
     * home GET
     *****************************/
    //get user contacts by user id
    public GetUserContacts(userid) {
        try {
            return this.httpClient.get(this.apiurl + "?reqType=get-user-contacts&userid=" + userid, this.httpOptions);
        } catch (ex) {
            throw ex;
        }
    }
    //get user list
    public GetUserList(){
        try{
            return this.httpClient.get(this.apiurl + "?reqType=get-user-list", this.httpOptions);
        }catch(ex){
            throw ex;
        }
    }

    /*****************************
     * Clinical GET
     *****************************/
    //get uploaded document by document id
    public GetDocument(docid) {
        try {
            return this.httpClient.get(this.apiurl + "?reqType=get-document&documentid=" + docid, this.httpOptions);
        } catch (ex) {
            throw ex;
        }
    }


    /*****************************************************************
     * START POST
     *****************************************************************/
    
    /*****************************
     * Clinical POST
     *****************************/
    //upload file
    UploadFile(sessionid, senderid, filedata) {
        const uploadReq = new HttpRequest('POST', this.apiurl + `/uploadfile?sessionid=` + sessionid + `&senderid=` + senderid, filedata, {
            reportProgress: true,
        });
        return this.httpClient.request(uploadReq);
    }

    
    /*****************************
     * Main POST
     *****************************/
    //register new user
    public RegisterNewUser(user){
        try {
            return this.httpClient.post(this.apiurl + "?reqType=save-user", user, this.httpOptions);
        } catch (ex) {
            throw ex;
        }
    }
}
