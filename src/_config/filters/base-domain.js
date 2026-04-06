export const getBaseDomain = url => {
    const domain = new URL(url);
    return `${domain.protocol}//${domain.hostname}`
}