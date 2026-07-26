/**
 * JourneyGraph.tsx
 *
 * Renders the two-line chart showing habit progress over 6 weeks.
 * Uses Chart.js via react-chartjs-2 wrapper.
 *
 * Props from App.tsx:
 * - weeks             → x-axis labels
 * - hoursLostData     → coral solid line going down
 * - hoursReclaimedData → green dashed line going up
 *
 * Key things I learned:
 * - Chart.js needs components registered before use
 *   ChartJS.register(...) at the top does this
 * - tension: 0.4 makes lines curved not jagged
 * - borderDash: [5,5] makes the green line dashed
 * - legend: false hides default legend — custom HTML legend used instead
 * - interaction mode 'index' shows both values on hover
 *
 * What I want to improve later:
 * - hoursLostData and hoursReclaimedData are currently
 *   built from fake weeklyData in seedData.ts
 * - When I add real daily logging, these arrays will
 *   be calculated from actual user check-ins
 */
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend as ChartLegend,
  ChartOptions,
  ChartData
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  ChartLegend
);


interface JourneyGraphProps {
  weeks: string[];
  hoursLostData: number[];
  hoursReclaimedData: number[];
}

export const JourneyGraph: React.FC<JourneyGraphProps> = ({
  weeks,
  hoursLostData,
  hoursReclaimedData
}) => {
  const data: ChartData<'line'> = {
    labels: weeks,
    datasets: [
      {
        label: 'Hours lost',
        data: hoursLostData,
        borderColor: '#e0845a', // Coral accent
        backgroundColor: '#e0845a',
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: '#0e1014',
        pointBorderColor: '#e0845a',
        pointBorderWidth: 2,
        tension: 0.4, // Smooth, cinematic curves
      },
      {
        label: 'Hours reclaimed',
        data: hoursReclaimedData,
        borderColor: '#88c9a8', // Green accent
        backgroundColor: '#88c9a8',
        borderWidth: 2,
        borderDash: [5, 5], // Dashed line
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: '#0e1014',
        pointBorderColor: '#88c9a8',
        pointBorderWidth: 2,
        tension: 0.4,
      }
    ]
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1600,
      easing: 'easeOutQuart'
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(221, 217, 210, 0.4)', // Muted text
          font: {
            family: 'Inter',
            size: 11
          }
        },
        border: {
          display: false
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.03)', // Extremely minimal
        },
        ticks: {
          color: 'rgba(221, 217, 210, 0.4)',
          font: {
            family: 'Inter',
            size: 11
          },
          stepSize: 5
        },
        border: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        display: false // No default legend
      },
      tooltip: {
        backgroundColor: '#0e1014',
        titleColor: '#ede9e2',
        bodyColor: 'rgba(221, 217, 210, 0.8)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            return ` ${context.dataset.label}: ${context.parsed.y} hrs`;
          }
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    }
  };

  return (
    <section className="py-8">
      
      {/* Section Header & Custom Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        
        <div>
          <h2 className="text-[11px] uppercase tracking-[0.08em] text-app-muted font-medium">
            Progress over time
          </h2>
          <p className="text-xs text-app-text mt-1 font-light">
            {hoursReclaimedData[hoursReclaimedData.length - 1] > 0
            ? 'You are slowly shifting your habits.'
            : 'Log your daily hours to see your real journey.'}
            </p>
        </div>

        {/* Custom Legend */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-0.5 bg-app-coral inline-block"></span>
            <span className="text-xs text-app-muted">Hours lost</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-0.5 border-t border-dashed border-app-green inline-block"></span>
            <span className="text-xs text-app-muted">Hours reclaimed</span>
          </div>
        </div>

      </div>

      {/* Chart Surface */}
      <div className="premium-card p-4 sm:p-6">
        <div className="h-64 sm:h-72 w-full">
          <Line data={data} options={options} />
        </div>
      </div>

    </section>
  );
};
