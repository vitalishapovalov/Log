export const isNode = (): boolean => (
    typeof process !== "undefined" && process.versions != null && process.versions.node != null
);

export const isBrowser = (): boolean => (
    typeof window !== "undefined" && typeof window.document !== "undefined"
);

export const isFirefox = (): boolean => (
    isBrowser() && typeof InstallTrigger === "object"
);

export const isSafari = (): boolean => (
    isBrowser() && /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
);
