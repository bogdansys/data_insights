import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { SimpleLinearRegression, PolynomialRegression } from "ml-regression";
import KMeans from "ml-kmeans";
import { RandomForestRegression as RandomForest } from "ml-random-forest";
import { DecisionTreeRegression as DecisionTree } from "ml-cart";
import { Matrix } from "ml-matrix";

const MachineLearning = ({ data }) => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("");
  const [targetColumn, setTargetColumn] = useState("");
  const [featureColumns, setFeatureColumns] = useState([]);
  const [results, setResults] = useState(null);
  const [testSize, setTestSize] = useState(0.2);
  const [hyperparameters, setHyperparameters] = useState({});
  const [trainedModel, setTrainedModel] = useState(null);
  const [predictionInputs, setPredictionInputs] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [featureImportance, setFeatureImportance] = useState([]);
  const [crossValidationResults, setCrossValidationResults] = useState(null);

  useEffect(() => {
    if (featureColumns.length > 0) {
      const initialInputs = {};
      featureColumns.forEach((feature) => {
        initialInputs[feature] = "";
      });
      setPredictionInputs(initialInputs);
    }
  }, [featureColumns]);

  const handleTrain = () => {
    setTrainingProgress(0);
    const interval = setInterval(() => {
      setTrainingProgress((prev) => Math.min(prev + 10, 100));
    }, 100);

    // Prepare data
    const targetIndex = data[0].indexOf(targetColumn);
    const featureIndices = featureColumns.map((col) => data[0].indexOf(col));
    const X = data
      .slice(1)
      .map((row) =>
        featureIndices.map((i) => {
          const value = parseFloat(row[i]);
          return isNaN(value) ? 0 : value; // Replace NaN with 0
        }),
      )
      .filter((row) => row.every((val) => !isNaN(val)));
    const y = data
      .slice(1)
      .map((row) => {
        const value = parseFloat(row[targetIndex]);
        return isNaN(value) ? 0 : value; // Replace NaN with 0
      })
      .filter((val) => !isNaN(val));

    if (X.length !== y.length) {
      console.error("Mismatch in X and y lengths after filtering");
      return;
    }

    // Split data
    const splitIndex = Math.floor(X.length * (1 - testSize));
    const X_train = X.slice(0, splitIndex);
    const y_train = y.slice(0, splitIndex);
    const X_test = X.slice(splitIndex);
    const y_test = y.slice(splitIndex);

    let model;
    switch (selectedAlgorithm) {
      case "linear_regression":
        model = new SimpleLinearRegression(
          X_train.map((x) => x[0]),
          y_train,
        );
        break;
      case "polynomial_regression":
        model = new PolynomialRegression(
          X_train.map((x) => x[0]),
          y_train,
          hyperparameters.degree || 2,
        );
        break;
      case "random_forest":
        model = new RandomForest({
          nEstimators: hyperparameters.n_estimators || 100,
          maxDepth: hyperparameters.max_depth || 10,
          treeOptions: { maxFeatures: "sqrt" },
        });
        const X_matrix = new Matrix(X_train);
        const y_vector = Matrix.columnVector(y_train);
        if (X_matrix.columns !== featureColumns.length) {
          console.error(
            `Mismatch in feature count: expected ${featureColumns.length}, got ${X_matrix.columns}`,
          );
          return;
        }
        model.train(X_matrix, y_vector);
        break;
      case "decision_tree":
        model = new DecisionTree({
          maxDepth: hyperparameters.max_depth || 10,
        });
        model.train(new Matrix(X_train), Matrix.columnVector(y_train));
        break;
      case "kmeans":
        model = new KMeans(hyperparameters.n_clusters || 3);
        model.train(X_train);
        break;
      default:
        clearInterval(interval);
        setTrainingProgress(0);
        return;
    }

    // Calculate metrics
    let y_pred;
    if (selectedAlgorithm === "kmeans") {
      y_pred = model.predict(X_test);
    } else {
      y_pred = X_test.map((x) => model.predict(x));
    }

    const mse =
      y_pred.reduce((sum, pred, i) => sum + Math.pow(pred - y_test[i], 2), 0) /
      y_pred.length;
    const rmse = Math.sqrt(mse);
    const r2 =
      1 -
      mse /
        y_test.reduce(
          (sum, y) =>
            sum +
            Math.pow(y - y_test.reduce((a, b) => a + b) / y_test.length, 2),
          0,
        );

    clearInterval(interval);
    setTrainingProgress(100);

    setResults({
      rmse: rmse.toFixed(4),
      r2: r2.toFixed(4),
    });

    // Feature importance
    if (selectedAlgorithm === "linear_regression") {
      setFeatureImportance([
        {
          feature: featureColumns[0],
          importance: Math.abs(model.slope).toFixed(4),
        },
      ]);
    } else if (selectedAlgorithm === "random_forest") {
      const importance = model.featureImportance();
      setFeatureImportance(
        featureColumns.map((feature, index) => ({
          feature,
          importance: importance[index].toFixed(4),
        })),
      );
    }

    // Simple k-fold cross-validation
    const kFolds = 5;
    const foldSize = Math.floor(X.length / kFolds);
    const scores = [];

    for (let i = 0; i < kFolds; i++) {
      const testStart = i * foldSize;
      const testEnd = testStart + foldSize;
      const X_test_fold = X.slice(testStart, testEnd);
      const y_test_fold = y.slice(testStart, testEnd);
      const X_train_fold = [...X.slice(0, testStart), ...X.slice(testEnd)];
      const y_train_fold = [...y.slice(0, testStart), ...y.slice(testEnd)];

      let foldModel;
      switch (selectedAlgorithm) {
        case "linear_regression":
          foldModel = new SimpleLinearRegression(
            X_train_fold.map((x) => x[0]),
            y_train_fold,
          );
          break;
        case "polynomial_regression":
          foldModel = new PolynomialRegression(
            X_train_fold.map((x) => x[0]),
            y_train_fold,
            hyperparameters.degree || 2,
          );
          break;
        case "random_forest":
          foldModel = new RandomForest({
            nEstimators: hyperparameters.n_estimators || 100,
            maxDepth: hyperparameters.max_depth || 10,
            treeOptions: { maxFeatures: "sqrt" },
          });
          foldModel.train(
            new Matrix(X_train_fold),
            Matrix.columnVector(y_train_fold),
          );
          break;
        case "decision_tree":
          foldModel = new DecisionTree({
            maxDepth: hyperparameters.max_depth || 10,
          });
          foldModel.train(
            new Matrix(X_train_fold),
            Matrix.columnVector(y_train_fold),
          );
          break;
        default:
          continue;
      }

      const y_pred_fold = X_test_fold.map((x) => foldModel.predict(x));
      const mse =
        y_pred_fold.reduce(
          (sum, pred, i) => sum + Math.pow(pred - y_test_fold[i], 2),
          0,
        ) / y_pred_fold.length;
      scores.push(mse);
    }

    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const standardDeviation = Math.sqrt(
      scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) /
        scores.length,
    );

    setCrossValidationResults({
      mean: mean.toFixed(4),
      standardDeviation: standardDeviation.toFixed(4),
    });

    setTrainedModel(model);
  };

  const handlePredictionInputChange = (feature, value) => {
    setPredictionInputs((prev) => ({ ...prev, [feature]: value }));
  };

  const handlePredict = () => {
    if (trainedModel) {
      const input = featureColumns.map((feature) =>
        parseFloat(predictionInputs[feature]),
      );
      const predictionResult = trainedModel.predict(input);
      if (Array.isArray(predictionResult)) {
        setPrediction(predictionResult.map((val) => val.toFixed(4)).join(", "));
      } else if (typeof predictionResult === "number") {
        setPrediction(predictionResult.toFixed(4));
      } else {
        setPrediction(JSON.stringify(predictionResult));
      }
    }
  };

  const handleHyperparameterChange = (param, value) => {
    setHyperparameters((prev) => ({ ...prev, [param]: value }));
  };

  if (!data) return <div>Please upload data first.</div>;

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <Select onValueChange={setSelectedAlgorithm}>
          <SelectTrigger>
            <SelectValue placeholder="Select ML algorithm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="linear_regression">Linear Regression</SelectItem>
            <SelectItem value="polynomial_regression">
              Polynomial Regression
            </SelectItem>
            <SelectItem value="random_forest">Random Forest</SelectItem>
            <SelectItem value="decision_tree">Decision Tree</SelectItem>
            <SelectItem value="kmeans">K-Means Clustering</SelectItem>
          </SelectContent>
        </Select>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">How does it work?</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>How Machine Learning Works</DialogTitle>
              <DialogDescription>
                1. Select a machine learning algorithm.
                <br />
                2. Choose the target column (what you want to predict).
                <br />
                3. Select feature columns (data used for prediction).
                <br />
                4. Adjust hyperparameters if available.
                <br />
                5. Train the model on your data.
                <br />
                6. View model performance metrics.
                <br />
                7. Use the trained model to make predictions on new data.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <Select onValueChange={setTargetColumn}>
        <SelectTrigger>
          <SelectValue placeholder="Select target column" />
        </SelectTrigger>
        <SelectContent>
          {data[0].map((header, index) => (
            <SelectItem key={index} value={header}>
              {header}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={(value) => setFeatureColumns([...featureColumns, value])}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select feature columns" />
        </SelectTrigger>
        <SelectContent>
          {data[0].map((header, index) => (
            <SelectItem key={index} value={header}>
              {header}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div>Selected features: {featureColumns.join(", ")}</div>

      <div className="space-y-2">
        <Label>Test Size</Label>
        <Slider
          min={0.1}
          max={0.5}
          step={0.1}
          value={[testSize]}
          onValueChange={([value]) => setTestSize(value)}
        />
        <div>Test Size: {testSize}</div>
      </div>

      {selectedAlgorithm === "polynomial_regression" && (
        <div className="space-y-2">
          <Label>Polynomial Degree</Label>
          <Input
            type="number"
            value={hyperparameters.degree || 2}
            onChange={(e) =>
              handleHyperparameterChange("degree", parseInt(e.target.value))
            }
          />
        </div>
      )}

      {(selectedAlgorithm === "random_forest" ||
        selectedAlgorithm === "decision_tree") && (
        <div className="space-y-2">
          <Label>Max Depth</Label>
          <Input
            type="number"
            value={hyperparameters.max_depth || 10}
            onChange={(e) =>
              handleHyperparameterChange("max_depth", parseInt(e.target.value))
            }
          />
        </div>
      )}

      {selectedAlgorithm === "random_forest" && (
        <div className="space-y-2">
          <Label>Number of Trees</Label>
          <Input
            type="number"
            value={hyperparameters.n_estimators || 100}
            onChange={(e) =>
              handleHyperparameterChange(
                "n_estimators",
                parseInt(e.target.value),
              )
            }
          />
        </div>
      )}

      {selectedAlgorithm === "kmeans" && (
        <div className="space-y-2">
          <Label>Number of Clusters</Label>
          <Input
            type="number"
            value={hyperparameters.n_clusters || 3}
            onChange={(e) =>
              handleHyperparameterChange("n_clusters", parseInt(e.target.value))
            }
          />
        </div>
      )}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={handleTrain}>Train Model</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Train the selected machine learning model on your data</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {trainingProgress > 0 && trainingProgress < 100 && (
        <div className="mt-4">
          <Label>Training Progress</Label>
          <Progress value={trainingProgress} className="w-full" />
        </div>
      )}

      {results && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>RMSE</CardTitle>
            </CardHeader>
            <CardContent>{results.rmse}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>R-squared</CardTitle>
            </CardHeader>
            <CardContent>{results.r2}</CardContent>
          </Card>
        </div>
      )}

      {crossValidationResults && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Cross-Validation Mean</CardTitle>
            </CardHeader>
            <CardContent>{crossValidationResults.mean}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Cross-Validation Std Dev</CardTitle>
            </CardHeader>
            <CardContent>
              {crossValidationResults.standardDeviation}
            </CardContent>
          </Card>
        </div>
      )}

      {featureImportance.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Feature Importance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={featureImportance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="feature" />
              <YAxis />
              <RechartsTooltip />
              <Bar dataKey="importance" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {trainedModel && (
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold">Make Predictions</h3>
          {featureColumns.map((feature) => (
            <div key={feature} className="space-y-2">
              <Label>{feature}</Label>
              <Input
                type="number"
                value={predictionInputs[feature]}
                onChange={(e) =>
                  handlePredictionInputChange(feature, e.target.value)
                }
                placeholder={`Enter ${feature} value`}
              />
            </div>
          ))}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handlePredict}>Predict</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Make a prediction using the trained model</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {prediction !== null && (
            <Card>
              <CardHeader>
                <CardTitle>Prediction Result</CardTitle>
              </CardHeader>
              <CardContent>{prediction}</CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default MachineLearning;
