const fs = require('fs');
let code = fs.readFileSync('app/image-tools/image-converter/page.tsx', 'utf8');

code = code.replace(
  "import Header from '@/components/header';",
  "import { Header } from '@/components/header';"
);
code = code.replace(
  "import Footer from '@/components/footer';",
  "import { Footer } from '@/components/footer';"
);

fs.writeFileSync('app/image-tools/image-converter/page.tsx', code);
