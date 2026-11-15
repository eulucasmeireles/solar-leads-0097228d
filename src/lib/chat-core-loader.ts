/* eslint-disable @typescript-eslint/no-explicit-any */
// Core loader — cached ES module import (runtime, not an npm dep).
let corePromise: Promise<any> | null = null;
export const loadChatCore = (url: string) => (corePromise ??= import(/* @vite-ignore */ url));
