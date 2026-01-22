export const withCurrentValueOption = (
    options: Array<{ label: string; value: string }>,
    currentValue?: string
) => {
    if (!currentValue) return options;

    const values = Array.isArray(currentValue) ? currentValue : [currentValue];

    const existingValues = new Set(options.map(opt => opt.value));

    const newOptions = values
        .filter(val => !existingValues.has(val))
        .map(val => ({ label: val, value: val }));

    return [...options, ...newOptions];
};
