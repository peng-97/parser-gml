import json from '@rollup/plugin-json';
import commonjs from 'rollup-plugin-commonjs';
const pkg = require('./package.json');

const banner = `/*!\n * ${pkg.name} v${pkg.version}\n * LICENSE : ${pkg.license}\n  AUTHOR  : ${pkg.author.name} \n* */`;
const basePlugins = [
    json(),commonjs()
];
module.exports = [
    {
        input: './src/index.js',
        plugins: basePlugins,
        external: [],
        output: {
            'sourcemap': true,
            'format': 'umd',
            'name': pkg.name,
            'banner': banner,
            'globals': {},
            'file': 'dist/index.js'
        }
    },
    {
        input: './src/index.js',
        plugins: basePlugins,
        external: [],
        output: {
            'sourcemap': true,
            'format': 'umd',
            'name': "parserGml",
            'banner': banner,
            'globals': {},
            'file': 'dist/parser-gml.js'
        }
    },
];
