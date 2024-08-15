import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import _ from 'lodash';
import Papa from 'papaparse';

const DataQualityAssessment = ({ csvData }) => {
  const [qualityIssues, setQualityIssues] = useState([]);
  const [dataCompleteness, setDataCompleteness] = useState(100);
  const [duplicateRows, setDuplicateRows] = useState(0);

  useEffect(() => {
    if (csvData) {
      assessDataQuality(csvData);
    }
  }, [csvData]);

  const assessDataQuality = (csvData) => {
    const parsedData = Papa.parse(csvData, { header: true }).data;
    const headers = Object.keys(parsedData[0]);
    const issues = [];
    let totalCells = 0;
    let emptyCells = 0;

    // Check for missing values and data type consistency
    headers.forEach((header) => {
      const columnData = parsedData.map(row => row[header]);
      const missingCount = columnData.filter(cell => cell === '' || cell === undefined || cell === null).length;
      emptyCells += missingCount;
      totalCells += columnData.length;

      if (missingCount > 0) {
        issues.push(`Column "${header}" has ${missingCount} missing values (${((missingCount / columnData.length) * 100).toFixed(2)}%)`);
      }

      // Check data type consistency
      const dataTypes = new Set(columnData.map(cell => {
        if (!isNaN(parseFloat(cell)) && cell !== null && cell !== '') {
          return 'number';
        } else if (cell !== null && cell !== '') {
          return 'string';
        }
        return 'empty';
      }));
      dataTypes.delete('empty');
      if (dataTypes.size > 1) {
        issues.push(`Column "${header}" has inconsistent data types`);
      }
    });

    // Calculate data completeness
    const completeness = ((totalCells - emptyCells) / totalCells) * 100;
    setDataCompleteness(completeness);

    // Detect outliers using IQR method for numeric columns
    headers.forEach((header) => {
      const columnData = columnData = parsedData.map(row => parseFloat(row[header])).filter(val => !isNaN(val));
      if (columnData.length > 0) {
        const sortedData = columnData.sort((a, b) => a - b);
        const q1 = sortedData[Math.floor(sortedData.length / 4)];
        const q3 = sortedData[Math.floor(sortedData.length * 3 / 4)];
        const iqr = q3 - q1;
        const lowerBound = q1 - 1.5 * iqr;
        const upperBound = q3 + 1.5 * iqr;
        const outliers = columnData.filter(val => val < lowerBound || val > upperBound);
        if (outliers.length > 0) {
          issues.push(`Column "${header}" has ${outliers.length} potential outliers`);
        }
      }
    });

    // Detect duplicate rows
    const uniqueRows = _.uniqWith(parsedData, _.isEqual);
    const duplicateRowCount = parsedData.length - uniqueRows.length;
    setDuplicateRows(duplicateRowCount);
    if (duplicateRowCount > 0) {
      issues.push(`The dataset contains ${duplicateRowCount} duplicate rows.`);
    }

    // Set all issues to state
    setQualityIssues(issues);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Data Completeness</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={dataCompleteness} className="w-full" />
          <p className="mt-2 text-sm text-gray-600">{dataCompleteness.toFixed(2)}% of cells contain data</p>
        </CardContent>
      </Card>

      {qualityIssues.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Data Quality Issues Detected</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5">
              {qualityIssues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {qualityIssues.length === 0 && (
        <Alert variant="success">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Data Quality Issues Detected</AlertTitle>
        </Alert>
      )}
    </div>
  );
};

export default DataQualityAssessment;
