import { ScullyConfig, setPluginConfig } from '@scullyio/scully';
/** this loads the default render plugin, remove when switching to something else. */
import '@scullyio/scully-plugin-puppeteer';
import { baseHrefRewrite } from '@scullyio/scully-plugin-base-href-rewrite';

const defaultPostRenderers = ['seoHrefOptimise', baseHrefRewrite];
setPluginConfig(baseHrefRewrite, { href: 'https://christopherschedler.com/' });

export const config: ScullyConfig = {
  projectRoot: './src',
  projectName: 'cs-blog',
  outDir: './docs',
  defaultPostRenderers,
  routes: {
    '/posts/:id': {
      type: 'contentFolder',
      id: {
        folder: './posts',
      },
    },
  },
};
