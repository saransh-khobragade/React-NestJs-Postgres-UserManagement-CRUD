import { Injectable } from '@nestjs/common';
import * as client from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly register: client.Registry;
  private readonly httpRequestsTotal: client.Counter<string>;
  private readonly httpRequestDuration: client.Histogram<string>;
  private readonly activeConnections: client.Gauge<string>;
  private readonly userRegistrations: client.Counter<string>;
  private readonly userLogins: client.Counter<string>;

  constructor() {
    this.register = new client.Registry();
    
    // Default Node.js metrics
    client.collectDefaultMetrics({ register: this.register });

    // Custom application metrics
    this.httpRequestsTotal = new client.Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status'],
      registers: [this.register],
    });

    this.httpRequestDuration = new client.Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status'],
      buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
      registers: [this.register],
    });

    this.activeConnections = new client.Gauge({
      name: 'active_connections',
      help: 'Number of active connections',
      registers: [this.register],
    });

    this.userRegistrations = new client.Counter({
      name: 'user_registrations_total',
      help: 'Total number of user registrations',
      registers: [this.register],
    });

    this.userLogins = new client.Counter({
      name: 'user_logins_total',
      help: 'Total number of user logins',
      labelNames: ['status'],
      registers: [this.register],
    });
  }

  getMetrics(): Promise<string> {
    return this.register.metrics();
  }

  incrementHttpRequests(method: string, route: string, status: string): void {
    this.httpRequestsTotal.inc({ method, route, status });
  }

  observeHttpDuration(method: string, route: string, status: string, duration: number): void {
    this.httpRequestDuration.observe({ method, route, status }, duration);
  }

  setActiveConnections(count: number): void {
    this.activeConnections.set(count);
  }

  incrementUserRegistrations(): void {
    this.userRegistrations.inc();
  }

  incrementUserLogins(success: boolean): void {
    this.userLogins.inc({ status: success ? 'success' : 'failure' });
  }
}