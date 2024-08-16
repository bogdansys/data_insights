## Project Description

ML and Data Insights Hub is a comprehensive web application for data analysis, visualization, and machine learning. It offers the following features:

- Data Upload: Upload and preview CSV files
- Statistical Analysis: Calculate and display key statistics for selected columns
- Data Visualization: Create various charts (bar, scatter, line, pie) from your data
- Machine Learning: Train and evaluate ML models, make predictions
- Data Quality Assessment: Analyze data completeness and identify quality issues
- Dark Mode: Toggle between light and dark themes for comfortable viewing

### Live app: https://data-insights-nu.vercel.app/

## Running Locally

To run this project on your local machine:

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`

## Technologies Used

- React
- Vite
- Tailwind CSS
- Recharts
- Shadcn UI components
- Lucide React icons

# ML and Data Insights Hub - Project Structure and File Guide

## Key Files and Their Responsibilities

1. `src/pages/Index.jsx`
   - Main entry point of the application
   - Controls the overall layout and navigation
   - Manages dark mode toggle

2. `src/pages/DataUpload.jsx`
   - Handles data uploading functionality
   - Parses CSV files and displays a preview of the data
   - Triggers initial data quality assessment

3. `src/pages/StatisticalAnalysis.jsx`
   - Performs basic statistical analysis on selected columns
   - Calculates mean, median, mode, and standard deviation
   - Allows exporting of statistics

4. `src/pages/DataVisualization.jsx`
   - Manages various data visualization options
   - Supports bar charts, scatter plots, line charts, and pie charts
   - Uses Recharts library for rendering visualizations

5. `src/pages/MachineLearning.jsx`
   - Implements machine learning algorithms
   - Supports Linear Regression, Polynomial Regression, Random Forest, Decision Tree, and K-Means Clustering
   - Handles model training, evaluation, and prediction

6. `src/pages/DataPreprocessing.jsx`
   - Provides data preprocessing options
   - Includes handling missing values, normalization, and custom transformations

7. `src/pages/DataQualityAssessment.jsx`
   - Assesses the quality of uploaded data
   - Detects missing values, inconsistencies, and potential outliers

8. `src/App.jsx`
   - Sets up routing and global providers
   - Manages the application's overall structure

9. `src/nav-items.jsx`
   - Defines the navigation structure for the application

## File Structure

```
ml-and-data-insights-hub/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   └── ui/
│   │       └── (various UI components)
│   ├── lib/
│   │   └── utils.js (utility functions)
│   ├── pages/
│   │   ├── Index.jsx (main page)
│   │   ├── DataUpload.jsx
│   │   ├── StatisticalAnalysis.jsx
│   │   ├── DataVisualization.jsx
│   │   ├── MachineLearning.jsx
│   │   ├── DataPreprocessing.jsx
│   │   ├── DataQualityAssessment.jsx
│   │   ├── CorrelationAnalysis.jsx
│   │   ├── DataExport.jsx
│   │   ├── DataFiltering.jsx
│   │   └── DataSorting.jsx
│   ├── App.jsx
│   ├── index.css (global styles)
│   ├── main.jsx (entry point)
│   └── nav-items.jsx (navigation configuration)
├── .eslintrc.cjs (ESLint configuration)
├── index.html (HTML template)
├── package.json (project dependencies and scripts)
├── tailwind.config.js (Tailwind CSS configuration)
└── vite.config.js (Vite configuration)
```

## Making Changes

- To modify the overall layout or add new pages, edit `src/pages/Index.jsx`
- For changes to data processing or analysis, look in the respective files in `src/pages/`
- UI components are located in `src/components/ui/`
- Styling changes can be made in `src/index.css` or by modifying Tailwind classes in components
- To add or modify machine learning models, edit `src/pages/MachineLearning.jsx`
- For changes to the navigation structure, update `src/nav-items.jsx`

Remember to check `package.json` for available scripts and dependencies when working on the project.

## Project Structure
The project follows a standard React application structure:

```
ml-and-data-insights-hub/
├── public/
├── src/
│   ├── components/
│   │   └── ui/
│   ├── lib/
│   ├── pages/
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   └── nav-items.jsx
├── .eslintrc.cjs
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## Key Components
The main components of the application are located in the `src/pages/` directory:

- `Index.jsx`: The main page component that orchestrates the overall layout and navigation.
- `DataUpload.jsx`: Handles data uploading and initial processing.
- `StatisticalAnalysis.jsx`: Performs basic statistical analysis on the uploaded data.
- `DataVisualization.jsx`: Provides various data visualization options.
- `MachineLearning.jsx`: Implements machine learning algorithms and model training.

Other important files:

- `src/App.jsx`: The root component of the application.
- `src/nav-items.jsx`: Defines the navigation structure.
- `src/index.css`: Contains global styles and Tailwind CSS configurations.

## Workflow
The application follows a linear workflow:

1. Data Upload
2. Statistical Analysis
3. Data Visualization
4. Machine Learning

Each step is represented by a tab in the main interface. Users progress through these steps sequentially, although they can move back and forth between tabs as needed.

## Adding New Features
To add a new feature to the application:

1. Create a new component in the `src/pages/` directory if it's a major feature, or in `src/components/` for smaller, reusable components.
2. Import and use the new component in `Index.jsx` or the relevant parent component.
3. If the feature requires a new tab, add it to the `navItems` array in `src/nav-items.jsx`.
4. Implement the necessary logic, state management, and UI elements in your new component.
5. Style your component using Tailwind CSS classes for consistency with the rest of the application.

## Best Practices
- Use functional components and hooks for state management and side effects.
- Leverage the UI components from `src/components/ui/` for consistent styling.
- Follow the existing code style and formatting conventions.
- Write clear, descriptive comments for complex logic or algorithms.
- Use meaningful variable and function names that describe their purpose.
- Optimize performance by memoizing expensive computations or using React.memo for pure components.

## Troubleshooting
Common issues and their solutions:

- If you encounter dependency issues, try deleting the `node_modules` folder and running `npm install` again.
- For styling problems, make sure Tailwind CSS is properly configured in `tailwind.config.js` and that you're using the correct class names.
- If a component is not rendering as expected, check the React DevTools to inspect the component hierarchy and state.
- For performance issues, use the React Profiler to identify bottlenecks in rendering or computation.

For any other issues, consult the project's issue tracker or reach out to the project maintainers.

Enjoy exploring your data with ML and Data Insights Hub!
