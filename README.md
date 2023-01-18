# rollup-plugin-violent-monkey

> Prepends ViolentMonkey headers to your rollup bundle

## Template

Looking for a simple development environment? Have a look at [vite-violent-monkey](https://github.com/jensk-dev/vite-violent-monkey/).

## Features
* Pass metadata directly via the `options` object to the plugin
* Define an external config file via the `defineMetadata`. Works with TypeScript or JavaScript.
* Automatically finds grants from all imported modules and includes them in the bundle

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