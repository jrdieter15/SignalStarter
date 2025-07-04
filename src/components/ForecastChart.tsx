import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ForecastData {
  date: string;
  actual?: number;
  predicted: number;
  confidenceLower: number;
  confidenceUpper: number;
}

interface ForecastChartProps {
  data: ForecastData[];
  title: string;
  unit?: string;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ data, title, unit = '' }) => {
  const labels = data.map(d => d.date);
  
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Actual',
        data: data.map(d => d.actual),
        borderColor: 'rgb(var(--color-primary))',
        backgroundColor: 'rgba(var(--color-primary), 0.1)',
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.1,
      },
      {
        label: 'Predicted',
        data: data.map(d => d.predicted),
        borderColor: 'rgb(var(--color-secondary))',
        backgroundColor: 'rgba(var(--color-secondary), 0.1)',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.1,
      },
      {
        label: 'Confidence Range',
        data: data.map(d => d.confidenceUpper),
        borderColor: 'rgba(var(--color-muted), 0.3)',
        backgroundColor: 'rgba(var(--color-muted), 0.1)',
        borderWidth: 1,
        fill: '+1',
        pointRadius: 0,
        tension: 0.1,
      },
      {
        label: 'Confidence Lower',
        data: data.map(d => d.confidenceLower),
        borderColor: 'rgba(var(--color-muted), 0.3)',
        backgroundColor: 'rgba(var(--color-muted), 0.1)',
        borderWidth: 1,
        fill: false,
        pointRadius: 0,
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          filter: (item: any) => item.text !== 'Confidence Lower',
        },
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${unit}${value?.toLocaleString() || 'N/A'}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: `Value (${unit})`,
        },
        beginAtZero: false,
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  return (
    <div className="h-80 w-full">
      <Line data={chartData} options={options} />
    </div>
  );
};