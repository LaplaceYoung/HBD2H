/**
 * Helper to get the correct asset URL considering the Vite base path.
 */
export const getAssetUrl = (path: string): string => {
    const base = import.meta.env.BASE_URL || '/';
    // Remove leading slash from path if it exists to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${base}${cleanPath}`;
};
