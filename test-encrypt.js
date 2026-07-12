const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function test() {
  const doc = await PDFDocument.create();
  doc.addPage([500, 500]);
  try {
    const bytes = await doc.save({ 
        userPassword: 'open', 
        ownerPassword: 'owner',
        permissions: {
            printing: 'highResolution'
        }
    });
    console.log('Saved with options, length:', bytes.length);
  } catch (e) {
    console.error(e);
  }
}
test();
