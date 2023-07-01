import parserBabel from 'prettier/parser-babel';
import prettier from 'prettier/standalone';

export const processSource = (source: string) => {
    // Split the source into lines
    let lines = source.split('\n');

    // Define patterns that need to be removed
    const importPattern = /^import.*/;
    const exportPattern = /^export.*/;
    const setSoundPattern = /setSound.*/;
    const notifyPattern = /notifySortUpdate\(\);/;
    const abortPattern = /if \(IsAborted\(\)\)\s*{[^}]*}/;
    const checkSortPausePattern = /await CheckSortPause\(\);/;

    // Remove lines that match the patterns
    lines = lines.filter((line) => {
        return !(
            importPattern.test(line) ||
            setSoundPattern.test(line) ||
            exportPattern.test(line) ||
            notifyPattern.test(line) ||
            abortPattern.test(line) ||
            checkSortPausePattern.test(line)
        );
    });

    // Join the lines back together, excluding any resulting empty lines
    let newSource = lines.filter(line => line.trim() !== '').join('\n');

    // Replace sortState.data with 'data'
    newSource = newSource.replace(/sortState\.data/g, 'data');

    newSource = newSource.replace(/if\s*\(\s*IsAborted\s*\(\s*\)\s*\)\s*\{[\s\S]*?\}/g, '');

    // remove comments
    newSource = newSource.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '');

    // remove empty lines
    newSource = newSource.replace(/^\s*[\r\n]/gm, '');

    // Format with prettier
    prettier.format(newSource, {
        parser: 'babel',
        plugins: [parserBabel],
        semi: true,
        singleQuote: true,
        tabWidth: 4,
        useTabs: false,
        wrapLineLength: 40
    });

    return newSource;
};
