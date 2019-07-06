# gifect

Make GIFs with React.

## Example

Create a new React project with [CRA](https://facebook.github.io/create-react-app/)

```bash
yarn create react-app hello --typescript
```

Install gifect

```bash
yarn add gifect
```

Update `src/App.tsx`

```typescript
import React from 'react';
import { Root, withRenderer } from 'gifect';

const fps = 10;

const typer = (message: string, progress: number): string =>
  message.slice(0, message.length * progress);

const App: Root = state => (
  <div className="App">{typer('gifect', state.progress)}</div>
);

export default withRenderer(App, {
  width: 45,
  height: 20,
  numFrames: 3 * fps, // 3 seconds
  fps,
});
```

Start React app with `yarn start`.

Create GIF with `gifect` in another tab.

```bash
yarn gifect http://localhost:3000 gifect.gif
```

Output GIF:

![gifect](./gifect.gif)
