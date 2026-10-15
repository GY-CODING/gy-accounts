'use client';

import { useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Navegadores Chromium exponen deviceMemory y connection; Safari/Firefox no.
type NavigatorHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

// ¿Conviene desactivar la decoración continua (aurora animada, spotlight, blur de cristal)?
// - El usuario pidió menos movimiento (prefers-reduced-motion).
// - Dispositivo táctil (móvil/tablet): ahí el blur + backdrop-filter es lo que provoca tirones al hacer scroll.
// - Equipo modesto: ≤4 núcleos, ≤4 GB de RAM o modo de ahorro de datos.
// Mismo nombre y API que el hook de gy-web, para que la suite se comporte igual.
export function detectLiteMotion(): boolean {
  if (typeof window === 'undefined') return false;
  const nav = navigator as NavigatorHints;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const lowCpu = (nav.hardwareConcurrency ?? 8) <= 4;
  const lowMemory = (nav.deviceMemory ?? 8) <= 4;
  const saveData = !!nav.connection?.saveData;
  return coarse || lowCpu || lowMemory || saveData;
}

export function useLiteMotion(): boolean {
  const reduceMotion = useReducedMotion();
  const [lite, setLite] = useState(false);

  useEffect(() => {
    // Se recalcula si cambia el tipo de puntero (p. ej. al conectar un ratón a una tablet)
    const mq = window.matchMedia('(pointer: coarse)');
    const update = () => setLite(detectLiteMotion());
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return !!reduceMotion || lite;
}
