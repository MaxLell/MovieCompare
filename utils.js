/**
 * This function is used to debounce the inputCallback function. It shall make
 * sure that the API is not called on every single key stroke, but rather then
 * that it is only called, when the user has stopped typing for a certain delay
 * (requestDelay).
 */
const debounce = (callback, requestDelay) => {
    let timeoutId;
    return (...arguments) => {
        if (timeoutId !== undefined) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            callback.apply(null, arguments);
        }, requestDelay);
    }
}