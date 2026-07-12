const fs = require('fs');
let code = fs.readFileSync('app/globals.css', 'utf8');

code = code.replace(/select \{[^}]+\}/g, `select {
    @apply bg-background text-foreground border-border rounded-md px-2 py-1;
    color: hsl(var(--foreground));
    background-color: hsl(var(--background));
  }`);

code = code.replace(/option \{[^}]+\}/g, `option {
    color: hsl(var(--foreground));
    background-color: hsl(var(--background));
  }`);

fs.writeFileSync('app/globals.css', code);
