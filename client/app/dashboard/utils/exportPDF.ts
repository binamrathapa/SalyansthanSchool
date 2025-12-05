export const exportPDF = async (htmlContent: string, title: string) => {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { border-collapse: collapse; width: 100%; font-size: 12px; }
          th, td { border: 1px solid #ccc; padding: 4px; text-align: left; }
          th { background-color: #f0f0f0; }
          img { max-width: 50px; max-height: 50px; border-radius: 4px; }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();

  // Delay to ensure images render
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
};
