// rollup-plugin-my-example.js
import { OutputOptions, SourceMap } from "rollup";
import { Plugin } from "vite";

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

function SerializeInput() {
  throw new Error("Todo");
}

export default function ViolentMonkey(): Plugin {
  return {
    name: "violent-monkey", // this name will show up in warnings and errors
    renderChunk(_code: string, chunk: ChunkInfo, _options: OutputOptions, _meta: { chunks: {[id: string]: ChunkInfo} }): string | { code: string, map: SourceMap } | null {
      if (!chunk.isEntry) {
        return null;
      }

      // prepend Violent Monkey
      SerializeInput();
    }
  } as Plugin;
}
