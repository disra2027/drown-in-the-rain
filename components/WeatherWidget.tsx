interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

interface WeatherWidgetProps {
  data: WeatherData;
}

export default function WeatherWidget({ data }: WeatherWidgetProps) {
  return (
    <div className="bg-gradient-to-br from-card to-secondary/20 rounded-xl p-4 border border-border fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{data.icon}</span>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{data.temperature}°C</h3>
              <p className="text-sm text-muted-foreground">{data.location}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{data.condition}</p>
        </div>
        <div className="text-right text-xs text-muted-foreground space-y-1">
          <div>Humidity: {data.humidity}%</div>
          <div>Wind: {data.windSpeed} km/h</div>
        </div>
      </div>
    </div>
  );
}