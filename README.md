# rollup-plugin-violent-monkey

> Prepends ViolentMonkey headers to your rollup bundle

## Features
* Metadata autocomplete using ``defineMetadata`` in ``violentmonkey.metadata.js``
* Automatically finds grants from code and includes them in the bundle

## Usage

Install package:

```sh
# npm
npm i -D rollup-plugin-violent-monkey

# pnpm
pnpm i -D rollup-plugin-violent-monkey
```

Vite Usage:

```js
// vite.cofig.js
import { defineConfig } from "vite";
import { plugin as violentMonkey } from "rollup-plugin-violent-monkey";

export default defineConfig({
    build: {
        rollupOptions: {
            plugins: [violentMonkey()],
        },
    },
});
```

Rollup Usage:

```js
// rollup.config.js
import { plugin as violentMonkey } from "rollup-plugin-violent-monkey";

export default {
    plugins: [violentMonkey()],
};
```

To use the plugin, a metadata file must be provided at the root of your vite/rollup project. Use the included type definitions to add or remove data

```js
// violentmonkey.metadata.js
import { defineMetadata } from "rollup-plugin-violent-monkey";

export default defineMetadata({
  name: "My Violent Script",
  downloadUrl: "github.com/myviolentscriptgist.js",
  grants: ["GM_addElement", "GM.addStyle", "window.focus"],
});
```