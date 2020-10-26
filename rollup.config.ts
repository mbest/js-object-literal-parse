import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import sourceMaps from "rollup-plugin-sourcemaps";
import camelCase from "lodash.camelcase";
import typescript from "rollup-plugin-typescript2";
import json from "rollup-plugin-json";

const pkg = require("./package.json");

const libraryName = "object-literal-parse";

export default {
  input: "object-literal-parse.ts",
  output: [
    {
      file: pkg.main,
      name: camelCase(libraryName),
      format: "umd",
      sourcemap: true,
    },
    { file: pkg.module, format: "es", sourcemap: true },
  ],
  external: [],
  watch: {
    include: "object-literal-parse.ts",
  },
  plugins: [
    json(),
    typescript({ useTsconfigDeclarationDir: true }),
    commonjs(),
    resolve(),
    sourceMaps(),
  ],
};
