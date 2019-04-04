import { terser } from 'rollup-plugin-terser'

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/object-translation.esm.js',
        format: 'esm'
    },
    plugins: [
        terser()
    ]
};
