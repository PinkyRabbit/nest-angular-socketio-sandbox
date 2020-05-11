import { Module, HttpModule } from '@nestjs/common';

import { SocketIoGateway } from './socketio.gateway';

@Module({
  imports: [HttpModule],
  providers: [SocketIoGateway],
})
export class SocketioModule {}
