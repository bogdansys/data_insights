import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const StatisticalAnalysis = ({ data }) => {
  const [selectedColumn, setSelectedColumn] = useState('');
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    if (data && selectedColumn) {
      const columnIndex = data[0].indexOf(selectedColumn);
      if (columnIndex === -1) return;

      const columnData = data.slice(1).map(row => parseFloat(row[columnIndex])).filter(val => !isNaN(val));
      
      if (columnData.length === 0) {
        setStatistics(null);
        return;
      }

      const mean = columnData.reduce((sum, val) => sum + val, 0) / columnData.length;
      const sortedData = [...columnData].sort((a, b) => a - b);
      const median = sortedData[Math.floor(sortedData.length / 2)];
      const mode = columnData.reduce((a, b, i, arr) =>
        (arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b), columnData[0]);
      const variance = columnData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / columnData.length;
      const stdDev = Math.sqrt(variance);

      setStatistics({ mean, median, mode, stdDev });
    } else {
      setStatistics(null);
    }
  }, [data, selectedColumn]);

  const exportStatistics = () => {
    if (!statistics) return;
    const csvContent = `Statistic,Value\nMean,${statistics.mean.toFixed(2)}\nMedian,${statistics.median.toFixed(2)}\nMode,${statistics.mode.toFixed(2)}\nStandard Deviation,${statistics.stdDev.toFixed(2)}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "statistics.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!data) return <div>Please upload data first.</div>;

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Select onValueChange={setSelectedColumn}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a column" />
                </SelectTrigger>
                <SelectContent>
                  {data[0].map((header, index) => (
                    <SelectItem key={index} value={header}>{header}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TooltipTrigger>
            <TooltipContent>
              <p>Choose a column to analyze</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">How does it work?</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>How Statistical Analysis Works</DialogTitle>
              <DialogDescription>
                1. Select a column from your dataset.<br/>
                2. The system calculates key statistics:<br/>
                   - Mean: The average value<br/>
                   - Median: The middle value<br/>
                   - Mode: The most frequent value<br/>
                   - Standard Deviation: Measure of data spread<br/>
                3. Results are displayed in easy-to-read cards.<br/>
                4. You can export the statistics as a CSV file.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      {statistics && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Mean</CardTitle>
              </CardHeader>
              <CardContent>{statistics.mean.toFixed(2)}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Median</CardTitle>
              </CardHeader>
              <CardContent>{statistics.median.toFixed(2)}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Mode</CardTitle>
              </CardHeader>
              <CardContent>{statistics.mode.toFixed(2)}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Standard Deviation</CardTitle>
              </CardHeader>
              <CardContent>{statistics.stdDev.toFixed(2)}</CardContent>
            </Card>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button onClick={exportStatistics}>Export Statistics</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Download statistics as CSV</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download statistics as CSV</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </>
      )}
    </div>
  );
};

export default StatisticalAnalysis;
