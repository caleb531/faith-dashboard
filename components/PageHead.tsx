import Head from 'next/head';
import React from 'react';
import site from './siteData';

type Props = { pagePath: string, pageTitle: string, pageDescription: string };

// The <head> content that should appear on all pages; the props for the
// current page are passed into this function to maximize SEO for each page
function PageHead({ pagePath, pageTitle, pageDescription }: Props) {
  const pageUrl = `${site.baseUrl}${pagePath}`;
  const socialImageUrl = `${site.baseUrl}${site.socialImagePath}`;
  return (
    <Head>
        {/* Prevent viewport from zooming in when focusing inputs on iOS; according to StackOverflow, this meta tag must be added to _app instead of _document in order for proper de-duping (since NextJS already adds a 'meta viewport' tag to the page by default); source: https://stackoverflow.com/a/65833542/560642 */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <title>{pageTitle || site.title}</title>
        {pagePath ? <link rel="canonical" href={pageUrl} /> : null}
        <meta property="og:title" content={pageTitle || site.title} />
        <meta property="og:type" content="website" />
        {pagePath ? <meta property="og:url" content={pageUrl} /> : null}
        <meta property="og:image" content={socialImageUrl} />
        <meta property="og:image:width" content="2400" />
        <meta property="og:image:height" content="1260" />
        {pageDescription ? <meta property="og:description" content={pageDescription} /> : null}
        {pageDescription ? <meta name="description" content={pageDescription} /> : null}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={site.twitterUsernameSite} />
        <meta name="twitter:creator" content={site.twitterUsernameCreator} />
        <meta name="twitter:title" content={pageTitle || site.title} />
        {pageDescription ? <meta name="twitter:description" content={pageDescription} /> : null}
        <meta name="twitter:image" content={socialImageUrl} />
        {pagePath ? <meta name="twitter:url" content={pageUrl} /> : null}
    </Head>
  );
}

export default PageHead;
