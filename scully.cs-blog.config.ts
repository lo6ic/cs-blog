import { ScullyConfig, setPluginConfig } from '@scullyio/scully';
/** this loads the default render plugin, remove when switching to something else. */
import '@scullyio/scully-plugin-puppeteer';
import { baseHrefRewrite } from '@scullyio/scully-plugin-base-href-rewrite';
import { existsSync } from 'node:fs';
import puppeteer from 'puppeteer';

const defaultPostRenderers = ['seoHrefOptimise', baseHrefRewrite];
const browserCandidates = [
  process.env['PUPPETEER_EXECUTABLE_PATH'],
  process.env['CHROME_BIN'],
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
  '/snap/bin/chromium',
];
const bundledChromiumPath = (() => {
  try {
    return puppeteer.executablePath();
  } catch {
    return undefined;
  }
})();
const executablePath =
  browserCandidates.find((candidate): candidate is string => !!candidate && existsSync(candidate)) ??
  (bundledChromiumPath && existsSync(bundledChromiumPath) ? bundledChromiumPath : undefined);
const isCi = process.env['CI'] === 'true';
const productionSiteUrl = process.env['SCULLY_SITE_URL'] ?? 'https://christopherschedler.com/';
const rewrittenBaseHref = isCi ? productionSiteUrl : '/';
setPluginConfig(baseHrefRewrite, { href: rewrittenBaseHref });

export const config: ScullyConfig = {
  projectRoot: './src',
  projectName: 'cs-blog',
  outDir: './docs',
  defaultPostRenderers,
  puppeteerLaunchOptions: {
    ...(executablePath ? { executablePath } : {}),
    ...(isCi
      ? {
          args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
        }
      : {}),
  },
  routes: {
    '/posts/:id': {
      type: 'contentFolder',
      id: {
        folder: './posts',
      },
    },
  },
};
