#!/usr/bin/env node

import fs from 'fs';
import puppeteer from 'puppeteer';
import png from 'png-js';
import GIFEncoder from 'gifencoder';
import { RuntimeConfig, State } from '../gifect';

const args = process.argv.slice(2);

const getInitialState = (runtimeConfig: RuntimeConfig): State => ({
  currentFrame: 0,
  progress: 0,
  numFrames: runtimeConfig.numFrames,
});

const nextState = ({ currentFrame, numFrames }: State): State => {
  const nextFrame = currentFrame + 1;

  return {
    currentFrame: nextFrame,
    progress: nextFrame / numFrames,
    numFrames,
  };
};

const isDone = ({ currentFrame, numFrames }: State): boolean =>
  currentFrame >= numFrames;

const init = (page: puppeteer.Page): Promise<[RuntimeConfig, State]> =>
  new Promise(async resolve => {
    await page.exposeFunction('gifectInit', (config: RuntimeConfig) => {
      const state = getInitialState(config);

      resolve([config, state]);

      return state;
    });

    page.evaluate(() => {
      window.gifectStarted = true;
    });
  });

const getScreenshot = (page: puppeteer.Page): Promise<any> =>
  new Promise(async resolve => {
    new png(await page.screenshot({ encoding: 'binary' })).decode(
      (data: any) => {
        resolve(data);
      },
    );
  });

(async () => {
  const targetURL = args[0];
  const output = args[1];

  if (!targetURL || !output) {
    console.log('usage: gifect <url> <output>');
    return;
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(args[0]);

  let [runtimeConfig, state] = await init(page);

  await page.setViewport({
    width: runtimeConfig.width,
    height: runtimeConfig.height,
  });

  const encoder = new GIFEncoder(runtimeConfig.width, runtimeConfig.height);
  encoder.createReadStream().pipe(fs.createWriteStream(output));
  encoder.setRepeat(0);
  encoder.setDelay(1000 / runtimeConfig.fps);
  encoder.start();

  const saveScreenshot = async () => {
    const screenshot = await getScreenshot(page);
    encoder.addFrame(screenshot);
  };

  const nextFrame = async (): Promise<void> => {
    await saveScreenshot();
    state = nextState(state);

    await page.evaluate(
      (state: State, runtimeConfig: RuntimeConfig) => {
        (window as any)[runtimeConfig.frameCallback](state);
      },
      state,
      runtimeConfig,
    );

    if (isDone(state)) {
      return saveScreenshot();
    }

    return nextFrame();
  };

  await nextFrame();

  encoder.finish();

  await browser.close();
})();
