import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { PolynomialRegression } from 'ml-regression';
import { motion, AnimatePresence } from "framer-motion";

const PolynomialRegressionComponent = ({ data }) => {
  const [targetColumn, setTargetColumn] = useState('');
  const [featureColumn, setFeatureColumn] = useState('');
  const [degree, setDegree] = useState(2);
  const [results, setResults] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [predictionInput, setPredictionInput] = useState('');
  const [error, setError] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [logs, setLogs] = useState([]);

  const addLog = (message, type = 'info') => {
    setLogs(prevLogs => [...prevLogs, { id: Date.now(), message, type }]);
  };

  const handleTrain = async () => {
    setError(null);
    setIsTraining(true);
    setLogs([]);
    try {
      addLog("Starting Polynomial Regression training...", 'start');
      if (!targetColumn || !featureColumn) {
        throw new Error("Please select both target and feature columns.");
      }

      const targetIndex = data[0].indexOf(targetColumn);
      const featureIndex = data[0].indexOf(featureColumn);

      if (targetIndex === -1 || featureIndex === -1) {
        throw new Error("Invalid column selection.");
      }

      addLog("Preprocessing data...", 'process');
      await new Promise(resolve => setTimeout(resolve, 500));
      const X = data.slice(1).map(row => parseFloat(row[featureIndex])).filter(val => !isNaN(val));
      const y = data.slice(1).map(row => parseFloat(row[targetIndex])).filter(val => !isNaN(val));

      if (X.length !== y.length) {
        throw new Error("Mismatch in feature and target data lengths.");
      }

      addLog(`Training model with degree ${degree}...`, 'process');
      await new Promise(resolve => setTimeout(resolve, 1500));
      const regression = new PolynomialRegression(X, y, degree);
      
      addLog("Calculating predictions and metrics...", 'process');
      await new Promise(resolve => setTimeout(resolve, 800));
      const predictions = X.map(x => regression.predict(x));
      const mse = predictions.reduce((sum, pred, i) => sum + Math.pow(pred - y[i], 2), 0) / predictions.length;
      const r2 = 1 - (mse / y.reduce((sum, val) => sum + Math.pow(val - y.reduce((a, b) => a + b) / y.length, 2), 0));

      setResults({
        coefficients: regression.coefficients,
        r2: r2.toFixed(4),
        equation: regression.toString(3)
      });

      addLog("Training completed successfully!", 'success');
    } catch (err) {
      setError(err.message);
      addLog(`Error: ${err.message}`, 'error');
    } finally {
      setIsTraining(false);
    }
  };

  const handlePredict = () => {
    setError(null);
    try {
      if (!results) {
        throw new Error("Please train the model before making predictions.");
      }
      const input = parseFloat(predictionInput);
      if (isNaN(input)) {
        throw new Error("Please enter a valid number for prediction.");
      }
      const predictedValue = results.coefficients.reduce((sum, coeff, index) => sum + coeff * Math.pow(input, index), 0);
      setPrediction(predictedValue.toFixed(4));
      addLog(`Prediction made: Input ${input} → Output ${predictedValue.toFixed(4)}`, 'success');
    } catch (err) {
      setError(err.message);
      addLog(`Prediction Error: ${err.message}`, 'error');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Polynomial Regression Configuration</CardTitle>
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
            <Label htmlFor="feature">Feature Column</Label>
            <Select onValueChange={setFeatureColumn}>
              <SelectTrigger id="feature">
                <SelectValue placeholder="Select feature column" />
              </SelectTrigger>
              <SelectContent>
                {data[0].map((header, index) => (
                  <SelectItem key={index} value={header}>{header}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="degree">Polynomial Degree</Label>
            <Input
              id="degree"
              type="number"
              value={degree}
              onChange={(e) => setDegree(parseInt(e.target.value))}
              min={1}
              max={10}
            />
          </div>
          <Button onClick={handleTrain} className="w-full" disabled={isTraining}>
            {isTraining ? 'Training...' : 'Train Model'}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Training Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            className="h-60 overflow-y-auto bg-gray-100 p-4 rounded-lg shadow-inner"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence>
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className={`mb-2 p-2 rounded ${
                    log.type === 'error' ? 'bg-red-100 text-red-800' :
                    log.type === 'success' ? 'bg-green-100 text-green-800' :
                    log.type === 'start' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-200 text-gray-800'
                  }`}
                >
                  {log.message}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Model Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Coefficients:</strong> {results.coefficients.map(c => c.toFixed(4)).join(', ')}</p>
                <p><strong>R-squared:</strong> {results.r2}</p>
                <p><strong>Equation:</strong> {results.equation}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Make Predictions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prediction-input">Enter {featureColumn} value</Label>
                <Input
                  id="prediction-input"
                  type="number"
                  value={predictionInput}
                  onChange={(e) => setPredictionInput(e.target.value)}
                  placeholder={`Enter ${featureColumn} value`}
                />
              </div>
              <Button onClick={handlePredict} className="w-full">Predict</Button>
              <AnimatePresence>
                {prediction !== null && (
                  <motion.div
                    className="mt-4 p-4 bg-gray-100 rounded-md"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="font-semibold text-lg">Prediction Result</h3>
                    <p className="text-2xl font-bold">{prediction}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default PolynomialRegressionComponent;