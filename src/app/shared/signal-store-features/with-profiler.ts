import {
  EmptyFeatureResult,
  SignalStoreFeature,
  SignalStoreFeatureResult,
} from '@ngrx/signals';
import { addProfilerProxy } from '../util/add-profiler-proxy';

export function withProfiler<
  Input extends SignalStoreFeatureResult,
>(): SignalStoreFeature<Input, EmptyFeatureResult> {
  return (store) => {
    const methods = store.methods;
    const proxiedMethods = {} as typeof methods;

    for (const methodName of Reflect.ownKeys(methods)) {
      const name = methodName as keyof typeof methods;

      proxiedMethods[name] = addProfilerProxy(methods[name], String(name));
    }

    return { ...store, methods: proxiedMethods };
  };
}
