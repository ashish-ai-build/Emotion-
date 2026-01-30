import React, { useState } from 'react';
import Layout from './components/Layout';
import CameraFeed from './components/CameraFeed';
import EmotionChart from './components/EmotionChart';
import { getDominantEmotion } from './utils/emotionMapping';
import classNames from 'classnames';

function App() {
  const [emotions, setEmotions] = useState([]);
  const dominant = getDominantEmotion(emotions);

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full h-full">
        {/* Main Camera Feed Region */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <CameraFeed onEmotionUpdate={setEmotions} />

          <div className="bg-surface p-8 rounded-3xl border border-border-subtle shadow-sm transition-all duration-500">
            <h2 className="text-text-muted text-xs font-semibold tracking-wide uppercase mb-3 transition-colors duration-500">Current Mood</h2>
            <div className="flex items-baseline gap-4">
              <div
                className="text-6xl font-extrabold text-text-main transition-all duration-500"
              >
                {dominant.label}
              </div>
              <div className="text-xl font-medium text-text-muted transition-colors duration-500">
                {Math.round(dominant.score * 100)}%
              </div>
            </div>

            {/* Progress bar for dominant emotion */}
            <div className="w-full h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full mt-6 overflow-hidden transition-colors duration-500">
              <div
                className="h-full transition-all duration-500 ease-out"
                style={{
                  width: `${dominant.score * 100}%`,
                  backgroundColor: dominant.color || '#d1d5db'
                }}
              />
            </div>
          </div>
        </div>

        {/* Sidebar / Metrics */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-surface p-8 rounded-3xl border border-border-subtle shadow-sm flex-grow flex flex-col transition-all duration-500">
            <h3 className="text-text-muted font-semibold text-xs uppercase tracking-wide mb-8 border-b border-border-subtle pb-4 transition-colors duration-500">
              Mood Spectrum
            </h3>
            <div className="flex-grow flex items-center justify-center">
              <EmotionChart emotions={emotions} />
            </div>
          </div>

          {/* Additional Info Box */}
          <div className="bg-surface p-6 rounded-3xl border border-border-subtle shadow-sm transition-all duration-500">
            <div className="flex gap-4 items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
              <div>
                <h4 className="text-text-main font-bold text-sm transition-colors duration-500">Active</h4>
                <p className="text-text-muted text-xs mt-0.5 font-medium transition-colors duration-500">
                  Optimized for natural detection
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;
