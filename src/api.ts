export interface IStockProps {
  quote: {
    open: number;
    close: number;
    companyName: string;
    symbol: string;
    latestPrice: number;
    latestSource: string;
    change: number;
    changePercent: number;
  };
}
export interface IWeatherProps {
  main: {
    feels_like: number;
    humidity: number;
    temp: number;
    temp_max: number;
    temp_min: number;
  };
  name: string;
  weather: { main: string }[];
}

export function getNndm() {
  return fetch(
    'https://cloud.iexapis.com/stable/stock/NNDM/book?token=pk_bd01fb5baf384826a86a28fd4f608990',
  ).then((response) => response.json());
}

export function getSeoulWeather() {
  return fetch(
    'https://api.openweathermap.org/data/2.5/weather?lat=37.5666791&lon=126.9782914&appid=35b9f36e2788176e71a7291fa1976605',
  ).then((response) => response.json());
}
