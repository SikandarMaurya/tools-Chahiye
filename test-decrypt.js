const { decryptPDF, isEncrypted } = require('@pdfsmaller/pdf-decrypt');
const { encryptPDF } = require('@pdfsmaller/pdf-encrypt');
const fs = require('fs');

async function test() {
  const bytes = fs.readFileSync('test.pdf'); // unencrypted pdf
  const encrypted = await encryptPDF(new Uint8Array(bytes), '', { ownerPassword: 'owner' });
  
  const info = await isEncrypted(encrypted);
  console.log(info);
  
  try {
    const dec = await decryptPDF(encrypted, '');
    console.log('Decrypted with empty pwd!', dec.length);
  } catch (e) {
    console.error('failed:', e.message);
  }
}
test();
