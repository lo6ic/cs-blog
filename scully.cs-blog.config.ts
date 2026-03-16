import { ScullyConfig, setPluginConfig } from '@scullyio/scully';
/** this loads the default render plugin, remove when switching to something else. */
import '@scullyio/scully-plugin-puppeteer';
import { baseHrefRewrite } from '@scullyio/scully-plugin-base-href-rewrite';

const defaultPostRenderers = ['seoHrefOptimise', baseHrefRewrite];
const executablePath =
  process.env['PUPPETEER_EXECUTABLE_PATH'] ?? process.env['CHROME_BIN'];
const isCi = process.env['CI'] === 'true';
setPluginConfig(baseHrefRewrite, { href: 'https://christopherschedler.com/' });

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
