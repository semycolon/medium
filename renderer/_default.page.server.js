import { renderToString } from '@vue/server-renderer';
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr';
import { createApp } from './app';
// eslint-disable-next-line import/no-unresolved
import logoUrl from '../assets/icons/logo.svg?url';

// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = ['pageProps', 'urlPathname'];

function getPageTitle(pageContext) {
  const def = process.env.VITE_SITE_TITLE;
  const { Page } = pageContext;
  const { pageTitle: title } = Page;
  if (!title) return def;
  if (typeof title === 'function') return title(pageContext) || def;
  if (typeof title === 'string') return title || def;
  return def;
}

function getPageDesc(pageContext) {
  const def = process.env.VITE_SITE_DESCRIPTION;
  const { Page } = pageContext;
  const { pageDesc: desc } = Page;
  if (!desc) return def;
  if (typeof desc === 'function') return desc(pageContext) || def;
  if (typeof desc === 'string') return desc || def;
  return def;
}

async function render(pageContext) {
  const app = createApp(pageContext);
  const appHtml = await renderToString(app);

  const title = getPageTitle(pageContext);
  const desc = getPageDesc(pageContext);

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${logoUrl}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <title>${title}</title>
      </head>
      <body>
        <div id="app">${dangerouslySkipEscape(appHtml)}</div>
      </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {
      // We can add some `pageContext` here, which is useful if we want to do page redirection https://vite-plugin-ssr.com/page-redirection
    },
  };
}

export { render };
