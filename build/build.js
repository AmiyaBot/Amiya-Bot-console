'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'

const ora = require('ora')
const rm = require('rimraf')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')
const COS = require('./cos')

const spinner = ora('building for production...')
spinner.start()

function createVersionFile (stats) {
    const files = Object.keys(stats.compilation.assets)
    const version = new Date().getTime().toString()

    files.unshift(version)

    fs.writeFileSync('.version', files.join('\n'), {flag: 'w+'})

    try {
        const cos = new COS()

        cos.putFile('console/.version', '.version')

        files.shift()
        for (let item of files) {
            cos.putFile(`console/${version}/${item}`, `dist/${item}`)
        }
    } catch (e) {
        console.log(e)
    }
}

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
    if (err) throw err
    webpack(webpackConfig, (err, stats) => {
        spinner.stop()
        if (err) throw err
        createVersionFile(stats)
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
            chunks: false,
            chunkModules: false
        }) + '\n\n')

        if (stats.hasErrors()) {
            console.log(chalk.red('  Build failed with errors.\n'))
            process.exit(1)
        }

        console.log(chalk.cyan('  Build complete.\n'))
        console.log(chalk.yellow(
            '  Tip: built files are meant to be served over an HTTP server.\n' +
            '  Opening index.html over file:// won\'t work.\n'
        ))
    })
})
