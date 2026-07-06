export const cleanSource = (source: string) => {
  let lines = source.split('\n')

  const importPattern = /^import.*/
  const exportPattern = /^export.*/
  const setSoundPattern = /setSound.*/
  const notifyPattern = /notifySortUpdate\(\);/
  const abortPattern = /if \(IsAborted\(\)\)\s*{[^}]*}/
  const checkSortPausePattern = /await CheckSortPause\(\);/

  lines = lines.filter((line) => {
    return !(
      importPattern.test(line) ||
      setSoundPattern.test(line) ||
      exportPattern.test(line) ||
      notifyPattern.test(line) ||
      abortPattern.test(line) ||
      checkSortPausePattern.test(line)
    )
  })

  let newSource = lines.filter((line) => line.trim() !== '').join('\n')

  newSource = newSource.replace(/sortState\.data/g, 'data')
  newSource = newSource.replace(/if\s*\(\s*IsAborted\s*\(\s*\)\s*\)\s*\{[\s\S]*?\}/g, '')
  newSource = newSource.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '')
  newSource = newSource.replace(/^\s*[\r\n]/gm, '').trim()

  return newSource
}
