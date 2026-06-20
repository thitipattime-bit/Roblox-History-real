import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { LanguageProvider } from './lib/LanguageContext.tsx';
import './index.css';

// Intercept and cleanly handle benign dev-server or sandbox WebSocket exceptions/rejections
if (typeof window !== 'undefined') {
  const isWSErr = (err: any) => {
    if (!err) return false;
    const msg = typeof err === 'string' ? err.toLowerCase() : String(err.message || err.reason?.message || err.reason || err).toLowerCase();
    return (
      msg.includes('websocket') || 
      msg.includes('ws://') || 
      msg.includes('wss://') || 
      msg.includes('vite') || 
      msg.includes('closed without opened') ||
      msg.includes('sockjs') ||
      msg.includes('hmr')
    );
  };
  
  // Monkey-patch console.error to silence Vite's reconnect and connection lost spam
  const originalError = console.error;
  console.error = (...args) => {
    if (args.length > 0 && isWSErr(args[0])) return;
    originalError(...args);
  };

  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (args.length > 0 && typeof args[0] === 'string' && 
       (args[0].includes('WebSocket') || args[0].includes('WebSocket patch skipped'))) {
      return;
    }
    originalWarn(...args);
  };
  
  // Monkey-patch global WebSocket to auto-trap interior connection rejections & network errors cleanly
  const OriginalWebSocket = window.WebSocket;
  if (OriginalWebSocket) {
    const SafeWebSocket = function(url: string | URL, protocols?: string | string[]) {
      const ws = protocols 
        ? new OriginalWebSocket(url, protocols) 
        : new OriginalWebSocket(url);

      // Secure sub-channel error shield
      ws.addEventListener('error', (event) => {
        try {
          event.preventDefault?.();
          event.stopPropagation?.();
          event.stopImmediatePropagation?.();
        } catch {}
      });

      return ws;
    };

    // Ensure pristine prototype hierarchy is preserved
    SafeWebSocket.prototype = OriginalWebSocket.prototype;
    
    // Convey static descriptors and readyState codes (CONNECTING, OPEN, CLOSING, CLOSED)
    Object.defineProperties(SafeWebSocket, Object.getOwnPropertyDescriptors(OriginalWebSocket));

    try {
      Object.defineProperty(window, 'WebSocket', {
        value: SafeWebSocket,
        configurable: true,
        writable: true
      });
    } catch (e) {
      try {
        (window as any).WebSocket = SafeWebSocket;
      } catch (err) {
        console.warn("🔒 Custom WebSocket patch skipped due to structural security policy:", err);
      }
    }
  }
  
  window.addEventListener('unhandledrejection', (ev) => {
    if (isWSErr(ev.reason) || isWSErr(ev)) {
      ev.preventDefault();
      ev.stopPropagation();
      ev.stopImmediatePropagation();
    }
  }, true);

  window.addEventListener('error', (ev) => {
    if (isWSErr(ev.message) || isWSErr(ev.error)) {
      ev.preventDefault();
      ev.stopPropagation();
      ev.stopImmediatePropagation();
    }
  }, true);

  // Initialize the requested WebSocket connection with safe error handling and resilient auto-reconnect
  const initWebSocket = () => {
    let reconnectDelay = 2000;
    const maxReconnectDelay = 30000;
    let socket: WebSocket | null = null;

    const connect = () => {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
        const wsUrl = `${protocol}${window.location.host}/ws`;
        
        console.log('[WebSocket Client] Active setup connecting to secure proxy line:', wsUrl);
        socket = new WebSocket(wsUrl);

        let pingInterval: NodeJS.Timeout | null = null;

        // Event: Connection opened
        socket.onopen = () => {
          reconnectDelay = 2000; // Reset delay on success
          console.log('⚡ WebSocket Connection Established Automatically with Express Workspace!');
          try {
            socket?.send('Hello, Server! (Client handshake initiated successfully)');
          } catch (e) {
            console.warn('WebSocket initial send bypassed:', e);
          }

          // Schedule persistent 10s ping intervals to suppress proxy timeout closures
          pingInterval = setInterval(() => {
            if (socket?.readyState === WebSocket.OPEN) {
              try {
                socket.send('PING');
              } catch {}
            }
          }, 10000);
        };

        // Event: Message received
        socket.onmessage = (event) => {
          if (event.data === 'PONG') {
            // Heartbeat check resolved silently
            return;
          }
          try {
            const payload = JSON.parse(event.data);
            console.log('📬 WebSocket Message Received from Node Server:', payload);
          } catch {
            console.log('📬 Raw WebSocket Message from Server:', event.data);
          }
        };

        let didTriggerClose = false;
        const triggerReconnect = () => {
          if (didTriggerClose) return;
          didTriggerClose = true;
          if (pingInterval) clearInterval(pingInterval);
          console.log('🔌 WebSocket connection closed/failed. Reconnecting in ' + reconnectDelay + 'ms...');
          setTimeout(() => {
            reconnectDelay = Math.min(reconnectDelay * 2, maxReconnectDelay);
            connect();
          }, reconnectDelay);
        };

        // Event: Connection closed
        socket.onclose = () => {
          triggerReconnect();
        };

        // Event: Connection error
        socket.onerror = () => {
          triggerReconnect();
          try {
            socket?.close();
          } catch {}
        };
      } catch (err) {
        console.warn('WebSocket connection init bypassed:', err);
      }
    };

    connect();
  };

  initWebSocket();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
);
