import type { OutputOptions } from "rollup";
import type { Plugin } from "vite";

import { RawMetadata } from "./schema/index";
import { Grant, isGrant } from "./schema/primitives";

import { UserScript } from "./user-script";

export function defineMetadata(opts: RawMetadata): RawMetadata {
  return opts;
}

export async function plugin(metadata: RawMetadata): Promise<Plugin> {
  const script = await UserScript.from(metadata);

  const defaultGrants = script.getSet("grants");
  const codeGrants = new Map<string, Set<Grant>>();
  const grantRegex: RegExp = /(GM(?:\.|_)\S+?|window\.(?:focus|close))\s*?\(/g;

  return {
    name: "violent-monkey",
    /**
     * Store all grants found in the code.
     */
    async transform(code, id) {
      codeGrants.delete(id);

      const grants = new Set<Grant>();

      for (const match of code.matchAll(grantRegex)) {
        if (match.length > 0) {
          const res = await isGrant.safeParseAsync(match[1]);

          if (res.success) {
            grants.add(res.data);
          }
        }
      }

      if (grants.size > 0) {
        codeGrants.set(id, grants);
      }

      return code;
    },
    generateBundle(
      _options: OutputOptions,
      bundle,
      _isWrite: boolean
    ) {
      /**
       * Get all grants from code & config
       */
      const grants: Grant[] = [];

      for (const codeGrant of codeGrants.values()) {
        grants.push(...codeGrant);
      }

      if (defaultGrants) {
        grants.push(...defaultGrants);
      }

      script.setSet("grants", new Set(grants));

      /**
       * Generate header info
       */
      const headers = script.toString();

      /**
       * Append to the entry points
       */
      for (const fileName in bundle) {
        const fileInfo = bundle[fileName];

        if (fileInfo.type !== "chunk" || !fileInfo.isEntry) {
          continue;
        }

        fileInfo.code = `${headers}\n${fileInfo.code}`;
      }
    }
  } as Plugin;
}
