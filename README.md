# compression-stream

A De/CompressionStream *ponyfill* for Bun, fully based on [Jimmy Wärting](https://github.com/oven-sh/bun/issues/1723#issuecomment-1774174194)'s idea.

This modules does not patch the *global* environment, it just provides native or polyfilled classes.

```js
import { CompressionStream, DecompressionStream } from '@ungap/compression-stream';

// that's literally it 🥳
```
