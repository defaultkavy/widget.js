/**
 * This program is use for write export all class and types in index.ts, make this function automatically.
 */

const fs = require('fs');

const dir = fs.readdirSync('src');

const excludes = ['index.ts'];
let result = '';

for (const folder of dir) {
    if (excludes.includes(folder)) continue;
    const files = fs.readdirSync(`src/${folder}`);
    for (const file of files) {
        result += `export * from './${folder}/${file.replace('.ts', '')}';\n`
    }
}

const data = fs.readFileSync('src/index.ts', 'utf-8');

const save = data.split('// exports class')[0];
result = `${save}// exports class\n${result}`

fs.writeFileSync('src/index.ts', result);