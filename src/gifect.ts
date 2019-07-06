export type Root = (state: State) => React.ReactNode;

export type State = {
  progress: number; // [0, 1]
  currentFrame: number;
  numFrames: number;
};

export type Config = {
  width: number;
  height: number;
  numFrames: number;
  fps: number;
};

export type RuntimeConfig = Config & {
  frameCallback: string;
};
