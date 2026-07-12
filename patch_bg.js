const fs = require('fs');
let code = fs.readFileSync('lib/tools.ts', 'utf8');

const newTool = `      {
        id: "background-remover",
        title: "AI Background Remover",
        description: "Remove image backgrounds instantly with AI. Export as transparent PNG.",
        icon: ImageIcon,
        href: "/image-tools/background-remover",
        isNew: true,
        isPopular: true,
      },
`;

code = code.replace(
  'id: "crop-image",',
  newTool + '      {\n        id: "crop-image",'
);

fs.writeFileSync('lib/tools.ts', code);
