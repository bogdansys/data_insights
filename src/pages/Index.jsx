import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Moon, Sun, ArrowRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import DataUpload from './DataUpload';
import StatisticalAnalysis from './StatisticalAnalysis';
import DataVisualization from './DataVisualization';
import MachineLearning from './MachineLearning';

const Index = () => {
  const [data, setData] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    document.body.classList.toggle('dark', savedDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    document.body.classList.toggle('dark', newDarkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold gradient-text">ML and Data Insights Hub</h1>
            <p className="text-sm text-muted-foreground mt-1">by Iordache Mihai Bogdan</p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={toggleDarkMode} variant="outline" size="icon">
                  {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle dark mode</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="overflow-hidden shadow-xl">
            <CardContent className="p-6">
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-8">
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                  <TabsTrigger value="visualization">Visualization</TabsTrigger>
                  <TabsTrigger value="ml">Machine Learning</TabsTrigger>
                </TabsList>
                <TabsContent value="upload">
                  <DataUpload setData={setData} />
                </TabsContent>
                <TabsContent value="analysis">
                  <StatisticalAnalysis data={data} />
                </TabsContent>
                <TabsContent value="visualization">
                  <DataVisualization data={data} darkMode={darkMode} />
                </TabsContent>
                <TabsContent value="ml">
                  <MachineLearning data={data} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg mt-8`}>
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-center items-center space-x-4">
          <a href="https://www.linkedin.com/in/mihai-iordache-676444187/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">
            LinkedIn
          </a>
          <a href="https://github.com/bogdansys" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">
            GitHub
          </a>
          <a href="mailto:bogdanmihai453@gmail.com" className="text-green-500 hover:text-green-600">
            Email
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Index;