import React, { useRef } from 'react';
import { QRCode } from 'qrcode.react';

const QRPrintBulk = ({ items, onClose }) => {
  const qrRef = useRef();

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    const qrElement = qrRef.current;
    const qrCanvas = qrElement.querySelectorAll('canvas');

    let qrImagesHtml = '';
    qrCanvas.forEach((canvas, index) => {
      const qrImage = canvas.toDataURL('image/png');
      qrImagesHtml += `<div class="qr-label-item">
        <img src="${qrImage}" alt="QR Code ${index + 1}" />
        <p class="label-text">${items[index].name || 'Item'}</p>
        <p class="label-serial">${items[index].serialNumber}</p>
      </div>`;
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>QR Code Labels - Bulk Print</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            background: white;
            padding: 20px;
            font-family: Arial, sans-serif;
          }
          .print-header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 15px;
          }
          .print-header h1 {
            font-size: 20px;
            margin-bottom: 5px;
          }
          .print-header p {
            font-size: 12px;
            color: #666;
          }
          .labels-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            page-break-after: auto;
          }
          .qr-label-item {
            border: 1px solid #ddd;
            padding: 15px;
            text-align: center;
            page-break-inside: avoid;
            background: white;
          }
          .qr-label-item img {
            max-width: 100%;
            height: auto;
            margin-bottom: 10px;
          }
          .label-text {
            font-weight: bold;
            font-size: 13px;
            margin: 8px 0 4px 0;
            word-break: break-word;
            max-height: 40px;
            overflow: hidden;
          }
          .label-serial {
            font-size: 11px;
            color: #666;
            font-family: monospace;
          }
          @media print {
            body {
              padding: 0;
              margin: 0;
            }
            .print-header {
              margin-bottom: 20px;
              padding-bottom: 10px;
              border-bottom: 1px solid #ccc;
            }
            .labels-grid {
              gap: 15px;
            }
            .qr-label-item {
              border: 1px solid #999;
              padding: 12px;
            }
          }
          @page {
            size: A4;
            margin: 10mm;
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <h1>QR Code Labels</h1>
          <p>Generated on ${new Date().toLocaleString()} | Total: ${items.length} items</p>
        </div>
        <div class="labels-grid">
          ${qrImagesHtml}
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  const itemsPerPage = 12; // 3x4 grid
  const pages = Math.ceil(items.length / itemsPerPage);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal qr-bulk-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Bulk QR Code Print ({items.length} items)</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-content qr-bulk-content">
          <div className="qr-bulk-preview" ref={qrRef}>
            {Array.from({ length: pages }).map((_, pageIndex) => {
              const startIdx = pageIndex * itemsPerPage;
              const pageItems = items.slice(startIdx, startIdx + itemsPerPage);

              return (
                <div key={pageIndex} className="qr-page">
                  {pageIndex === 0 && (
                    <div className="print-header-preview">
                      <h3>QR Code Labels</h3>
                      <p>Total: {items.length} items</p>
                    </div>
                  )}
                  <div className="qr-labels-grid">
                    {pageItems.map((item) => (
                      <div key={item.id} className="qr-label">
                        <div className="qr-label-content">
                          <QRCode
                            value={`QR-${item.id?.substring(0, 8).toUpperCase() || 'UNKNOWN'}`}
                            size={120}
                            level="H"
                            includeMargin={false}
                          />
                          <p className="label-name">{item.name || 'Item'}</p>
                          <p className="label-serial">{item.serialNumber}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {pageIndex < pages - 1 && <div className="page-break" />}
                </div>
              );
            })}
          </div>

          <div className="qr-bulk-info">
            <p>📋 {items.length} items across {pages} page(s)</p>
          </div>

          <div className="qr-actions">
            <button className="btn-primary" onClick={handlePrint}>
              🖨️ Print All
            </button>
            <button className="btn-tertiary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRPrintBulk;
