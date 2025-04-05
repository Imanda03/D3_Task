import { ApiResponse, CovidDataPoint, DailyChangeData, Metrictype, RegressionResult, ScatterDataPoint } from "./types";


export const transformData = (apiData: ApiResponse): CovidDataPoint[] => {
    const result: CovidDataPoint[] = [];

    const dates = Object.keys(apiData.cases || {});

    dates.forEach((date) => {
        result.push({
            date: new Date(date),
            cases: apiData.deaths[date],
            deaths: apiData.deaths[date],
            recovered: apiData.recovered ? apiData.recovered[date] : 0
        })
    });

    return result;
}

export const generateScatterData = (data: CovidDataPoint[]): ScatterDataPoint[] => {
    if (!data) return [];

    return data.map(d => ({
        x: d.cases,
        y: d.deaths,
        date: d.date
    }))
}

export const calculateDailyChange = (data: CovidDataPoint[], metric: Metrictype): DailyChangeData[] => {
    if (!data || data.length < 2) return [];

    return data.slice(1).map((d, i) => ({
        date: d.date,
        value: d[metric] - data[i][metric]
    }));
};

export const linearRegression = (data: [number, number][]): RegressionResult => {
    const n = data.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;
    let sumYY = 0;

    for (let i = 0; i < n; i++) {
        sumX += data[i][0];
        sumY += data[i][1];
        sumXY += data[i][0] * data[i][1]
        sumXX += data[i][0] * data[i][0]
        sumYY += data[i][1] * data[i][1]
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const xMean = sumX / n;
    const yMean = sumY / n;

    let SST = 0;
    let SSR = 0;

    for (let i = 0; i < n; i++) {
        const yPred = slope * data[i][0] + intercept;
        SST += Math.pow(data[i][1] - yMean, 2);
        SSR += Math.pow(yPred - yMean, 2);
    }

    const r2 = SSR / SST;

    return { slope, intercept, r2 };
}