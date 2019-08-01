import { Injectable, Directive } from '@angular/core';
import { DLService } from './dl.service';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class BLService {
    constructor(private dlservice: DLService) {

    }

    /**
     * Handle error
     */
    handleError(error) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        window.alert("Server Disconnected");//(errorMessage);
        return throwError("Server Disconnected");//(errorMessage);
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
            return this.dlservice.GetLoginUser(userName, password)
                .pipe(map((res: any) => JSON.parse(res)),
                    catchError(this.handleError));
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
            return this.dlservice.GetUserContacts(userid)
                .pipe(map((res: any) => JSON.parse(res)),
                    catchError(this.handleError));
        } catch (ex) {
            throw ex;
        }
    }
    //get user list
    public GetUserList(){
        try {
            return this.dlservice.GetUserList()
                .pipe(map((res: any) => JSON.parse(res)),
                    catchError(this.handleError));
        } catch (ex) {
            throw ex;
        }
    }
    //get old chat
    public GetOldChat(useridlist) {
        try {
            return this.dlservice.GetOldChat(useridlist)
                .pipe(map((res: any) => JSON.parse(res)),
                    catchError(this.handleError));
        } catch (ex) {
            throw ex;
        }
    }

    /*****************************
     * Clinical GET
     *****************************/
    //get uploaded document by document id
    public GetDocument(docid) {
        try {
            return this.dlservice.GetDocument(docid)
                .pipe(map((res: any) => res),
                    catchError(this.handleError));
        } catch (ex) {
            throw ex;
        }
    }
    //get document list by session users
    public GetDocumnetList(useridlist) {
        try {
            return this.dlservice.GetDocumnetList(useridlist)
                .pipe(map((res: any) => JSON.parse(res)),
                    catchError(this.handleError));
        } catch (ex) {
            throw ex;
        }
    }
    //get remote user details for display by user id
    public GetRemoteUserDetails(userid) {
        try {
            return this.dlservice.GetRemoteUserDetails(userid)
                .pipe(map((res: any) => JSON.parse(res)),
                    catchError(this.handleError));
        } catch (ex) {
            throw ex;
        }
    }
     
    /*****************************************************************
     * START POST
     *****************************************************************/
    
     /*****************************
     * Home POST
     *****************************/
    //when user accepted call then add new session
    public SaveNewSession(data) {
        try {
            var session = JSON.stringify(data)
            return this.dlservice.SaveNewSession(session)
                .pipe(map((res: any) => JSON.parse(res)));
        } catch (ex) {
            throw ex;
        }
    }

    /*****************************
     * Clinical POST
     *****************************/
    UploadFile(sessionid,senderid,filedata){
        return this.dlservice.UploadFile(sessionid,senderid,filedata);
    }
    //end video call
    public EndVideoCall(data) {
        try {
            var chat = JSON.stringify(data);
            return this.dlservice.EndVideoCall(chat)
                .pipe(map((res: any) => JSON.parse(res)));
        } catch (ex) {
            throw ex;
        }
    }

    /*****************************
     * Main POST
     *****************************/
    //register new user
    public RegisterNewUser(data){
        try {
            var user = JSON.stringify(data)
            return this.dlservice.RegisterNewUser(user)
                .pipe(map((res: any) => JSON.parse(res)));
        } catch (ex) {
            throw ex;
        }
    }
    
    /*****************************
     * Message POST
     *****************************/
    //save chat for maintain history
    public SaveChat(data) {
        try {
            var chat = JSON.stringify(data);
            return this.dlservice.SaveChat(chat)
                .pipe(map((res: any) => JSON.parse(res)));
        } catch (ex) {
            throw ex;
        }
    }
}