import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DataTransformation = ({ data, setData }) => {
  const [selectedColumn, setSelectedColumn] = useState('');
  const [transformationType, setTransformationType] = useState('');
  const [customValue, setCustomValue] = useState('');

  const applyTransformation = () => {
    if (!data || !selectedColumn || !transformationType) return;

    const columnIndex = data[0].indexOf(selectedColumn);
    let transformedData = [data[0]];

    switch (transformationType) {
      case 'log':
        transformedData = [
          ...transformedData,
          ...data.slice(1).map(row => {
            const newRow = [...row];
            const value = parseFloat(row[columnIndex]);
            newRow[columnIndex] = value > 0 ? Math.log(value).toFixed(4) : row[columnIndex];
            return newRow;
          })
        ];
        break;
      case 'normalize':
        const values = data.slice(1).map(row => parseFloat(row[columnIndex])).filter(val => !isNaN(val));
        const min = Math.min(...values);
        const max = Math.max(...values);
        transformedData = [
          ...transformedData,
          ...data.slice(1).map(row => {
            const newRow = [...row];
            const value = parseFloat(row[columnIndex]);
            newRow[columnIndex] = !isNaN(value) ? ((value - min) / (max - min)).toFixed(4) : row[columnIndex];
            return newRow;
          })
        ];
        break;
      case 'custom':
        transformedData = [
          ...transformedData,
          ...data.slice(1).map(row => {
            const newRow = [...row];
            newRow[columnIndex] = customValue;
            return newRow;
          })
        ];
        break;
      default:
        return;
    }

    setData(transformedData);
  };

  return (
    <div className="space-y-4">
      <Select onValueChange={setSelectedColumn}>
        <SelectTrigger>
          <SelectValue placeholder="Select a column to transform" />
        </SelectTrigger>
        <SelectContent>
          {data && data[0].map((header, index) => (
            <SelectItem key={index} value={header}>{header}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select onValueChange={setTransformationType}>
        <SelectTrigger>
          <SelectValue placeholder="Select transformation type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="log">Logarithmic</SelectItem>
          <SelectItem value="normalize">Normalize (0-1)</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={applyTransformation}>Apply Transformation</Button>
    </div>
  );
};

export default DataTransformation;
