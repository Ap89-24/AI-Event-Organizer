export function createLocationSlug(city, state) {
    if(!city || !state) return "";

    citySlug = city.toLowerCase().replace(/\s+/g, '-');
    stateSlug = state.toLowerCase().replace(/\s+/g, '-');

    return `${citySlug}-${stateSlug}`;
}