let cachedDisplayTransitionSupport: boolean | undefined;

export function canTransitionDisplay(): boolean {
  if (cachedDisplayTransitionSupport !== undefined) return cachedDisplayTransitionSupport;
  if (
    typeof window === 'undefined' ||
    !window.CSS?.supports?.('transition-behavior', 'allow-discrete') ||
    !document.body
  ) {
    return false;
  }
  const probe = document.createElement('div');
  probe.style.cssText = 'transition: display 1s allow-discrete !important; display: block;';
  document.body.appendChild(probe);
  getComputedStyle(probe).display;
  probe.style.display = 'none';
  cachedDisplayTransitionSupport = getComputedStyle(probe).display === 'block';
  probe.remove();
  return cachedDisplayTransitionSupport;
}

export function supportsTopLayerExit(): boolean {
  return Boolean(window.CSS?.supports?.('overlay', 'auto')) && canTransitionDisplay();
}

export async function closeTopLayer(element: HTMLDialogElement | null): Promise<void> {
  if (!element || !element.open) return;
  if (!supportsTopLayerExit()) {
    element.setAttribute('data-closing', '');
    const animations = element.getAnimations({ subtree: true });
    if (animations.length > 0) {
      await Promise.race([
        Promise.allSettled(animations.map((a) => a.finished)),
        new Promise<void>((resolve) => setTimeout(resolve, 1200)),
      ]);
    }
    if (!element.hasAttribute('data-closing')) return;
    element.removeAttribute('data-closing');
  }
  if (element.open) {
    element.close();
  }
}

export function installClosedByFallback(dialog: HTMLDialogElement): () => void {
  if ('closedBy' in HTMLDialogElement.prototype) {
    return () => {};
  }
  const outside = (e: PointerEvent) => {
    const r = dialog.getBoundingClientRect();
    return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
  };
  let pressedOutside = false;
  const onDown = (e: PointerEvent) => {
    pressedOutside = outside(e);
  };
  const onUp = (e: PointerEvent) => {
    if (pressedOutside && outside(e)) {
      void closeTopLayer(dialog);
    }
    pressedOutside = false;
  };
  dialog.addEventListener('pointerdown', onDown);
  dialog.addEventListener('pointerup', onUp);
  return () => {
    dialog.removeEventListener('pointerdown', onDown);
    dialog.removeEventListener('pointerup', onUp);
  };
}

let activeViewTransition: { skipTransition?: () => void } | null = null;

export function switchThemeWithCircularReveal<T extends string>(
  triggerEl: HTMLElement | null,
  nextTheme: T,
  applyTheme: (theme: T) => void
): void {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const docAny = document as Document & {
    startViewTransition?: (cb: () => void) => {
      ready: Promise<void>;
      finished: Promise<void>;
      skipTransition?: () => void;
    };
  };

  if (prefersReduced || typeof docAny.startViewTransition !== 'function') {
    applyTheme(nextTheme);
    return;
  }

  activeViewTransition?.skipTransition?.();

  let originX = window.innerWidth * 0.5;
  let originY = 48;
  if (triggerEl) {
    const rect = triggerEl.getBoundingClientRect();
    originX = rect.left + rect.width / 2;
    originY = rect.top + rect.height / 2;
  }

  const endRadius = Math.hypot(
    Math.max(originX, window.innerWidth - originX),
    Math.max(originY, window.innerHeight - originY)
  );

  document.documentElement.setAttribute('data-theme-vt', 'active');
  const transition = docAny.startViewTransition(() => {
    applyTheme(nextTheme);
  });
  activeViewTransition = transition;

  transition.ready
    .then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${originX}px ${originY}px)`,
            `circle(${endRadius}px at ${originX}px ${originY}px)`,
          ],
        },
        {
          duration: 640,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    })
    .catch(() => {
      // View transition skipped cleanly
    });

  transition.finished.finally(() => {
    document.documentElement.removeAttribute('data-theme-vt');
  });
}

export function initScrollRevealFallback(): () => void {
  if (
    typeof window === 'undefined' ||
    window.CSS?.supports?.('(animation-timeline: view()) and (animation-range: entry)') ||
    !window.matchMedia('(prefers-reduced-motion: no-preference)').matches
  ) {
    return () => {};
  }

  const nodes = Array.from(document.querySelectorAll<HTMLElement>('.scroll-reveal'));
  if (nodes.length === 0) return () => {};

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).dataset.revealed = 'true';
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  for (const el of nodes) {
    el.dataset.revealFallback = 'pending';
    observer.observe(el);
  }

  return () => observer.disconnect();
}

let focusgroupPolyfillStarted = false;

export function initFocusgroupPolyfill(): void {
  if (focusgroupPolyfillStarted) return;
  if (typeof HTMLElement === 'undefined') return;
  if (Object.hasOwn(HTMLElement.prototype, 'focusGroup')) return;

  focusgroupPolyfillStarted = true;
  import('@microsoft/focusgroup-polyfill')
    .then(({ polyfillBodyAndObserve }) => {
      polyfillBodyAndObserve();
    })
    .catch(() => {
      // Graceful fallback handled by standard click + arrow handlers if needed
    });
}
