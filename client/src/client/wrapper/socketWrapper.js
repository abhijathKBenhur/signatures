import ENDPOINTS from "../commons/Endpoints";

let liveInstance = null;
export const getNewConnection = metamaskID => {
    let socketEndpoint = process.env.NODE_ENV == "production"  ? ENDPOINTS.WEBSOCKET_REMOTE_ENDPOINT : ENDPOINTS.WEBSOCKET_ENDPOINT
    liveInstance = new WebSocket(socketEndpoint+"?metamaskId="+metamaskID);
    return liveInstance
}

const SocketInstance = {
    getNewConnection,

}

export default SocketInstance;
