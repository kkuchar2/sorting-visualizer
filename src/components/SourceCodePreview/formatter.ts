export const cleanSource = (source: string) => {
  let newSource = source

  newSource = newSource.replace(/^import\s[\s\S]*?from\s+['"][^'"]+['"]\s*;?\s*\n?/gm, '')
  newSource = newSource.replace(/^import\s+['"][^'"]+['"]\s*;?\s*\n?/gm, '')

  newSource = newSource.replace(/async function notifyStep[\s\S]*?\n}\n?/m, '')
  newSource = newSource.replace(
    /\n\s*if \(pos % IMAGE_SORT_WRITE_BATCH === 0\) \{\n\s*const shouldContinue = await notifyStep\(pos - 1\)\n\s*if \(!shouldContinue\) \{\n\s*return\n\s*\}\n\s*\}/g,
    '',
  )
  newSource = newSource.replace(
    /\n\s*if \(n % IMAGE_SORT_WRITE_BATCH !== 0\) \{\n\s*const shouldContinue = await notifyStep\(n - 1\)\n\s*if \(!shouldContinue\) \{\n\s*return\n\s*\}\n\s*\}/g,
    '',
  )
  newSource = newSource.replace(/^\s*const data = sortState\.data\s*$/m, '')

  const lines = newSource.split('\n')

  const exportPattern = /^export.*/
  const setSoundPattern = /setSound/
  const notifyPattern = /notifySortUpdate/
  const abortPattern = /if \(IsAborted\(\)\)\s*{[^}]*}/
  const checkSortPausePattern = /await CheckSortPause/
  const promiseTimeoutPattern = /await PromiseTimeout/
  const shouldContinuePattern = /shouldContinue/

  const filteredLines = lines.filter((line) => {
    return !(
      setSoundPattern.test(line) ||
      exportPattern.test(line) ||
      notifyPattern.test(line) ||
      abortPattern.test(line) ||
      checkSortPausePattern.test(line) ||
      promiseTimeoutPattern.test(line) ||
      shouldContinuePattern.test(line)
    )
  })

  newSource = filteredLines.filter((line) => line.trim() !== '').join('\n')

  newSource = newSource.replace(/sortState\.data/g, 'data')
  newSource = newSource.replace(/if\s*\(\s*IsAborted\s*\(\s*\)\s*\)\s*\{[\s\S]*?\}/g, '')
  newSource = newSource.replace(/^\s*await CheckSortPause\(\);?\s*$/gm, '')
  newSource = newSource.replace(/^\s*await PromiseTimeout\([^)]*\);?\s*$/gm, '')
  newSource = newSource.replace(/^\s*notifySortUpdate\([^)]*\);?\s*$/gm, '')
  newSource = newSource.replace(/async function (\w+)\(\)/g, 'function $1()')
  newSource = newSource.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '')
  newSource = newSource.replace(/\n{3,}/g, '\n\n').trim()

  return newSource
}
