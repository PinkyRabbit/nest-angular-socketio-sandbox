import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
import { from, of } from 'rxjs';

@Injectable()
export class ChatService {
  constructor(private socket: Socket) {
    this.init();
    this.joke();
    this.pong();
  }

  init() {
    return this.socket.fromEvent('init').subscribe(
      (msg) => console.log(msg),
      (err) => console.log(err)
    );
  }

  ping() {
    console.log('ping!');
    this.socket.emit('ping');
    // of(this.socket.emit('ping')).subscribe((res) => console.log(res));
  }

  joke() {
    console.log('joke');
    return this.socket.fromEvent('joke').subscribe((joke) => console.log(joke));
  }

  pong() {
    console.log('pong');
    return this.socket
      .fromEvent('pong')
      .pipe(map((data: any) => alert(data.msg)));
  }
}
