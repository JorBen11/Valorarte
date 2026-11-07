import { singleFlight } from './single-flight';

const deferred = () => {
  let resolve!: () => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

describe('singleFlight', () => {
  it('dos pulsaciones rápidas ejecutan la tarea una sola vez', async () => {
    const lock = { current: false };
    const pending = deferred();
    const task = jest.fn(() => pending.promise);

    const first = singleFlight(lock, task);
    const second = singleFlight(lock, task);
    pending.resolve();
    await Promise.all([first, second]);

    expect(task).toHaveBeenCalledTimes(1);
  });

  it('libera el cerrojo al terminar con éxito', async () => {
    const lock = { current: false };
    await singleFlight(lock, async () => {});
    expect(lock.current).toBe(false);
  });

  it('libera el cerrojo y propaga el error si la tarea falla', async () => {
    const lock = { current: false };
    const pending = deferred();
    const run = singleFlight(lock, () => pending.promise);
    expect(lock.current).toBe(true);
    pending.reject(new Error('fallo'));

    await expect(run).rejects.toThrow('fallo');
    expect(lock.current).toBe(false);
    const task = jest.fn(async () => {});
    await singleFlight(lock, task);
    expect(task).toHaveBeenCalledTimes(1);
  });
});
