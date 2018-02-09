const rollup = require('rollup')
const path = require('path')
const globby = require('globby')
const fs = require('fs')
const { promisify } = require('util')
const del = require('del')
const makeRollupConfig = require('./rollup.config')
const chalk = require('chalk')

const writeFile = promisify(fs.writeFile)

const rootPath = path.resolve(__dirname, '..', '..')

async function doBuild() {
  await del(`${rootPath}/packages/*/dist`, { force: true, cwd: rootPath })
  const packagePaths = await globby('packages/*/', {
    cwd: rootPath,
    nodir: false
  })
  const packages = packagePaths.map(packagePath => {
    const fullPackagePath = path.resolve(rootPath, packagePath)
    const ret = {
      path: fullPackagePath,
      name: packagePath.split(path.sep)[1],
      pkg: require(path.resolve(fullPackagePath, 'package.json'))
    }
    ret.config = makeRollupConfig(ret)
    return ret
  })

  await Promise.all(
    packages.map(async pkg => {
      const bundle = await rollup.rollup(pkg.config)
      const cjsPath = path.resolve(pkg.path, pkg.pkg.main)
      const esmPath = path.resolve(pkg.path, pkg.pkg.module)
      await Promise.all([
        bundle
          .write({
            format: 'es',
            sourcemap: true,
            file: esmPath
          })
          .then(() =>
            console.log(chalk.magenta('Generated cjs bundle for', pkg.pkg.name))
          ),
        bundle
          .write({
            format: 'cjs',
            sourcemap: true,
            file: cjsPath
          })
          .then(() =>
            console.log(chalk.magenta('Generated esm bundle for', pkg.pkg.name))
          )
      ])
      await writeFlowFiles([esmPath, cjsPath], bundle.exports)
      console.log(chalk.magenta('Wrote flow files for', pkg.pkg.name))
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
