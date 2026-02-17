import { Logger } from '@nestjs/common';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'ws';
import * as WebSocket from 'ws';
import { AuthService } from '../components/auth/auth.service';
import { Member } from "../libs/dto/member/member";
import * as url from "url";

interface MessagePayload {
  event: string,
  text: string,
  memberData: Member,
}

interface InfoPayload {
  event: string,
  totalClients: number,
  memberData: Member,
  action: string,
}

@WebSocketGateway({ transports: ['websocket'], secure: false })
export class SocketGateway implements OnGatewayInit {
  private logger: Logger = new Logger("SocketEventsGateway");
  private summaryClient: number = 0;
  private clientsAuthMap = new Map<WebSocket, Member>()
  private messageList: MessagePayload[] = [];

  constructor(private authService: AuthService) { };

  @WebSocketServer()
  server: Server;

  public afterInit(server: Server) {
    this.logger.verbose(`WebSocket Server Initializes & total [${this.summaryClient}]`)
  }

  private async retrieveAuth(req: any): Promise<Member> {
    try {
      const parseUrl = url.parse(req.url, true);
      const { token } = parseUrl.query;
      return await this.authService.verifyToken(token as string);
    } catch (err) {
      return null;
    }
  }


  //   Broadcasting in WebSocket means:

  // Sending a message from the server to multiple connected clients at the same time.

  // Instead of sending data to just one user, the server sends it to everyone (or a group).


  public async handleConnection(client: WebSocket, req: any) {  //Starts working when there is a new connection and gets user  data
    const authMember = await this.retrieveAuth(req);
    this.summaryClient++;
    this.clientsAuthMap.set(client, authMember);

    const clientNick: string = authMember?.memberNick ?? "Guset";
    this.logger.verbose(`Connection [${clientNick}] & total [${this.summaryClient}]`)


    const infoMsg: InfoPayload = {
      event: 'info',
      totalClients: this.summaryClient,
      memberData: authMember,
      action: "joined",
    };
    this.emiteMessage(infoMsg); //(3) ending message to all online/connected members
    // CLIENT MESSAGE
    client.send(JSON.stringify({ event: 'getMessage', list: this.messageList })); // (1) sending meassage list to new connected member
  }


  public handleDisconnect(client: WebSocket) {  //Starts working when a user disconnected 
    const authMember = this.clientsAuthMap.get(client)
    this.summaryClient--;
    this.clientsAuthMap.delete(client);

    const clientNick: string = authMember?.memberNick ?? "Guset";
    this.logger.verbose(`Disconnection [${clientNick}] & total [${this.summaryClient}]`)


    const infoMsg: InfoPayload = {
      event: 'info',
      totalClients: this.summaryClient,
      memberData: authMember,
      action: "left",
    };
    this.broadcastMessage(client, infoMsg) //(2) sending message about disconnection to all online members except disconnected member
  }

  @SubscribeMessage('message')
  public async handleMessage(client: WebSocket, payload: any): Promise<void> {
    const authMember = this.clientsAuthMap.get(client)
    const newMessage: MessagePayload = { event: 'message', text: payload, memberData: authMember };

    const clientNick: string = authMember?.memberNick ?? "Guset";
    this.logger.verbose(`NEW MESSAGE [${clientNick}]: ${payload}`)

    this.messageList.push(newMessage);
    if (this.messageList.length > 5) this.messageList.splice(0, this.messageList.length - 5)

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
/*
# TYPES MESSAGE TARGETS:
1. Client (only)
2. Broadcast (except client)
3. Emit (all clients)
*/