import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ChevronDown } from "lucide-react";
import LinearRegression from './ml/LinearRegression';
import PolynomialRegression from './ml/PolynomialRegression';
import DecisionTree from './ml/DecisionTree.jsx';

const MachineLearning = ({ data }) => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('');
  const [error, setError] = useState(null);

  const renderAlgorithmComponent = () => {
    switch (selectedAlgorithm) {
      case 'linear_regression':
        return <LinearRegression data={data} />;
      case 'polynomial_regression':
        return <PolynomialRegression data={data} />;
      case 'decision_tree':
        return <DecisionTree data={data} />;
      default:
        return null;
    }
  };

  if (!data) return <div>Please upload data first.</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Machine Learning Model Configuration</CardTitle>
          <CardDescription>Select and configure your machine learning model</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Select onValueChange={(value) => {
                  setSelectedAlgorithm(value);
                  setError(null);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose ML algorithm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear_regression">Linear Regression</SelectItem>
                    <SelectItem value="polynomial_regression">Polynomial Regression</SelectItem>
                    <SelectItem value="decision_tree">Decision Tree</SelectItem>
                  </SelectContent>
                </Select>
              </TooltipTrigger>
              <TooltipContent>
                <p>Choose the machine learning algorithm to use</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {renderAlgorithmComponent()}

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            How Machine Learning Works
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Understanding Machine Learning</DialogTitle>
            <DialogDescription>
              Machine Learning is a method of data analysis that automates analytical model building. Here's a simplified overview of the process:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p><strong>1. Data Preparation:</strong> Select features (input variables) and a target (what you want to predict).</p>
            <p><strong>2. Algorithm Selection:</strong> Choose a suitable algorithm based on your data and prediction goal.</p>
            <p><strong>3. Model Configuration:</strong> Set hyperparameters specific to the chosen algorithm.</p>
            <p><strong>4. Training:</strong> The algorithm learns patterns from your data to create a model.</p>
            <p><strong>5. Evaluation:</strong> Test the model's performance on unseen data.</p>
            <p><strong>6. Prediction:</strong> Use the trained model to make predictions on new data.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MachineLearning;