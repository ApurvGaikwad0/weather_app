// Export data as JSON
export const exportAsJSON = (data: any, fileName: string) => {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(data, null, 2)
  )}`;
  const link = document.createElement('a');
  link.href = jsonString;
  link.download = `${fileName}.json`;
  link.click();
};

// Export data as XML
export const exportAsXML = (data: any, fileName: string) => {
  const convertToXML = (obj: any) => {
    let xml = '';
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        xml += `<${key}>`;
        if (typeof obj[key] === 'object') {
          xml += convertToXML(obj[key]);
        } else {
          xml += obj[key];
        }
        xml += `</${key}>`;
      }
    }
    return xml;
  };

  const xmlString = `<?xml version="1.0" encoding="UTF-8"?>\n<root>${convertToXML(
    data
  )}</root>`;
  const blob = new Blob([xmlString], { type: 'application/xml' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.xml`;
  link.click();
};

// Export data as CSV
export const exportAsCSV = (data: any[], fileName: string) => {
  const csvRows = [];
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(',')); // Add headers

  for (const row of data) {
    const values = headers.map((header) => `"${row[header]}"`);
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.csv`;
  link.click();
};

// Export data as Markdown
export const exportAsMarkdown = (data: any, fileName: string) => {
  let markdown = `# Exported Data\n\n`;
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      markdown += `## ${key}\n\n${JSON.stringify(data[key], null, 2)}\n\n`;
    }
  }

  const blob = new Blob([markdown], { type: 'text/markdown' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.md`;
  link.click();
};