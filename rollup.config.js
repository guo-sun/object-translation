import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/index.js',
        format: 'umd',
        name: 'translator'
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
