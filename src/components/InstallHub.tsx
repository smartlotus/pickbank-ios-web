import React, { useEffect, useState } from 'react';
import { Check, Copy, Download, ExternalLink, Laptop, ShieldCheck, Smartphone, Wifi } from 'lucide-react';
import type { AppLang } from '../core/types';
import { COPY } from '../i18n/copy';
import { FocusTabList, FocusTabPanel } from './TabPrimitives';

interface InstallHubProps {
  lang: AppLang;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const SOURCE_URL = 'https://pickbank-ios.pages.dev/downloads/altstore-source.json';

export const InstallHub: React.FC<InstallHubProps> = ({ lang }) => {
  const t = COPY[lang];
  const [activeTab, setActiveTab] = useState<string>('sidestore');
  const [copiedSource, setCopiedSource] = useState(false);

  // Web App Install progressive enhancement per install-web-app guidance
  const [supportsWebInstall, setSupportsWebInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installStatus, setInstallStatus] = useState('');

  useEffect(() => {
    const navProto = typeof Navigator !== 'undefined' ? (Navigator.prototype as unknown as { install?: unknown }) : undefined;
    const hasNativeInstall = typeof navProto?.install === 'function';
    setSupportsWebInstall(hasNativeInstall);

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, []);

  const handleCopySource = async () => {
    try {
      await navigator.clipboard.writeText(SOURCE_URL);
      setCopiedSource(true);
      setTimeout(() => setCopiedSource(false), 2000);
    } catch {
      // Clipboard blocked in restricted context
    }
  };

  const handleInstallWebApp = async () => {
    if (isInstalling) return;
    setIsInstalling(true);
    try {
      const navAny = navigator as Navigator & { install?: () => Promise<void> };
      if (supportsWebInstall && typeof navAny.install === 'function') {
        await navAny.install();
        setInstallStatus(lang === 'zh' ? '应用已安装或打开。' : 'The app was installed or opened.');
      } else if (deferredPrompt) {
        const promptEv = deferredPrompt;
        setDeferredPrompt(null);
        await promptEv.prompt();
        const { outcome } = await promptEv.userChoice;
        setInstallStatus(
          outcome === 'accepted'
            ? lang === 'zh'
              ? '已成功添加 PickBank 至主屏幕！'
              : 'PickBank Web App installed!'
            : lang === 'zh'
              ? '已取消安装，随时可再次点击尝试。'
              : 'Installation canceled.'
        );
      }
    } catch (err) {
      const name = err instanceof Error ? err.name : '';
      if (name === 'AbortError') {
        setInstallStatus(lang === 'zh' ? '安装已取消或暂未完成。' : 'Installation was canceled.');
      } else {
        setInstallStatus(lang === 'zh' ? '当前浏览器暂不支持一键安装。' : 'Installation could not start.');
      }
    } finally {
      setIsInstalling(false);
    }
  };

  const canTriggerWebInstall = supportsWebInstall || deferredPrompt !== null;

  return (
    <section id="install" className="section-block scroll-reveal">
      <div className="section-inner">
        <div className="section-header-split">
          <div>
            <p className="eyebrow-pill">
              <ShieldCheck size={14} aria-hidden="true" />
              <span>{t.installEyebrow}</span>
            </p>
            <h2 className="section-title">{t.installHeading}</h2>
          </div>
          <p className="section-desc">{t.installDesc}</p>
        </div>

        <div className="install-layout">
          {/* Direct IPA & Source URL Card */}
          <aside className="install-download-card glass-surface">
            <div className="install-ipa-badge">
              <img
                src="/assets/icon-512.png"
                alt="PickBank IPA Icon"
                width={56}
                height={56}
                className="install-ipa-icon"
              />
              <div>
                <h3 className="install-ipa-title">{t.downloadCardTitle}</h3>
                <p className="install-ipa-sub">{t.downloadCardSub}</p>
              </div>
            </div>

            <a
              href="https://github.com/smartlotus/pickbank-ios"
              target="_blank"
              rel="noreferrer"
              className="btn-primary install-ipa-btn"
            >
              <ExternalLink size={18} aria-hidden="true" />
              <span>{t.downloadIpaBtn}</span>
            </a>

            <a
              href="/downloads/altstore-source.json"
              download="altstore-source.json"
              className="btn-glass install-ipa-btn"
            >
              <Download size={17} aria-hidden="true" />
              <span>{lang === 'zh' ? '下载 SideStore / AltStore 源清单 (.json)' : 'Download Source Manifest (.json)'}</span>
            </a>

            <div className="source-box">
              <span className="source-label">{t.sourceUrlLabel}</span>
              <code className="source-code">{SOURCE_URL}</code>
              <div className="source-actions">
                <button type="button" className="btn-glass btn-sm" onClick={handleCopySource}>
                  {copiedSource ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                  <span>{copiedSource ? t.copiedText : t.copySourceUrl}</span>
                </button>
                <a
                  href={`sidestore://source?url=${encodeURIComponent(SOURCE_URL)}`}
                  className="btn-outline btn-sm"
                >
                  <ExternalLink size={14} aria-hidden="true" />
                  <span>{t.openSideStore}</span>
                </a>
                <a
                  href={`altstore://source?url=${encodeURIComponent(SOURCE_URL)}`}
                  className="btn-outline btn-sm"
                >
                  <ExternalLink size={14} aria-hidden="true" />
                  <span>{t.openAltStore}</span>
                </a>
              </div>
            </div>
          </aside>

          {/* 4-Method Single-Row Focusgroup Tabbed Guide */}
          <div className="install-tabs-card glass-surface">
            <FocusTabList
              ariaLabel={lang === 'zh' ? '免开发者费用安装方式' : '$0 Installation Methods'}
              idPrefix="install"
              activeId={activeTab}
              onSelect={setActiveTab}
              tabs={t.installTabs.map((item) => ({
                id: item.id,
                label: item.label,
              }))}
            />

            <div className="tab-panels-stack">
              {t.installTabs.map((item) => {
                const Icon =
                  item.id === 'sidestore'
                    ? Wifi
                    : item.id === 'altstore'
                      ? Laptop
                      : item.id === 'xcode'
                        ? ShieldCheck
                        : Smartphone;

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

                    {item.id === 'pwa' ? (
                      <div className="pwa-install-box">
                        {canTriggerWebInstall ? (
                          <button
                            type="button"
                            className="btn-primary"
                            aria-disabled={isInstalling ? 'true' : undefined}
                            onClick={handleInstallWebApp}
                          >
                            <Download size={16} aria-hidden="true" />
                            <span>{t.pwaInstallDirectBtn}</span>
                          </button>
                        ) : null}
                        <p className="pwa-install-hint" role="status">
                          {installStatus || t.pwaInstallHintIdle}
                        </p>
                      </div>
                    ) : null}
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
