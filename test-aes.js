const { encryptPDF } = require('@pdfsmaller/pdf-encrypt');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function test() {
  const doc = await PDFDocument.create();
  doc.addPage([500, 500]);
  const bytes = await doc.save();
  
  const encrypted = await encryptPDF(new Uint8Array(bytes), 'hello');
  fs.writeFileSync('enc.pdf', encrypted);
  
  try {
    await PDFDocument.load(encrypted, { password: 'hello' });
    console.log('PDF-lib loaded AES-256 successfully');
  } catch (e) {
    console.error('PDF-lib failed:', e.message);
  }
}
test();
