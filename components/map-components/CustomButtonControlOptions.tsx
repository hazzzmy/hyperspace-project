import { Radius } from 'lucide-react';
import { IControl, Map } from 'maplibre-gl';
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

interface CustomButtonControlOptions {
  onClick?: () => void;
  initialActive?: boolean;
  icon: React.ReactNode; // Add icon to options
}

const CustomButton: React.FC<{ onClick: () => void; isActive: boolean; icon: React.ReactNode }> = ({ onClick, isActive, icon }) => {
  return (
    <div
      onClick={onClick}
      title='Measure'
      className={`maplibregl-ctrl flex bg-white rounded shadow-lg cursor-pointer w-7 h-7 items-center justify-center`}
    >
      {React.cloneElement(icon as React.ReactElement<any>, {
        className: `h-5 w-5 items-center rounded-lg ${isActive ? 'text-sky-500' : 'text-gray-600'}`
      })}
    </div>
  );
};

const CustomButtonWithState: React.FC<{ onClick?: () => void; initialActive?: boolean; icon: React.ReactNode }> = ({
  onClick = () => alert('Button clicked!'),
  initialActive = false,
  icon,
}) => {
  const [isActive, setIsActive] = useState(initialActive);

  const handleClick = () => {
    setIsActive(!isActive);
    onClick();
  };

  return <CustomButton onClick={handleClick} isActive={isActive} icon={icon} />;
};

class CustomButtonControl implements IControl {
  private container: HTMLElement;
  private map?: Map;
  private root: ReactDOM.Root;

  constructor(private options: CustomButtonControlOptions) {
    this.container = document.createElement('div');
    this.root = ReactDOM.createRoot(this.container);
    this.root.render(
      <CustomButtonWithState onClick={options.onClick} initialActive={options.initialActive} icon={options.icon} />
    );
  }

  onAdd(map: Map): HTMLElement {
    this.map = map;
    return this.container;
  }

  onRemove(): void {
    if (this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.map = undefined;
    // Delay the unmount to ensure it doesn't conflict with ongoing renders
    setTimeout(() => {
      this.root.unmount();
    }, 0);
  }
}

export default CustomButtonControl;
