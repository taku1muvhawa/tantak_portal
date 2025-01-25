// import React from 'react';
// import { Document, Page } from '@react-pdf/renderer';

// const PdfViewer = ({ pdfFile }) => {
//   return (
//     <div>
//       <Document file={pdfFile}>
//         <Page pageNumber={1} />
//       </Document>
//     </div>
//   );
// };

// export default PdfViewer;

// import React, { useEffect } from 'react';
// import { Document, Page } from '@react-pdf/renderer';

// const PdfViewer = ({ pdfFile }) => {
//   useEffect(() => {
//     const handleContextMenu = (e) => e.preventDefault();
//     const handleKeyDown = (e) => {
//       if (e.ctrlKey || e.metaKey) {
//         e.preventDefault();
//       }
//     };

//     window.addEventListener('contextmenu', handleContextMenu);
//     window.addEventListener('keydown', handleKeyDown);

//     return () => {
//       window.removeEventListener('contextmenu', handleContextMenu);
//       window.removeEventListener('keydown', handleKeyDown);
//     };
//   }, []);

//   return (
//     <div>
//       <Document file={pdfFile}>
//         <Page pageNumber={1} />
//       </Document>
//     </div>
//   );
// };

// export default PdfViewer;
