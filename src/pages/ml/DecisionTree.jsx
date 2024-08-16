import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { DecisionTreeRegression as DecisionTree } from 'ml-cart';

const DecisionTreeComponent = ({ data }) => {
  const [targetColumn, setTargetColumn] = useState('');
  const [featureColumns, setFeatureColumns] = useState([]);
  const [maxDepth, setMaxDepth] = useState(5);
  const [minLeafSamples, setMinLeafSamples] = useState(2);
  const [results, setResults] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [predictionInputs, setPredictionInputs] = useState({});
  const [error, setError] = useState(null);

  const handleTrain = () => {
    setError(null);
    try {
      if (!targetColumn || featureColumns.length === 0) {
        throw new Error("Please select target and feature columns.");
      }

      const targetIndex = data[0].indexOf(targetColumn);
      const featureIndices = featureColumns.map(col => data[0].indexOf(col));

      if (targetIndex === -1 || featureIndices.includes(-1)) {
        throw new Error("Invalid column selection.");
      }

      const X = data.slice(1).map(row => featureIndices.map(i => {
        const value = parseFloat(row[i]);
        return isNaN(value) ? 0 : value;
      }));
      const y = data.slice(1).map(row => {
        const value = parseFloat(row[targetIndex]);
        return isNaN(value) ? 0 : value;
      });

      if (X.length !== y.length) {
        throw new Error("Mismatch in feature and target data lengths.");
      }

      const model = new DecisionTree({
        maxDepth: maxDepth,
        minNumSamples: minLeafSamples
      });

      model.train(X, y);

      const predictions = model.predict(X);
      const mse = predictions.reduce((sum, pred, i) => sum + Math.pow(pred - y[i], 2), 0) / predictions.length;
      const r2 = 1 - (mse / y.reduce((sum, val) => sum + Math.pow(val - y.reduce((a, b) => a + b) / y.length, 2), 0));

      setResults({
        r2: r2.toFixed(4),
        model: model
      });

      setPredictionInputs(Object.fromEntries(featureColumns.map(feature => [feature, ''])));
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePredict = () => {
    setError(null);
    try {
      if (!results) {
        throw new Error("Please train the model before making predictions.");
      }
      const input = featureColumns.map(feature => {
        const value = parseFloat(predictionInputs[feature]);
        if (isNaN(value)) {
          throw new Error(`Invalid input for feature "${feature}". Please enter a valid number.`);
        }
        return value;
      });
      const predictedValue = results.model.predict([input])[0];
      setPrediction(predictedValue.toFixed(4));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Decision Tree Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="target">Target Column</Label>
            <Select onValueChange={setTargetColumn}>
              <SelectTrigger id="target">
                <SelectValue placeholder="Select target column" />
              </SelectTrigger>
              <SelectContent>
                {data[0].map((header, index) => (
                  <SelectItem key={index} value={header}>{header}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="features">Feature Columns</Label>
            <Select
              onValueChange={(value) => setFeatureColumns(prev => [...prev, value])}
            >
              <SelectTrigger id="features">
                <SelectValue placeholder="Select feature columns" />
              </SelectTrigger>
              <SelectContent>
                {data[0].map((header, index) => (
                  <SelectItem key={index} value={header}>{header}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="mt-2 text-sm text-gray-600">
              Selected features: {featureColumns.join(', ')}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="max-depth">Max Depth</Label>
            <Input
              id="max-depth"
              type="number"
              value={maxDepth}
              onChange={(e) => setMaxDepth(parseInt(e.target.value))}
              min={1}
              max={100}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="min-leaf-samples">Min Leaf Samples</Label>
            <Input
              id="min-leaf-samples"
              type="number"
              value={minLeafSamples}
              onChange={(e) => setMinLeafSamples(parseInt(e.target.value))}
              min={1}
              max={100}
            />
          </div>
          <Button onClick={handleTrain} className="w-full">Train Model</Button>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Model Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>R-squared:</strong> {results.r2}</p>
          </CardContent>
        </Card>
      )}

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Make Predictions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {featureColumns.map(feature => (
              <div key={feature} className="space-y-2">
                <Label htmlFor={`prediction-${feature}`}>{feature}</Label>
                <Input
                  id={`prediction-${feature}`}
                  type="number"
                  value={predictionInputs[feature]}
                  onChange={(e) => setPredictionInputs(prev => ({ ...prev, [feature]: e.target.value }))}
                  placeholder={`Enter ${feature} value`}
                />
              </div>
            ))}
            <Button onClick={handlePredict} className="w-full">Predict</Button>
            {prediction !== null && (
              <div className="mt-4 p-4 bg-gray-100 rounded-md">
                <h3 className="font-semibold text-lg">Prediction Result</h3>
                <p className="text-2xl font-bold">{prediction}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DecisionTreeComponent;