import { useQuery } from "@tanstack/react-query";
import { type Expense } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { useState } from "react";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export default function ExportPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { data: expenses, isLoading } = useQuery<Expense[]>({
    queryKey: ["/api/expenses"],
  });

  const generatePDF = async () => {
    if (!expenses) return;
    setIsGenerating(true);

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Add title
      doc.setFontSize(20);
      doc.text("Expense Report", pageWidth / 2, 20, { align: "center" });

      // Add date range
      doc.setFontSize(12);
      doc.text(
        `Generated on ${new Date().toLocaleDateString()}`,
        pageWidth / 2,
        30,
        { align: "center" }
      );

      // Add summary
      const totalIncome = expenses
        .filter((e) => e.type === "Income")
        .reduce((sum, e) => sum + e.amount, 0);
      const totalExpenses = expenses
        .filter((e) => e.type === "Expense")
        .reduce((sum, e) => sum + e.amount, 0);

      doc.setFontSize(14);
      doc.text("Summary", 14, 45);
      doc.setFontSize(12);
      doc.text(`Total Income: $${(totalIncome / 100).toFixed(2)}`, 14, 55);
      doc.text(`Total Expenses: $${(totalExpenses / 100).toFixed(2)}`, 14, 65);
      doc.text(
        `Net Balance: $${((totalIncome - totalExpenses) / 100).toFixed(2)}`,
        14,
        75
      );

      // Add transactions table
      const tableData = expenses.map((expense) => [
        new Date(expense.createdAt).toLocaleDateString(),
        expense.type,
        expense.category,
        expense.description || "",
        `$${(expense.amount / 100).toFixed(2)}`,
      ]);

      doc.autoTable({
        startY: 85,
        head: [["Date", "Type", "Category", "Description", "Amount"]],
        body: tableData,
        headStyles: { fillColor: [66, 66, 66] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: 85 },
        didDrawPage: (data) => {
          // Add footer on each page
          const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
          const totalPages = doc.internal.getNumberOfPages();
          doc.setFontSize(10);
          doc.text(
            `Page ${pageNumber} of ${totalPages}`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: "center" }
          );
        },
      });

      // Save the PDF
      doc.save("expense-report.pdf");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Export Expense Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <div className="text-sm text-muted-foreground">
                Generate a PDF report of all your transactions. The report includes:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Summary of total income and expenses</li>
                  <li>Detailed transaction history</li>
                  <li>Date and category breakdown</li>
                </ul>
              </div>

              <Button
                onClick={generatePDF}
                disabled={isLoading || isGenerating}
                className="w-full sm:w-auto"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  "Generate PDF Report"
                )}
              </Button>

              {expenses && expenses.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  No transactions found. Add some transactions to generate a report.
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
