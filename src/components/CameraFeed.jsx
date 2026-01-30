import React, { useEffect, useRef, useState } from 'react';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { calculateEmotions, getDominantEmotion } from '../utils/emotionMapping';
import classNames from 'classnames';
import { Camera, Loader2, RefreshCw, AlertCircle, ShieldAlert } from 'lucide-react';

const CameraFeed = ({ onEmotionUpdate }) => {
    const videoRef = useRef(null);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [webcamRunning, setWebcamRunning] = useState(false);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState("Initializing...");
    const faceLandmarkerRef = useRef(null);
    const requestRef = useRef(null);
    const lastVideoTimeRef = useRef(-1);

    // We should match the version in package.json if possible, or use @latest for WASM
    const VISION_VERSION = "0.10.20"; // Stable version

    useEffect(() => {
        let isMounted = true;

        const loadModel = async () => {
            try {
                setStatus("Connecting to AI Core...");
                const filesetResolver = await FilesetResolver.forVisionTasks(
                    `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${VISION_VERSION}/wasm`
                );

                setStatus("Downloading Face Neural Network...");
                const faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
                    baseOptions: {
                        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                        delegate: "GPU"
                    },
                    outputFaceBlendshapes: true,
                    runningMode: "VIDEO",
                    numFaces: 1
                });

                if (isMounted) {
                    faceLandmarkerRef.current = faceLandmarker;
                    setIsModelLoaded(true);
                    setStatus("System Ready");
                    console.log("MediaPipe initialized.");
                }
            } catch (err) {
                console.error("AI Init Error:", err);
                if (isMounted) {
                    setError(`Matrix Load Failed: ${err.message}`);
                    setStatus("Init Error");
                }
            }
        };

        loadModel();

        return () => {
            isMounted = false;
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            if (faceLandmarkerRef.current) faceLandmarkerRef.current.close();
        };
    }, []);

    const enableCam = async () => {
        if (!faceLandmarkerRef.current) return;

        if (webcamRunning) {
            setWebcamRunning(false);
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject;
                stream.getTracks().forEach(track => track.stop());
                videoRef.current.srcObject = null;
            }
            return;
        }

        try {
            setStatus("Authenticating Vision Stream...");
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 1280 }, height: { ideal: 720 } }
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    setWebcamRunning(true);
                    setError(null);
                    setStatus("Vision Active");
                };
            }
        } catch (err) {
            console.error("Camera Error:", err);
            setError(`Stream Denied: ${err.name === 'NotAllowedError' ? 'Permission Denied' : err.message}`);
            setStatus("Stream Error");
        }
    };

    const predictWebcam = async () => {
        if (!videoRef.current || !faceLandmarkerRef.current || !webcamRunning) return;

        const startTimeMs = performance.now();

        if (videoRef.current.readyState >= 2 && lastVideoTimeRef.current !== videoRef.current.currentTime) {
            lastVideoTimeRef.current = videoRef.current.currentTime;
            try {
                const results = faceLandmarkerRef.current.detectForVideo(videoRef.current, startTimeMs);

                if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {
                    const blendshapes = results.faceBlendshapes[0].categories;
                    const emotionData = calculateEmotions(blendshapes);
                    onEmotionUpdate(emotionData);
                }
            } catch (e) {
                // Suppress mid-loop noise
            }
        }

        if (webcamRunning) {
            requestRef.current = requestAnimationFrame(predictWebcam);
        }
    };

    useEffect(() => {
        if (webcamRunning) {
            requestRef.current = requestAnimationFrame(predictWebcam);
        }
        return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
    }, [webcamRunning]);

    return (
        <div className="relative w-full max-w-2xl mx-auto aspect-video bg-stone-950 rounded-3xl overflow-hidden shadow-2xl border border-border-subtle transition-colors duration-500">
            {/* Video Element */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={classNames(
                    "w-full h-full object-cover transform scale-x-[-1] transition-opacity duration-700",
                    { "opacity-100": webcamRunning, "opacity-20": !webcamRunning }
                )}
            />

            {/* Overlay UI */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6 text-center">
                {!isModelLoaded && !error && (
                    <div className="flex flex-col items-center gap-4 text-stone-400">
                        <Loader2 size={32} className="animate-spin opacity-50" />
                        <p className="text-sm font-medium tracking-wide">Preparing...</p>
                    </div>
                )}

                {isModelLoaded && !webcamRunning && !error && (
                    <div className="flex flex-col items-center gap-6">
                        <button
                            onClick={enableCam}
                            className="pointer-events-auto flex items-center gap-3 px-10 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-sm tracking-tight"
                        >
                            Launch Camera
                        </button>
                        <p className="text-stone-500 text-xs font-medium tracking-wide">Ready when you are</p>
                    </div>
                )}

                {error && (
                    <div className="flex flex-col items-center gap-4 text-stone-600 bg-white p-8 rounded-3xl border border-stone-200 shadow-xl max-w-sm pointer-events-auto">
                        <AlertCircle size={40} className="text-stone-400 mb-2" />
                        <div className="space-y-1">
                            <p className="font-bold text-stone-800 tracking-tight">Something went wrong</p>
                            <p className="text-xs text-stone-500 leading-relaxed">{error}</p>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 flex items-center gap-2 px-8 py-2.5 bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold rounded-xl transition-all"
                        >
                            <RefreshCw size={14} /> Refresh
                        </button>
                    </div>
                )}
            </div>

            {webcamRunning && (
                <div className="absolute top-6 right-6 px-3 py-1 bg-cyan-500/10 border border-cyan-500/50 rounded-full flex items-center gap-2 pointer-events-none">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-[10px] font-bold text-cyan-400 font-mono uppercase tracking-widest">Live Link</span>
                </div>
            )}
        </div>
    );
};

export default CameraFeed;
