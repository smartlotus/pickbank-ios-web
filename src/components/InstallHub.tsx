import React, { useState } from 'react';
import { Check, CloudCog, Copy, ExternalLink, Laptop, ShieldCheck, Wifi, Wrench } from 'lucide-react';
import type { AppLang } from '../core/types';
import { COPY } from '../i18n/copy';
import { FocusTabList, FocusTabPanel } from './TabPrimitives';

interface InstallHubProps {
  lang: AppLang;
}

const SOURCE_URL = 'https://pickbank-ios.smartlotus1130.workers.dev/downloads/altstore-source.json';

export const InstallHub: React.FC<InstallHubProps> = ({ lang }) => {
  const t = COPY[lang];
  const [activeTab, setActiveTab] = useState<string>('sidestore');
  const [copiedSource, setCopiedSource] = useState(false);

  const handleCopySource = async () => {
    try {
      await navigator.clipboard.writeText(SOURCE_URL);
      setCopiedSource(true);
      setTimeout(() => setCopiedSource(false), 2000);
    } catch {
      // Clipboard blocked in restricted context
    }
  };

  return (
    <section id="install" className="swiss-section scroll-reveal">
      <div className="swiss-container">
        <div className="swiss-section-header">
          <div className="swiss-section-kicker-col">
            <p className="swiss-kicker">
              <ShieldCheck size={13} aria-hidden="true" />
              <span>{t.installIndex}</span>
            </p>
            <p className="mono-meta">ENTITLEMENTS: EMPTY [] · COST: $0</p>
          </div>
          <div className="swiss-section-title-col">
            <h2 className="swiss-section-title">{t.installHeading}</h2>
            <p className="swiss-section-desc">{t.installDesc}</p>
          </div>
        </div>

        <div className="install-swiss-grid">
          {/* Left 4-Col Native Repository & SideStore Source Sheet */}
          <div className="install-spec-sheet">
            <div className="install-sheet-top">
              <span className="install-version-chip">v2.0.0 · NATIVE IPA</span>
              <h3 className="install-sheet-title">{t.downloadCardTitle}</h3>
              <p className="install-sheet-sub">{t.downloadCardSub}</p>
            </div>

            <div className="install-sheet-actions">
              <a
                href="https://github.com/smartlotus/pickbank-ios"
                target="_blank"
                rel="noreferrer"
                className="swiss-btn swiss-btn--accent"
              >
                <ExternalLink size={15} aria-hidden="true" />
                <span>{t.downloadIpaBtn}</span>
              </a>
            </div>

            <div className="install-feed-box">
              <span className="mono-label">{t.sourceUrlLabel}</span>
              <code className="install-feed-code">{SOURCE_URL}</code>
              <div className="install-feed-actions">
                <button type="button" className="swiss-btn swiss-btn--ink swiss-btn--sm" onClick={handleCopySource}>
                  {copiedSource ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                  <span>{copiedSource ? t.copiedText : t.copySourceUrl}</span>
                </button>
                <a
                  href={`sidestore://source?url=${encodeURIComponent(SOURCE_URL)}`}
                  className="swiss-btn swiss-btn--ghost swiss-btn--sm"
                >
                  <Wifi size={14} aria-hidden="true" />
                  <span>{t.openSideStore}</span>
                </a>
                <a
                  href={`altstore://source?url=${encodeURIComponent(SOURCE_URL)}`}
                  className="swiss-btn swiss-btn--ghost swiss-btn--sm"
                >
                  <Laptop size={14} aria-hidden="true" />
                  <span>{t.openAltStore}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right 8-Col Accessible Native iOS Deployment Guide Tabs */}
          <div className="install-tabs-sheet">
            <FocusTabList
              ariaLabel={lang === 'zh' ? 'iPhone 与 iPad 免付费装机方案' : 'Zero-Fee Native iOS Install Guides'}
              idPrefix="install"
              activeId={activeTab}
              onSelect={setActiveTab}
              tabs={t.installTabs.map((item) => ({
                id: item.id,
                label: item.label,
              }))}
            />

            <div className="install-panels-wrap">
              {t.installTabs.map((item) => {
                const Icon =
                  item.id === 'sidestore'
                    ? Wifi
                    : item.id === 'altstore'
                      ? Laptop
                      : item.id === 'xcode'
                        ? Wrench
                        : CloudCog;

                return (
                  <FocusTabPanel
                    key={item.id}
                    tabId={item.id}
                    idPrefix="install"
                    isActive={activeTab === item.id}
                    onBeforeMatch={() => setActiveTab(item.id)}
                  >
                    <div className="install-panel-head">
                      <span className="install-method-badge">
                        <Icon size={14} aria-hidden="true" />
                        <span>{item.badge}</span>
                      </span>
                      <h3 className="install-panel-title">{item.title}</h3>
                      <p className="install-panel-intro">{item.intro}</p>
                    </div>

                    <ol className="install-steps-list">
                      {item.steps.map((step, i) => (
                        <li key={i} className="install-step-item">
                          <span className="install-step-num" aria-hidden="true">
                            0{i + 1}
                          </span>
                          <span className="install-step-text">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </FocusTabPanel>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
