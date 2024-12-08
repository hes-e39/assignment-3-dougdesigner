// Add helpers here. This is usually code that is just JS and not React code. Example: write a function that
// calculates number of minutes when passed in seconds. Things of this nature that you don't want to copy/paste
// everywhere.

export const getMinutes = (totalMilliseconds: number) => Math.floor(totalMilliseconds / 60000);

export const getSeconds = (totalMilliseconds: number) => Math.floor((totalMilliseconds % 60000) / 1000);

export const getHundredths = (totalMilliseconds: number) => Math.floor((totalMilliseconds % 1000) / 10);

export const getDisplayMinutes = (totalMilliseconds: number, isRunning: boolean, inputMinutes: number) => {
    if (totalMilliseconds === 0 && !isRunning) {
        return 0;
    }
    if (isRunning || totalMilliseconds > 0) {
        return getMinutes(totalMilliseconds);
    }
    return inputMinutes;
};

export const getDisplaySeconds = (totalMilliseconds: number, isRunning: boolean, inputSeconds: number) => {
    if (totalMilliseconds === 0 && !isRunning) {
        return 0;
    }
    if (isRunning || totalMilliseconds > 0) {
        return getSeconds(totalMilliseconds);
    }
    return inputSeconds;
};

export const getDisplayHundredths = (totalMilliseconds: number, isRunning: boolean) => {
    if (isRunning) {
        return getHundredths(totalMilliseconds);
    }
    return 0;
};
