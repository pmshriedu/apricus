// types/jspdf.d.ts
import "jspdf-autotable";
import jsPDF from "jspdf";

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}
