"use client"

import { PauseIcon, PlayIcon, TimerResetIcon } from 'lucide-react';
import React, { useState, useRef } from 'react';

type TimePlayerProps = {
    timestamps: string[];
    onPlayEvent: (timestamp: string) => void;
};

const TimePlayer: React.FC<TimePlayerProps> = ({ timestamps, onPlayEvent }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [activeTime, setActiveTime] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const playTimestamps = (index: number) => {
        if (index >= timestamps.length) {
            setIsPlaying(false);
            setIsPaused(false);
            return;
        }

        const timestamp = timestamps[index];
        setActiveTime(timestamp);
        onPlayEvent(timestamp);
        setCurrentIndex(index);

        timeoutRef.current = setTimeout(() => {
            playTimestamps(index + 1);
        }, 3000);
    };

    const handlePlay = () => {
        setIsPlaying(true);
        setIsPaused(false);
        playTimestamps(currentIndex);
    };

    const handlePause = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsPaused(true);
        setIsPlaying(false);
    };

    const handleStop = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsPaused(false);
        setIsPlaying(false);
        setActiveTime(null);
        setCurrentIndex(0);
        onPlayEvent("2024-08-17T00:00:00Z");
    };

    return (
        <div className="flex items-center space-x-2">
            <button
                onClick={isPlaying ? handlePause : handlePlay}
                className={`px-4 py-2 text-white bg-blue-500 rounded-md min-w-[120px] ${isPlaying ? 'bg-red-500' : ''}`}
            >
                {isPlaying ? <div className='flex items-center'>
                        <PauseIcon/> 
                        <p>Pause</p>
                    </div> 
                    : isPaused ? <div className='flex items-center'>
                                    <PlayIcon/> 
                                    <p>Resume</p>
                                </div> 
                    : <div className='flex items-center'>
                        <PlayIcon/> 
                        <p>Stream</p>
                    </div>
                }
            </button>
            <button
                onClick={handleStop}
                className="px-4 py-2 text-white bg-red-500 rounded-md"
            >
                <TimerResetIcon />
            </button>
            {activeTime && (
                <div className="text-lg font-semibold text-gray-400">
                    Time: {new Date(activeTime).toLocaleTimeString([], { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
            )}
        </div>
    );
};

export default TimePlayer;
