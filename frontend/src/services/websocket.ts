import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';


const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws';

class WebSocketService {
  private client: Client;
  private onConnectCallbacks: (() => void)[] = [];

  constructor() {
    this.client = new Client({
      // SockJS ile bağlantı kurmak için webSocketFactory kullanıyoruz
      webSocketFactory: () => new SockJS(WS_URL),
      // Bağlantı koparsa 5 saniye sonra tekrar dener
      reconnectDelay: 5000,
      // Kalp atışı (bağlantı durumunu kontrol etmek için)
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      // Hata ayıklama logları (üretim ortamında kapatılabilir)
      debug: (str) => {
        // console.log('STOMP: ' + str);
      },
    });

    // Bağlantı başarılı olduğunda tetiklenir
    this.client.onConnect = () => {
      console.log('WebSocket Bağlantısı Başarılı!');


      this.onConnectCallbacks.forEach((cb) => cb());
      this.onConnectCallbacks = [];
    };

    // Bağlantıda veya iletişimde hata çıkarsa
    this.client.onStompError = (frame) => {
      console.error(' STOMP Hatası: ' + frame.headers['message']);
      console.error('Detaylar: ' + frame.body);
    };
  }


  public connect() {
    if (!this.client.active) {
      this.client.activate();
    }
  }


  public disconnect() {
    if (this.client.active) {
      this.client.deactivate();
      console.log('WebSocket Bağlantısı Kapatıldı.');
    }
  }


  public subscribe(destination: string, callback: (message: any) => void) {
    const doSubscribe = () => {
      return this.client.subscribe(destination, (message) => {
        if (message.body) {
          callback(JSON.parse(message.body));
        }
      });
    };


    if (this.client.connected) {
      return doSubscribe();
    }

    else {
      let actualSubscription: any = null;
      let cancelled = false;

      this.onConnectCallbacks.push(() => {
        if (!cancelled) {
          actualSubscription = doSubscribe();
        }
      });

      return {
        id: 'pending',
        unsubscribe: () => {
          cancelled = true;
          if (actualSubscription) {
            actualSubscription.unsubscribe();
          }
        }
      };
    }
  }


  public sendMessage(destination: string, body: any) {
    if (this.client.connected) {
      this.client.publish({
        destination: destination,
        body: JSON.stringify(body),
      });
    } else {
      console.error('WebSocket asenkron işlemi bağlı değil, mesaj gönderilemedi!');
    }
  }
}

export const websocketService = new WebSocketService();
