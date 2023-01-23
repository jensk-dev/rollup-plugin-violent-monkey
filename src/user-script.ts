import { isMaps, isPrimitives, isSets, Maps, Metadata, Primitives, RawMetadata, Sets } from "./schema/complex";

export class UserScript {
  private headers: string;
  private shouldRebuild: boolean;

  private static fieldMap: Record<keyof Metadata, string> = {
    name: "name",
    namespace: "namespace",
    version: "version",
    description: "description",
    icon: "icon",
    downloadUrl: "downloadURL",
    supportUrl: "supportURL",
    homepageUrl: "homepageURL",
    runAt: "run-at",
    injectInto: "inject-into",
    noframes: "noframes",
    unwrap: "unwrap",
    localizedName: "name",
    localizedDescription: "description",
    resources: "resource",
    match: "match",
    excludeMatch: "exclude-match",
    include: "include",
    exclude: "exclude",
    grants: "grant",
    require: "require"
  };

  private primitives: Primitives;
  private sets: Sets; // todo, infer type from MetaArrays[MetaArraysKey][number]
  private maps: Maps;

  constructor(name: string) {
    this.primitives = isPrimitives.parse({ name });
    this.sets = { };
    this.maps = { };
    this.headers = "";
    this.shouldRebuild = true;
  }

  public static async from(metadata: RawMetadata) {
    const [primitives, sets, maps] = await Promise.all([
      isPrimitives.parseAsync(metadata),
      isSets.parseAsync(metadata),
      isMaps.parseAsync(metadata)
    ]);

    const script = new UserScript(primitives.name);

    script.primitives = primitives;
    script.sets = sets;
    script.maps = maps;

    return script;
  }

  private static formatMetadata(key: string, val: string) {
    return `// @${key} ${val}\n`;
  }

  private primitivesToString() {
    let string = "";

    const keys = Object.keys(this.primitives) as (keyof Primitives)[];
    const values = Object.values(this.primitives);

    if (keys.length !== values.length) {
      throw new Error("Could not iterate key-value pairs, key count does not match value count");
    }

    const n = keys.length;

    for (let i = 0; i < n; i++) {
      const key = UserScript.fieldMap[keys[i]];
      const value = values[i];

      string += UserScript.formatMetadata(key, value.toString());
    };

    return string;
  }

  private setsToString() {
    let string = "";

    const keys = Object.keys(this.sets) as (keyof Sets)[];
    const values = Object.values(this.sets);

    if (keys.length !== values.length) {
      throw new Error("Could not iterate key-value pairs, key count does not match value count");
    }

    const n = keys.length;

    for (let i = 0; i < n; i++) {
      const key = UserScript.fieldMap[keys[i]];

      for (const value of values[i].values()) {
        string += UserScript.formatMetadata(key, value);
      };
    };

    return string;
  }

  private mapsToString() {
    let string = "";

    const keys = Object.keys(this.maps) as (keyof Maps)[];
    const values = Object.values(this.maps);

    if (keys.length !== values.length) {
      throw new Error("Could not iterate key-value pairs, key count does not match value count");
    }

    const n = keys.length;

    for (let i = 0; i < n; i++) {
      const key = keys[i];
      const mappedKey = UserScript.fieldMap[key];

      if (key.startsWith("localized")) {
        for (const [locale, value] of values[i].entries()) {
          string += UserScript.formatMetadata(`${mappedKey}:${locale}`, value);
        }
      } else {
        for (const [id, value] of values[i].entries()) {
          string += UserScript.formatMetadata(mappedKey, `${id} ${value}`);
        }
      }
    }

    return string;
  }

  public toString() {
    if (!this.shouldRebuild) {
      return this.headers;
    }

    let headers = "// ==UserScript==\n";

    headers += this.primitivesToString();
    headers += this.setsToString();
    headers += this.mapsToString();

    headers += "// ==/UserScript==\n";

    this.headers = headers;
    this.shouldRebuild = false;

    return this.headers;
  }
}
