import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DataSorting = ({ data, setData, addToHistory }) => {
  const [selectedColumn, setSelectedColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const applySort = () => {
    if (!data || !selectedColumn) return;

    const columnIndex = data[0].indexOf(selectedColumn);
    const sortedData = [
      data[0],
      ...data.slice(1).sort((a, b) => {
        if (sortOrder === 'asc') {
          return a[columnIndex].localeCompare(b[columnIndex], undefined, { numeric: true });
        } else {
          return b[columnIndex].localeCompare(a[columnIndex], undefined, { numeric: true });
        }
      })
    ];

    addToHistory(sortedData);
    setData(sortedData);
  };

  return (
    <div className="space-y-4">
      <Select onValueChange={setSelectedColumn}>
        <SelectTrigger>
          <SelectValue placeholder="Select a column to sort" />
        </SelectTrigger>
        <SelectContent>
          {data && data[0].map((header, index) => (
            <SelectItem key={index} value={header}>{header}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select onValueChange={setSortOrder}>
        <SelectTrigger>
          <SelectValue placeholder="Select sort order" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">Ascending</SelectItem>
          <SelectItem value="desc">Descending</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={applySort}>Apply Sort</Button>
    </div>
  );
};

export default DataSorting;
