import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser'

// this is a workaround for 
// https://github.com/rollup/plugins/issues/1253
import { readFileSync } from 'fs';

const tsconfig = JSON.parse(readFileSync('./tsconfig.json'))
console.log(tsconfig)

export default {
  input: './src/index.ts',
  output: [
    {
      file: 'lib/makeshift-msg.mjs',
      format: 'module',
    },
    {
      file: 'lib/makeshift-msg.umd.js',
      format: 'cjs',
    },
  ],
  plugins: [
    nodeResolve({
      exportConditions: ['node'],
    }),
    typescript(tsconfig),
    commonjs(),
    terser()
  ]
};