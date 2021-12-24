import { Express } from 'express';
import fetch from 'node-fetch';
import xml2js from 'xml2js';

// Some podcast feeds have hundreds of episodes, which can quickly exceed the
// localStorage quota if cached on the front end; to avoid this, we cap the
// number of episodes at a finite number of episodes
const MAX_EPISODE_COUNT = 50;

export default function (app: Express): void {
  app.get('/widgets/podcast/feed', async (req, res) => {

    const response = await fetch(String(req.query.url));
    const xmlStr = await response.text();

    const result = await xml2js.parseStringPromise(xmlStr, {
      // Eliminate the root node (<rss>) from the returned JSON hierarchy
      explicitRoot: false,
      // Only wrap values in an array if there is more than one element of the
      // same tag name at the same level of hierarchy
      explicitArray: false,
      // Do not store attributes in a sub-object; rather, keep them in the same
      // object as the child values; this theoretically can introduce name
      // conflicts if a <child> tag and an attribute on the <parent> have the
      // same name; fortunately, we do not need to be concerned for the purpose
      // of this endpoint, since the RSS XML schema uses unique names for most
      // tags/attributes
      mergeAttrs: true
    });
    // By disabling the explicitArray behavior, we open up the possibility of
    // the 'item' property *not* being an array if the podcast feed has only
    // one episode; we handle that here by ensuring that the 'item' property is
    // always an array
    if (!Array.isArray(result.channel.item)) {
      result.channel.item = [result.channel.item];
    }
    // Cap number of episodes returned by endpoint (see MAX_EPISODE_COUNT
    // comment above)
    if (result.channel.item.length > MAX_EPISODE_COUNT) {
      result.channel.item.length = MAX_EPISODE_COUNT;
    }

    res.status(response.status);
    res.json(result);

  });
}
