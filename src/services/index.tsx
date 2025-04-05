import { ApiResponse } from "../utils/types";

export const fetchCovidData = async (dateRange: number): Promise<ApiResponse> => {
    try {
        const response = await fetch(`https://disease.sh/v3/covid-19/historical/all?lastdays=${dateRange}`);

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const jsonData: ApiResponse = await response.json();
        return jsonData;
    } catch (error) {
        console.error('Error fetching COVID data:', error);
        throw error;
    }

}