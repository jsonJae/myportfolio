// The splash screen lives in index.html so it paints before the bundle lands.
// It exposes a small hand-off API on window.__splash:
//   ready      Promise, resolves once the page's assets are in and the name is full
//   appReady() tell it the app has mounted
//   claim()    take over its elements for the flight; null if it already left
//   finish()   remove it and release the page
//   fade()     dismiss it with a plain cross-fade

export function getSplash() {
    if (typeof window === 'undefined') return null;
    const splash = window.__splash;
    return splash && splash.active ? splash : null;
}
