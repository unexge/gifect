import React from 'react';
import { Root, State, Config } from './gifect';
import { init } from './bridge';

type Props = {
  root: Root;
  config: Config;
};

class Renderer extends React.Component<Props> {
  lastState!: State;

  async componentDidMount() {
    this.lastState = await init(this.props.config, this.frame.bind(this));

    this.forceUpdate();
  }

  shouldComponentUpdate() {
    return false;
  }

  frame(state: State) {
    this.lastState = state;

    this.forceUpdate();
  }

  render() {
    if (!this.lastState) {
      return null;
    }

    return this.props.root(this.lastState);
  }
}

export function withRenderer(RootComponent: Root, config: Config) {
  return class extends React.Component {
    render() {
      return React.createElement(Renderer, {
        root: RootComponent,
        config,
      });
    }
  };
}
