const CONF = {
  DEBUG: false,
  APP_PORT: 8888,
  IS_PRODUCTION: false,
  WEBSOCKET_TYPE: {
    TRY_CONNECT: 'try-connect',
    CHECK_CONNECT: 'check-connect',
    PING: 'ping',
    PONG: 'pong',
    REPLY_SERVER_HEART_BEAT: 'reply-server-heart-beat',
    SOCKET_HEART_BEAT: 'socket-heart-beat',
    RESPONSE_DATE: 'response-date',
    QUESTION: 'question',
  },
};

export default CONF;
