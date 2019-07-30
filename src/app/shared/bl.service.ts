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

    /**
     * Get Clinical
     */
    public GetDocument(docid) {
        try {
            return this.dlservice.GetDocument(docid)
                .pipe(map((res: any) => res),
                    catchError(this.handleError));
        } catch (ex) {
            throw ex;
        }
    }

     /**
      * Post clinical
      */
    UploadFile(sessionid,senderid,filedata){
        return this.dlservice.UploadFile(sessionid,senderid,filedata);
    }
}