import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  externals: ["vite"],
  declaration: true,
  clean: true,
  failOnWarn: true,
  rollup: {
    esbuild: {
      minify: true
    }
  }
});
