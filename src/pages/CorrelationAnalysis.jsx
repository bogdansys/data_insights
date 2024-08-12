import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip, Cell } from 'recharts';

const CorrelationAnalysis = ({ data }) => {
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [correlationData, setCorrelationData] = useState([]);

  useEffect(() => {
    if (data && selectedColumns.length > 1) {
      const correlationMatrix = calculateCorrelationMatrix();
      setCorrelationData(correlationMatrix);
    }
  }, [data, selectedColumns]);

  const calculateCorrelationMatrix = () => {
    const matrix = [];
    for (let i = 0; i < selectedColumns.length; i++) {
      for (let j = i; j < selectedColumns.length; j++) {
        const correlation = i === j ? 1 : calculateCorrelation(selectedColumns[i], selectedColumns[j]);
        matrix.push({ x: selectedColumns[i], y: selectedColumns[j], value: correlation });
        if (i !== j) {
          matrix.push({ x: selectedColumns[j], y: selectedColumns[i], value: correlation });
        }
      }
    }
    return matrix;
  };

  const calculateCorrelation = (col1, col2) => {
    const index1 = data[0].indexOf(col1);
    const index2 = data[0].indexOf(col2);
    const values1 = data.slice(1).map(row => parseFloat(row[index1])).filter(val => !isNaN(val));
    const values2 = data.slice(1).map(row => parseFloat(row[index2])).filter(val => !isNaN(val));

    if (values1.length !== values2.length || values1.length === 0) {
      return 0;
    }

    const mean1 = values1.reduce((sum, val) => sum + val, 0) / values1.length;
    const mean2 = values2.reduce((sum, val) => sum + val, 0) / values2.length;

    const deviation1 = values1.map(val => val - mean1);
    const deviation2 = values2.map(val => val - mean2);

    const sum1 = deviation1.reduce((sum, val) => sum + val * val, 0);
    const sum2 = deviation2.reduce((sum, val) => sum + val * val, 0);

    const correlation = deviation1.reduce((sum, val, i) => sum + val * deviation2[i], 0) / Math.sqrt(sum1 * sum2);

    return isNaN(correlation) ? 0 : correlation;
  };

  return (
    <div className="space-y-4">
      <Select
        onValueChange={(value) => setSelectedColumns(prev => [...prev, value])}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select columns for correlation analysis" />
        </SelectTrigger>
        <SelectContent>
          {data && data[0].map((header, index) => (
            <SelectItem key={index} value={header}>{header}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div>Selected columns: {selectedColumns.join(', ')}</div>
      {correlationData.length > 0 && (
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart>
            <XAxis dataKey="x" type="category" />
            <YAxis dataKey="y" type="category" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter data={correlationData} fill="#8884d8">
              {correlationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.value > 0 ? `rgb(0, ${Math.floor(entry.value * 255)}, 0)` : `rgb(${Math.floor(-entry.value * 255)}, 0, 0)`} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CorrelationAnalysis;
