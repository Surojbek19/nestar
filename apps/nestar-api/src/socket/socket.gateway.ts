import { Logger } from '@nestjs/common';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'ws';
import * as WebSocket from 'ws';

interface MessagePayload {
  event: string,
  text: string,
}

interface InfoPayload {
  event: string,
  totalClients: number,
}

@WebSocketGateway({ transports: ['websocket'], secure: false })
export class SocketGateway implements OnGatewayInit {
  private logger: Logger = new Logger("SocketEventsGateway");
  private summaryClient: number = 0;

  @WebSocketServer()
  server: Server;

  public afterInit(server: Server) {
    this.logger.verbose(`WebSocket Server Initializes & total [${this.summaryClient}]`)
  }


  //   Broadcasting in WebSocket means:

  // Sending a message from the server to multiple connected clients at the same time.

  // Instead of sending data to just one user, the server sends it to everyone (or a group).


  handleConnection(client: WebSocket, ...args: any[]) {  //Starts working when there is a new connection and gets user  data
    this.summaryClient++;
    this.logger.verbose(`Connection & total [${this.summaryClient}]`)


    const infoMsg: InfoPayload = {
      event: 'info',
      totalClients: this.summaryClient,
    };
    this.emiteMessage(infoMsg);

  }


  handleDisconnect(client: WebSocket) {  //Starts working when a user disconnected 
    this.summaryClient--;
    this.logger.verbose(`Disconnection & total [${this.summaryClient}]`)


    const infoMsg: InfoPayload = {
      event: 'info',
      totalClients: this.summaryClient,
    };
    this.broadcastMessage(client, infoMsg)
  }

  @SubscribeMessage('message')
  public async handleMessage(client: WebSocket, payload: any): Promise<void> {
    const newMessage: MessagePayload = { event: 'message', text: payload };

    this.logger.verbose(`NEW MESSAGE: ${payload}`)
    this.emiteMessage(newMessage)
  }

  private broadcastMessage(sender: WebSocket, message: InfoPayload | MessagePayload) {
    this.server.clients.forEach((client) => {
      if (client !== sender && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    })
  }

  private emiteMessage(message: InfoPayload | MessagePayload) {  // this method sends a message to all online users both authenticated or non-authenticated 
    this.server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    })
  }


}
