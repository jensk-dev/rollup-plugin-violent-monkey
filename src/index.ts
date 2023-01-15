import { resolve } from "path";
import { pathToFileURL } from "url";
import type { OutputOptions, SourceMap } from "rollup";
import type { Plugin } from "vite";
import Ajv from "ajv";

export type ViolentMonkeyGrant =
  "GM_info" |
  "GM_getValue" |
  "GM_setValue" |
  "GM_deleteValue" |
  "GM_listValues" |
  "GM_addValueChangeListener" |
  "GM_removeValueChangeListener" |
  "GM_getResourceText" |
  "GM_getResourceURL" |
  "GM_addElement" |
  "GM_addStyle" |
  "GM_openInTab" |
  "GM_registerMenuCommand" |
  "GM_unregisterMenuCommand" |
  "GM_notification" |
  "GM_setClipboard" |
  "GM_xmlhttpRequest" |
  "GM_download" |
  "GM.addStyle" |
  "GM.addElement" |
  "GM.registerMenuCommand" |
  "GM.deleteValue" |
  "GM.getResourceUrl" |
  "GM.getValue" |
  "GM.info" |
  "GM.listValues" |
  "GM.notification" |
  "GM.openInTab" |
  "GM.setClipboard" |
  "GM.setValue" |
  "GM.xmlHttpRequest" |
  "window.close" |
  "window.focus"

export type ViolentMonkeyOptions = {
  name: string,
  localizedName?: {
    [locale: string]: string
  },
  namespace?: string,
  match?: string,
  excludeMatch?: string,
  include?: string,
  exclude?: string,
  version?: string,
  description?: string,
  localizedDescription?: {
    [locale: string]: string
  },
  icon?: string,
  require?: string,
  resource?: string,
  runAt?: "document-end" | "document-start" | "document-idle",
  noframes?: boolean,
  grants?: ViolentMonkeyGrant[],
  injectInto?: "page" | "content" | "auto",
  downloadUrl?: string,
  supportUrl?: string,
  homepageUrl?: string,
  unwrap?: string
}

type ChunkInfo = {
  code: string;
  dynamicImports: string[];
  exports: string[];
  facadeModuleId: string | null;
  fileName: string;
  implicitlyLoadedBefore: string[];
  imports: string[];
  importedBindings: { [imported: string]: string[] };
  isDynamicEntry: boolean;
  isEntry: boolean;
  isImplicitEntry: boolean;
  map: SourceMap | null;
  modules: {
    [id: string]: {
      renderedExports: string[];
      removedExports: string[];
      renderedLength: number;
      originalLength: number;
      code: string | null;
    };
  };
  moduleIds: string[];
  name: string;
  referencedFiles: string[];
  type: "chunk";
};

type AssetInfo = {
  fileName: string;
  name?: string;
  source: string | Uint8Array;
  type: "asset";
};

function toKebab(str: string) {
  return str.replace(/[A-Z]/g, char => `-${char.toLowerCase()}`);
}

async function tryGetCfg(): Promise<ViolentMonkeyOptions> {
  const cfgFilePath = pathToFileURL(resolve(process.cwd(), "violentmonkey.metadata.js"));
  return (await import(cfgFilePath.toString())).default;
}

async function tryGetSchema(): Promise<any> {
  return (await import("./schema.json")).default;
}

function addMetadata(key: string, val: string) {
  return `// @${key} ${val}\n`;
}

async function getMetadataBlock(): Promise<string> {
  const [schema, cfg] = await Promise.all([
    tryGetSchema(),
    tryGetCfg()
  ]);

  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  if (!validate(cfg) && validate.errors && validate.errors.length > 0) {
    throw new Error("Config is not valid.");
  }

  let metadata = "// ==UserScript==\n";

  for (const property in cfg) {
    let prop: string;
    const val = cfg[property as never] as unknown;

    if (property.endsWith("Url")) {
      prop = property.replace("Url", "URL");
    } else {
      prop = toKebab(property);
    }

    if (prop === "grants" && Array.isArray(val)) {
      if (val.length === 0) {
        metadata += addMetadata("grant", "none");
      } else {
        for (const grant of val) {
          metadata += addMetadata("grant", grant);
        }
      }

      continue;
    }

    if (prop.startsWith("localized") && typeof val === "object") {
      for (const locale in val) {
        metadata += addMetadata(
          `${prop.split("-")[1]}:${locale}`,
          val[locale as never] as string
        );
      }

      continue;
    }

    metadata += addMetadata(prop, val as string);
  }

  metadata += "// ==/UserScript==\n";

  return metadata;
}

export function defineMetadata(opts: ViolentMonkeyOptions): ViolentMonkeyOptions {
  return opts;
}

export default function ViolentMonkey(): Plugin {
  return {
    name: "violent-monkey",
    async generateBundle(_options: OutputOptions, bundle: { [fileName: string]: AssetInfo | ChunkInfo }, _isWrite: boolean): Promise<void> {
      for (const fileName in bundle) {
        const info = bundle[fileName];

        if (info.type !== "chunk" || !info.isEntry) {
          continue;
        }

        try {
          const metadata = await getMetadataBlock();
          const code = `${metadata}\n${info.code}`;

          info.code = code;
        } catch (err) {
          this.warn((err as Error).message);
        }
      }
    }
  } as Plugin;
}
