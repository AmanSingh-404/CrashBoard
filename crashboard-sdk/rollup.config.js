import resolve  from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser   from '@rollup/plugin-terser'

export default {
  input: 'src/index.js',
  output: [
    // CommonJS build — for Node.js / require()
    {
      file:    'dist/index.js',
      format:  'cjs',
      exports: 'default',
    },
    // ES Module build — for React / import
    {
      file:   'dist/index.esm.js',
      format: 'esm',
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    terser(),   // minify the output
  ],
}