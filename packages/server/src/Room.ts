import { Client, Room } from 'colyseus';
import { Constants, Maths, Models, Types } from '@tosios/common';
import { GameState } from './State';

export class GameRoom extends Room<GameState> {
    //
    // Lifecycle
    //
    onCreate(options: Types.IRoomOptions) {
        // Set max number of clients for this room
        this.maxClients = Maths.clamp(
            options.roomMaxPlayers || 0,
            Constants.ROOM_PLAYERS_MIN,
            Constants.ROOM_PLAYERS_MAX,
        );

        const playerName = options.playerName.slice(0, Constants.PLAYER_NAME_MAX);
        const roomName = options.roomName.slice(0, Constants.ROOM_NAME_MAX);

        // Init Metadata
        this.setMetadata({
            playerName,
            roomName,
            roomMaxPlayers: this.maxClients,
        });

        // Init State
        this.setState(
            new GameState({
                roomName,
                maxPlayers: this.maxClients,
                onMessage: this.handleMessage,
            }),
        );

        this.setSimulationInterval(() => this.handleTick());

        console.log(
            `${new Date().toISOString()} [Created] player=${playerName} room=${roomName}max=${this.maxClients}`,
        );

        // Listen to messages from clients
        this.onMessage('*', (client: Client, type: string | number, message: Models.ActionJSON) => {
            const playerId = client.sessionId;

            // Validate which type of message is accepted
            switch (type) {
                case 'move':
                case 'rotate':
                case 'shoot':
                    this.state.playerPushAction({
                        playerId,
                        ...message,
                    });
                    break;
                default:
                    break;
            }
        });
    }

    onJoin(client: Client, options: Types.IPlayerOptions) {
        this.state.playerAdd(client.sessionId, options.playerName);
        console.log(`${new Date().toISOString()} [Joined] id=${client.sessionId} player=${options.playerName}`);
    }

    onLeave(client: Client) {
        this.state.playerRemove(client.sessionId);
        console.log(`${new Date().toISOString()} [Left] id=${client.sessionId}`);
    }

    //
    // Handlers
    //
    handleTick = () => {
        this.state.update();
    };

    handleMessage = (message: Models.MessageJSON) => {
        this.broadcast(message.type, message);
    };
}
