import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import {
  Subject,
  Observable,
  interval,
  timer,
  Subscription,
  throwError
} from 'rxjs';
import {
  catchError,
  tap,
  share
} from 'rxjs/operators';

interface Message {
  type: 'sub' | 'unsub' | 'message';
  channel?: string;
  channels?: string[];
  data?: any;
}

interface RxSocketOptions {
  urls: string[]; // 主 + 备用 WebSocket 域名
  reconnectInterval?: number; // 重连间隔 ms
  reconnectAttempts?: number; // 最大重连次数
  heartbeatInterval?: number; // 心跳间隔
}

export class RxSocket {
  private socket$: WebSocketSubject<any> | null = null;
  private connection$: Observable<any> | null = null;
  private subscriptions = new Map<string, Subject<any>>();
  private reconnectAttempts = 0;
  private connected = false;
  private currentUrlIndex = 0;
  private reconnectSub?: Subscription;

  constructor(private options: RxSocketOptions) {
    this.options.reconnectInterval ??= 3000;
    this.options.reconnectAttempts ??= 10;
    this.options.heartbeatInterval ??= 15000;
    this.connect();
  }

  private connect() {
    const url = this.options.urls[this.currentUrlIndex];
    this.socket$ = webSocket({
      url,
      openObserver: {
        next: () => {
          console.log('[RxSocket] Connected:', url);
          this.connected = true;
          this.reconnectAttempts = 0;
        }
      },
      closeObserver: {
        next: () => {
          console.warn('[RxSocket] Disconnected');
          this.connected = false;
          this.reconnect();
        }
      }
    });

    this.connection$ = this.socket$.pipe(
      tap((msg) => this.routeMessage(msg)),
      catchError((err) => {
        console.error('[RxSocket] Connection error:', err);
        return throwError(err);
      }),
      share()
    );

    // heartbeat
    interval(this.options.heartbeatInterval).subscribe(() => {
      if (this.connected) this.send({ type: 'ping' });
    });
  }

  private reconnect() {
    if (this.reconnectAttempts >= this.options.reconnectAttempts!) {
      this.currentUrlIndex = (this.currentUrlIndex + 1) % this.options.urls.length;
      this.reconnectAttempts = 0;
    }

    const delay = this.options.reconnectInterval!;
    this.reconnectSub = timer(delay).subscribe(() => {
      this.reconnectAttempts++;
      console.log(`[RxSocket] Reconnecting... Attempt ${this.reconnectAttempts}`);
      this.connect();

      // 重新订阅所有频道
      this.subscriptions.forEach((_, channel) => {
        this.send({ type: 'sub', channel });
      });
    });
  }

  private routeMessage(msg: Message) {
    if (msg.type === 'message' && msg.channel && this.subscriptions.has(msg.channel)) {
      this.subscriptions.get(msg.channel)?.next(msg.data);
    }
  }

  private send(msg: Message) {
    if (this.connected && this.socket$) {
      this.socket$.next(msg);
    }
  }

  /**
   * 单频道订阅
   */
  public subscribe(channel: string): Observable<any> {
    if (!this.subscriptions.has(channel)) {
      const subject = new Subject<any>();
      this.subscriptions.set(channel, subject);
      this.send({ type: 'sub', channel });
    }
    return this.subscriptions.get(channel)!.asObservable();
  }

  /**
   * 多频道订阅
   */
  public subscribeMany(channels: string[]): { [channel: string]: Observable<any> } {
    const result: { [channel: string]: Observable<any> } = {};
    for (const ch of channels) {
      result[ch] = this.subscribe(ch);
    }
    return result;
  }

  /**
   * 取消单频道订阅
   */
  public unsubscribe(channel: string) {
    if (this.subscriptions.has(channel)) {
      this.send({ type: 'unsub', channel });
      this.subscriptions.get(channel)?.complete();
      this.subscriptions.delete(channel);
    }
  }

  /**
   * 取消多频道订阅
   */
  public unsubscribeMany(channels: string[]) {
    for (const ch of channels) {
      this.unsubscribe(ch);
    }
  }

  /**
   * 主动关闭连接
   */
  public close() {
    this.socket$?.complete();
    this.reconnectSub?.unsubscribe();
    this.connected = false;
  }
}
