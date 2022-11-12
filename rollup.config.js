import nodeResolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import typescript from '@rollup/plugin-typescript'

const babelConfig = require('./babel.config')

const isExternal = function (id) {
  return id.startsWith("use-sync-external-store") || id.startsWith('react');
};

function esmConfig(file) {
  return {
    input: `src/${file}.ts`,
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
    plugins: [nodeResolve({ extensions: [".js", ".ts"] }), typescript({})],
  };
}

function cjsConfig(file) {
  return {
    input: `src/${file}.ts`,
    output: [
      {
        file: `dist/${file}.js`,
        format: "cjs",
      },
    ],
    external: isExternal,
    plugins: [
      nodeResolve({ extensions: [".js", ".ts"] }),
      babel({
        ...babelConfig,
        extensions: [".js", ".ts"],
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