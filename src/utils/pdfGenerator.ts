import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportElementToPDF(elementId: string, filename: string = 'Ministers-Connect-Registration-Confirmation.pdf'): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return false;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1200,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth - 20; // 10mm margins
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (imgHeight > pdfHeight - 20) {
      const scaledWidth = ((pdfHeight - 20) * canvas.width) / canvas.height;
      const xOffset = (pdfWidth - scaledWidth) / 2;
      pdf.addImage(imgData, 'PNG', xOffset, 10, scaledWidth, pdfHeight - 20);
    } else {
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    }

    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    window.print();
    return false;
  }
}

export function printConfirmationLetter(): void {
  window.print();
}
