import sys

file_path = "components/pdf-to-image-client.tsx"
with open(file_path, "r") as f:
    content = f.read()

target1 = """      const pagesToProcess = parsePageSelection();
      const totalPages = pagesToProcess.length;
      
      const zip = new JSZip();
      
      const mimeTypes: Record<string, string> = {"""

replacement1 = """      const pagesToProcess = parsePageSelection();
      const totalPages = pagesToProcess.length;
      
      const zip = new JSZip();
      const generatedBlobs: { filename: string; blob: Blob }[] = [];
      
      const mimeTypes: Record<string, string> = {"""

target2 = """        if (blob) {
          // Zero-pad page number
          const pageStr = pageNum.toString().padStart(Math.max(3, numPages.toString().length), '0');
          const filename = `${file?.name.replace('.pdf', '')}_page-${pageStr}.${ext}`;
          zip.file(filename, blob);
        }"""

replacement2 = """        if (blob) {
          // Zero-pad page number
          const pageStr = pageNum.toString().padStart(Math.max(3, numPages.toString().length), '0');
          const filename = `${file?.name.replace('.pdf', '')}_page-${pageStr}.${ext}`;
          generatedBlobs.push({ filename, blob });
          zip.file(filename, blob);
        }"""

target3 = """      setStatusText('Compressing ZIP archive...');
      
      const zipBlob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 5 }
      });
      
      saveAs(zipBlob, `${file?.name.replace('.pdf', '')}_images.zip`);
      
      setIsFinished(true);"""

replacement3 = """      if (generatedBlobs.length === 1) {
        setStatusText('Saving image...');
        saveAs(generatedBlobs[0].blob, generatedBlobs[0].filename);
      } else {
        setStatusText('Compressing ZIP archive...');
        
        const zipBlob = await zip.generateAsync({ 
          type: 'blob',
          compression: 'DEFLATE',
          compressionOptions: { level: 5 }
        });
        
        saveAs(zipBlob, `${file?.name.replace('.pdf', '')}_images.zip`);
      }
      
      setIsFinished(true);"""

target4 = """                    <p className="text-neutral-500 max-w-md mx-auto mb-8 font-sans">
                      Your high-resolution images have been successfully generated and packaged into a ZIP file.
                    </p>"""

replacement4 = """                    <p className="text-neutral-500 max-w-md mx-auto mb-8 font-sans">
                      Your high-resolution image(s) have been successfully generated and downloaded.
                    </p>"""

if target1 in content and target2 in content and target3 in content and target4 in content:
    content = content.replace(target1, replacement1)
    content = content.replace(target2, replacement2)
    content = content.replace(target3, replacement3)
    content = content.replace(target4, replacement4)
    with open(file_path, "w") as f:
        f.write(content)
    print("Patched successfully")
else:
    print("One or more targets not found")
    if target1 not in content: print("target1 not found")
    if target2 not in content: print("target2 not found")
    if target3 not in content: print("target3 not found")
    if target4 not in content: print("target4 not found")

