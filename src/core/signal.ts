type SignalUnsubscriber = () => void;
export type SignalMany<EventMap extends Record<string, any> = any> = {
  on: (event: keyof EventMap, callback: CallableFunction) => SignalUnsubscriber;
  once: (
    event: keyof EventMap,
    callback: CallableFunction,
  ) => SignalUnsubscriber;
  off: (event: keyof EventMap, callback?: CallableFunction) => void;
  clear: () => void;
  emit: (event: keyof EventMap, ...extra_options: any[]) => void;
};

export type Signal<EventName extends string> = {
  on: (event: EventName, callback: CallableFunction) => SignalUnsubscriber;
  once: (event: EventName, callback: CallableFunction) => SignalUnsubscriber;
  off: (event: EventName, callback?: CallableFunction) => void;
  clear: () => void;
  emit: (event: EventName, ...extra_options: any[]) => void;
};

export const createSignal = <EventName extends string>(
  eventname: EventName,
): Signal<EventName> => {
  let listeners: CallableFunction[] = [];
  const signal: Signal<EventName> = {
    on: (event, callback) => {
      listeners.push(callback);

      return () => signal.off(event, callback);
    },

    once: (event, callback) => {
      const unsub = signal.on(event, () => {
        callback();
        unsub();
      });

      return unsub;
    },

    emit: (event, ...extra_options: any[]) => {
      listeners.forEach((cb) => {
        cb(...extra_options);
      });
    },

    off: (event, callback = undefined) => {
      if (callback === undefined) {
        listeners = [];
      } else {
        listeners = listeners.filter((cb) => cb !== callback);
      }
    },
    clear: () => {
      listeners = [];
    },
  };

  return signal;
};

export const createSignalMap = <
  EventMap extends Record<string, any>,
>(): SignalMany<EventMap> => {
  const events = new Map<keyof EventMap, CallableFunction[]>();
  const signal: SignalMany<EventMap> = {
    on: (event, callback) => {
      const list = events.get(event) ?? [];
      list.push(callback);
      events.set(event, list);

      return () => signal.off(event, callback);
    },

    once: (event, callback) => {
      const unsub = signal.on(event, () => {
        callback();
        unsub();
      });

      return unsub;
    },

    emit: (event, ...extra_options: any[]) => {
      const callbacks = events.get(event) ?? [];
      callbacks.forEach((cb) => {
        cb(...extra_options);
      });
    },

    off: (event, callback = undefined) => {
      if (callback === undefined) {
        events.set(event, []);
      } else {
        const list = events.get(event) ?? [];
        events.set(
          event,
          list.filter((cb) => cb !== callback),
        );
      }
    },
    clear: () => {
      events.clear();
    },
  };

  return signal;
};
