import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const DataExport = ({ data }) => {
  const [exportFormat, setExportFormat] = useState('csv');

  const exportData = () => {
    if (!data) return;

    let content = '';
    let filename = '';

    if (exportFormat === 'csv') {
      content = data.map(row => row.join(',')).join('\n');
      filename = 'exported_data.csv';
    } else if (exportFormat === 'json') {
      const headers = data[0];
      const jsonData = data.slice(1).map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index];
        });
        return obj;
      });
      content = JSON.stringify(jsonData, null, 2);
      filename = 'exported_data.json';
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Select onValueChange={setExportFormat}>
              <SelectTrigger>
                <SelectValue placeholder="Select export format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
          </TooltipTrigger>
          <TooltipContent>
            <p>Choose the format for exporting your data</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={exportData}>Export Data</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Download your data in the selected format</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default DataExport;
