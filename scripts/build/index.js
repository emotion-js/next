const rollup = require('rollup')
const fs = require('fs')
const { promisify } = require('util')
const chalk = require('chalk')
const { getPackages, cleanDist } = require('./utils')

const writeFile = promisify(fs.writeFile)

async function doBuild() {
  await cleanDist()
  const packages = await getPackages()
  // await changePackages(packages)
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
      if (!pkg.name.endsWith('.macro')) {
        await writeFlowFiles([esmPath, cjsPath], bundle.exports)
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

// async function changePackages(packages) {
//   await Promise.all(
//     packages.map(async pkg => {
//       if (
//         pkg.pkg.peerDependencies &&
//         pkg.pkg.peerDependencies['@emotion/core']
//       ) {
//         pkg.pkg.peerDependencies['@emotion/core'] = '0.x.x'
//       }
//       await writeFile(
//         path.resolve(pkg.path, 'package.json'),
//         JSON.stringify(pkg.pkg, null, 2)
//       )
//     })
//   )
// }

doBuild()
