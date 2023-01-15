# rollup-plugin-violent-monkey

> Prepends ViolentMonkey headers to your rollup bundle

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
import ViolentMonkey from "rollup-plugin-violent-monkey";

export default defineConfig({
    build: {
        rollupOptions: {
            plugins: [ViolentMonkey()]
        },
    },
});
```

Rollup Usage:

```js
// rollup.config.js
import ViolentMonkey from "rollup-plugin-violent-monkey";

export default {
    plugins: [ViolentMonkey()]
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