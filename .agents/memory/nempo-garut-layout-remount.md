---
name: Nempo Garut per-page Layout remounts
description: Why component-local state in layout.tsx doesn't survive navigation, and the fix pattern used for persistent playback/UI state.
---

In the `nempo-garut` artifact, `src/components/layout.tsx` (the "Nempo Buddy" widget shell) is rendered individually inside each page component rather than once at the top of the router tree in `App.tsx`. This means any `useState`/`useRef` declared inside `Layout` is torn down and reinitialized every time the user navigates to a different page.

**Why:** This caused the Jingle Nempo audio player to pause/reset whenever the chat widget closed or the user changed pages, because the `<audio>` element and its playing state lived inside `Layout`.

**How to apply:** For any state that must persist across navigation or widget open/close (e.g. audio/video playback, long-running timers, global UI toggles), do NOT store it locally inside `Layout` or other per-page-mounted components. Instead:
1. Create a context provider (e.g. `src/contexts/jingle-context.tsx`) that owns the persistent resource using a module-level or ref-held object (e.g. `new Audio()` created outside React's render cycle) so it isn't recreated on remount.
2. Mount the provider once, high up in `App.tsx` (outside the router/page tree), so it never unmounts on navigation.
3. Have `Layout` and any other consumers call a `useX()` hook to read/drive the shared state, instead of holding their own local copies.
4. A companion "mini player"/global indicator component (rendered once in `App.tsx`, sibling to the router) can reflect state (e.g. play/pause, progress) even when the widget itself is closed.

Internal links can also drop the `app=1` query parameter when navigating. Treat app-frame mode as session state, not only as the current URL query, or the remounted layout will fall back to the full website chrome.
