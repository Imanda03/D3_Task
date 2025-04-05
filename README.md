# COVID-19 Data Dashboard
A dynamic, interactive dashboard built with React and D3.js to visualize COVID-19 data from the disease.sh API.
# Features

# Interactive Visualizations:

- Line Chart: Graphs cumulative COVID-19 metrics over time
- Bar Chart: Graphs daily changes in cases, deaths, or recovered
- Scatter Plot: Explores correlation between cases and deaths with regression line


# Interactive Elements:

- Metric selector (cases, deaths, recovered)
- Date range filter (7, 14, 30, or 90 days)
- Interactive tooltips on all charts
- Animated transitions when changing filters


Responsive Design: All visualizations adapt to different screen sizes

# Technology Stack

React: For user interface development and component structure
D3.js: For creating custom, interactive data visualizations
disease.sh API: For real-time COVID-19 data

# Implementation Details
# API Integration
The application fetches historical COVID-19 data from:
 https://disease.sh/v3/covid-19/historical/all?lastdays=30
This returns daily cases, deaths, and recovered counts for the specified time period.
#Data Transformation
Raw API data is converted into formats suitable for each visualization:

- Time series format for line chart, Daily changes calculation for bar chart, X/Y coordinate mapping for scatter plot

- Interactive Features

- Data Filtering: Users can filter data by:

- Metric type (cases, deaths, recovered), Time period (7, 14, 30, 90 days)

# Visualizations:

- Tooltips on hover with detailed information, Smooth transitions and animations when data changes, Color coding to indicate different metrics

# Statistical Analysis:

- Linear regression line on scatter plot, R-squared value to indicate correlation strength

# Challenges and Solutions
Challenges Faced

# Data Processing:

Challenge: Converting the nested API response structure to structured data for D3.js
Solution: Implemented custom data transformation functions per visualization type


# Responsive D3 Visualizations:

Challenge: Making D3 charts responsive to container size changes
Solution: Dynamic sizing and redraw on container resize


# Performance Optimization:

Challenge: Smooth animations with larger datasets
Solution: Selective rendering and transition optimization


# Cross-Browser Compatibility:

Challenge: SVG rendering differences between browsers
Solution: Standardized D3 methods and verified compatibility


# Deployment Instructions

# Clone the repository:

git clone https://github.com/Imanda03/D3_Task

Install dependencies:

cd covid-dashboard
npm install

Start the development server:

npm start

Build for production:

npm run build