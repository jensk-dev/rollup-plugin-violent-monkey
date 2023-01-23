import type { OutputOptions, SourceMap } from "rollup";
import type { Plugin } from "vite";

import {
  metadata as metadataParser,
  Metadata,
  grant as grantParser,
  Grant,
  primitiveField,
  MetadataKey
} from "./schema";
import { UserScript } from "./user-script";

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

export function defineMetadata(opts: Metadata): Metadata {
  return opts;
}

export async function plugin(metadata: Metadata): Promise<Plugin> {
  const script = await UserScript.from(metadata);

  console.log(script);

  const _moduleGrants: Map<string, Grant[]> = new Map();
  const _grantRegex: RegExp = /(GM(?:\.|_)\S+?|window\.(?:focus|close))\s*?\(/g;
  const _defaultGrants: Grant[] = [];
  const _headers: string[] = [];

  function addMetadata(key: string, val: string) {
    return `// @${key} ${val}\n`;
  }

  function toKebab(str: string) {
    return str.replace(/[A-Z]/g, char => `-${char.toLowerCase()}`);
  }

  if (!metadata) {
    throw new Error("Required parameter metadata is undefined");
  }

  const result = await metadataParser.safeParseAsync(metadata);

  if (!result.success) {
    const err = result.error.errors.pop();

    throw new Error(
      `Validation of Violent Monkey metadata failed: metadata.${err?.path.join(
        "."
      )} (${err?.message})`
    );
  }

  const md = result.data;

  if (md.grants) {
    _defaultGrants.push(...md.grants);
  }

  for (const field in md) {
    const result = primitiveField.safeParse(md[field as MetadataKey]);

    if (!result.success || !result.data) {
      continue;
    }

    let fmt: string;

    if (field.endsWith("Url")) {
      fmt = field.replace("Url", "URL");
    } else {
      fmt = toKebab(field);
    }

    _headers.push(addMetadata(fmt, result.data as string));
  }

  if (md.require) {
    _headers.push(...md.require.map(r => addMetadata("require", r)));
  }

  if (md.include) {
    _headers.push(...md.include.map(i => addMetadata("include", i)));
  }

  if (md.exclude) {
    _headers.push(...md.exclude.map(e => addMetadata("exclude", e)));
  }

  if (md.match) {
    _headers.push(...md.match.map(m => addMetadata("match", m)));
  }

  if (md.excludeMatch) {
    _headers.push(
      ...md.excludeMatch.map(em => addMetadata("exclude-match", em))
    );
  }

  if (md.resources) {
    for (const key in md.resources) {
      const value = md.resources[key];
      _headers.push(addMetadata("resource", `${key} ${value}`));
    }
  }

  if (md.localizedDescription) {
    for (const key in md.localizedDescription) {
      const value = md.localizedDescription[key];
      _headers.push(addMetadata(`description:${key}`, value));
    }
  }

  if (md.localizedName) {
    for (const key in md.localizedName) {
      const value = md.localizedName[key];
      _headers.push(addMetadata(`name:${key}`, value));
    }
  }

  return {
    name: "violent-monkey",
    /**
     * Store all grants found in the code.
     */
    async transform(code, id) {
      const grants: Grant[] = [];

      // find all grants from code and parse and validate them
      for (const match of code.matchAll(_grantRegex)) {
        if (match.length > 0) {
          const res = await grantParser.safeParseAsync(match[1]);

          if (res.success) {
            grants.push(res.data);
          }
        }
      }

      // filter all duplicate grants
      _moduleGrants.set(id, [...new Set(grants)]);

      return code;
    },
    generateBundle(
      _options: OutputOptions,
      bundle: { [fileName: string]: AssetInfo | ChunkInfo },
      _isWrite: boolean
    ) {
      const headers: string[] = [..._headers];

      // Get all grants from config & code and append to header
      let grants: Grant[] = [];

      // Get module grants
      for (const kvp of _moduleGrants) {
        grants.push(...kvp[1]);
      }

      // Combine module grants and default grants
      grants = [...new Set([...grants, ..._defaultGrants])].sort();

      if (grants.length > 0) {
        for (const grant of grants) {
          headers.push(addMetadata("grant", grant));
        }
      } else {
        headers.push(addMetadata("grant", "none"));
      }

      // Generate metadata
      let metadataBlock = "// ==UserScript==\n";

      for (const header of headers) {
        metadataBlock += header;
      }

      metadataBlock += "// ==/UserScript==\n";

      // Append to the entrypoints
      for (const fileName in bundle) {
        const fileInfo = bundle[fileName];

        if (fileInfo.type !== "chunk" || !fileInfo.isEntry) {
          continue;
        }

        fileInfo.code = `${metadataBlock}\n${fileInfo.code}`;
      }
    }
  } as Plugin;
}
