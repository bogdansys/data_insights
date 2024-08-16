import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { HelpCircle, Upload } from "lucide-react";
import DataQualityAssessment from './DataQualityAssessment';

const DataUpload = ({ setData }) => {
  const [parsedData, setParsedData] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative">
                <Input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Upload className="mr-2 h-5 w-5" />
                  Upload CSV
                </label>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Upload a CSV file to analyze</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              How does it work? <HelpCircle className="ml-2 h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>How Data Upload Works</DialogTitle>
              <DialogDescription>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Select a CSV file from your computer using the file input.</li>
                  <li>The file is read and parsed into a table format.</li>
                  <li>A preview of the data is displayed below the upload button.</li>
                  <li>Data quality assessment is performed automatically.</li>
                  <li>You can then proceed to analyze or visualize the data using other tools in the application.</li>
                </ol>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      {parsedData && (
        <div className="space-y-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Data Preview</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">First 5 rows of uploaded data</p>
            </div>
            <div className="border-t border-gray-200">
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
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={() => { setParsedData(null); setData(null); }} variant="destructive">
                  Clear Data
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Remove the uploaded data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DataQualityAssessment data={parsedData} />
        </div>
      )}
    </div>
  );
};

export default DataUpload;