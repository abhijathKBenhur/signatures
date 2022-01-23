import ENDPOINTS from "../commons/Endpoints";

let liveInstance = null;

export const getNewConnection = metamaskID => {
    liveInstance = new WebSocket(ENDPOINTS.WEBSOCKET_ENDPOINT+"?metamaskId="+metamaskID);
    return liveInstance
}

const SocketInstance = {
    getNewConnection,

}

export default SocketInstance;
