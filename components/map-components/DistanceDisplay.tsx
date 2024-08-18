import React from 'react';

interface DistanceDisplayProps {
  distance: string;
}

const DistanceDisplay: React.FC<DistanceDisplayProps> = ({ distance }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 10,
        left: 10,
        margin: 'auto',
        width: 'max-content',
        background: 'rgba(0, 0, 0, 0.5)',
        color: 'white',
        padding: '0.5rem 1rem',
        zIndex: 10,
        borderRadius: '0.5rem',
      }}
    >
      {distance}
    </div>
  );
};

export default DistanceDisplay;
