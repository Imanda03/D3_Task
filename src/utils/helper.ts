export const transformData = (apiData: any) => {
    const result: { date: Date; cases: any; deaths: any; recovered: any; }[] = [];

    const dates = Object.keys(apiData.cases || {});

    dates.forEach((date) => {
        result.push({
            date: new Date(date),
            cases: apiData.cases[date],
            deaths: apiData.deaths[date],
            recovered: apiData.recovered ? apiData.recovered[date] : 0
        });
    });

    return result;
}

export const formatNum = (n: number) =>
    n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` :
        n >= 1000 ? `${(n / 1000).toFixed(1)}K` :
            n.toString();