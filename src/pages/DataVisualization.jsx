import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { BarChart, Bar, ScatterChart, Scatter, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const DataVisualization = ({ data }) => {
  const [chartType, setChartType] = useState('bar');
  const [selectedColumn, setSelectedColumn] = useState('');
  const [selectedColumnX, setSelectedColumnX] = useState('');
  const [selectedColumnY, setSelectedColumnY] = useState('');
  const [chartData, setChartData] = useState([]);
  const [isVisualizationArmed, setIsVisualizationArmed] = useState(false);
  const [error, setError] = useState(null);

  const generateVisualization = () => {
    if (!isVisualizationArmed) {
      setError("Please arm the visualization before generating charts.");
      return;
    }

    setError(null);
    if (data) {
      let newChartData = [];

      switch (chartType) {
        case 'bar':
          if (selectedColumn) {
            const columnIndex = data[0].indexOf(selectedColumn);
            if (columnIndex !== -1) {
              const columnData = data.slice(1).map(row => row[columnIndex]);
              const frequencyMap = columnData.reduce((acc, value) => {
                acc[value] = (acc[value] || 0) + 1;
                return acc;
              }, {});
              newChartData = Object.entries(frequencyMap).map(([value, count]) => ({ value, count }));
            }
          }
          break;
        case 'line':
          if (selectedColumn) {
            const columnIndex = data[0].indexOf(selectedColumn);
            if (columnIndex !== -1) {
              newChartData = data.slice(1).map((row, index) => ({
                index,
                value: parseFloat(row[columnIndex])
              })).filter(item => !isNaN(item.value));
            }
          }
          break;
        case 'scatter':
          if (selectedColumnX && selectedColumnY) {
            const columnIndexX = data[0].indexOf(selectedColumnX);
            const columnIndexY = data[0].indexOf(selectedColumnY);
            if (columnIndexX !== -1 && columnIndexY !== -1) {
              newChartData = data.slice(1).map(row => ({
                x: parseFloat(row[columnIndexX]),
                y: parseFloat(row[columnIndexY])
              })).filter(point => !isNaN(point.x) && !isNaN(point.y));
            }
          }
          break;
        case 'area':
          if (selectedColumn) {
            const columnIndex = data[0].indexOf(selectedColumn);
            if (columnIndex !== -1) {
              newChartData = data.slice(1).map((row, index) => ({
                index,
                value: parseFloat(row[columnIndex])
              })).filter(item => !isNaN(item.value));
            }
          }
          break;
      }

      setChartData(newChartData);
    }
  };

  const handleArmVisualization = () => {
    if (chartType === 'scatter' && selectedColumnX && selectedColumnY) {
      setIsVisualizationArmed(true);
      setError(null);
    } else if (chartType !== 'scatter' && selectedColumn) {
      setIsVisualizationArmed(true);
      setError(null);
    } else {
      setError("Please select all required columns before arming the visualization.");
    }
  };

  if (!data) return <div>Please upload data first.</div>;

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Select onValueChange={(value) => {
                setChartType(value);
                setSelectedColumn('');
                setSelectedColumnX('');
                setSelectedColumnY('');
                setIsVisualizationArmed(false);
                setChartData([]);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select chart type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="scatter">Scatter Plot</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="area">Area Chart</SelectItem>
                </SelectContent>
              </Select>
            </TooltipTrigger>
            <TooltipContent>
              <p>Choose the type of chart to visualize your data</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">How does it work?</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>How Data Visualization Works</DialogTitle>
              <DialogDescription>
                1. Select a chart type from the dropdown menu.<br/>
                2. Choose the column(s) you want to visualize.<br/>
                3. Arm the visualization to prepare for chart generation.<br/>
                4. Click "Generate Visualization" to create the chart.<br/>
                5. The system processes the data and creates the chart.<br/>
                6. The chart is displayed using the Recharts library.<br/>
                7. You can interact with the chart (hover, zoom, etc.).<br/>
                8. Different chart types are suitable for different data types and relationships.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      {['bar', 'line', 'area'].includes(chartType) && (
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
      )}

      {chartType === 'scatter' && (
        <>
          <Select onValueChange={setSelectedColumnX}>
            <SelectTrigger>
              <SelectValue placeholder="Select X-axis column" />
            </SelectTrigger>
            <SelectContent>
              {data[0].map((header, index) => (
                <SelectItem key={index} value={header}>{header}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={setSelectedColumnY}>
            <SelectTrigger>
              <SelectValue placeholder="Select Y-axis column" />
            </SelectTrigger>
            <SelectContent>
              {data[0].map((header, index) => (
                <SelectItem key={index} value={header}>{header}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      )}

      <Button onClick={handleArmVisualization} className="w-full mb-2" variant="secondary">
        Arm Visualization
      </Button>
      <Button onClick={generateVisualization} className="w-full" disabled={!isVisualizationArmed}>
        Generate Visualization
      </Button>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {chartData.length > 0 && (
        <ResponsiveContainer width="100%" height={400}>
          {chartType === 'bar' && (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="value" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          )}
          {chartType === 'scatter' && (
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" name={selectedColumnX} />
              <YAxis dataKey="y" name={selectedColumnY} />
              <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter name={`${selectedColumnX} vs ${selectedColumnY}`} data={chartData} fill="#8884d8" />
            </ScatterChart>
          )}
          {chartType === 'line' && (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          )}
          {chartType === 'area' && (
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          )}
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default DataVisualization;