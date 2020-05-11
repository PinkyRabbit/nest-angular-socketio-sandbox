import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayDisconnect,
  OnGatewayConnection,
  OnGatewayInit,
  ConnectedSocket,
} from '@nestjs/websockets';
import { from, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { HttpService } from '@nestjs/common';

@WebSocketGateway(8988)
// @WebSocketGateway(8988, { namespace: 'events' })
// @WebSocketGateway(3001, { namespace: 'chat' })
export class SocketIoGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  clients: any[] = [];

  // @TODO: dshjfvghjs
  constructor(private httpService: HttpService) {
    setInterval(() => {
      this.emitChuckNorrisJoke();
    }, 10000);
  }

  afterInit(server: Server) {
    console.log('SocketIoGateway Init');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
    this.clients.push(client);
    client.emit('init', `User ${client.id} initialized`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  emitChuckNorrisJoke() {
    console.log('emitChuckNorrisJoke');
    this.httpService
      .get('https://api.chucknorris.io/jokes/random')
      .pipe(
        map(result => result.data),
        map(data => data.value),
      )
      .subscribe(joke =>
        this.clients.forEach(client => client.emit('joke', joke)),
      );
  }

  // emit(channel, msg) {
  //   this.server.emit(channel, msg);
  // }

  @SubscribeMessage('*')
  test(client: any): Observable<WsResponse<any>> {
    console.log('test');
    console.log(client);
    return of({ event: 'events', data: { msg: 'test' } });
  }

  @SubscribeMessage('ping')
  ping(client: any): WsResponse<any> {
    console.log('ping');
    console.log(client);
    return { event: 'events', data: { msg: 'pong' } };
  }

  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }

  @SubscribeMessage('debug')
  async debug(
    @MessageBody() _roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    return { connected: client.connected, rooms: client.adapter.rooms };
  }
}
