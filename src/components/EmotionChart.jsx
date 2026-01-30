import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const options = {
    indexAxis: 'y', // Horizontal bars
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
        title: {
            display: false,
        },
    },
    scales: {
        x: {
            min: 0,
            max: 1,
            grid: {
                color: 'rgba(120, 113, 108, 0.1)', // Stone-500 equivalent
            },
            ticks: {
                color: '#a8a29e', // Stone-400
            }
        },
        y: {
            grid: {
                display: false,
            },
            ticks: {
                color: '#57534e', // This will need to be dynamic or use a neutral mid-tone
                font: {
                    family: "'Inter', sans-serif",
                    weight: '600'
                }
            }
        },
    },
    animation: {
        duration: 300, // Smooth transition
    }
};

const EmotionChart = ({ emotions }) => {
    if (!emotions || emotions.length === 0) return null;

    const data = {
        labels: emotions.map(e => e.label),
        datasets: [
            {
                label: 'Confidence',
                data: emotions.map(e => e.score),
                backgroundColor: emotions.map(e => e.color),
                borderColor: emotions.map(e => e.color),
                borderWidth: 1,
                borderRadius: 4,
                barThickness: 20,
            },
        ],
    };

    return (
        <div className="w-full h-64">
            <Bar options={options} data={data} />
        </div>
    );
};

export default EmotionChart;
