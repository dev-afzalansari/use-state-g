import nodeResolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";

const babelConfig = require('./babel.config')

const isExternal = function (id) {
  return id.startsWith("react-tivity");
};

function esmConfig(file) {
  return {
    input: `src/${file}.js`,
    output: [
      {
        file: `dist/esm/${file}.js`,
        format: "esm",
      },
      {
        file: `dist/esm/${file}.mjs`,
        format: "esm",
      },
    ],
    external: isExternal,
    plugins: [nodeResolve({ extensions: [".ts", ".js"] })],
  };
}

function cjsConfig(file) {
  return {
    input: `src/${file}.js`,
    output: [
      {
        file: `dist/${file}.js`,
        format: "cjs",
      },
    ],
    external: isExternal,
    plugins: [
      nodeResolve({ extensions: [".ts", ".js"] }),
      babel({
        ...babelConfig,
        extensions: [".js"],
        babelHelpers: "bundled",
      })
    ],
  };
}

export default function () {
  return [
    esmConfig("index"),
    cjsConfig("index")
  ];
}