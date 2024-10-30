let { CompressionStream, DecompressionStream } = globalThis;

if (!CompressionStream) {
  // original idea: MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource>
  // @see https://github.com/oven-sh/bun/issues/1723#issuecomment-1774174194
  const {
    createGzip, createGunzip,
    createDeflate, createInflate,
    createDeflateRaw, createInflateRaw,
  } = await import('node:zlib');

  class Stream {
    constructor(compress, format) {
      let handler;
      if (format === 'gzip')
        handler = compress ? createGzip() : createGunzip();
      else if (format === 'deflate')
        handler = compress ? createDeflate() : createInflate();
      else if (format === 'deflate-raw')
        handler = compress ? createDeflateRaw() : createInflateRaw();
      else {
        throw new TypeError([
          `Failed to construct '${this.constructor.name}'`,
          `Unsupported compression format: '${format}'`
        ].join(': '));
      }

      this.readable = new ReadableStream({
        type: 'bytes',
        start: controller => {
          handler.on('data', chunk => controller.enqueue(chunk));
          handler.once('end', () => controller.close());
        },
      });

      this.writable = new WritableStream({
        write: chunk => handler.write(chunk),
        close: () => handler.end(),
      });
    }
  }

  CompressionStream = class CompressionStream extends Stream {
    constructor(format) {
      super(true, format);
    }
  }

  DecompressionStream = class DecompressionStream extends Stream {
    constructor(format) {
      super(false, format);
    }
  }
}

export { CompressionStream, DecompressionStream };
