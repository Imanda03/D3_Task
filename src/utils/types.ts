export type Metrictype = 'cases' | 'deaths' | 'recovered';

export interface ApiResponse {
    cases: Record<string, number>;
    deaths: Record<string, number>;
    recovered?: Record<string, number>;
}

export interface CovidDataPoint {
    date: Date;
    cases: number;
    deaths: number;
    recovered: number;
}

export interface DailyChangeData {
    date: Date;
    value: number;
}

export interface ScatterDataPoint {
    x: number;
    y: number;
    date: Date;
}

export interface SummaryCardProps {
    title: string;
    value: string;
    color: 'blue' | 'red' | 'green' | 'purple';
    metric?: Metrictype;
}

export interface LineChartProps {
    data: CovidDataPoint[];
    metric: Metrictype;
}

export interface BarChartProps {
    data: DailyChangeData[];
}

export interface ScatterPlotProps {
    data: ScatterDataPoint[];
}
export interface RegressionResult {
    slope: number;
    intercept: number;
    r2: number;
}