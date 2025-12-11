import { useContext } from 'react';
import { TonesFlexContext } from './TonesFlexContext';

export const useTonesFlex = () => {
  const context = useContext(TonesFlexContext);
  if (!context) {
    throw new Error('useTonesFlex must be used within TonesFlexProvider');
  }
  return context;
};