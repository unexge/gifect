import { Config, State } from './gifect';

const waitForStart = async (): Promise<void> => {
  if (window.gifectStarted) {
    return;
  }

  return new Promise(resolve => {
    Object.defineProperty(window, 'gifectStarted', {
      set: () => {
        resolve();
      },
    });
  });
};

export const init = async (
  config: Config,
  nextFrame: (state: State) => void,
): Promise<State> => {
  await waitForStart();

  window.gifectFrame = nextFrame;

  return window.gifectInit!({
    ...config,
    frameCallback: 'gifectFrame',
  });
};
