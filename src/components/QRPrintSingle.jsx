import React, { useRef } from 'react';
import { QRCode } from 'qrcode.react';

const QRPrintSingle = ({ item, onClose }) => {
  const qrRef = useRef();

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    const qrElement = qrRef.current.querySelector('canvas');
    const qrImage = qrElement.toDataURL('image/png');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>QR Code - ${item.name || 'Item'}</title>
        <style>
          body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            background: white;
          }
          .print-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            flex-direction: column;
          }
          .qr-card {
            border: 2px solid #333;
            padding: 40px;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 400px;
          }
          .qr-card h1 {
            margin: 0 0 15px 0;
            font-size: 24px;
            color: #333;
          }
          .item-details {
            margin-bottom: 30px;
            text-align: left;
            background: #f9f9f9;
            padding: 15px;
            border-radius: 4px;
          }
          .detail-row {
            margin: 8px 0;
            font-size: 14px;
          }
          .detail-label {
            font-weight: bold;
            color: #666;
            display: inline-block;
            min-width: 100px;
          }
          .detail-value {
            color: #333;
          }
          .qr-code {
            margin: 30px 0;
            display: flex;
            justify-content: center;
          }
          .qr-code img {
            border: 1px solid #ddd;
            padding: 10px;
            background: white;
          }
          .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #999;
          }
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            .print-container {
              min-height: auto;
            }
            .qr-card {
              box-shadow: none;
              border: 1px solid #ccc;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          <div class="qr-card">
            <h1>${item.name || 'Unnamed Item'}</h1>
            <div class="item-details">
              <div class="detail-row">
                <span class="detail-label">Item ID:</span>
                <span class="detail-value">${item.id || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Serial:</span>
                <span class="detail-value">${item.serialNumber}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="detail-value">${item.status}</span>
              </div>
              ${item.description ? `
              <div class="detail-row">
                <span class="detail-label">Description:</span>
                <span class="detail-value">${item.description}</span>
              </div>
              ` : ''}
            </div>
            <div class="qr-code">
              <img src="${qrImage}" alt="QR Code" />
            </div>
            <div class="footer">
              <p>Generated on ${new Date().toLocaleString()}</p>
              <p>QR Code ID: QR-${item.id?.substring(0, 8).toUpperCase() || 'UNKNOWN'}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownload = () => {
    const qrElement = qrRef.current.querySelector('canvas');
    const link = document.createElement('a');
    link.download = `qr-${item.serialNumber}.png`;
    link.href = qrElement.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal qr-print-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>QR Code - {item.name || 'Unnamed Item'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-content qr-content">
          <div className="qr-preview" ref={qrRef}>
            <div className="qr-card-preview">
              <h3>{item.name || 'Unnamed Item'}</h3>
              <div className="item-info">
                <p><strong>Serial:</strong> {item.serialNumber}</p>
                <p><strong>Item ID:</strong> {item.id}</p>
                <p><strong>Status:</strong> {item.status}</p>
                {item.description && <p><strong>Description:</strong> {item.description}</p>}
              </div>
              <div className="qr-code-wrapper">
                <QRCode
                  value={`QR-${item.id?.substring(0, 8).toUpperCase() || 'UNKNOWN'}`}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="qr-code-label">QR-{item.id?.substring(0, 8).toUpperCase() || 'UNKNOWN'}</p>
            </div>
          </div>

          <div className="qr-actions">
            <button className="btn-primary" onClick={handlePrint}>
              🖨️ Print
            </button>
            <button className="btn-secondary" onClick={handleDownload}>
              ⬇️ Download
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

export default QRPrintSingle;
