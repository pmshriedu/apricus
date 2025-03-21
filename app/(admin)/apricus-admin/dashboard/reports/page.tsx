"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DownloadCloud,
  FileSpreadsheet,
  ChevronDown,
  Calendar,
  Filter,
  RefreshCw,
  Hotel,
  DollarSign,
  ClipboardList,
  BarChart3,
  MapPin,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

type Report = {
  type: string;
  title: string;
  description: string;
  icon: React.ElementType;
};

type ReportData = {
  [key: string]: string | number;
};

const reports: Report[] = [
  {
    type: "customers-by-hotel",
    title: "Customers by Hotel",
    description: "View unique customer counts and bookings for each hotel",
    icon: Hotel,
  },
  {
    type: "revenue-by-hotel",
    title: "Revenue by Hotel",
    description: "Analyze revenue generation across different hotels",
    icon: DollarSign,
  },
  {
    type: "bookings-by-status",
    title: "Bookings by Status",
    description: "Track confirmed, pending, and cancelled bookings",
    icon: ClipboardList,
  },
  {
    type: "revenue-monthly",
    title: "Monthly Revenue",
    description: "Track revenue trends on a monthly basis",
    icon: BarChart3,
  },
  {
    type: "locations-performance",
    title: "Locations Performance",
    description: "Compare performance metrics across different locations",
    icon: MapPin,
  },
];

const ReportsPage = () => {
  const { toast } = useToast();
  const [selectedReport, setSelectedReport] =
    useState<string>("customers-by-hotel");
  const [startDate, setStartDate] = useState<string>(
    format(
      new Date(new Date().setMonth(new Date().getMonth() - 1)),
      "yyyy-MM-dd"
    )
  );
  const [endDate, setEndDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const fetchReportData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/reports?type=${selectedReport}&startDate=${startDate}&endDate=${endDate}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch report: ${response.statusText}`);
      }

      const result = await response.json();
      setReportData(result.data);
    } catch (error) {
      console.error("Error fetching report:", error);
      setError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
      toast({
        title: "Error",
        description: "Failed to load report data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReport = async () => {
    try {
      const response = await fetch(
        `/api/reports?type=${selectedReport}&format=excel&startDate=${startDate}&endDate=${endDate}`
      );

      if (!response.ok) {
        throw new Error(`Failed to download report: ${response.statusText}`);
      }

      // Get the filename from the Content-Disposition header
      const contentDisposition = response.headers.get("Content-Disposition");
      const filenameRegex = /filename="(.+)"/;
      const filenameMatch = contentDisposition
        ? contentDisposition.match(filenameRegex)
        : null;
      const filename = filenameMatch
        ? filenameMatch[1]
        : `${selectedReport}-report.xlsx`;

      // Create a blob from the response
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Create a link element and trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Report downloaded successfully",
      });
    } catch (error) {
      console.error("Error downloading report:", error);
      toast({
        title: "Error",
        description: "Failed to download report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderTableHeaders = () => {
    if (!reportData || reportData.length === 0) return null;

    // Get the keys from the first data item
    const headers = Object.keys(reportData[0]);

    return (
      <TableHeader>
        <TableRow>
          {headers.map((header) => (
            <TableHead key={header}>
              {header
                .replace(/([A-Z])/g, " $1") // Insert space before capital letters
                .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
                .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space between camelCase words
                .trim()}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
    );
  };

  const renderTableRows = () => {
    if (!reportData || reportData.length === 0) return null;

    const keys = Object.keys(reportData[0]);

    return (
      <TableBody>
        {reportData.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {keys.map((key) => (
              <TableCell key={key}>{row[key]}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    );
  };

  const renderSelectedReportIcon = () => {
    const report = reports.find((r) => r.type === selectedReport);
    const Icon = report?.icon || FileSpreadsheet;
    return <Icon className="mr-2 h-4 w-4" />;
  };

  React.useEffect(() => {
    // Fetch data when component mounts
    fetchReportData();
  }, [selectedReport]); // Re-fetch when selected report changes

  return (
    <div className="space-y-8 p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate and download reports for your business analytics
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchReportData}
            className="flex items-center"
            disabled={isLoading}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Button
            size="sm"
            onClick={downloadReport}
            className="flex items-center"
            disabled={isLoading || reportData.length === 0}
          >
            <DownloadCloud className="mr-2 h-4 w-4" />
            Download Excel
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <Card className="transition-all duration-200">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="report-type"
                  className="block text-sm font-medium mb-1"
                >
                  Report Type
                </label>
                <Select
                  value={selectedReport}
                  onValueChange={(value) => setSelectedReport(value)}
                >
                  <SelectTrigger id="report-type" className="w-full">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reports.map((report) => (
                      <SelectItem key={report.type} value={report.type}>
                        <div className="flex items-center">
                          <report.icon className="mr-2 h-4 w-4" />
                          {report.title}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label
                  htmlFor="start-date"
                  className="block text-sm font-medium mb-1"
                >
                  Start Date
                </label>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="end-date"
                  className="block text-sm font-medium mb-1"
                >
                  End Date
                </label>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button onClick={fetchReportData} disabled={isLoading}>
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Report Description */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center">
            {renderSelectedReportIcon()}
            {reports.find((r) => r.type === selectedReport)?.title || "Report"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {reports.find((r) => r.type === selectedReport)?.description}
          </p>

          {/* Report date range info */}
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            <span>
              {format(new Date(startDate), "MMMM d, yyyy")} -{" "}
              {format(new Date(endDate), "MMMM d, yyyy")}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Report Data Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Report Data</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : reportData.length === 0 ? (
            <div className="text-center py-8">
              <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No data available for the selected criteria
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                {renderTableHeaders()}
                {renderTableRows()}
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reports Guide */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">
            Available Reports
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Accordion type="single" collapsible className="w-full">
            {reports.map((report) => (
              <AccordionItem key={report.type} value={report.type}>
                <AccordionTrigger className="px-6">
                  <div className="flex items-center">
                    <report.icon className="mr-2 h-4 w-4" />
                    <span>{report.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    {report.description}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedReport(report.type);
                      fetchReportData();
                    }}
                    className="text-xs"
                  >
                    Generate This Report
                  </Button>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;
