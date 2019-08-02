import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { SocketIOService } from '../services/socket.io.service';
import * as moment from 'moment';
import { GlobalService } from '../services/global.service';
import { BLService } from '../shared/bl.service';

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
    private globalService: GlobalService,
    private blService: BLService) {
    this.loggedUserName = sessionStorage.getItem("username");
    this.GetOldChat(this.globalService.sessionUserDbId);
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

    if (this.globalService.sessionid) {
      var Data = {
        SessionId: this.globalService.sessionid,
        SenderId: this.globalService.loggedUserInfo.UserId,
        SentTime: new Date(),
        SentText: this.message
      };
      //saving message in db
      this.SaveChat(Data);
    }

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

  /*******************************
   * Database calls
   ******************************/
  //save chat for maintin chat history
  private SaveChat(data) {
    this.blService.SaveChat(data)
      .subscribe(res => {
        if (res.Status == 'OK') {
          //var data = res.Results;
          console.log("msg saved");
        }
      });
  }
  //get old chat between users
  private GetOldChat(uid) {
    try {
      this.blService.GetOldChat(this.globalService.loggedUserInfo.UserId + "," + uid)
        .subscribe(res => {
          if (res.Status == "OK") {
            var data = res.Results;
            this.messages = [];
            data.chat.forEach(c => {
              var type = '';
              var sendername = '';
              if (this.loggedUserName == c.SenderName) {
                type = 'sent';
                sendername = 'Me';
              } else {
                type = "received";
                sendername = c.SenderName;
              }
              this.messages.push({
                Message: c.SentText,
                Type: type,
                Sender: sendername,
                Date: moment(c.SentTime).format('MMM DD h:mm A')
              });
            });
            this.ScrollToBottom('div-msg');
          } else {
            console.log(res.ErrorMessgae);
          }
        })
    } catch (ex) {
      console.log(ex);
    }
  }
}

class MessageModel {
  Message: string;
  Type: string;
  Sender: string;
  Date: string;
}
