const debounce = (func, delay = 300) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout( () => {
            func(...args);
        }, delay);
    };
};