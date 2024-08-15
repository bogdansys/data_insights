import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import DataQualityAssessment from './DataQualityAssessment';

const DataUpload = ({ setData }) => {
  const [parsedData, setParsedData] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      const rows = text.split('\n').map(row => row.split(','));
      setParsedData(rows);
      setData(rows);
    };

    reader.readAsText(file);
  };

  const generateSampleCSV = () => {
    const headers = ["Name", "Age", "Email"];
    const rows = [
      ["John Doe", "30", "john@example.com"],
      ["Jane Smith", "25", "jane@example.com"],
      ["Sam Johnson", "40", "sam@example.com"]
    ];
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    return csvContent;
  };

 const downloadSampleCSV = () => {
   const filePath = '/sample_customer_data.csv';
   const link = document.createElement("a");
   link.href = filePath;
   link.setAttribute("download", "sample_customer_data.csv");
   link.style.visibility = 'hidden';
   document.body.appendChild(link);
   link.click();
   document.body.removeChild(link);
 };

  return (
    <div className="space-y-2 sm:space-y-4">
      <div className="space-y-2 sm:space-y-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input type="file" accept=".csv" onChange={handleFileUpload} className="flex-grow" />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">How does it work?</Button>
                  </DialogTrigger>
                </Dialog>
                <Button onClick={downloadSampleCSV} className="w-full sm:w-auto">Download Test Data</Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Upload a CSV file to analyze</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Dialog>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>How Data Upload Works</DialogTitle>
              <DialogDescription>
                1. Select a CSV file from your computer.<br/>
                2. The file is read and parsed into a table format.<br/>
                3. A preview of the data is displayed.<br/>
                4. Data quality assessment is performed automatically.<br/>
                5. You can then proceed to analyze or visualize the data.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      {parsedData && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                {parsedData[0].map((header, index) => (
                  <TableHead key={index}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {parsedData.slice(1, 6).map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={() => { setParsedData(null); setData(null); }}>Clear Data</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Remove the uploaded data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DataQualityAssessment data={parsedData} />
        </>
      )}
    </div>
  );
};

export default DataUpload;