import { createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';

export function creator<T>(cb: () => Promise<T>): () => Promise<T> {
  let cache: T;
  return async () => {
    if (!cache) {
      cache = await cb();
    }
    return cache;
  };
}

// export function creator<T>(cb: () => Promise<T>): () => T | undefined {
//   let cache: Accessor<T | undefined>;

//   return () => {
//     if (!cache) {
//       cache = promiseToSignal(cb());
//     }

//     return cache();
//   };
// }

export function promiseToSignal<T>(promise: Promise<T>) {
  const [v, s] = createSignal<T | undefined>(undefined);

  promise.then((value) => s(() => value));

  return v();
}

export const s = promiseToSignal;

export function createSignalObject<T>(init: T) {
  const [value, set] = createSignal<T>(init);

  return {
    value,
    set,
  };
}

export function createStoreObject<T extends object>(init: T) {
  const [value, set] = createStore(init);

  return {
    value,
    set,
  };
}

export function escapeHtml(html: string) {
  var text = document.createTextNode(html);

  var p = document.createElement('p');
  p.appendChild(text);
  return p.innerHTML;
}

export async function sleep(ms: number) {
  const { promise, resolve } = Promise.withResolvers<void>();
  setTimeout(() => resolve(), ms);

  await promise;
}

export function promiseLock<T>(options?: {
  promiseInitializer?: (_: Promise<T>) => Promise<T>;
}) {
  const data: {
    isResolve: boolean;
    isResolveSuccess: boolean | undefined;
    resolve: (value: T | PromiseLike<T>) => void;
    promise: Promise<T>;
    refresh: () => void;
    refreshResolved: () => void;
  } = {} as any;

  data.refresh = () => {
    data.isResolve = false;
    data.isResolveSuccess = undefined;

    data.promise = new Promise<T>((_resolve) => {
      data.resolve = _resolve;
    }).then(
      (_value) => {
        data.isResolve = true;
        data.isResolveSuccess = true;

        return _value;
      },
      (_value) => {
        data.isResolve = true;
        data.isResolveSuccess = false;

        return _value;
      }
    );

    if (options?.promiseInitializer) {
      options.promiseInitializer(data.promise).then(data.resolve);
    }
  };

  data.refreshResolved = () => {
    if (data.isResolve) {
      data.refresh();
    }
  };

  data.refresh();

  return data;
}
