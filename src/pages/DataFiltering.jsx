import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const DataFiltering = ({ data, setData }) => {
  const [selectedColumn, setSelectedColumn] = useState('');
  const [filterValue, setFilterValue] = useState('');

  const applyFilter = () => {
    if (!data || !selectedColumn || !filterValue) return;

    const columnIndex = data[0].indexOf(selectedColumn);
    const filteredData = [
      data[0],
      ...data.slice(1).filter(row => row[columnIndex].toString().includes(filterValue))
    ];

    setData(filteredData);
  };

  return (
    <div className="space-y-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Select onValueChange={setSelectedColumn}>
              <SelectTrigger>
                <SelectValue placeholder="Select a column to filter" />
              </SelectTrigger>
              <SelectContent>
                {data && data[0].map((header, index) => (
                  <SelectItem key={index} value={header}>{header}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TooltipTrigger>
          <TooltipContent>
            <p>Choose the column you want to filter</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Input
              type="text"
              placeholder="Enter filter value"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Enter the value to filter by</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={applyFilter}>Apply Filter</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Filter the data based on your selection</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default DataFiltering;
