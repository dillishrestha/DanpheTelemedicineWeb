import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SocketIOService } from '../services/socket.io.service';
import * as moment from 'moment';

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./communication.css']
})
export class MessageComponent implements OnInit {
  public message: string;
  public messages: Array<MessageModel> = new Array<MessageModel>();
  public loggedUserName;

  constructor(private socketIOService: SocketIOService) {
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
  }

  ngOnInit() {
    this.GetMessage();
  }

  GetMessage() {
    this.socketIOService
      .GetMessages()
      .subscribe(data => {
        const currentTime = moment().format('hh:mm:ss a');
        var msg = new MessageModel();
        msg.Message = data.message;
        msg.Sender = data.fromname;
        msg.Type = "received";
        msg.Date = moment(new Date()).format('MMM DD h:mm A');
        this.messages.push(msg);
      });
  }
}

class MessageModel {
  Message: string;
  Type: string;
  Sender: string;
  Date: string;
}
