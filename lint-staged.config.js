// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ESLint } = require('eslint')

const removeIgnoredFiles = async (files) => {
  const eslint = new ESLint()
  const isIgnored = await Promise.all(
    files.map((file) => {
      return eslint.isPathIgnored(file)
    })
  )
  const filteredFiles = files.filter((_, i) => !isIgnored[i])
  return filteredFiles
}

module.exports = {
  // sort package.json
  'package.json': 'sort-package-json',

  // format all files recognized by prettier
  '*': 'prettier --ignore-unknown --write --cache',

  // lint src javascript
  '*.{js,ts}': async (filenames) => {
    const filesToLint = await removeIgnoredFiles(filenames)
    return [`eslint --cache --fix --max-warnings 0 ${filesToLint.join(' ')}`]
  },
}
