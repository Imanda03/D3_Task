import { useEffect, useState } from 'react'
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
  const [selectedMetric, setSelectedMetric] = useState<Metrictype>('cases');
  const [dateRange, setDateRange] = useState<number>(30);

  useEffect(() => {
    const loadData = async () => {
      try {
        const apiData = await fetchCovidData(dateRange);
        const transformedData = transformData(apiData);
        setData(transformedData);
      } catch (err) {
        console.log('error', err)
      }
    };

    loadData();
  }, [dateRange]);

  const dailyChangeData: DailyChangeData[] = calculateDailyChange(data, selectedMetric);
  const scatterData: ScatterDataPoint[] = generateScatterData(data);

  return (
    <>
      <Header />
      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '1rem',
        }}
      >
        {/* Controls Section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.5rem',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <div>
            <label htmlFor='metric-select' style={{ marginRight: '0.5rem' }}>Select Metric:</label>
            <select
              id="metric-select"
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as Metrictype)}
              style={{
                padding: '0.5rem',
                borderRadius: '0.25rem',
                border: '1px solid #e2e8f0'
              }}
            >
              <option value="cases">Cases</option>
              <option value="deaths">Deaths</option>
              <option value="recovered">Recovered</option>
            </select>
          </div>
          <div>
            <label htmlFor='date-range' style={{ marginRight: '0.5rem' }}>Date Range (days):</label>
            <select
              id="date-range"
              value={dateRange}
              onChange={(e) => setDateRange(parseInt(e.target.value))}
              style={{
                padding: '0.5rem',
                borderRadius: '0.25rem',
                border: '1px solid #e2e8f0'
              }}
            >
              <option value="7">Last 7 days</option>
              <option value="14">Last 14 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
        </div>

        {/* Charts Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            width: '100%'
          }}
        >
          {/* Line Chart */}
          <div
            style={{
              backgroundColor: 'white',
              padding: '1rem',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
              gridColumn: '1 / -1',
            }}
          >
            <h2 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              marginBottom: '0.5rem'
            }}>
              Cumulative {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Over Time
            </h2>
            <LineChart data={data} metric={selectedMetric} />
          </div>

          {/* Bar Chart */}
          <div
            style={{
              backgroundColor: 'white',
              padding: '1rem',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
              gridColumn: '1 / -1',
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

          {/* Scatter Plot */}
          <div
            style={{
              backgroundColor: 'white',
              padding: '1rem',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
              gridColumn: '1 / -1', // Full width on smaller screens
            }}
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

          {/* Summary Cards */}
          <div
            style={{
              marginTop: '1.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              gridColumn: '1 / -1',
            }}
          >
            <SummaryCard
              title="Total Cases"
              value={data[data.length - 1]?.cases?.toLocaleString() || '0'}
              color="blue"
            />
            <SummaryCard
              title="Total Deaths"
              value={data[data.length - 1]?.deaths?.toLocaleString() || '0'}
              color="red"
            />
            <SummaryCard
              title="Latest Daily Increase"
              value={dailyChangeData[dailyChangeData.length - 1]?.value?.toLocaleString() || '0'}
              metric={selectedMetric}
              color="purple"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default App