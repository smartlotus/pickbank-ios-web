import React, { useEffect, useRef } from 'react';

export interface FocusTabItem {
  id: string;
  label: string;
  badge?: string;
  icon?: React.ReactNode;
}

interface FocusTabListProps {
  ariaLabel: string;
  tabs: FocusTabItem[];
  activeId: string;
  onSelect: (id: string) => void;
  idPrefix: string;
  variant?: 'underline' | 'pill-glass';
  className?: string;
}

export const FocusTabList: React.FC<FocusTabListProps> = ({
  ariaLabel,
  tabs,
  activeId,
  onSelect,
  idPrefix,
  variant = 'underline',
  className = '',
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  useEffect(() => {
    const activeBtn = buttonRefs.current.get(activeId);
    if (activeBtn) {
      activeBtn.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
        container: 'nearest',
      } as ScrollIntoViewOptions);
    }
  }, [activeId]);

  const handleKeyFallback = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Only act if native focusgroup & polyfill didn't already move focus
    if (Object.hasOwn(HTMLElement.prototype, 'focusGroup')) return;
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    const currentIndex = tabs.findIndex((t) => t.id === activeId);
    if (currentIndex < 0) return;

    let nextIndex = currentIndex;
    if (e.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') nextIndex = 0;
    else if (e.key === 'End') nextIndex = tabs.length - 1;

    const targetTab = tabs[nextIndex];
    if (targetTab) {
      e.preventDefault();
      onSelect(targetTab.id);
      buttonRefs.current.get(targetTab.id)?.focus();
    }
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={ariaLabel}
      className={`fg-tablist fg-tablist--${variant} ${className}`.trim()}
      onKeyDown={handleKeyFallback}
      {...({ focusgroup: 'tablist nomemory' } as Record<string, string>)}
    >
      {tabs.map((tab) => {
        const selected = tab.id === activeId;
        const domId = `${idPrefix}-tab-${tab.id}`;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              if (el) buttonRefs.current.set(tab.id, el);
              else buttonRefs.current.delete(tab.id);
            }}
            type="button"
            role="tab"
            id={domId}
            aria-selected={selected}
            className="fg-tab"
            onClick={() => onSelect(tab.id)}
            onFocus={() => {
              if (!selected) onSelect(tab.id);
            }}
            {...(selected ? ({ focusgroupstart: '' } as Record<string, string>) : {})}
          >
            {tab.icon ? (
              <span className="fg-tab-icon" aria-hidden="true">
                {tab.icon}
              </span>
            ) : null}
            <span className="fg-tab-label">{tab.label}</span>
            {tab.badge ? <span className="fg-tab-badge">{tab.badge}</span> : null}
          </button>
        );
      })}
    </div>
  );
};

interface FocusTabPanelProps {
  tabId: string;
  idPrefix: string;
  isActive: boolean;
  onBeforeMatch: () => void;
  hasFocusableContent?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const FocusTabPanel: React.FC<FocusTabPanelProps> = ({
  tabId,
  idPrefix,
  isActive,
  onBeforeMatch,
  hasFocusableContent = true,
  className = '',
  children,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    if (isActive) {
      el.removeAttribute('hidden');
    } else {
      el.setAttribute('hidden', 'until-found');
    }
  }, [isActive]);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const handler = () => {
      onBeforeMatch();
    };
    el.addEventListener('beforematch', handler);
    return () => el.removeEventListener('beforematch', handler);
  }, [onBeforeMatch]);

  return (
    <div
      ref={panelRef}
      role="tabpanel"
      id={`${idPrefix}-panel-${tabId}`}
      aria-labelledby={`${idPrefix}-tab-${tabId}`}
      tabIndex={isActive && !hasFocusableContent ? 0 : undefined}
      hidden={isActive ? undefined : ('until-found' as unknown as boolean)}
      className="fg-tabpanel"
    >
      <div className={`tab-panel-body ${className}`.trim()}>{children}</div>
    </div>
  );
};
