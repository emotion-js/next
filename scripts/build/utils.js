const path = require('path')
const globby = require('globby')
const del = require('del')
const makeRollupConfig = require('./rollup.config')

const rootPath = path.resolve(__dirname, '..', '..')

exports.cleanDist = async function cleanDist() {
  await del(`${rootPath}/packages/*/dist`, { force: true, cwd: rootPath })
}

exports.getPackages = async function getPackages() {
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
    ret.outputConfigs = getOutputConfigs(ret)
    return ret
  })
  return packages
}

function getOutputConfigs(pkg) {
  const cjsPath = path.resolve(pkg.path, pkg.pkg.main)
  const esmPath = path.resolve(pkg.path, pkg.pkg.module)
  return [
    {
      format: 'es',
      sourcemap: true,
      file: esmPath
    },
    {
      format: 'cjs',
      sourcemap: true,
      file: cjsPath
    }
  ]
}
