import * as io from 'socket.io-client';
import { Observable, from } from 'rxjs';

export class SocketIOService {
    private url = '/';
    private socket;
    private connected = false;
    public connectedusers: any;

    constructor() {
        this.socket = io(this.url);
    }

    /**
     * Common methods
     */
    /**
     * @param username set to socket
     */
    public SetUserName(username) {
        this.socket.emit('add user', username);
        return Observable.create((observer) => {
            this.socket.on('logged-user', (data) => {
                this.connected = true;
                observer.next(data);
            });
        });
    }
    /**
     * Remove all user data from socket
     */
    public RemoveUser() {
        this.socket.close();

        this.socket = io(this.url);
    }

    public BroadCastMessage(message) {
        this.socket.emit('new-broadcast-message', message);
    }

    public GetConnectedUsers() {
        return Observable.create((observer) => {
            this.socket.on('client-list', (data) => {
                observer.next(data);
            });
        });
    }
    //set user is busy when user is on call
    public BusyNow() {
        this.socket.emit('busy-user');
    }
    public GetBusyUsers() {
        this.socket.emit('get-busy-user');
        return Observable.create((observer) => {
            this.socket.on('get-busy-user', (data) => {
                observer.next(data);
            });
        });
    }
    
    /*********************************************************************
     * Messaging
     *********************************************************************/
    public SendMessage(message, from, to) {
        //this.socket.emit('new-message', message);
        this.socket.emit('new-message', {
            toid: to,
            message: message,
            fromname: from
        });
    }

    public GetMessages() {
        return Observable.create((observer) => {
            this.socket.on('new-message', (message) => {
                observer.next(message);
            });
        });
    }
    public SendDocument(data) {
        this.socket.emit('send-document', data);
    }

    public GetDocument(){
        return Observable.create((observer) => {
            this.socket.on('get-document', (data) => {
                observer.next(data);
            });
        });
    }
    /***
     * Section home Chat
     * following requests are used for Chat
     */

    SendChatRequest(toid) {
        this.socket.emit('chat-request', toid);
    }
    OnChatRequest() {
        return Observable.create((observer) => {
            this.socket.on('chat-request', (data) => {
                observer.next(data);
            });
        });
    }
    ChatEnded(toid){
        this.socket.emit('chat-ended', toid);
    }
    OnChatEnded() {
        return Observable.create((observer) => {
            this.socket.on('chat-ended', (data) => {
                observer.next(data);
            });
        });
    }
    /***
     * Section Audio call
     * following requests are used for audio call
     */

    public AudioCallRequest(from, to, sessionid, userid) {
        this.socket.emit('audio-call', {
            fromname: from,
            toid: to,
            sessionid: sessionid,
            userid: userid
        });
    }
    public OnAudioCallRequest() {
        return Observable.create((observer) => {
            this.socket.on('audio-call', (data) => {
                observer.next(data);
            });
        });
    }
    public AudioCallAccepted(from, to, sessionid, userid) {
        this.socket.emit('audio-call-accept', {
            fromname: from,
            toid: to,
            sessionid: sessionid,
            userid: userid
        });
    }
    public OnAudioCallAccepted() {
        return Observable.create((observer) => {
            this.socket.on('audio-call-accept', (data) => {
                observer.next(data);
            });
        });
    }
    public EndAudioCall(from, to, toname) {
        this.socket.emit('end-audio-call', {
            fromname: from,
            toid: to,
            toname: toname
        });
    }
    public OnAudioCallEnded() {
        this.socket.emit('get-busy-user');
        return Observable.create((observer) => {
            this.socket.on('audio-call-ended', (data) => {
                observer.next(data);
            });
        });
    }
    public AudioCallRejected(from, to) {
        this.socket.emit('audio-call-reject', {
            fromname: from,
            toid: to
        });
    }
    public OnAudioCallRejected() {
        return Observable.create((observer) => {
            this.socket.on('audio-call-reject', (data) => {
                observer.next(data);
            });
        });
    }


    /***
     * Section Video call
     * following requests are used for video call
     */

    public VideoCallRequest(from, to, sessionid, userid) {
        this.socket.emit('video-call', {
            fromname: from,
            toid: to,
            sessionid: sessionid,
            userid: userid
        });
    }
    public OnVideoCallRequest() {
        return Observable.create((observer) => {
            this.socket.on('video-call', (data) => {
                observer.next(data);
            });
        });
    }
    public VideoCallAccepted(from, to, sessionid, userid) {
        this.socket.emit('video-call-accept', {
            fromname: from,
            toid: to,
            sessionid: sessionid,
            userid: userid
        });
    }
    public OnVideoCallAccepted() {
        return Observable.create((observer) => {
            this.socket.on('video-call-accept', (data) => {
                observer.next(data);
            });
        });
    }
    public EndVideoCall(from, to, toname) {
        this.socket.emit('end-video-call', {
            fromname: from,
            toid: to,
            toname: toname
        });
    }
    public OnVideoCallEnded() {
        this.socket.emit('get-busy-user');
        return Observable.create((observer) => {
            this.socket.on('video-call-ended', (data) => {
                observer.next(data);
            });
        });
    }
    public VideoCallRejected(from, to) {
        this.socket.emit('video-call-reject', {
            fromname: from,
            toid: to
        });
    }
    public OnVideoCallRejected() {
        return Observable.create((observer) => {
            this.socket.on('video-call-reject', (data) => {
                observer.next(data);
            });
        });
    }


    /**
     * 
     * @param candidate or @param description for audio/video call
     * need to send remote user id
     */
    public SendCallRequest(val, type, uid) {
        var data;
        if (type == 'desc') {
            data = {
                toid: uid,
                desc: val
            }
        } else {
            data = {
                toid: uid,
                candidate: val
            }
        }
        this.socket.emit('call-request', data);
    }
    public ReceiveCallRequest() {
        return Observable.create((observer) => {
            this.socket.on('call-request', (data) => {
                observer.next(data);
            });
        });
    }
}