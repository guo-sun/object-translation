import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/index.umd.js',
        format: 'umd',
        name: 'object-translation'
    },
    plugins: [
        babel({
            presets: [
                [
                    "@babel/preset-env",
                    {
                        targets: {
                            node: "current",
                        },
                        modules: false
                    }
                ]
            ]
        }),
        terser()
    ]
};
