const rollup = require('rollup')
const fs = require('fs')
const { promisify } = require('util')
const chalk = require('chalk')
const { getPackages, cleanDist } = require('./utils')

const writeFile = promisify(fs.writeFile)

async function doBuild() {
  await cleanDist()
  const packages = await getPackages()
  await Promise.all(
    packages.map(async pkg => {
      const bundle = await rollup.rollup(pkg.config)

      await Promise.all(
        pkg.outputConfigs.map(config => {
          return bundle.write(config).then(() => {
            console.log(
              chalk.magenta(
                `Generated ${config.format} bundle for`,
                pkg.pkg.name
              )
            )
          })
        })
      )
      if (pkg.UMDConfig) {
        const UMDBundle = await rollup.rollup(pkg.UMDConfig)
        await UMDBundle.write(pkg.UMDOutputConfig).then(() => {
          console.log(
            chalk.magenta(
              `Generated ${pkg.UMDOutputConfig.format} bundle for`,
              pkg.pkg.name
            )
          )
        })
      }
      if (!pkg.name.endsWith('.macro')) {
        await writeFlowFiles(
          pkg.outputConfigs.map(({ file }) => file),
          bundle.exports
        )
        console.log(chalk.magenta('Wrote flow files for', pkg.pkg.name))
      }
    })
  )
}

async function writeFlowFiles(paths, exportNames) {
  return Promise.all(
    paths.map(async path => {
      await writeFile(
        path + '.flow',
        `// @flow
export * from '../src/index.js'${
          exportNames.indexOf('default') !== -1
            ? `\nexport { default } from '../src/index.js'`
            : ''
        }\n`
      )
    })
  )
}

doBuild()
