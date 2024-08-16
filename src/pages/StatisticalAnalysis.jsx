import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const StatisticalAnalysis = ({ data }) => {
  const [selectedColumn, setSelectedColumn] = useState('');
  const [statistics, setStatistics] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [isAnalysisArmed, setIsAnalysisArmed] = useState(false);
  const [error, setError] = useState(null);

  const calculateStatistics = () => {
    if (!isAnalysisArmed) {
      setError("Please arm the analysis before generating results.");
      return;
    }

    setError(null);
    if (data && selectedColumn) {
      const columnIndex = data[0].indexOf(selectedColumn);
      if (columnIndex === -1) return;

      const columnData = data.slice(1).map(row => parseFloat(row[columnIndex])).filter(val => !isNaN(val));
      
      if (columnData.length === 0) {
        setStatistics(null);
        setChartData(null);
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

      // Prepare chart data
      const frequencyMap = columnData.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {});
      const chartData = Object.entries(frequencyMap).map(([value, count]) => ({ value: parseFloat(value), count }));
      setChartData(chartData);
    } else {
      setStatistics(null);
      setChartData(null);
    }
  };

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

  const handleArmAnalysis = () => {
    if (selectedColumn) {
      setIsAnalysisArmed(true);
      setError(null);
    } else {
      setError("Please select a column before arming the analysis.");
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
        <Button onClick={handleArmAnalysis} className="w-full mb-2" variant="secondary">
          Arm Analysis
        </Button>
        <Button onClick={calculateStatistics} className="w-full" disabled={!isAnalysisArmed}>
          Generate Analysis
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">How does it work?</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>How Statistical Analysis Works</DialogTitle>
              <DialogDescription>
                1. Select a column from your dataset.<br/>
                2. Arm the analysis to prepare for calculation.<br/>
                3. Click "Generate Analysis" to calculate key statistics:<br/>
                   - Mean: The average value<br/>
                   - Median: The middle value<br/>
                   - Mode: The most frequent value<br/>
                   - Standard Deviation: Measure of data spread<br/>
                4. Results are displayed in easy-to-read cards.<br/>
                5. A histogram is generated to visualize data distribution.<br/>
                6. You can export the statistics as a CSV file.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {statistics && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Statistical Analysis Results</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Mean</h3>
                <p className="text-2xl font-bold">{statistics.mean.toFixed(2)}</p>
              </div>
              <div>
                <h3 className="font-semibold">Median</h3>
                <p className="text-2xl font-bold">{statistics.median.toFixed(2)}</p>
              </div>
              <div>
                <h3 className="font-semibold">Mode</h3>
                <p className="text-2xl font-bold">{statistics.mode.toFixed(2)}</p>
              </div>
              <div>
                <h3 className="font-semibold">Standard Deviation</h3>
                <p className="text-2xl font-bold">{statistics.stdDev.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
          {chartData && (
            <Card>
              <CardHeader>
                <CardTitle>Data Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="value" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
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
        </>
      )}
    </div>
  );
};

export default StatisticalAnalysis;