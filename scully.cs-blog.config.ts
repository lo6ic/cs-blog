import { ScullyConfig, setPluginConfig } from '@scullyio/scully';
/** this loads the default render plugin, remove when switching to something else. */
import '@scullyio/scully-plugin-puppeteer';
import '@k9n/scully-plugin-toc';
import { TocConfig, TocPluginName } from '@k9n/scully-plugin-toc';
import { baseHrefRewrite } from '@scullyio/scully-plugin-base-href-rewrite';

const defaultPostRenderers = ['seoHrefOptimise', baseHrefRewrite];
setPluginConfig(baseHrefRewrite, { href: 'https://christopherschedler.com/' });

const tocOptions: TocConfig = {
  blogAreaSelector: '.blog-content', // where to search for TOC headings
  insertSelector: '#toc', // where to insert the TOC
  level: ['h2', 'h3'], // what heading levels to include
  trailingSlash: true, // add trailing slash before the anker ('#')
  scrollIntoViewOnClick: true, // add event to each link that scrolls into view on click:
  // onclick="document.getElementById('target-id').scrollIntoView()"
};
setPluginConfig(TocPluginName, tocOptions);

export const config: ScullyConfig = {
  projectRoot: './src',
  projectName: 'cs-blog',
  outDir: './docs',
  //defaultPostRenderers,
  routes: {
    '/posts/:id': {
      type: 'contentFolder',
      postRenderers: [TocPluginName],
      id: {
        folder: './posts',
      },
    },
  },
};
