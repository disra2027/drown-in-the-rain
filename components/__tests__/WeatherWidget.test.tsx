import { render, screen } from '../../__tests__/utils/testUtils';
import WeatherWidget from '../WeatherWidget';
import { mockWeatherData } from '../../__tests__/utils/testUtils';

describe('WeatherWidget', () => {
  it('should render weather data correctly', () => {
    render(<WeatherWidget data={mockWeatherData} />);

    expect(screen.getByText('22°C')).toBeInTheDocument();
    expect(screen.getByText('New York')).toBeInTheDocument();
    expect(screen.getByText('Partly Cloudy')).toBeInTheDocument();
    expect(screen.getByText('Humidity: 65%')).toBeInTheDocument();
    expect(screen.getByText('Wind: 12 km/h')).toBeInTheDocument();
    expect(screen.getByText('🌤️')).toBeInTheDocument();
  });

  it('should display different weather conditions', () => {
    const rainyWeather = {
      ...mockWeatherData,
      condition: 'Rainy',
      temperature: 18,
      icon: '🌧️'
    };

    render(<WeatherWidget data={rainyWeather} />);

    expect(screen.getByText('18°C')).toBeInTheDocument();
    expect(screen.getByText('Rainy')).toBeInTheDocument();
    expect(screen.getByText('🌧️')).toBeInTheDocument();
  });

  it('should handle different locations', () => {
    const londonWeather = {
      ...mockWeatherData,
      location: 'London',
      temperature: 15,
      humidity: 80,
      windSpeed: 8
    };

    render(<WeatherWidget data={londonWeather} />);

    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('15°C')).toBeInTheDocument();
    expect(screen.getByText('Humidity: 80%')).toBeInTheDocument();
    expect(screen.getByText('Wind: 8 km/h')).toBeInTheDocument();
  });

  it('should have proper styling classes', () => {
    const { container } = render(<WeatherWidget data={mockWeatherData} />);
    
    const widget = container.firstChild as HTMLElement;
    expect(widget).toHaveClass('bg-gradient-to-br', 'from-card', 'to-secondary/20', 'rounded-xl');
  });

  it('should handle zero values correctly', () => {
    const zeroWeather = {
      ...mockWeatherData,
      temperature: 0,
      humidity: 0,
      windSpeed: 0
    };

    render(<WeatherWidget data={zeroWeather} />);

    expect(screen.getByText('0°C')).toBeInTheDocument();
    expect(screen.getByText('Humidity: 0%')).toBeInTheDocument();
    expect(screen.getByText('Wind: 0 km/h')).toBeInTheDocument();
  });

  it('should handle negative temperatures', () => {
    const coldWeather = {
      ...mockWeatherData,
      temperature: -10,
      condition: 'Snow',
      icon: '❄️'
    };

    render(<WeatherWidget data={coldWeather} />);

    expect(screen.getByText('-10°C')).toBeInTheDocument();
    expect(screen.getByText('Snow')).toBeInTheDocument();
    expect(screen.getByText('❄️')).toBeInTheDocument();
  });
});