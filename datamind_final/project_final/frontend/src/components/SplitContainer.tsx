import React, { useRef, useState } from 'react';

interface SplitContainerProps {
  direction?: 'vertical' | 'horizontal';
  minSizes?: [number, number];
  initialSizes?: [number, number];
  children: [React.ReactNode, React.ReactNode];
}

const SplitContainer: React.FC<SplitContainerProps> = ({
  direction = 'vertical',
  minSizes = [100, 100],
  initialSizes = [300, 300],
  children,
}) => {
  const isVertical = direction === 'vertical';
  const containerRef = useRef<HTMLDivElement>(null);
  const [sizes, setSizes] = useState<[number, number]>(initialSizes);
  const dragging = useRef(false);

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    document.body.style.userSelect = 'none';
    const start = isVertical ? e.clientY : e.clientX;
    const [startSizeA, startSizeB] = sizes;
    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!dragging.current) return;
      const delta = (isVertical ? moveEvent.clientY : moveEvent.clientX) - start;
      let newA = startSizeA + delta;
      let newB = startSizeB - delta;
      if (newA < minSizes[0]) {
        newB -= (minSizes[0] - newA);
        newA = minSizes[0];
      }
      if (newB < minSizes[1]) {
        newA -= (minSizes[1] - newB);
        newB = minSizes[1];
      }
      setSizes([newA, newB]);
    };
    const onMouseUp = () => {
      dragging.current = false;
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div
      ref={containerRef}
      className={`flex ${isVertical ? 'flex-col h-full w-full' : 'flex-row w-full h-full'}`}
      style={{ height: '100%', width: '100%' }}
    >
      <div style={{ flexBasis: sizes[0], flexGrow: 0, flexShrink: 0, minHeight: minSizes[0], minWidth: minSizes[0], overflow: 'auto' }}>
        {children[0]}
      </div>
      <div
        className={isVertical ? 'cursor-row-resize w-full' : 'cursor-col-resize h-full'}
        style={{
          background: 'rgba(120,120,120,0.2)',
          [isVertical ? 'height' : 'width']: 8,
          [isVertical ? 'width' : 'height']: '100%',
          zIndex: 10,
          userSelect: 'none',
        } as React.CSSProperties}
        onMouseDown={onMouseDown}
      />
      <div style={{ flexBasis: sizes[1], flexGrow: 1, flexShrink: 0, minHeight: minSizes[1], minWidth: minSizes[1], overflow: 'auto' }}>
        {children[1]}
      </div>
    </div>
  );
};

export default SplitContainer;
