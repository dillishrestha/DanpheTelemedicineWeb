import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { SocketIOService } from '../services/socket.io.service';
import * as moment from 'moment';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./communication.css']
})
export class MessageComponent implements OnInit {
  public message: string;
  public messages: Array<MessageModel> = new Array<MessageModel>();
  public loggedUserName;

  constructor(private socketIOService: SocketIOService,
    private changeDetector: ChangeDetectorRef,
    private globalService: GlobalService) {
    this.loggedUserName = sessionStorage.getItem("username");
  }

  public caller;
  @Input('caller')
  public set setCaller(_caller) {
    this.caller = _caller;
  }

  @Output("callback")
  callback: EventEmitter<Object> = new EventEmitter<Object>();

  SendMessage() {
    if (this.message == '') {
      return;
    }
    var msg = new MessageModel();
    msg.Message = this.message;
    msg.Sender = 'Me';
    msg.Type = "sent";
    msg.Date = moment(new Date()).format('MMM DD h:mm A');

    this.messages.push(msg);
    this.socketIOService.SendMessage(this.message, this.loggedUserName, this.caller);
    this.message = '';
    this.ScrollToBottom('div-msg');
  }

  ngOnInit() {
    this.GetMessage();
  }

  GetMessage() {
    this.socketIOService
      .GetMessages()
      .subscribe(data => {
        var msg = new MessageModel();
        msg.Message = data.message;
        msg.Sender = data.fromname;
        msg.Type = "received";
        msg.Date = moment(new Date()).format('MMM DD h:mm A');
        this.messages.push(msg);
        this.changeDetector.detectChanges();
        this.ScrollToBottom('div-msg');
      });
  }

  ///Scroll to bottom => handling ui
  public ScrollToBottom(id) {
    this.changeDetector.detectChanges();
    var div = document.getElementById(id);
    div.scrollTop = div.clientHeight;
    div.scrollTop = div.scrollHeight - div.scrollTop;
  }
}

class MessageModel {
  Message: string;
  Type: string;
  Sender: string;
  Date: string;
}
