const fs = require('fs');
let code = fs.readFileSync('lib/tools.ts', 'utf8');

code = code.replace(
  '      {\n              {\n        id: "image-converter",',
  '      {\n        id: "image-converter",'
);

fs.writeFileSync('lib/tools.ts', code);
