import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';

const DataPreprocessing = ({ data, setData }) => {
  const [preprocessingTasks, setPreprocessingTasks] = useState([]);
  const [customValue, setCustomValue] = useState('');
  const [normalizationRange, setNormalizationRange] = useState([0, 1]);
  const addPreprocessingTask = () => {
    setPreprocessingTasks([...preprocessingTasks, { column: '', method: '' }]);
  };

  const updatePreprocessingTask = (index, field, value) => {
    const updatedTasks = [...preprocessingTasks];
    updatedTasks[index][field] = value;
    setPreprocessingTasks(updatedTasks);
  };

  const handlePreprocessing = () => {
    if (!data || preprocessingTasks.length === 0) return;

    let newData = [...data];

    preprocessingTasks.forEach(task => {
      const { column, method } = task;
      const columnIndex = newData[0].indexOf(column);
      if (columnIndex === -1) return;

      switch (method) {
        case 'remove_missing':
          newData = newData.filter((row, index) => index === 0 || row[columnIndex] !== '');
          break;
        case 'fill_mean':
        case 'fill_median':
        case 'fill_mode':
          const columnData = newData.slice(1).map(row => parseFloat(row[columnIndex])).filter(val => !isNaN(val));
          let fillValue;
          if (method === 'fill_mean') {
            fillValue = columnData.reduce((sum, val) => sum + val, 0) / columnData.length;
          } else if (method === 'fill_median') {
            const sorted = [...columnData].sort((a, b) => a - b);
            fillValue = sorted[Math.floor(sorted.length / 2)];
          } else if (method === 'fill_mode') {
            fillValue = columnData.reduce((a, b, i, arr) =>
              (arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b), columnData[0]);
          }
          newData = newData.map((row, index) => {
            if (index === 0 || row[columnIndex] !== '') return row;
            let newRow = [...row];
            newRow[columnIndex] = fillValue.toString();
            return newRow;
          });
          break;
        case 'fill_custom':
          newData = newData.map((row, index) => {
            if (index === 0 || row[columnIndex] !== '') return row;
            let newRow = [...row];
            newRow[columnIndex] = customValue;
            return newRow;
          });
          break;
        case 'normalize':
          const [min, max] = normalizationRange;
          const values = newData.slice(1).map(row => parseFloat(row[columnIndex])).filter(val => !isNaN(val));
          const minVal = Math.min(...values);
          const maxVal = Math.max(...values);
          newData = newData.map((row, index) => {
            if (index === 0) return row;
            let newRow = [...row];
            const value = parseFloat(row[columnIndex]);
            if (!isNaN(value)) {
              const normalizedValue = (value - minVal) / (maxVal - minVal) * (max - min) + min;
              newRow[columnIndex] = normalizedValue.toFixed(2);
            }
            return newRow;
          });
          break;
      }
    });

    setData(newData);
  };

  const downloadCSV = () => {
    if (!data) return;
    const csvContent = data.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'preprocessed_data.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!data) return <div>Please upload data first.</div>;

  return (
    <div className="space-y-4">
      {preprocessingTasks.map((task, index) => (
        <div key={index} className="flex space-x-2">
          <Select onValueChange={(value) => updatePreprocessingTask(index, 'column', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a column" />
            </SelectTrigger>
            <SelectContent>
              {data[0].map((header, headerIndex) => (
                <SelectItem key={headerIndex} value={header}>{header}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => updatePreprocessingTask(index, 'method', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select preprocessing method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="remove_missing">Remove missing values</SelectItem>
              <SelectItem value="fill_mean">Fill with mean</SelectItem>
              <SelectItem value="fill_median">Fill with median</SelectItem>
              <SelectItem value="fill_mode">Fill with mode</SelectItem>
              <SelectItem value="fill_custom">Fill with custom value</SelectItem>
              <SelectItem value="normalize">Normalize</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ))}

      <Button onClick={addPreprocessingTask}>Add Preprocessing Task</Button>

      {preprocessingTasks.some(task => task.method === 'fill_custom') && (
        <Input
          type="text"
          placeholder="Enter custom value"
          value={customValue}
          onChange={(e) => setCustomValue(e.target.value)}
        />
      )}

      {preprocessingTasks.some(task => task.method === 'normalize') && (
        <div className="space-y-2">
          <Label>Normalization Range</Label>
          <Slider
            min={0}
            max={1}
            step={0.1}
            value={normalizationRange}
            onValueChange={setNormalizationRange}
          />
          <div>Range: {normalizationRange[0]} - {normalizationRange[1]}</div>
        </div>
      )}


      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={handlePreprocessing}>Process Data</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Apply selected preprocessing methods to the data</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {data && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Data Preview</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {data[0].map((header, index) => (
                    <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.slice(1, 6).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataPreprocessing;
