// Preload OpenTelemetry before any instrumented modules are loaded
import { startOtel } from './otel';

startOtel().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start OpenTelemetry SDK', err);
});

