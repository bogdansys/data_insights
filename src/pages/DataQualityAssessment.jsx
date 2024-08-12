import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const DataQualityAssessment = ({ data }) => {
  const [qualityIssues, setQualityIssues] = useState([]);
  const [dataCompleteness, setDataCompleteness] = useState(100);

  useEffect(() => {
    if (data) {
      assessDataQuality(data);
    }
  }, [data]);

  const assessDataQuality = (data) => {
    const issues = [];
    let totalCells = 0;
    let emptyCells = 0;

    // Check for missing values and data type consistency
    data[0].forEach((header, columnIndex) => {
      const columnData = data.slice(1).map(row => row[columnIndex]);
      const missingCount = columnData.filter(cell => cell === '' || cell === undefined || cell === null).length;
      emptyCells += missingCount;
      totalCells += columnData.length;

      if (missingCount > 0) {
        issues.push(`Column "${header}" has ${missingCount} missing values (${((missingCount / columnData.length) * 100).toFixed(2)}%)`);
      }

      // Check data type consistency
      const dataTypes = new Set(columnData.map(cell => typeof cell));
      if (dataTypes.size > 1) {
        issues.push(`Column "${header}" has inconsistent data types`);
      }
    });

    // Calculate data completeness
    const completeness = ((totalCells - emptyCells) / totalCells) * 100;
    setDataCompleteness(completeness);

    // Detect outliers using IQR method for numeric columns
    data[0].forEach((header, columnIndex) => {
      const columnData = data.slice(1).map(row => parseFloat(row[columnIndex])).filter(val => !isNaN(val));
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

      {qualityIssues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              <li>Consider removing or imputing rows with missing data</li>
              <li>Investigate and potentially transform columns with inconsistent data types</li>
              <li>Review and possibly remove or adjust outliers in numeric columns</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DataQualityAssessment;
