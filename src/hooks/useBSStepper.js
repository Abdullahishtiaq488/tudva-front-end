// src/hooks/useBSStepper.js (Callback Ref)
'use client';
import { useEffect, useCallback, useState } from 'react'; // Use useState, not useRef
import Stepper from 'bs-stepper';
import 'bs-stepper/dist/css/bs-stepper.min.css';

const useBSStepper = ( options = {}) => { // No element ref as argument
  const [stepper, setStepper] = useState(null); // Use state

  const stepperRef = useCallback(node => {
    if (node !== null) {
      const stepperInstance = new Stepper(node, options);
      setStepper(stepperInstance);
    }
  }, [options]); // Dependencies for the callback

  useEffect(() => {
    return () => {
      if (stepper) {
        stepper.destroy();
      }
    };
  }, [stepper]); // Dependency for cleanup

  return { stepper, stepperRef }; // Return both the instance and the ref
};

export default useBSStepper;