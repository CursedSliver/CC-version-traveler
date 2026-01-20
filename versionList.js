const ALL_VERSIONS = [
    2.058,
    2.056,
    2.053,
    2.052,
    2.048,
    2.043,
    2.042,
    2.04,
    2.031,
    2.029,
    2.028,
    2.022,
    2.021,
    2.019,
    2.018,
    2.016,
    2.012,
    2.01
];

const PLATFORMS_VERSION_LIST = {
    'WEB': 2.058,
    'BETA': 2.058,
    'STEAM': 2.053,
    'CMG': 2.056
};
const PLATFORMS_VERSION_LIST_REVERSE_MAP = Object.entries(PLATFORMS_VERSION_LIST).reduce((acc, [platform, version]) => {
    const key = String(version.toFixed(3));
    (acc[key] ||= []).push(platform);
    return acc;
}, {});
const PLATFORMS_VERSION_NAMES = {
    'STEAM': 'Steam',
    'WEB': 'Web',
    'CMG': 'Coolmathgames',
    'BETA': 'Web Beta'
}