// @flow
const { getPackages } = require('./utils')
const { promisify } = require('util')
const fs = require('fs')
const path = require('path')
const writeFile = promisify(fs.writeFileSync)

async function changePackages() {
  const packages = await getPackages()

  await Promise.all(
    packages.map(async pkg => {
      if (pkg.pkg.peerDependencies && pkg.pkg.peerDependencies['react']) {
        pkg.pkg.peerDependencies['react'] = '>=16.3.0 || >=16.3.0-alpha.0'
        await writeFile(
          path.resolve(pkg.path, 'package.json'),
          JSON.stringify(pkg.pkg, null, 2)
        )
      }
    })
  )
}

changePackages()
