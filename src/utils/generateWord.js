import { Document, Packer, Paragraph, TextRun } from "docx";

import { saveAs } from "file-saver";

export const generateWordDocument = () => {
  let doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "ROYAUME DU MAROC ",
                bold: true,
              }),
              new TextRun({
                text: "\n FORCES ARMEES ROYALES",
                bold: true,
              }),
            ],
          }),
        ],
      },
    ],
  });

  saveDocumentToFile(doc, "first.docx");
};

function saveDocumentToFile(doc, fileName) {
  //   const packer = new Packer();
  const mimeType =
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  Packer.toBlob(doc).then((blob) => {
    const docblob = blob.slice(0, blob.size, mimeType);
    saveAs(docblob, fileName);
  });
}
