import { State, RuntimeConfig } from './src/gifect';

declare global {
  interface Window {
    gifectStarted?: boolean;
    gifectFrame?: (state: State) => void;
    gifectInit?: (runtimeConfig: RuntimeConfig) => Promise<State>;
  }
}
