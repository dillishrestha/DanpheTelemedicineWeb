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

     
    /*****************************************************************
     * START POST
     *****************************************************************/
    
    /*****************************
     * Clinical POST
     *****************************/
    UploadFile(sessionid,senderid,filedata){
        return this.dlservice.UploadFile(sessionid,senderid,filedata);
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
}