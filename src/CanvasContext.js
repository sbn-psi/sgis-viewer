import React, { createContext, useContext, useState } from 'react';

export const CanvasContext = createContext()
export const useAppCanvas = () => useContext(CanvasContext)

export const CanvasDispatchContext = createContext()
export const useAppCanvasDispatch = () => useContext(CanvasDispatchContext);

export const AppCanvasProvider = ({ children }) => {
  const [canvas, setCanvas] = useState(null);

  return (
    <CanvasContext.Provider value={canvas}>
      <CanvasDispatchContext.Provider value={setCanvas}>
        {children}
      </CanvasDispatchContext.Provider>
    </CanvasContext.Provider>
  );
};
