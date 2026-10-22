/** sessionStorage key recording that the preloader already played this session. */
export const PRELOADER_SEEN_KEY = "aurelia:preloader-seen";
export const SKIP_PRELOADER_CLASS = "skip-preloader";

/**
 * Inlined in <head>: tags returning visits before first paint so the
 * preloader never flashes on later full-page loads in the same session.
 */
export const skipPreloaderScript = `try{if(sessionStorage.getItem(${JSON.stringify(PRELOADER_SEEN_KEY)}))document.documentElement.classList.add(${JSON.stringify(SKIP_PRELOADER_CLASS)})}catch(e){}`;
