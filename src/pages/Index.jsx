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
        <div className="max-w-7xl mx-auto py-4 px-4 flex flex-col items-center relative">
          <h1 className="text-xl sm:text-3xl font-extrabold gradient-text mb-2 text-center">ML and Data Insights Hub</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4 text-center">by Iordache Mihai Bogdan</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={toggleDarkMode} variant="outline" size="icon" className="absolute top-2 right-2">
                  {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle dark mode</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>
      <main className="py-2 sm:py-4 md:py-6">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <Card className="overflow-hidden shadow-xl">
            <CardContent className="p-2 sm:p-4">
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="flex flex-wrap justify-center mb-4 gap-2">
                  {['upload', 'analysis', 'visualization', 'ml'].map((value, index) => (
                    <TabsTrigger key={value} value={value} className="flex-grow text-xs sm:text-sm md:text-base">
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </TabsTrigger>
                  ))}
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
      <footer className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg mt-2 sm:mt-4 md:mt-6`}>
        <div className="max-w-7xl mx-auto py-2 sm:py-4 px-2 sm:px-4 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
          <a href="https://www.linkedin.com/in/mihai-iordache-676444187/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 text-sm sm:text-base">
            LinkedIn
          </a>
          <a href="https://github.com/bogdansys" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800 text-sm sm:text-base">
            GitHub
          </a>
          <a href="mailto:bogdanmihai453@gmail.com" className="text-green-500 hover:text-green-600 text-sm sm:text-base">
            Email
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Index;
