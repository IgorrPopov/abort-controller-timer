export class TimerAbortController {
    static async resolveInTime<T>(
        promise: Promise<T>,
        timeLimit = 10_000,
    ): Promise<T> {
        const controller: AbortController = new AbortController();
        const { signal }: AbortController = controller;

        const timeout: NodeJS.Timeout = setTimeout(
            () => controller.abort(),
            timeLimit,
        );

        return TimerAbortController.resolve<T>(promise, signal, timeout);
    }

    private static async resolve<T>(
        promise: Promise<T>,
        signal: AbortSignal,
        timeout: NodeJS.Timeout,
    ): Promise<T> {
        const abortError: Error = new Error(
            `Async operation was aborted due to expired time that was given`,
        );

        const callback: (
            resolve: (value: T | PromiseLike<T>) => void,
            reject: (reason?: any) => void,
        ) => Promise<void> = async (
            resolve: (value: T | PromiseLike<T>) => void,
            reject: (reason?: any) => void,
        ): Promise<void> => {
            signal.addEventListener('abort', () => {
                reject(abortError);
            });

            try {
                resolve(await promise);
            } catch (error) {
                reject(error);
            } finally {
                signal.removeEventListener('abort', () =>
                    clearTimeout(timeout),
                );
            }
        };

        return new Promise(callback);
    }
}
