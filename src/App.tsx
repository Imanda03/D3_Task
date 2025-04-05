import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import { CovidDataPoint, DailyChangeData, Metrictype, ScatterDataPoint } from './utils/types';
import LineChart from './components/LineChart';
import { fetchCovidData } from './services';
import { transformData } from './utils/helper';
import { BarChart } from './components/BarChart';
import { calculateDailyChange, generateScatterData } from './utils/dataTransform';
import { ScatterPlot } from './components/ScatterPlot';
import { SummaryCard } from './components/SummaryCard';

const App = () => {
  const [data, setData] = useState<CovidDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<Metrictype>('cases');
  const [dateRange, setDateRange] = useState<number>(30);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const apiData = await fetchCovidData(dateRange);
        const transformedData = transformData(apiData);
        setData(transformedData);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    loadData();
  }, [dateRange]);

  const dailyChangeData: DailyChangeData[] = calculateDailyChange(data, selectedMetric);
  const scatterData: ScatterDataPoint[] = generateScatterData(data);

  return (
    <div
      style={{
        maxWidth: '1280px',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        paddingTop: '2rem',
        paddingBottom: '2rem',
      }}
    >
      <Header />
      <div style={{ display: 'flex', gap: 4, marginBottom: 6, justifyContent: 'space-between', alignItems: 'center', marginLeft: 10, marginRight: 10 }}>
        <div>
          <label htmlFor='metric-select' style={{ marginRight: 2, }}>Select Metric:</label>
          <select id="metric-select"
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as Metrictype)}
            style={{ padding: 2, margin: 10, border: 1, borderRadius: 10 }}
          >
            <option value="cases">Cases</option>
            <option value="deaths">Deaths</option>
            <option value="recovered">Recovered</option>
          </select>
        </div>
        <div>
          <label htmlFor='date-range' style={{ marginRight: 2, }}>Date Range (days):</label>
          <select id="date-range"
            value={dateRange}
            onChange={(e) => setDateRange(parseInt(e.target.value))}
            style={{ padding: 2, margin: 10, border: 1, borderRadius: 10 }}
          >
            <option value="7">Last 7 days</option>
            <option value="14">Last 14 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', margin: 10 }}>
        <div style={{
          backgroundColor: 'white',
          padding: '1rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
        }}>
          <h2 style={{ marginBottom: 2 }}>Cumulative {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Over Time</h2>
          <LineChart data={data} metric={selectedMetric} />
        </div>

        <div
          style={{
            backgroundColor: 'white',
            padding: '1rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
          }}
        >
          <h2
            style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              marginBottom: '0.5rem'
            }}
          >
            Daily New {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}
          </h2>
          <BarChart data={dailyChangeData} />
        </div>


        <div
          style={{
            backgroundColor: 'white',
            padding: '1rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
            gridColumn: 'span 1',
          }}
          className="responsive-grid-span"
        >
          <h2
            style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              marginBottom: '0.5rem',
            }}
          >
            Cases vs Deaths Correlation
          </h2>
          <ScatterPlot data={scatterData} />
        </div>

        <div
          style={{
            marginTop: '1.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
            gap: '1rem',
          }}
          className="responsive-grid"
        >
          <SummaryCard
            title="Total Cases"
            value={data[data.length - 1]?.cases?.toLocaleString()}
            color="blue"
          />
          <SummaryCard
            title="Total Deaths"
            value={data[data.length - 1]?.deaths?.toLocaleString()}
            color="red"
          />
          <SummaryCard
            title="Latest Daily Increase"
            value={dailyChangeData[dailyChangeData.length - 1]?.value?.toLocaleString()}
            metric={selectedMetric}
            color="purple"
          />

        </div>
      </div>


    </div>
  )
}

export default App