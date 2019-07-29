import { Injectable, Directive } from '@angular/core';
import { DLService } from './dl.service';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class BLService {
    constructor(private dlservice: DLService) {

    }
    UploadFile(sessionid,senderid,filedata){
        return this.dlservice.UploadFile(sessionid,senderid,filedata);
    }
}