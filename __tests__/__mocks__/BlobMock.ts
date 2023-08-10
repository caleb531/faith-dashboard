// The blob-polyfill package's .text() method on Blob objects hangs forever if
// you try to await it, even though this works fine in the browser; therefore,
// we implement our own minimal Blob polyfill
class BlobMock {
  _blobParts: string[];
  options: { type: string };
  constructor(blobParts: string[], options = { type: '' }) {
    this._blobParts = blobParts;
    this.options = options;
  }
  async text() {
    return this._blobParts.join('');
  }
}
export default BlobMock;
