class FileReaderMock {
  static _fileData: string;
  onload: undefined | ((event: ProgressEvent<FileReader>) => void);
  readAsText(file: File) {
    if (this.onload) {
      this.onload({
        target: {
          result: FileReaderMock._fileData
        }
      } as ProgressEvent<FileReader>);
    }
  }
}

export default FileReaderMock;
