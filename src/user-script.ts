import { isMaps, isPrimitives, isSets, Maps, Primitives, RawMetadata, Sets } from "./schema/complex";

export class UserScript {
  private primitives: Primitives;
  private sets: Sets; // todo, infer type from MetaArrays[MetaArraysKey][number]
  private maps: Maps;

  constructor(name: string) {
    this.primitives = isPrimitives.parse({ name });
    this.sets = { };
    this.maps = { };
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
}
