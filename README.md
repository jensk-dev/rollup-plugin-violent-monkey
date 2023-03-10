# rollup-plugin-violent-monkey

## Disclaimer

> rollup-plugin-violent-monkey is actively being developed. The API is rapidly changing and considered unstable. Install or upgrade at your own risk!

## Template

Looking for a simple development environment? Have a look at [vite-violent-monkey](https://github.com/jensk-dev/vite-violent-monkey/).

## Features
* Pass metadata directly via the `options` object to the plugin. Works with TypeScript or JavaScript including type completion and validation.
* Define an external config file via the `defineMetadata`.
* Automatically finds grants from all imported modules and includes them in the bundle
* Importable type declarations for the `GM_*` & `GM.*` [API](https://violentmonkey.github.io/api/gm/) supported by ViolentMonkey.

### Planned

* Add `@require` fields based on code imports, excluding type imports.

## Usage

### Installation:

```sh
# npm
npm i -D rollup-plugin-violent-monkey

# pnpm
pnpm i -D rollup-plugin-violent-monkey
```

### Using Vite:

```ts
// vite.cofig.ts
import { defineConfig } from "vite";
import { plugin as violentMonkey } from "rollup-plugin-violent-monkey";

export default defineConfig({
    build: {
        rollupOptions: {
            plugins: [violentMonkey({
                // add your script metadata here
                //...
            })],
        },
    },
});
```

### Using Rollup:

```ts
// rollup.config.js
import { plugin as violentMonkey } from "rollup-plugin-violent-monkey";

export default {
    plugins: [violentMonkey({
        // add your script metadata here
        //...
    })],
};
```

### Using a standalone config file

```ts
// violentmonkey.metadata.ts or violentmonkey.metadata.js
import { defineMetadata } from "rollup-plugin-violent-monkey";

export default defineMetadata({
  name: "My Violent Script",
  downloadUrl: "github.com/myviolentscriptgist.js",
  grants: ["GM_addElement", "GM.addStyle", "window.focus"],
});
```

Then import it in your Rollup or Vite config:

```ts
// vite.config.ts
import { defineConfig } from "vite";
import { plugin as violentMonkey } from "rollup-plugin-violent-monkey";

import metadata from "./violentmonkey.metadata"

export default defineConfig({
    build: {
        rollupOptions: {
            plugins: [violentMonkey(metadata)],
        },
    },
});
```

```js
// rollup.config.js
import { plugin as violentMonkey } from "rollup-plugin-violent-monkey";

import metadata from "./violentmonkey.metadata"

export default {
    plugins: [violentMonkey(metadata)],
};
```

### Importing ViolentMonkey type declarations

Create a `.d.ts` file in the root of your source directory, and add the following:

```ts
/// <reference types="rollup-plugin-violent-monkey/context/violentmonkey" />
```
