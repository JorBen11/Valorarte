/**
 * Ejecuta `task` solo si no hay otra en curso con el mismo cerrojo. La marca es síncrona, a diferencia
 * del estado de React, así que una segunda pulsación en el mismo fotograma se descarta.
 */
export async function singleFlight(lock: { current: boolean }, task: () => Promise<void>): Promise<void> {
  if (lock.current) return;
  lock.current = true;
  try {
    await task();
  } finally {
    lock.current = false;
  }
}
