import { terser } from 'rollup-plugin-terser'

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/es6.js',
        format: 'umd',
        name: 'translator'
    },
    plugins: [
        terser()
    ]
};
