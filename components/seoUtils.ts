import { Metadata } from 'next';
import site from './siteData';

// Source: <https://stackoverflow.com/a/61912075/560642>
type RequiredNotNull<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

type PageMetadataBase = NonNullable<
  RequiredNotNull<Pick<Metadata, 'title' | 'description'>>
> & {
  path: string;
};

// The <head> content that should appear on all pages; the props for the
// current page are passed into this function to maximize SEO for each page
export function getPageMetadata({
  path,
  title,
  description
}: PageMetadataBase): Metadata {
  const baseProdUrl = site.baseUrl;
  const url = `${baseProdUrl}${path}`;
  return {
    metadataBase: new URL(baseProdUrl),
    title,
    description,
    manifest: '/manifest.json',
    icons: {
      icon: '/app-icons/favicon.png',
      shortcut: '/app-icons/favicon.png',
      apple: `${baseProdUrl}/app-icons/apple-touch-icon.png`
    },
    appleWebApp: {
      title: 'Faith Dashboard',
      statusBarStyle: 'black-translucent'
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: {
        url: site.socialImagePath,
        width: 2400,
        height: 1260
      }
    },
    twitter: {
      card: 'summary_large_image',
      site: site.twitterUsernameSite,
      creator: site.twitterUsernameCreator,
      title,
      description,
      images: [site.socialImagePath]
    }
  };
}
