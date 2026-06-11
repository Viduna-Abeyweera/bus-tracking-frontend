import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws';

/**
 * WebSocket service for real-time bus tracking via STOMP over SockJS.
 * 
 * Provides a singleton-like API for connecting, subscribing to topics,
 * and sending messages. Auto-reconnects on disconnection.
 * 
 * Topics:
 *   /topic/bus-locations          — all bus location updates
 *   /topic/bus-locations/{routeId} — route-specific updates
 *   /topic/bus-status             — bus status changes
 */
class WebSocketService {
  constructor() {
    this.client = null;
    this.subscriptions = new Map();
    this.connected = false;
    this.onConnectCallbacks = [];
  }

  /**
   * Connect to the WebSocket server.
   * @param {string} token - JWT token for authentication (optional)
   */
  connect(token = null) {
    if (this.client?.active) return;

    const wsUrl = token ? `${WS_URL}?token=${token}` : WS_URL;

    this.client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        if (import.meta.env.DEV) {
          // Only log connection events in dev, not every frame
          if (str.includes('CONNECTED') || str.includes('DISCONNECTED')) {
            console.log('[WS]', str);
          }
        }
      },
      onConnect: () => {
        console.log('🔗 WebSocket connected');
        this.connected = true;
        // Execute any pending connect callbacks
        this.onConnectCallbacks.forEach(cb => cb());
        this.onConnectCallbacks = [];
      },
      onDisconnect: () => {
        console.log('🔌 WebSocket disconnected');
        this.connected = false;
      },
      onStompError: (frame) => {
        console.error('❌ WebSocket STOMP error:', frame.headers.message);
      },
    });

    this.client.activate();
  }

  /**
   * Disconnect from the WebSocket server.
   */
  disconnect() {
    if (this.client?.active) {
      this.subscriptions.forEach((sub) => sub.unsubscribe());
      this.subscriptions.clear();
      this.client.deactivate();
      this.connected = false;
      console.log('🔌 WebSocket disconnected');
    }
  }

  /**
   * Subscribe to a STOMP topic.
   * @param {string} topic - The topic to subscribe to
   * @param {function} callback - Called with parsed message body
   * @returns {string} Subscription ID for later unsubscription
   */
  subscribe(topic, callback) {
    const doSubscribe = () => {
      if (this.subscriptions.has(topic)) {
        this.subscriptions.get(topic).unsubscribe();
      }
      const sub = this.client.subscribe(topic, (message) => {
        try {
          const body = JSON.parse(message.body);
          callback(body);
        } catch (e) {
          console.error('Failed to parse WS message:', e);
        }
      });
      this.subscriptions.set(topic, sub);
    };

    if (this.connected) {
      doSubscribe();
    } else {
      this.onConnectCallbacks.push(doSubscribe);
    }

    return topic;
  }

  /**
   * Unsubscribe from a topic.
   */
  unsubscribe(topic) {
    if (this.subscriptions.has(topic)) {
      this.subscriptions.get(topic).unsubscribe();
      this.subscriptions.delete(topic);
    }
  }

  /**
   * Send a message to a STOMP destination.
   * @param {string} destination - e.g., '/app/bus/location'
   * @param {object} body - The message payload
   */
  send(destination, body) {
    if (this.client?.active) {
      this.client.publish({
        destination,
        body: JSON.stringify(body),
      });
    }
  }

  /**
   * Check if currently connected.
   */
  isConnected() {
    return this.connected;
  }
}

// Singleton instance
const wsService = new WebSocketService();
export default wsService;
