import glob from 'glob-promise';
import path from 'path';

describe('SEO metadata', () => {
  it('should be included in every page', async () => {
    const pagePaths = await glob('./app/**/page.tsx');
    pagePaths.forEach(async (pagePath: string) => {
      const pagePathRel = path.join('..', pagePath);
      const page = await import(pagePathRel);
      if (typeof page.generateMetadata !== 'function') {
        throw new Error(`missing generateMetadata() function for ${pagePath}`);
      }
      const metadata = await page.generateMetadata();
      expect(metadata).toHaveProperty('title');
      expect(metadata).toHaveProperty('description');
      expect(metadata).toHaveProperty('manifest');
      expect(metadata).toHaveProperty('icons.icon');
      expect(metadata).toHaveProperty('icons.shortcut');
      expect(metadata).toHaveProperty('icons.apple');
      expect(metadata).toHaveProperty('openGraph.title', metadata.title);
      expect(metadata).toHaveProperty(
        'openGraph.description',
        metadata.description
      );
      expect(metadata).toHaveProperty('twitter.title', metadata.title);
      expect(metadata).toHaveProperty(
        'twitter.description',
        metadata.description
      );
    });
  });
});
