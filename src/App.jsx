import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import CameraFeed from './components/CameraFeed';
import EmotionChart from './components/EmotionChart';
import { getDominantEmotion } from './utils/emotionMapping';
import classNames from 'classnames';
import { ScanFace, Activity, Heart, Info, Quote } from 'lucide-react';

const MOOD_SUPPORT = {
  Sad: [
    "It's okay to feel this way. Tomorrow is a fresh start.",
    "Breathe. This moment is temporary, but your strength is permanent.",
    "Be kind to yourself today. You are doing enough.",
    "Every cloud has a silver lining. Hold on to hope."
  ],
  Angry: [
    "Take a deep breath. Peace starts from within.",
    "Release the tension. You are in control of your calm.",
    "Don't let a moment steal your peace. Let it go.",
    "Cool heads and kind hearts win the day."
  ]
};

const App = () => {
  const [emotions, setEmotions] = useState([]);
  const [activeQuote, setActiveQuote] = useState(null);
  const [lastDominant, setLastDominant] = useState(null);

  const dominant = getDominantEmotion(emotions);
  const isFaceVisible = emotions.length > 0;

  useEffect(() => {
    if (isFaceVisible && (dominant.label === 'Sad' || dominant.label === 'Angry')) {
      if (dominant.label !== lastDominant) {
        const quotes = MOOD_SUPPORT[dominant.label];
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setActiveQuote(randomQuote);
        setLastDominant(dominant.label);
      }
    } else {
      setActiveQuote(null);
      setLastDominant(dominant.label);
    }
  }, [dominant.label, isFaceVisible]);

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
        {/* Main Camera Feed Region */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {activeQuote && (
            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 p-6 rounded-3xl animate-in fade-in slide-in-from-top-4 duration-500 flex items-start gap-4 shadow-sm">
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                <Heart className="text-emerald-500 w-5 h-5 fill-emerald-500/20" />
              </div>
              <p className="text-emerald-800 dark:text-emerald-200 text-sm font-medium italic leading-relaxed">
                "{activeQuote}"
              </p>
            </div>
          )}

          <CameraFeed onEmotionUpdate={setEmotions} />

          <div className="bg-surface p-8 rounded-3xl border border-border-subtle shadow-sm transition-all duration-500">
            <h2 className="text-text-muted text-xs font-semibold tracking-wide uppercase mb-3 transition-colors duration-500">Current Mood</h2>
            <div className="flex items-baseline gap-4">
              <div
                className={classNames(
                  "text-6xl font-extrabold transition-all duration-500",
                  { "text-text-main": isFaceVisible, "text-text-muted/20 animate-pulse": !isFaceVisible }
                )}
              >
                {isFaceVisible ? dominant.label : 'Searching...'}
              </div>
              {isFaceVisible && (
                <div className="text-xl font-medium text-text-muted transition-colors duration-500">
                  {Math.round(dominant.score * 100)}%
                </div>
              )}
            </div>

            {/* Progress bar for dominant emotion */}
            <div className="w-full h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full mt-6 overflow-hidden transition-colors duration-500">
              <div
                className="h-full transition-all duration-500 ease-out"
                style={{
                  width: isFaceVisible ? `${dominant.score * 100}%` : '0%',
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
            <div className="flex-grow flex items-center justify-center opacity-100 transition-opacity duration-500" style={{ opacity: isFaceVisible ? 1 : 0.3 }}>
              <EmotionChart emotions={emotions} />
            </div>
          </div>

          {/* Additional Info Box */}
          <div className="bg-surface p-6 rounded-3xl border border-border-subtle shadow-sm transition-all duration-500">
            <div className="flex gap-4 items-center">
              <div className={classNames(
                "w-2.5 h-2.5 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.4)] transition-all duration-500",
                isFaceVisible ? "bg-emerald-500" : "bg-stone-300 dark:bg-stone-700 shadow-none"
              )} />
              <div>
                <h4 className="text-text-main font-bold text-sm transition-colors duration-500">
                  {isFaceVisible ? 'Analysis Active' : 'Calibrating'}
                </h4>
                <p className="text-text-muted text-xs mt-0.5 font-medium transition-colors duration-500">
                  {isFaceVisible ? 'Optimized for natural detection' : 'Waiting for visual contact'}
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
