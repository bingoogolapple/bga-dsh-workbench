window.__ModuleLoader__.load({ id: 'bga-dsh-workbench', factory: (require) => { var module = { exports: {} }; var exports = module.exports;

if(typeof document!=="undefined"){var __s=document.createElement("style");__s.dataset.pluginCss="bga-dsh-workbench-kb";__s.textContent="/* src/client/task-board/kanban.module.css */\n[data-pane=conversation],\n[class*=centerCol] {\n  position: relative;\n}\n[data-bga-kb-view] {\n  position: absolute;\n  inset: 0;\n  display: none;\n  z-index: 30;\n  background: var(--dsw-alias-bg-base);\n}\nhtml[data-bga-kb-open] [data-bga-kb-view] {\n  display: block;\n}\nhtml[data-bga-kb-open] [data-pane=conversation] > :not([data-bga-kb-view]),\nhtml[data-bga-kb-open] [class*=centerCol] > :not([data-bga-kb-view]) {\n  display: none !important;\n}\n.kanban_bga-kb-entry {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  width: 100%;\n  height: 32px;\n  padding: 0 12px;\n  background: transparent;\n  border: none;\n  border-radius: 8px;\n  color: var(--dsw-alias-label-secondary);\n  cursor: pointer;\n  font-size: 13px;\n  white-space: nowrap;\n}\n.kanban_bga-kb-entry:hover {\n  background: var(--dsw-specific-sidebar-nav-item-hover);\n  color: var(--dsw-alias-label-primary);\n}\n.kanban_bga-kb-entry[data-active] {\n  background: var(--dsw-specific-sidebar-nav-item-active);\n  color: var(--dsw-alias-label-primary);\n  font-weight: 600;\n}\n.kanban_bga-kb-entry-icon {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex: none;\n}\n.kanban_bga-kb-entry-label {\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n[data-dsh-frame][data-sidebar-collapsed] .kanban_bga-kb-entry {\n  justify-content: center;\n  padding: 0;\n  width: 100%;\n}\n[data-dsh-frame][data-sidebar-collapsed] .kanban_bga-kb-entry-label {\n  display: none;\n}\n.kanban_bga-kb-board {\n  display: flex;\n  flex-direction: column;\n  box-sizing: border-box;\n  height: 100%;\n  min-width: 0;\n  min-height: 0;\n  padding: 14px 16px 16px;\n  gap: 12px;\n  background: var(--dsw-alias-bg-base);\n  color: var(--dsw-alias-label-primary);\n  font-family: var(--dsw-font-family);\n}\n.kanban_bga-kb-board-header {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  flex: none;\n}\n.kanban_bga-kb-search {\n  flex: 0 1 260px;\n  min-width: 120px;\n  padding: 6px 10px;\n  font-size: 13px;\n  color: var(--dsw-alias-label-primary);\n  background: var(--dsw-specific-input-major);\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 8px;\n  outline: none;\n}\n.kanban_bga-kb-search::placeholder {\n  color: var(--dsw-alias-label-tertiary);\n}\n.kanban_bga-kb-quick {\n  flex: 0 1 220px;\n  min-width: 120px;\n  margin-left: auto;\n  padding: 6px 10px;\n  font-size: 13px;\n  color: var(--dsw-alias-label-primary);\n  background: var(--dsw-specific-input-major);\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 8px;\n  outline: none;\n}\n.kanban_bga-kb-quick::placeholder {\n  color: var(--dsw-alias-label-tertiary);\n}\n.kanban_bga-kb-cols {\n  display: grid;\n  grid-template-columns: repeat(5, minmax(0, 1fr));\n  gap: 6px;\n  flex: 1;\n  min-height: 0;\n}\n.kanban_bga-kb-col {\n  display: flex;\n  flex-direction: column;\n  min-height: 0;\n  background: var(--dsw-alias-bg-layer-2);\n  border: 1px solid var(--dsw-alias-border-l1);\n  border-radius: 12px;\n  overflow: hidden;\n}\n.kanban_bga-kb-col-header {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  padding: 10px 12px;\n  flex: none;\n}\n.kanban_bga-kb-col-title {\n  margin: 0;\n  flex: 1;\n  font-size: 13px;\n  font-weight: 700;\n  color: var(--dsw-alias-label-primary);\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.kanban_bga-kb-col-count {\n  flex: none;\n  min-width: 0;\n  font-size: 12px;\n  color: var(--dsw-alias-label-tertiary);\n  background: var(--dsw-alias-interactive-bg-hover);\n  border-radius: 999px;\n  padding: 1px 8px;\n}\n.kanban_bga-kb-dot {\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  flex: none;\n}\n.kanban_bga-kb-dot[data-status=backlog] {\n  background: var(--dsw-alias-label-tertiary);\n}\n.kanban_bga-kb-dot[data-status=todo] {\n  background: var(--dsw-alias-state-business-primary);\n}\n.kanban_bga-kb-dot[data-status=running] {\n  background: var(--dsw-alias-state-warn-primary);\n}\n.kanban_bga-kb-dot[data-status=done] {\n  background: var(--dsw-alias-state-success-primary);\n}\n.kanban_bga-kb-dot[data-status=failed] {\n  background: var(--dsw-alias-state-error-primary);\n}\n.kanban_bga-kb-cards {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  padding: 2px 8px 10px;\n  overflow-y: auto;\n  flex: 1;\n  min-height: 0;\n}\n.kanban_bga-kb-col-empty {\n  padding: 24px 8px;\n  text-align: center;\n  font-size: 12px;\n  color: var(--dsw-alias-label-tertiary);\n}\n.kanban_bga-kb-card {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  padding: 10px 12px;\n  text-align: left;\n  background: var(--dsw-alias-bg-base);\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 10px;\n  cursor: pointer;\n  color: var(--dsw-alias-label-primary);\n  font-family: inherit;\n  transition:\n    box-shadow 120ms ease,\n    border-color 120ms ease,\n    transform 120ms ease;\n}\n.kanban_bga-kb-card:hover {\n  box-shadow: var(--dsw-shadow-lv2);\n  border-color: var(--dsw-alias-border-l3);\n  transform: translateY(-1px);\n}\n.kanban_bga-kb-card[data-status=running] {\n  border-color: var(--dsw-alias-state-warn-primary);\n}\n.kanban_bga-kb-card-top {\n  display: flex;\n  align-items: flex-start;\n  gap: 8px;\n}\n.kanban_bga-kb-card-title {\n  flex: 1;\n  min-width: 0;\n  font-size: 13px;\n  font-weight: 600;\n  line-height: 1.35;\n  overflow: hidden;\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n}\n.kanban_bga-kb-card-delete {\n  flex: none;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 22px;\n  height: 22px;\n  margin: -8px -10px 0 0;\n  padding: 0;\n  background: transparent;\n  border: none;\n  border-radius: 6px;\n  color: var(--dsw-alias-label-tertiary);\n  cursor: pointer;\n}\n.kanban_bga-kb-card-delete:hover {\n  background: var(--dsw-alias-interactive-bg-hover);\n  color: var(--dsw-alias-state-error-primary);\n}\n.kanban_bga-kb-card-excerpt {\n  font-size: 12px;\n  line-height: 1.4;\n  color: var(--dsw-alias-label-secondary);\n  overflow: hidden;\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n}\n.kanban_bga-kb-card-meta {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 11px;\n  color: var(--dsw-alias-label-tertiary);\n}\n.kanban_bga-kb-card-time {\n  flex: 1;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.kanban_bga-kb-card-schedule {\n  flex: none;\n  min-width: 0;\n  font-size: 12px;\n  line-height: 1;\n  white-space: nowrap;\n  padding: 2px 6px;\n  border-radius: 999px;\n  color: var(--dsw-alias-label-secondary);\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n.kanban_bga-kb-card-run {\n  flex: none;\n}\n.kanban_bga-kb-card-run[data-result=failed] {\n  color: var(--dsw-alias-state-error-primary);\n}\n.kanban_bga-kb-card-run[data-result=succeeded] {\n  color: var(--dsw-alias-state-success-primary);\n}\n.kanban_bga-kb-card-session {\n  flex: none;\n  color: var(--dsw-alias-state-business-primary);\n}\n.kanban_bga-kb-card-running {\n  font-size: 11px;\n  color: var(--dsw-alias-state-warn-primary);\n}\n.kanban_bga-kb-card-spinner {\n  width: 10px;\n  height: 10px;\n  flex: none;\n  border: 2px solid var(--dsw-alias-state-warn-primary);\n  border-top-color: transparent;\n  border-radius: 50%;\n  animation: kanban_dshTbSpin 800ms linear infinite;\n}\n@keyframes kanban_dshTbSpin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n.kanban_bga-kb-btn-primary {\n  padding: 6px 14px;\n  font-size: 13px;\n  font-weight: 600;\n  color: var(--dsw-alias-label-primary-foreground);\n  background: var(--dsw-alias-button-info-fill);\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n  white-space: nowrap;\n}\n.kanban_bga-kb-btn-primary:hover:not(:disabled) {\n  background: var(--dsw-alias-button-info-hover);\n}\n.kanban_bga-kb-btn-primary:disabled {\n  opacity: 0.5;\n  cursor: default;\n}\n.kanban_bga-kb-btn-ghost {\n  padding: 5px 12px;\n  font-size: 12px;\n  color: var(--dsw-alias-label-primary);\n  background: transparent;\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 8px;\n  cursor: pointer;\n  white-space: nowrap;\n}\n.kanban_bga-kb-btn-ghost:hover:not(:disabled) {\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n.kanban_bga-kb-btn-ghost:disabled {\n  opacity: 0.45;\n  cursor: default;\n}\n.kanban_bga-kb-btn-danger {\n  padding: 6px 14px;\n  font-size: 13px;\n  font-weight: 600;\n  color: #fff;\n  background: var(--dsw-alias-state-error-primary);\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n  white-space: nowrap;\n}\n.kanban_bga-kb-btn-danger:hover:not(:disabled) {\n  filter: brightness(1.08);\n}\n.kanban_bga-kb-btn-danger:active:not(:disabled) {\n  filter: brightness(0.94);\n}\n.kanban_bga-kb-btn-danger:disabled {\n  opacity: 0.5;\n  cursor: default;\n}\n.kanban_bga-kb-btn-icon {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 26px;\n  height: 26px;\n  padding: 0;\n  background: transparent;\n  border: none;\n  border-radius: 6px;\n  color: var(--dsw-alias-label-secondary);\n  cursor: pointer;\n  font-size: 13px;\n}\n.kanban_bga-kb-btn-icon:hover {\n  background: var(--dsw-alias-interactive-bg-hover);\n  color: var(--dsw-alias-label-primary);\n}\n.kanban_bga-kb-btn-link {\n  padding: 0;\n  font-size: 12px;\n  color: var(--dsw-alias-state-business-primary);\n  background: none;\n  border: none;\n  cursor: pointer;\n  white-space: nowrap;\n}\n.kanban_bga-kb-btn-link:hover {\n  text-decoration: underline;\n}\n.kanban_bga-kb-modal-bg {\n  position: fixed;\n  inset: 0;\n  z-index: 1300;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: var(--dsw-alias-bg-mask-1);\n}\n.kanban_bga-kb-modal {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  width: min(520px, calc(100vw - 48px));\n  max-height: calc(100vh - 96px);\n  overflow-y: auto;\n  padding: 18px;\n  background: var(--dsw-alias-bg-base);\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 14px;\n  box-shadow: var(--dsw-shadow-lv3);\n  color: var(--dsw-alias-label-primary);\n}\n.kanban_bga-kb-modal-sm {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  width: min(400px, calc(100vw - 48px));\n  max-height: calc(100vh - 96px);\n  overflow-y: auto;\n  padding: 18px;\n  background: var(--dsw-alias-bg-base);\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 14px;\n  box-shadow: var(--dsw-shadow-lv3);\n  color: var(--dsw-alias-label-primary);\n}\n.kanban_bga-kb-modal-title {\n  margin: 0;\n  font-size: 15px;\n  font-weight: 700;\n}\n.kanban_bga-kb-modal-msg {\n  margin: 0;\n  font-size: 13px;\n  line-height: 1.5;\n  color: var(--dsw-alias-label-secondary);\n  white-space: pre-wrap;\n  overflow-wrap: anywhere;\n}\n.kanban_bga-kb-modal-foot {\n  display: flex;\n  justify-content: flex-end;\n  gap: 10px;\n  margin-top: 4px;\n}\n.kanban_bga-kb-fld {\n  display: flex;\n  flex-direction: column;\n  gap: 5px;\n}\n.kanban_bga-kb-fld-label {\n  font-size: 12px;\n  font-weight: 600;\n  color: var(--dsw-alias-label-secondary);\n}\n.kanban_bga-kb-input {\n  padding: 7px 10px;\n  font-size: 13px;\n  color: var(--dsw-alias-label-primary);\n  background: var(--dsw-specific-input-major);\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 8px;\n  outline: none;\n  resize: vertical;\n  font-family: inherit;\n}\n.kanban_bga-kb-input:focus {\n  border-color: var(--dsw-alias-state-business-primary);\n}\n.kanban_bga-kb-select {\n  padding: 7px 10px;\n  font-size: 13px;\n  color: var(--dsw-alias-label-primary);\n  background: var(--dsw-specific-input-major);\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 8px;\n  outline: none;\n  font-family: inherit;\n  max-width: 100%;\n}\n.kanban_bga-kb-input::placeholder {\n  color: var(--dsw-alias-label-tertiary);\n}\n.kanban_bga-kb-fld-error {\n  margin: 0;\n  font-size: 12px;\n  color: var(--dsw-alias-state-error-primary);\n}\n.kanban_bga-kb-det {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  width: min(640px, calc(100vw - 48px));\n  max-height: calc(100vh - 80px);\n  background: var(--dsw-alias-bg-base);\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 14px;\n  box-shadow: var(--dsw-shadow-lv3);\n  color: var(--dsw-alias-label-primary);\n  overflow: hidden;\n}\n.kanban_bga-kb-det-close {\n  position: absolute;\n  top: 6px;\n  right: 6px;\n  z-index: 1;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 28px;\n  height: 28px;\n  padding: 0;\n  background: transparent;\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 8px;\n  color: var(--dsw-alias-label-secondary);\n  cursor: pointer;\n  font-size: 16px;\n  line-height: 1;\n}\n.kanban_bga-kb-det-close:hover {\n  background: var(--dsw-alias-interactive-bg-hover);\n  color: var(--dsw-alias-label-primary);\n}\n.kanban_bga-kb-det-header {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 14px 18px;\n  border-bottom: 1px solid var(--dsw-alias-separator-primary);\n  flex: none;\n}\n.kanban_bga-kb-det-title {\n  margin: 0;\n  flex: 1;\n  font-size: 15px;\n  font-weight: 700;\n  overflow-wrap: anywhere;\n}\n.kanban_bga-kb-badge {\n  flex: none;\n  padding: 2px 10px;\n  font-size: 12px;\n  border-radius: 999px;\n  border: 1px solid var(--dsw-alias-border-l2);\n  color: var(--dsw-alias-label-secondary);\n}\n.kanban_bga-kb-badge[data-status=running] {\n  color: var(--dsw-alias-state-warn-primary);\n  border-color: var(--dsw-alias-state-warn-primary);\n}\n.kanban_bga-kb-badge[data-status=done] {\n  color: var(--dsw-alias-state-success-primary);\n  border-color: var(--dsw-alias-state-success-primary);\n}\n.kanban_bga-kb-badge[data-status=failed] {\n  color: var(--dsw-alias-state-error-primary);\n  border-color: var(--dsw-alias-state-error-primary);\n}\n.kanban_bga-kb-det-body {\n  padding: 14px 18px;\n  overflow-y: auto;\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n  flex: 1;\n}\n.kanban_bga-kb-det-section {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.kanban_bga-kb-det-section h4 {\n  margin: 0;\n  font-size: 12px;\n  font-weight: 700;\n  color: var(--dsw-alias-label-tertiary);\n  text-transform: none;\n}\n.kanban_bga-kb-det-text {\n  margin: 0;\n  font-size: 13px;\n  line-height: 1.55;\n  color: var(--dsw-alias-label-primary);\n  white-space: pre-wrap;\n  overflow-wrap: anywhere;\n}\n.kanban_bga-kb-sch-toggle {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 13px;\n  color: var(--dsw-alias-label-primary);\n  cursor: pointer;\n  user-select: none;\n}\n.kanban_bga-kb-sch-toggle input {\n  accent-color: var(--dsw-alias-state-business-primary);\n}\n.kanban_bga-kb-sch-row {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.kanban_bga-kb-sch-input {\n  flex: 1;\n  min-width: 0;\n  font-family: var(--dsw-font-markdown-code-block-small);\n  font-size: 12.5px;\n}\n.kanban_bga-kb-sch-input--err {\n  border-color: var(--dsw-alias-state-error-primary);\n}\n.kanban_bga-kb-sch-input--err:focus {\n  border-color: var(--dsw-alias-state-error-primary);\n}\n.kanban_bga-kb-sch-preset {\n  flex: none;\n  padding: 7px 8px;\n  font-size: 12.5px;\n  color: var(--dsw-alias-label-primary);\n  background: var(--dsw-specific-input-major);\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 8px;\n  outline: none;\n}\n.kanban_bga-kb-sch-meta {\n  margin: 0;\n  font-size: 12px;\n  color: var(--dsw-alias-label-secondary);\n  overflow-wrap: anywhere;\n}\n.kanban_bga-kb-prompt {\n  margin: 0;\n  padding: 10px 12px;\n  font-size: 12.5px;\n  line-height: 1.5;\n  font-family: var(--dsw-font-markdown-code-block-small);\n  color: var(--dsw-alias-label-primary);\n  background: var(--dsw-alias-markdown-code-block);\n  border: 1px solid var(--dsw-alias-border-l1);\n  border-radius: 8px;\n  white-space: pre-wrap;\n  overflow-wrap: anywhere;\n  max-height: 240px;\n  overflow-y: auto;\n}\n.kanban_bga-kb-ex-list {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.kanban_bga-kb-ex-row {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 8px 10px;\n  border: 1px solid var(--dsw-alias-border-l1);\n  border-radius: 8px;\n  flex-wrap: wrap;\n}\n.kanban_bga-kb-ex-badge {\n  flex: none;\n  padding: 1px 8px;\n  font-size: 11px;\n  font-weight: 600;\n  border-radius: 999px;\n  color: var(--dsw-alias-state-warn-primary);\n  background: var(--dsw-alias-state-warn-secondary);\n}\n.kanban_bga-kb-ex-badge[data-result=succeeded] {\n  color: var(--dsw-alias-state-success-primary);\n  background: transparent;\n}\n.kanban_bga-kb-ex-badge[data-result=failed] {\n  color: var(--dsw-alias-state-error-primary);\n  background: transparent;\n}\n.kanban_bga-kb-ex-badge[data-result=cancelled] {\n  color: var(--dsw-alias-label-tertiary);\n  background: transparent;\n}\n.kanban_bga-kb-ex-times {\n  font-size: 12px;\n  color: var(--dsw-alias-label-secondary);\n}\n.kanban_bga-kb-ex-error {\n  width: 100%;\n  font-size: 12px;\n  color: var(--dsw-alias-state-error-primary);\n  overflow-wrap: anywhere;\n}\n.kanban_bga-kb-move {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n.kanban_bga-kb-det-foot {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 12px 18px;\n  border-top: 1px solid var(--dsw-alias-separator-primary);\n  flex: none;\n}\n.kanban_bga-kb-det-meta {\n  margin-left: auto;\n  font-size: 11px;\n  color: var(--dsw-alias-label-tertiary);\n}\n.kanban_bga-kb-entry:focus-visible,\n.kanban_bga-kb-card:focus-visible,\n.kanban_bga-kb-card-delete:focus-visible,\n.kanban_bga-kb-btn-primary:focus-visible,\n.kanban_bga-kb-btn-ghost:focus-visible,\n.kanban_bga-kb-btn-danger:focus-visible,\n.kanban_bga-kb-btn-icon:focus-visible,\n.kanban_bga-kb-btn-link:focus-visible,\n.kanban_bga-kb-search:focus-visible,\n.kanban_bga-kb-input:focus-visible,\n.kanban_bga-kb-select:focus-visible,\n.kanban_bga-kb-sch-preset:focus-visible,\n.kanban_bga-kb-sch-toggle input:focus-visible {\n  outline: 2px solid var(--dsw-alias-state-business-primary);\n  outline-offset: 2px;\n}\n.kanban_bga-kb-entry,\n.kanban_bga-kb-btn-primary,\n.kanban_bga-kb-btn-ghost,\n.kanban_bga-kb-btn-danger,\n.kanban_bga-kb-btn-icon,\n.kanban_bga-kb-btn-link,\n.kanban_bga-kb-search,\n.kanban_bga-kb-input,\n.kanban_bga-kb-select,\n.kanban_bga-kb-sch-preset,\n.kanban_bga-kb-sch-toggle input {\n  transition:\n    background-color 120ms ease,\n    color 120ms ease,\n    border-color 120ms ease,\n    outline-color 120ms ease,\n    box-shadow 120ms ease,\n    transform 120ms ease;\n}\n.kanban_bga-kb-card:active {\n  box-shadow: var(--dsw-shadow-lv1);\n  transform: translateY(0);\n}\n.kanban_bga-kb-entry:active,\n.kanban_bga-kb-btn-primary:active:not(:disabled),\n.kanban_bga-kb-btn-ghost:active:not(:disabled),\n.kanban_bga-kb-btn-danger:active:not(:disabled),\n.kanban_bga-kb-btn-icon:active:not(:disabled),\n.kanban_bga-kb-btn-link:active:not(:disabled) {\n  transform: translateY(1px);\n}\n.kanban_bga-kb-entry[data-active]:hover {\n  background: var(--dsw-specific-sidebar-nav-item-active);\n}\n.kanban_bga-kb-btn-icon:hover:not(:disabled) {\n  background: var(--dsw-alias-interactive-bg-hover);\n  color: var(--dsw-alias-label-primary);\n}\n.kanban_bga-kb-btn-link:hover:not(:disabled) {\n  text-decoration: underline;\n}\n.kanban_bga-kb-btn-icon:disabled,\n.kanban_bga-kb-btn-link:disabled {\n  opacity: 0.45;\n  cursor: default;\n}\n.kanban_bga-kb-search:focus,\n.kanban_bga-kb-select:focus,\n.kanban_bga-kb-sch-preset:focus {\n  border-color: var(--dsw-alias-state-business-primary);\n}\n.kanban_bga-kb-sch-toggle input {\n  margin: 0;\n}\n@media (prefers-reduced-motion: reduce) {\n  .kanban_bga-kb-entry,\n  .kanban_bga-kb-card,\n  .kanban_bga-kb-btn-primary,\n  .kanban_bga-kb-btn-ghost,\n  .kanban_bga-kb-btn-danger,\n  .kanban_bga-kb-btn-icon,\n  .kanban_bga-kb-btn-link,\n  .kanban_bga-kb-search,\n  .kanban_bga-kb-input,\n  .kanban_bga-kb-select,\n  .kanban_bga-kb-sch-preset,\n  .kanban_bga-kb-sch-toggle input {\n    transition: none;\n  }\n  .kanban_bga-kb-card-spinner {\n    animation: none;\n  }\n}\n\n/* src/client/task-board/embed.module.css */\n.embed_bga-kb-embed {\n  position: fixed;\n  z-index: 0;\n  display: none;\n  flex-direction: column;\n  box-sizing: border-box;\n  background: var(--dsw-alias-bg-base);\n  overflow: hidden;\n}\n.embed_bga-kb-embed-welcome {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 12px;\n  flex: none;\n  padding: 6px 16px;\n  border-bottom: 1px solid var(--dsw-alias-separator-primary);\n}\n.embed_bga-kb-embed-body {\n  flex: 1 1 auto;\n  min-height: 0;\n}\nhtml[data-bga-kb-embed] [data-phase=hero] [data-conversation-scroll] {\n  justify-content: flex-end;\n  overflow: hidden;\n}\nhtml[data-bga-kb-embed] [data-phase=hero] [class*=heroGlow] {\n  display: none;\n}\nhtml[data-bga-kb-embed] [data-phase=hero] [data-composer-seat] [class*=composerHero] {\n  padding-bottom: 28px;\n}\n\n/* src/client/task-board/cfg-card.module.css */\n.cfg_card_bga-kb-cfg {\n  border: 1px solid var(--dsw-alias-border-l2);\n  background: var(--dsw-alias-bg-layer-3);\n  border-radius: 12px;\n  list-style: none;\n  transition: border-color 0.16s, background 0.16s;\n}\n.cfg_card_bga-kb-cfg:hover {\n  border-color: var(--dsw-alias-label-dimmed);\n}\n.cfg_card_bga-kb-cfg--open {\n  background: var(--dsw-alias-bg-layer-2);\n  border-color: var(--dsw-alias-label-dimmed);\n}\n.cfg_card_bga-kb-cfg-header {\n  appearance: none;\n  width: 100%;\n  font: inherit;\n  color: inherit;\n  text-align: left;\n  cursor: pointer;\n  background: transparent;\n  border: 0;\n  border-radius: 12px;\n  align-items: center;\n  gap: 12px;\n  padding: 14px 16px;\n  display: flex;\n}\n.cfg_card_bga-kb-cfg-header:focus-visible {\n  outline: 2px solid var(--dsw-alias-brand-primary);\n  outline-offset: -2px;\n}\n.cfg_card_bga-kb-cfg-head-text {\n  flex-direction: column;\n  flex: 1;\n  gap: 4px;\n  min-width: 0;\n  display: flex;\n}\n.cfg_card_bga-kb-cfg-name {\n  color: var(--dsw-alias-label-primary);\n  font-size: 15px;\n  font-weight: 600;\n  line-height: 1.4;\n}\n.cfg_card_bga-kb-cfg-desc {\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 13px;\n  line-height: 1.5;\n}\n.cfg_card_bga-kb-cfg-pending {\n  white-space: nowrap;\n  background: var(--dsw-alias-bg-module-platform);\n  color: var(--dsw-alias-label-secondary);\n  border-radius: 999px;\n  flex: none;\n  padding: 1px 8px;\n  font-size: 11px;\n  font-weight: 500;\n  line-height: 17px;\n}\n.cfg_card_bga-kb-cfg-chevron {\n  color: var(--dsw-alias-label-tertiary);\n  flex: none;\n  transition: transform 0.16s;\n}\n.cfg_card_bga-kb-cfg-chevron--open {\n  transform: rotate(180deg);\n}\n.cfg_card_bga-kb-cfg-body {\n  border-top: 1px solid var(--dsw-alias-border-l2);\n  margin: 0 16px;\n  padding-bottom: 8px;\n}\n.cfg_card_bga-kb-cfg-ro {\n  color: var(--dsw-alias-label-tertiary);\n  margin: 12px 0 0;\n  font-size: 12px;\n  line-height: 1.5;\n}\n.cfg_card_bga-kb-cfg-hidden {\n  color: var(--dsw-alias-state-warn-primary);\n  margin: 12px 0 0;\n  font-size: 12px;\n  line-height: 1.5;\n}\n.cfg_card_bga-kb-cfg-foot {\n  border-top: 1px solid var(--dsw-alias-border-l2);\n  justify-content: flex-end;\n  align-items: center;\n  gap: 8px;\n  padding: 12px 0 4px;\n  display: flex;\n}\n.cfg_card_bga-kb-cfg-failed {\n  min-width: 0;\n  color: var(--dsw-alias-label-error);\n  flex: 1;\n  margin: 0;\n  font-size: 12px;\n  line-height: 1.5;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  white-space: nowrap;\n}\n.cfg_card_bga-kb-cfg-discard,\n.cfg_card_bga-kb-cfg-save {\n  appearance: none;\n  font: inherit;\n  cursor: pointer;\n  border: 1px solid transparent;\n  border-radius: 8px;\n  padding: 5px 14px;\n  font-size: 13px;\n  line-height: 1.5;\n}\n.cfg_card_bga-kb-cfg-discard {\n  border-color: var(--dsw-alias-border-l2);\n  color: var(--dsw-alias-label-secondary);\n  background: transparent;\n}\n.cfg_card_bga-kb-cfg-discard:hover:not(:disabled) {\n  color: var(--dsw-alias-label-primary);\n  border-color: var(--dsw-alias-label-dimmed);\n}\n.cfg_card_bga-kb-cfg-save {\n  background: var(--dsw-alias-label-primary);\n  color: var(--dsw-alias-bg-layer-3);\n}\n.cfg_card_bga-kb-cfg-discard:disabled,\n.cfg_card_bga-kb-cfg-save:disabled {\n  opacity: 0.4;\n  cursor: default;\n}\n.cfg_card_bga-kb-cfg-discard:focus-visible,\n.cfg_card_bga-kb-cfg-save:focus-visible {\n  outline: 2px solid var(--dsw-alias-brand-primary);\n  outline-offset: 1px;\n}\n.cfg_card_bga-kb-cfg-field {\n  flex-direction: column;\n  gap: 6px;\n  padding: 12px 0;\n  display: flex;\n}\n.cfg_card_bga-kb-cfg-field + .cfg_card_bga-kb-cfg-field {\n  border-top: 1px solid var(--dsw-alias-border-l2);\n}\n.cfg_card_bga-kb-cfg-head {\n  align-items: center;\n  gap: 8px;\n  display: flex;\n}\n.cfg_card_bga-kb-cfg-label {\n  min-width: 0;\n  color: var(--dsw-alias-label-primary);\n  flex: 1;\n  font-size: 13px;\n  font-weight: 500;\n  line-height: 1.5;\n}\n.cfg_card_bga-kb-cfg-badges {\n  align-items: center;\n  gap: 8px;\n  display: inline-flex;\n}\n.cfg_card_bga-kb-cfg-badge {\n  white-space: nowrap;\n  background: var(--dsw-alias-bg-module-platform);\n  color: var(--dsw-alias-label-secondary);\n  border-radius: 999px;\n  padding: 1px 8px;\n  font-size: 11px;\n  font-weight: 500;\n  line-height: 17px;\n}\n.cfg_card_bga-kb-cfg-reset {\n  font: inherit;\n  color: var(--dsw-alias-label-secondary);\n  cursor: pointer;\n  background: transparent;\n  border: none;\n  padding: 0;\n  font-size: 12px;\n  line-height: 1.5;\n}\n.cfg_card_bga-kb-cfg-reset:hover:not(:disabled) {\n  color: var(--dsw-alias-label-primary);\n}\n.cfg_card_bga-kb-cfg-reset:disabled {\n  cursor: default;\n}\n.cfg_card_bga-kb-cfg-reset:focus-visible {\n  outline: 2px solid var(--dsw-alias-brand-primary);\n  outline-offset: 2px;\n}\n.cfg_card_bga-kb-cfg-reset:focus-visible {\n  outline: 2px solid var(--dsw-alias-brand-primary);\n  outline-offset: 2px;\n}\n.cfg_card_bga-kb-cfg-input,\n.cfg_card_bga-kb-cfg-select {\n  border: 1px solid var(--dsw-alias-border-l2);\n  background: var(--dsw-alias-bg-layer-3);\n  height: 34px;\n  font: inherit;\n  color: var(--dsw-alias-label-primary);\n  border-radius: 8px;\n  padding: 0 12px;\n  font-size: 13px;\n  line-height: 1.5;\n}\n.cfg_card_bga-kb-cfg-input:focus-visible,\n.cfg_card_bga-kb-cfg-select:focus-visible {\n  border-color: var(--dsw-alias-brand-primary);\n  outline: none;\n}\n.cfg_card_bga-kb-cfg-input:disabled,\n.cfg_card_bga-kb-cfg-select:disabled {\n  color: var(--dsw-alias-label-tertiary);\n  cursor: default;\n}\n.cfg_card_bga-kb-cfg-input--err {\n  border: 1px solid var(--dsw-alias-label-error);\n  background: var(--dsw-alias-bg-layer-3);\n  height: 34px;\n  font: inherit;\n  color: var(--dsw-alias-label-primary);\n  border-radius: 8px;\n  padding: 0 12px;\n  font-size: 13px;\n  line-height: 1.5;\n}\n.cfg_card_bga-kb-cfg-input--err:focus-visible {\n  outline: 2px solid var(--dsw-alias-label-error);\n  outline-offset: 1px;\n  border-color: var(--dsw-alias-label-error);\n}\n.cfg_card_bga-kb-cfg-invalid {\n  color: var(--dsw-alias-label-error);\n  margin: 0;\n  font-size: 12px;\n  line-height: 1.5;\n}\n.cfg_card_bga-kb-cfg-hint {\n  color: var(--dsw-alias-label-tertiary);\n  margin: 0;\n  font-size: 12px;\n  line-height: 1.5;\n}\n@media (prefers-reduced-motion: reduce) {\n  .cfg_card_bga-kb-cfg,\n  .cfg_card_bga-kb-cfg-header,\n  .cfg_card_bga-kb-cfg-chevron,\n  .cfg_card_bga-kb-cfg-chevron--open,\n  .cfg_card_bga-kb-cfg-discard,\n  .cfg_card_bga-kb-cfg-save {\n    transition: none;\n  }\n}\n/*# sourceMappingURL=client.css.map */\n";document.head.appendChild(__s);}

"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.tsx
var index_exports = {};
__export(index_exports, {
  CONFIG_CHANGED_EVENT: () => CONFIG_CHANGED_EVENT,
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);
var import_client4 = require("react-dom/client");

// src/client/Banner.tsx
var import_react2 = require("react");

// src/client/banner-config.ts
var import_react = require("react");
var DEFAULT_TEXT = "\u7684\u4E13\u5C5E Harness \u5DE5\u4F5C\u53F0";
var AVATAR_URL = "/bga-dsh-workbench/avatar";
var CONFIG_URL = "/bga-dsh-workbench/config";
function useBannerConfig(defaultText) {
  const [config, setConfig] = (0, import_react.useState)({ text: defaultText, show: true });
  const fetchToken = (0, import_react.useRef)(0);
  (0, import_react.useEffect)(() => {
    const fetchConfig = () => {
      const token = ++fetchToken.current;
      fetch(CONFIG_URL, { cache: "no-store" }).then((response) => response.ok ? response.json() : Promise.reject(new Error(String(response.status)))).then((value) => {
        if (token !== fetchToken.current) return;
        const banner = value.banner ?? {};
        setConfig({
          text: typeof banner.text === "string" && banner.text.length > 0 ? banner.text : defaultText,
          show: banner.show !== false
        });
      }).catch(() => {
      });
    };
    fetchConfig();
    const refresh = () => {
      fetchConfig();
    };
    window.addEventListener("bga-dsh-workbench:config-changed", refresh);
    return () => {
      window.removeEventListener("bga-dsh-workbench:config-changed", refresh);
      fetchToken.current += 1;
    };
  }, [defaultText]);
  return config;
}

// src/client/Banner.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var bannerStyle = {
  position: "fixed",
  zIndex: 20,
  // 位于页面主体之上、但低于对话框等交互层
  display: "none",
  alignItems: "center",
  justifyContent: "center",
  gap: 12
};
var contentStyle = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  userSelect: "text"
};
var avatarStyle = {
  width: 44,
  height: 44,
  borderRadius: "50%",
  objectFit: "cover",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)"
};
var textStyle = {
  fontSize: 20,
  lineHeight: 1.2,
  fontWeight: 600,
  color: "var(--dsw-alias-label-primary, #222)"
};
function WorkbenchBanner() {
  const ref = (0, import_react2.useRef)(null);
  const config = useBannerConfig(DEFAULT_TEXT);
  (0, import_react2.useEffect)(() => {
    const el = ref.current;
    if (el === null) return;
    let lastPhase = null;
    let lastRectKey = "";
    let observedRoot = null;
    let resizeObserver;
    const ensureObserved = (root) => {
      if (root === null || root === observedRoot) return;
      if (typeof ResizeObserver !== "undefined") {
        resizeObserver?.disconnect();
        resizeObserver = new ResizeObserver(update);
        resizeObserver.observe(root);
      }
      observedRoot = root;
    };
    const update = () => {
      const current = ref.current;
      if (current === null) return;
      const root = document.querySelector("[data-phase]");
      ensureObserved(root);
      const phase = root?.getAttribute("data-phase") ?? null;
      const takeover = document.documentElement.hasAttribute("data-bga-kb-open") || document.documentElement.hasAttribute("data-bga-kb-embed");
      if (takeover) {
        lastRectKey = "";
        current.style.display = "none";
        return;
      }
      if (phase !== lastPhase) {
        lastPhase = phase;
        if (phase !== "hero") {
          lastRectKey = "";
          current.style.display = "none";
          return;
        }
      }
      if (phase !== "hero") return;
      const column = root.getBoundingClientRect();
      if (column.width <= 0 || column.height <= 0) {
        lastRectKey = "";
        current.style.display = "none";
        return;
      }
      const rectKey = `${Math.round(column.left)}x${Math.round(column.top)}x${Math.round(column.width)}x${Math.round(column.height)}`;
      if (rectKey === lastRectKey) return;
      lastRectKey = rectKey;
      const seat = root.querySelector("[data-composer-seat]");
      const seatRect = seat?.getBoundingClientRect();
      current.style.display = "flex";
      current.style.left = `${column.left}px`;
      current.style.width = `${Math.max(0, column.width)}px`;
      current.style.top = seatRect !== void 0 && seatRect.height > 0 ? `${seatRect.top - 140}px` : `${column.top + 24}px`;
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-phase"]
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => {
      observer.disconnect();
      resizeObserver?.disconnect();
    };
  }, []);
  if (!config.show) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref, style: bannerStyle, "data-bga-banner": "", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: contentStyle, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: AVATAR_URL, alt: "", style: avatarStyle }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: textStyle, children: config.text })
  ] }) });
}

// src/client/ConfettiLayer.tsx
var import_react3 = require("react");

// src/client/confetti.ts
var COLORS = ["#0070f3", "#111111", "#f5f5f5", "#00d4ff", "#ff0080", "#ffbd00", "#7928ca", "#34d399"];
var GRAVITY = 880;
var DRAG_PER_SECOND = 0.42;
var MAX_DURATION_MS = 3200;
var FADE_SECONDS = 0.35;
var BROWSER_CLOCK = {
  now: () => performance.now(),
  raf: (callback) => window.requestAnimationFrame(callback),
  cancelRaf: (id) => window.cancelAnimationFrame(id)
};
function randomBetween(random, min, max) {
  return min + random() * (max - min);
}
function spawnParticles(rect, count, random) {
  const originX = rect.width / 2;
  const originY = Math.max(rect.height * 0.25, 88);
  const particles = [];
  for (let index = 0; index < count; index += 1) {
    const angle = -Math.PI / 2 + randomBetween(random, -1.15, 1.15);
    const speed = randomBetween(random, 360, 860);
    const round = random() < 0.28;
    particles.push({
      round,
      color: COLORS[Math.floor(random() * COLORS.length)],
      width: round ? randomBetween(random, 4, 7) : randomBetween(random, 5, 9),
      height: round ? randomBetween(random, 4, 7) : randomBetween(random, 12, 20),
      maxLife: randomBetween(random, 1.6, 2.4),
      swaySpeed: randomBetween(random, 3, 7),
      x: originX,
      y: originY,
      // 水平分速度再叠 ±15% 随机波动，让喷射更有层次；垂直分速度即初速的竖直投影
      vx: Math.cos(angle) * speed * randomBetween(random, 0.6, 1.15),
      vy: Math.sin(angle) * speed,
      rotation: randomBetween(random, 0, Math.PI * 2),
      vr: randomBetween(random, -9, 9),
      swayPhase: randomBetween(random, 0, Math.PI * 2),
      life: 0
    });
  }
  return particles;
}
function runConfettiBurst(rect, options = {}) {
  const count = options.count ?? 180;
  const clock = {
    random: options.random ?? Math.random,
    now: options.now ?? BROWSER_CLOCK.now,
    raf: options.raf ?? BROWSER_CLOCK.raf,
    cancelRaf: options.cancelRaf ?? BROWSER_CLOCK.cancelRaf
  };
  const disposeImmediately = () => {
  };
  if (rect.width <= 0 || rect.height <= 0) return disposeImmediately;
  const PAD_TOP = 96;
  const PAD_SIDE = 48;
  const PAD_BOTTOM = 24;
  const surfaceWidth = rect.width + PAD_SIDE * 2;
  const surfaceHeight = rect.height + PAD_TOP + PAD_BOTTOM;
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(surfaceWidth);
  canvas.height = Math.ceil(surfaceHeight);
  canvas.style.position = "fixed";
  canvas.style.left = `${rect.left - PAD_SIDE}px`;
  canvas.style.top = `${rect.top - PAD_TOP}px`;
  canvas.style.width = `${surfaceWidth}px`;
  canvas.style.height = `${surfaceHeight}px`;
  canvas.style.zIndex = "2147483647";
  canvas.style.pointerEvents = "none";
  canvas.setAttribute("data-bga-confetti", "");
  const context = canvas.getContext("2d");
  if (context === null) return disposeImmediately;
  document.body.appendChild(canvas);
  const particles = spawnParticles(rect, count, clock.random);
  let running = true;
  let frameId = 0;
  let lastTime;
  const startTime = clock.now();
  const stop = () => {
    if (!running) return;
    running = false;
    clock.cancelRaf(frameId);
    canvas.remove();
  };
  const frame = (timestamp) => {
    if (!running) return;
    const nowMs = clock.now();
    const elapsed = nowMs - startTime;
    if (elapsed >= MAX_DURATION_MS) {
      stop();
      return;
    }
    const dt = lastTime === void 0 ? 0.016 : Math.min(0.05, Math.max(0, (nowMs - lastTime) / 1e3));
    lastTime = nowMs;
    void timestamp;
    const drag = Math.exp(-DRAG_PER_SECOND * dt);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.translate(-PAD_SIDE, -PAD_TOP);
    let alive = 0;
    for (const particle of particles) {
      particle.life += dt;
      if (particle.life >= particle.maxLife) continue;
      alive += 1;
      particle.vy += GRAVITY * dt;
      particle.vx *= drag;
      particle.vy *= drag;
      particle.swayPhase += particle.swaySpeed * dt;
      particle.x += particle.vx * dt + Math.sin(particle.swayPhase) * 26 * dt;
      particle.y += particle.vy * dt;
      particle.rotation += particle.vr * dt;
      const remaining = particle.maxLife - particle.life;
      context.globalAlpha = remaining < FADE_SECONDS ? Math.max(0, remaining / FADE_SECONDS) : 1;
      context.fillStyle = particle.color;
      context.save();
      context.translate(particle.x, particle.y);
      context.rotate(particle.rotation);
      if (particle.round) {
        context.beginPath();
        context.arc(0, 0, particle.width / 2, 0, Math.PI * 2);
        context.fill();
      } else {
        context.fillRect(-particle.width / 2, -particle.height / 2, particle.width, particle.height);
      }
      context.restore();
    }
    context.restore();
    context.globalAlpha = 1;
    if (alive > 0) {
      frameId = clock.raf(frame);
    } else {
      stop();
    }
  };
  frameId = clock.raf(frame);
  return stop;
}

// src/client/confetti-sound.ts
var sharedContext;
function ensureContext() {
  if (typeof AudioContext === "undefined") return void 0;
  if (sharedContext === void 0) {
    try {
      sharedContext = new AudioContext();
    } catch {
      return void 0;
    }
  }
  return sharedContext;
}
function unlockConfettiAudio() {
  const context = ensureContext();
  if (context === void 0) return;
  if (context.state === "suspended") void context.resume();
}
function armConfettiSound() {
  const onGesture = () => {
    unlockConfettiAudio();
  };
  window.addEventListener("pointerdown", onGesture);
  window.addEventListener("keydown", onGesture);
  return () => {
    window.removeEventListener("pointerdown", onGesture);
    window.removeEventListener("keydown", onGesture);
  };
}
function playConfettiSound(context) {
  const ctx = context ?? ensureContext();
  if (ctx === void 0) return;
  if (ctx.state === "suspended") void ctx.resume();
  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.setValueAtTime(1e-4, now);
  master.gain.exponentialRampToValueAtTime(0.35, now + 0.02);
  master.gain.exponentialRampToValueAtTime(1e-4, now + 1.1);
  master.connect(ctx.destination);
  const popLength = Math.floor(ctx.sampleRate * 0.08);
  const popBuffer = ctx.createBuffer(1, popLength, ctx.sampleRate);
  const popData = popBuffer.getChannelData(0);
  for (let index = 0; index < popData.length; index += 1) {
    popData[index] = (Math.random() * 2 - 1) * (1 - index / popData.length);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = popBuffer;
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.setValueAtTime(3e3, now);
  lowpass.frequency.exponentialRampToValueAtTime(700, now + 0.08);
  const popGain = ctx.createGain();
  popGain.gain.setValueAtTime(0.3, now);
  popGain.gain.exponentialRampToValueAtTime(1e-4, now + 0.1);
  noise.connect(lowpass).connect(popGain).connect(master);
  const notes = [523.25, 659.25, 783.99, 1046.5];
  for (const [index, frequency] of notes.entries()) {
    const start = now + index * 0.07;
    const oscillator = ctx.createOscillator();
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(frequency, start);
    const noteGain = ctx.createGain();
    noteGain.gain.setValueAtTime(1e-4, start);
    noteGain.gain.exponentialRampToValueAtTime(0.4, start + 0.02);
    noteGain.gain.exponentialRampToValueAtTime(1e-4, start + 0.45);
    oscillator.connect(noteGain).connect(master);
    oscillator.start(start);
    oscillator.stop(start + 0.5);
  }
  noise.start(now);
}

// src/client/ConfettiLayer.tsx
var SCROLL_SELECTOR = "[data-conversation-scroll]";
var FLOW_SELECTOR = "[data-chat-flow]";
var ROW_SELECTOR = "[data-chat-flow-key]";
var TAIL_SELECTOR = '[data-chat-flow-kind="turn-tail"]';
var USER_SELECTOR = '[data-chat-flow-kind="user"]';
var ERROR_SELECTOR = '[data-chat-flow-kind="turn-error"]';
var ASSISTANT_SELECTOR = '[data-chat-flow-kind="assistant-step"]';
var STOPPED_MARKER = /(?:已停止|Stopped)/u;
var CONFIG_URL2 = "/bga-dsh-workbench/config";
var TURN_COMPLETE_EVENT = "bga-dsh-workbench:turn-complete";
async function fetchConfettiSound() {
  try {
    if (typeof fetch === "undefined") return true;
    const response = await fetch(CONFIG_URL2, { cache: "no-store" });
    if (!response.ok) return true;
    const value = await response.json();
    return typeof value.confetti?.sound === "boolean" ? value.confetti.sound : true;
  } catch {
    return true;
  }
}
async function fetchConfettiEnabled() {
  try {
    if (typeof fetch === "undefined") return true;
    const response = await fetch(CONFIG_URL2, { cache: "no-store" });
    if (!response.ok) return true;
    const value = await response.json();
    return typeof value.confetti?.show === "boolean" ? value.confetti.show : true;
  } catch {
    return true;
  }
}
function collectRows(added) {
  const rows = [];
  const seen = /* @__PURE__ */ new Set();
  for (const node of added) {
    if (!(node instanceof Element)) continue;
    for (const candidate of node.matches(ROW_SELECTOR) ? [node, ...node.querySelectorAll(ROW_SELECTOR)] : [...node.querySelectorAll(ROW_SELECTOR)]) {
      if (!seen.has(candidate)) {
        seen.add(candidate);
        rows.push(candidate);
      }
    }
  }
  return rows;
}
function burstRect() {
  const scope = document.querySelector(SCROLL_SELECTOR) ?? document.querySelector(FLOW_SELECTOR);
  if (scope === null) return null;
  const rect = scope instanceof HTMLElement ? scope.getBoundingClientRect() : { left: 0, top: 0, width: 0, height: 0 };
  if (rect.width <= 0 || rect.height <= 0) return null;
  return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
}
function isStoppedTurn(tail) {
  const flow = tail.closest(FLOW_SELECTOR);
  if (flow === null) return false;
  const rows = flow.querySelectorAll(ROW_SELECTOR);
  let hitTail = false;
  for (let i = rows.length - 1; i >= 0; i--) {
    const row = rows[i];
    if (!hitTail) {
      if (row.isSameNode(tail)) hitTail = true;
      continue;
    }
    if (row.matches(USER_SELECTOR)) return true;
    if (row.matches(ASSISTANT_SELECTOR)) {
      const text = row.textContent ?? "";
      if (text.trim() === "" || STOPPED_MARKER.test(text)) return true;
      return false;
    }
  }
  return false;
}
function isBottomMost(tail) {
  const flow = tail.closest(FLOW_SELECTOR);
  if (flow === null) return false;
  const rowsInFlow = flow.querySelectorAll(ROW_SELECTOR);
  return rowsInFlow.length > 0 && rowsInFlow[rowsInFlow.length - 1].isSameNode(tail);
}
function ConfettiLayer({
  fire = runConfettiBurst,
  playSound = playConfettiSound,
  loadSoundEnabled = fetchConfettiSound,
  loadConfettiEnabled = fetchConfettiEnabled
}) {
  const fireRef = (0, import_react3.useRef)(fire);
  fireRef.current = fire;
  const playSoundRef = (0, import_react3.useRef)(playSound);
  playSoundRef.current = playSound;
  const loadSoundRef = (0, import_react3.useRef)(loadSoundEnabled);
  loadSoundRef.current = loadSoundEnabled;
  const loadConfettiRef = (0, import_react3.useRef)(loadConfettiEnabled);
  loadConfettiRef.current = loadConfettiEnabled;
  (0, import_react3.useEffect)(() => {
    const seenTails = /* @__PURE__ */ new WeakSet();
    let seenUserRow = false;
    let disposed = false;
    const active = /* @__PURE__ */ new Set();
    const stop = () => {
      disposed = true;
      observer.disconnect();
      for (const dispose of [...active]) dispose();
      active.clear();
    };
    let confettiEnabled = true;
    void loadConfettiRef.current().then((enabled) => {
      if (!disposed) confettiEnabled = enabled;
    });
    let soundEnabled = true;
    void loadSoundRef.current().then((enabled) => {
      if (!disposed) soundEnabled = enabled;
    });
    const observer = new MutationObserver((records) => {
      if (disposed) return;
      const rows = [];
      let batchHasUser = false;
      let batchHasError = false;
      for (const record of records) {
        for (const row of collectRows(record.addedNodes)) {
          rows.push(row);
          if (row.matches(USER_SELECTOR)) batchHasUser = true;
          if (row.matches(ERROR_SELECTOR)) batchHasError = true;
        }
      }
      if (rows.length === 0) return;
      const freshTails = rows.filter((row) => row.matches(TAIL_SELECTOR) && !seenTails.has(row));
      for (const tail of freshTails) seenTails.add(tail);
      const gateSkipped = batchHasUser || batchHasError || !seenUserRow;
      const eligible = !gateSkipped ? freshTails.filter((tail) => isBottomMost(tail) && !isStoppedTurn(tail)) : [];
      if (eligible.length > 0 && confettiEnabled) {
        const rect = burstRect();
        if (rect !== null) {
          const disposeBurst = fireRef.current(rect);
          if (typeof disposeBurst === "function") active.add(disposeBurst);
          window.dispatchEvent(new CustomEvent(TURN_COMPLETE_EVENT));
          if (soundEnabled) playSoundRef.current();
        }
      }
      if (batchHasUser) seenUserRow = true;
    });
    observer.observe(document.body, { childList: true, subtree: true });
    const disarmSound = armConfettiSound();
    return () => {
      disarmSound();
      stop();
    };
  }, []);
  return null;
}

// src/client/english/EnglishLearningLayer.tsx
var import_react4 = require("react");

// src/client/english/api.ts
var BASE = "/bga-dsh-workbench/english";
async function get(path) {
  const res = await fetch(`${BASE}${path}`, { cache: "no-store" });
  return res.json();
}
async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body === void 0 ? void 0 : JSON.stringify(body)
  });
  return res.json();
}
var englishApi = {
  state: () => get("/state"),
  next: () => get("/next"),
  builtins: () => get("/builtins"),
  result: (body) => post("/result", body),
  select: (cardId) => post("/select", { cardId }),
  createFromBuiltin: (builtin, mode, mastery, threshold) => post("/cards", { builtin, mode, mastery, threshold }),
  createGenerated: (card) => post("/cards", card),
  generate: (params) => post("/generate", params),
  models: () => get("/models"),
  setDefaultModel: (provider, model) => post("/default-model", { provider, model }),
  importState: (content) => post("/import", { content }),
  exportState: () => fetch(`${BASE}/export`).then((res) => res.text()),
  updateCard: (cardId, patch) => post("/cards/update", { cardId, ...patch }),
  deleteCard: (cardId) => post("/cards/delete", { cardId }),
  reset: () => post("/reset")
};

// src/client/english/EnglishLearningLayer.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var overlayStyle = {
  position: "fixed",
  inset: 0,
  zIndex: 2147483646,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(0,0,0,0.45)"
};
var cardStyle = {
  width: 420,
  maxWidth: "92vw",
  borderRadius: 16,
  background: "var(--dsw-alias-bg-layer, #fff)",
  color: "var(--dsw-alias-text-primary, #111)",
  boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
  padding: 20,
  fontFamily: "inherit"
};
var inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  fontSize: 18,
  border: "2px solid var(--dsw-alias-border-l2, #ccc)",
  boxSizing: "border-box",
  marginTop: 12,
  outline: "none"
};
var rowStyle = { display: "flex", alignItems: "center", gap: 10, fontSize: 13, marginBottom: 8 };
var btnStyle = {
  marginTop: 12,
  padding: "10px 0",
  width: "100%",
  borderRadius: 10,
  border: "none",
  background: "var(--dsw-alias-brand-primary, #0070f3)",
  color: "#fff",
  fontSize: 15,
  cursor: "pointer"
};
var choiceStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  marginTop: 8,
  textAlign: "left",
  border: "2px solid var(--dsw-alias-border-l2, #ccc)",
  background: "transparent",
  cursor: "pointer",
  fontSize: 15,
  transition: "border-color 120ms ease, background 120ms ease"
};
var choiceSelectedStyle = {
  ...choiceStyle,
  borderColor: "var(--dsw-alias-brand-primary, #0070f3)",
  background: "var(--dsw-alias-brand-primary-weak, rgba(0,112,243,0.08))"
};
var LANG_MAP = { zh: "zh-CN", en: "en-US", "en-simple": "en-US", ja: "ja-JP", ko: "ko-KR", es: "es-ES", fr: "fr-FR", de: "de-DE", pt: "pt-BR", ru: "ru-RU", ar: "ar-SA" };
function speak(text, lang = "en") {
  try {
    if (typeof window === "undefined" || typeof window.speechSynthesis === "undefined") return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = LANG_MAP[lang] ?? lang;
    utter.rate = 1;
    utter.volume = 1;
    setTimeout(() => {
      window.speechSynthesis.speak(utter);
    }, 50);
  } catch {
  }
}
function Hearts({ count }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { children: [
    "\u2764\uFE0F",
    count
  ] });
}
function EnglishLearningLayer() {
  const [question, setQuestion] = (0, import_react4.useState)(null);
  const [notice, setNotice] = (0, import_react4.useState)(null);
  const [value, setValue] = (0, import_react4.useState)("");
  const [phase, setPhase] = (0, import_react4.useState)("ask");
  const [feedback, setFeedback] = (0, import_react4.useState)(null);
  const [state, setState] = (0, import_react4.useState)(null);
  const [busy, setBusy] = (0, import_react4.useState)(false);
  const [inputHint, setInputHint] = (0, import_react4.useState)(null);
  const [sessionDone, setSessionDone] = (0, import_react4.useState)(false);
  const sessionCountRef = (0, import_react4.useRef)(0);
  const sessionCorrectRef = (0, import_react4.useRef)(0);
  const autoCloseTimerRef = (0, import_react4.useRef)(null);
  const busyRef = (0, import_react4.useRef)(false);
  const enabledRef = (0, import_react4.useRef)(true);
  const targetLangRef = (0, import_react4.useRef)("en");
  (0, import_react4.useEffect)(() => {
    fetch("/bga-dsh-workbench/config", { cache: "no-store" }).then((r) => r.ok ? r.json() : null).then((cfg) => {
      const c = cfg;
      if (c !== null) enabledRef.current = typeof c.english?.enabled === "boolean" ? c.english.enabled : true;
    }).catch(() => {
    });
  }, []);
  const challenge = async () => {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    try {
      const res = await englishApi.next();
      if (res.question !== null) {
        if (res.targetLang) targetLangRef.current = res.targetLang;
        setQuestion(res.question);
        setValue("");
        setPhase("ask");
        setFeedback(null);
        setInputHint(null);
      } else {
        const reason = res.reason;
        if (reason === "done") {
          setNotice({ kind: "done", text: "\u{1F389} \u5F53\u524D\u8BDD\u9898\u5361\u5DF2\u5168\u90E8\u638C\u63E1\uFF0C\u53BB\u8BBE\u7F6E\u91CC\u6362\u4E00\u5F20\u65B0\u8BDD\u9898\u5361\u5427" });
        } else if (reason === "locked") {
          setNotice({ kind: "locked", text: "\u2764\uFE0F \u4ECA\u65E5\u5FC3\u5F62\u5DF2\u7528\u5C3D\uFF0C\u660E\u5929\u518D\u6765\u7EE7\u7EED\u5B66\u4E60" });
        }
      }
      englishApi.state().then((r) => setState(r.state)).catch(() => {
      });
    } catch {
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  };
  const endSession = () => {
    setQuestion(null);
    setNotice(null);
    setValue("");
    setPhase("ask");
    setFeedback(null);
    setInputHint(null);
    sessionCountRef.current = 0;
    sessionCorrectRef.current = 0;
    setSessionDone(false);
  };
  const dismissFeedback = challenge;
  (0, import_react4.useEffect)(() => {
    const handler = () => {
      if (!enabledRef.current) return;
      if (sessionCountRef.current > 0) return;
      void challenge();
    };
    window.addEventListener(TURN_COMPLETE_EVENT, handler);
    return () => window.removeEventListener(TURN_COMPLETE_EVENT, handler);
  }, []);
  const inputRef = (0, import_react4.useRef)(null);
  (0, import_react4.useEffect)(() => {
    if (question !== null) inputRef.current?.focus();
  }, [question]);
  (0, import_react4.useEffect)(() => {
    if (question?.mode === "audio") speak(question.answer, targetLangRef.current);
  }, [question]);
  const submit = async () => {
    if (question === null || busy) return;
    if (question.mode === "choice" && value === "") {
      setInputHint("\u8BF7\u5148\u9009\u62E9\u4E00\u4E2A\u9009\u9879");
      return;
    }
    if (question.mode !== "choice" && value.trim() === "") {
      setInputHint("\u8BF7\u5148\u8F93\u5165\u5185\u5BB9\u518D\u63D0\u4EA4");
      return;
    }
    setInputHint(null);
    const answer = question.mode === "choice" ? value : value;
    setBusy(true);
    try {
      const res = await englishApi.result({ itemId: question.itemId, cardId: question.cardId, answer, mode: question.mode });
      const r = res.result;
      setFeedback({ xp: r.xpDelta, hearts: r.heartsLeft, streak: r.streak, mastered: r.mastered, answer: r.answer });
      setState(res.state);
      sessionCountRef.current++;
      if (r.ok === "correct") {
        sessionCorrectRef.current++;
      }
      setPhase(r.ok === "correct" ? "correct" : "wrong");
    } catch {
    } finally {
      setBusy(false);
    }
  };
  (0, import_react4.useEffect)(() => {
    if (phase !== "correct" && phase !== "wrong") return;
    if (autoCloseTimerRef.current !== null) window.clearTimeout(autoCloseTimerRef.current);
    const card = state?.cards.find((c) => c.id === question?.cardId);
    const limit = card?.sessionSize ?? 5;
    const newCount = sessionCountRef.current;
    if (newCount >= limit) {
      autoCloseTimerRef.current = window.setTimeout(() => {
        autoCloseTimerRef.current = null;
        setSessionDone(true);
        setPhase("ask");
      }, 1e3);
      return;
    }
    const delay = phase === "correct" ? 1e3 : 4e3;
    autoCloseTimerRef.current = window.setTimeout(() => {
      autoCloseTimerRef.current = null;
      dismissFeedback();
    }, delay);
  }, [phase]);
  (0, import_react4.useEffect)(() => {
    if (!sessionDone) return;
    const timer = window.setTimeout(() => {
      endSession();
    }, 1e3);
    return () => window.clearTimeout(timer);
  }, [sessionDone]);
  const onKey = (e) => {
    if (e.key !== "Enter") return;
    if (question !== null && question.mode !== "choice" && value.trim() === "") {
      setInputHint("\u8BF7\u5148\u8F93\u5165\u5185\u5BB9\u518D\u63D0\u4EA4");
      e.preventDefault();
      return;
    }
    void submit();
  };
  const choose = (option) => {
    setValue(option);
  };
  if (notice !== null) {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: overlayStyle, onClick: () => setNotice(null), children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { ...cardStyle, textAlign: "center" }, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 16, lineHeight: 1.6 }, children: notice.text }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 12, marginTop: 12, opacity: 0.7 }, children: "\u70B9\u51FB\u4EFB\u610F\u5904\u5173\u95ED" })
    ] }) });
  }
  if (sessionDone) {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: overlayStyle, onClick: () => endSession(), children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { ...cardStyle, textAlign: "center" }, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 22, marginBottom: 12 }, children: "\u{1F389} \u672C\u8F6E\u5B8C\u6210\uFF01" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { fontSize: 15, lineHeight: 2 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
          "\u7B54\u5BF9 ",
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("b", { children: sessionCorrectRef.current }),
          " / ",
          sessionCountRef.current,
          " \u9898"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
          "\u6B63\u786E\u7387 ",
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("b", { children: [
            sessionCountRef.current > 0 ? Math.round(sessionCorrectRef.current / sessionCountRef.current * 100) : 0,
            "%"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", style: { ...btnStyle, marginTop: 16 }, onClick: () => endSession(), children: "\u597D\u7684" })
    ] }) });
  }
  if (question === null) return null;
  const hearts = state?.day.hearts ?? 5;
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: overlayStyle, onClick: phase === "correct" || phase === "wrong" ? dismissFeedback : void 0, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: cardStyle, onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: rowStyle, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Hearts, { count: hearts }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { children: [
        "\u{1F525}",
        state?.streak ?? 0
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { marginLeft: "auto" }, children: [
        "\u26A1",
        state?.xp ?? 0,
        " XP \xB7 ",
        state?.badge.name ?? "\u9752\u94DC"
      ] })
    ] }),
    phase === "ask" && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 20, fontWeight: 600, lineHeight: 1.5 }, children: question.prompt }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 13, opacity: 0.7, marginTop: 6 }, children: question.hint }),
      question.mode === "audio" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", style: { ...btnStyle, marginTop: 10 }, onClick: () => speak(question.answer, targetLangRef.current), children: "\u{1F50A} \u518D\u542C\u4E00\u904D" }),
      question.mode !== "choice" ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "input",
        {
          ref: inputRef,
          style: inputStyle,
          value,
          onChange: (e) => {
            setValue(e.target.value);
            setInputHint(null);
          },
          onKeyDown: onKey,
          onCopy: (e) => {
            if (question.mode === "copy") e.preventDefault();
          },
          onCut: (e) => {
            if (question.mode === "copy") e.preventDefault();
          },
          onPaste: (e) => {
            if (question.mode === "copy") e.preventDefault();
          },
          onContextMenu: (e) => {
            if (question.mode === "copy") e.preventDefault();
          },
          placeholder: "\u8F93\u5165\u82F1\u6587\u2026"
        }
      ) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { marginTop: 8 }, children: question.choices?.map((option) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", style: option === value ? choiceSelectedStyle : choiceStyle, onClick: () => choose(option), children: option }, option)) }),
      inputHint !== null && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 13, color: "var(--dsw-alias-state-error-primary, #c00000)", marginTop: 8 }, children: inputHint }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", style: { ...btnStyle, opacity: busy ? 0.6 : 1 }, disabled: busy, onClick: () => void submit(), children: "\u63D0\u4EA4" }),
      question.mode === "copy" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", style: { ...btnStyle, background: "transparent", color: "var(--dsw-alias-brand-primary, #0070f3)", border: "1px solid currentColor" }, onClick: () => speak(question.answer, targetLangRef.current), children: "\u{1F50A} \u6717\u8BFB\u8BE5\u8BCD" })
    ] }),
    phase === "correct" && feedback !== null && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { textAlign: "center" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 40 }, children: "\u2705" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { fontSize: 16, marginTop: 6 }, children: [
        "\u6B63\u786E\uFF01+",
        feedback.xp,
        " XP",
        feedback.mastered ? " \xB7 \u{1F393} \u672C\u8BCD\u5DF2\u638C\u63E1" : ""
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { fontSize: 13, marginTop: 6, opacity: 0.75 }, children: [
        "\u{1F525} \u8FDE\u51FB ",
        feedback.streak,
        " \u5929 \xB7 \u2764\uFE0F \u5269 ",
        feedback.hearts
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 12, marginTop: 8, opacity: 0.6 }, children: "\u23F1 1 \u79D2\u540E\u81EA\u52A8\u4E0B\u4E00\u9898" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", style: btnStyle, onClick: dismissFeedback, children: "\u7EE7\u7EED" })
    ] }),
    phase === "wrong" && feedback !== null && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { textAlign: "center" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 40 }, children: "\u274C" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { fontSize: 16, marginTop: 6 }, children: [
        "\u7B54\u9519\u4E86\uFF0C\u6B63\u786E\u7B54\u6848\uFF1A",
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("b", { children: feedback.answer })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { fontSize: 13, marginTop: 6, opacity: 0.75 }, children: [
        "\u2764\uFE0F \u8FD8\u5269 ",
        feedback.hearts,
        "\uFF08\u7B54\u9519\u6263\u4E00\u9897\u5FC3\uFF09"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", style: { ...btnStyle, background: "var(--dsw-alias-brand-primary, #0070f3)" }, onClick: dismissFeedback, children: "\u5B66\u5230\u5566" })
    ] })
  ] }) });
}

// src/client/SettingsSection.tsx
var import_react6 = require("react");

// src/client/english/EnglishSettings.tsx
var import_react5 = require("react");
var import_jsx_runtime3 = require("react/jsx-runtime");
var h3Style = { fontSize: 15, margin: "16px 0 4px" };
var subH3Style = { fontSize: 13, margin: 0, fontWeight: 600 };
var rowStyle2 = { display: "flex", alignItems: "center", gap: 12, padding: "8px 0", flexWrap: "wrap" };
var labelStyle = { minWidth: 72, fontWeight: 400, fontSize: 14 };
var captionStyle = { fontSize: 12, color: "var(--dsw-alias-label-tertiary, #888)" };
var buttonStyle = {
  padding: "4px 12px",
  borderRadius: 8,
  border: "1px solid var(--dsw-alias-border-l2, #ccc)",
  background: "transparent",
  cursor: "pointer",
  fontSize: 13
};
var inputStyle2 = {
  padding: "4px 8px",
  borderRadius: 8,
  border: "1px solid var(--dsw-alias-border-l2, #ccc)",
  fontSize: 13,
  minWidth: 180
};
var okStyle = { color: "var(--dsw-alias-state-success-primary, #2e8e52)", fontSize: 13 };
var errorStyle = { color: "var(--dsw-alias-state-error-primary, #c00000)", fontSize: 13 };
var MODES = [
  { id: "copy", label: "\u6284\u5199" },
  { id: "recall", label: "\u56DE\u5FC6" },
  { id: "choice", label: "\u9009\u62E9" },
  { id: "audio", label: "\u542C\u97F3" }
];
var MASTERY = [
  { id: "count", label: "\u8FDE\u7EED\u7B54\u5BF9\u8FBE\u6807" },
  { id: "srs", label: "\u667A\u80FD\u95F4\u9694\u590D\u4E60" }
];
var LANGUAGES = [
  { id: "zh", label: "\u4E2D\u6587" },
  { id: "en", label: "English" },
  { id: "en-simple", label: "Simple English" },
  { id: "ja", label: "\u65E5\u672C\u8A9E" },
  { id: "ko", label: "\uD55C\uAD6D\uC5B4" },
  { id: "es", label: "Espa\xF1ol" },
  { id: "fr", label: "Fran\xE7ais" },
  { id: "de", label: "Deutsch" },
  { id: "pt", label: "Portugu\xEAs" },
  { id: "ru", label: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439" },
  { id: "ar", label: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629" }
];
function EnglishSettings(_props) {
  const [state, setState] = (0, import_react5.useState)(null);
  const [builtins, setBuiltins] = (0, import_react5.useState)([]);
  const [topic, setTopic] = (0, import_react5.useState)("");
  const [nativeLang, setNativeLang] = (0, import_react5.useState)("zh");
  const [targetLang, setTargetLang] = (0, import_react5.useState)("en");
  const [mode, setMode] = (0, import_react5.useState)("copy");
  const [mastery, setMastery] = (0, import_react5.useState)("srs");
  const [threshold, setThreshold] = (0, import_react5.useState)(3);
  const [sessionSize, setSessionSize] = (0, import_react5.useState)(5);
  const [busy, setBusy] = (0, import_react5.useState)(false);
  const [hoveredCard, setHoveredCard] = (0, import_react5.useState)(null);
  const [hoveredEdit, setHoveredEdit] = (0, import_react5.useState)(null);
  const [hoveredView, setHoveredView] = (0, import_react5.useState)(null);
  const [hoveredDelete, setHoveredDelete] = (0, import_react5.useState)(null);
  const [viewingCard, setViewingCard] = (0, import_react5.useState)(null);
  const [confirmDelete, setConfirmDelete] = (0, import_react5.useState)(null);
  const [editingCardId, setEditingCardId] = (0, import_react5.useState)(null);
  const [showResetConfirm, setShowResetConfirm] = (0, import_react5.useState)(false);
  const [englishEnabled, setEnglishEnabled] = (0, import_react5.useState)(true);
  const [message, setMessage] = (0, import_react5.useState)(null);
  const fileRef = (0, import_react5.useRef)(null);
  const [pickProviders, setPickProviders] = (0, import_react5.useState)([]);
  const [pickProvider, setPickProvider] = (0, import_react5.useState)("");
  const [pickModel, setPickModel] = (0, import_react5.useState)("");
  const [showPicker, setShowPicker] = (0, import_react5.useState)(false);
  const [pendingGenerate, setPendingGenerate] = (0, import_react5.useState)(false);
  const [defaultLabel, setDefaultLabel] = (0, import_react5.useState)("\u672A\u9009\u62E9\u9ED8\u8BA4\u6A21\u578B");
  const [pickMessage, setPickMessage] = (0, import_react5.useState)(null);
  const refresh = async (silent = false) => {
    try {
      const res = await englishApi.state();
      setState(res.state);
      if (!silent) return;
    } catch {
      if (!silent) setMessage({ kind: "error", text: "\u8BFB\u53D6\u5916\u8BED\u5B66\u4E60\u72B6\u6001\u5931\u8D25" });
    }
  };
  const pickerCancel = () => {
    setShowPicker(false);
    setPendingGenerate(false);
    setPickProvider("");
    setPickModel("");
  };
  (0, import_react5.useEffect)(() => {
    fetch("/bga-dsh-workbench/config", { cache: "no-store" }).then((r) => r.ok ? r.json() : null).then((cfg) => {
      const c = cfg;
      if (c !== null) setEnglishEnabled(typeof c.english?.enabled === "boolean" ? c.english.enabled : true);
    }).catch(() => {
    });
  }, []);
  const onToggleEnglishEnabled = async (next) => {
    setEnglishEnabled(next);
    try {
      await fetch("/bga-dsh-workbench/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ english: { enabled: next } })
      });
      setMessage({ kind: "ok", text: next ? "\u5916\u8BED\u5B66\u4E60\u5DF2\u542F\u7528" : "\u5916\u8BED\u5B66\u4E60\u5DF2\u5173\u95ED" });
    } catch {
      setEnglishEnabled(!next);
      setMessage({ kind: "error", text: "\u4FDD\u5B58\u5931\u8D25" });
    }
  };
  (0, import_react5.useEffect)(() => {
    void refresh(true);
    englishApi.builtins().then((res) => setBuiltins(res.builtins)).catch(() => {
    });
    englishApi.models().then((res) => {
      const provs = res.providers ?? [];
      setPickProviders(provs);
      if (res.hasDefault && res.current.provider && res.current.model) {
        const prov = provs.find((p) => p.provider === res.current.provider);
        const name = prov?.models.find((m) => m.id === res.current.model)?.name ?? res.current.model;
        setDefaultLabel(`${prov?.providerName ?? res.current.provider} \xB7 ${name}`);
      }
    }).catch(() => {
    });
  }, []);
  const openPicker = async (alsoGenerate) => {
    setPendingGenerate(alsoGenerate);
    setPickMessage(null);
    try {
      const res = await englishApi.models();
      const provs = res.providers ?? [];
      setPickProviders(provs);
      if (res.current.provider && res.current.model) {
        setPickProvider(res.current.provider);
        setPickModel(res.current.model);
      } else if (provs.length > 0 && provs[0].models.length > 0) {
        setPickProvider(provs[0].provider);
        setPickModel(provs[0].models[0].id);
      }
    } catch {
      setPickMessage({ kind: "error", text: "\u83B7\u53D6\u6A21\u578B\u5217\u8868\u5931\u8D25" });
    }
    setShowPicker(true);
  };
  const onPickProviderChange = (provider) => {
    setPickProvider(provider);
    const prov = pickProviders.find((p) => p.provider === provider);
    setPickModel(prov && prov.models.length > 0 ? prov.models[0].id : "");
  };
  const pickerConfirm = async () => {
    if (pickProvider === "" || pickModel === "") {
      setPickMessage({ kind: "error", text: "\u8BF7\u9009\u62E9\u63D0\u4F9B\u5546\u4E0E\u6A21\u578B" });
      return;
    }
    setPickMessage(null);
    setBusy(true);
    try {
      const saved = await englishApi.setDefaultModel(pickProvider, pickModel);
      if (!saved.ok) throw new Error("save failed");
      const prov = pickProviders.find((p) => p.provider === pickProvider);
      const name = prov?.models.find((m) => m.id === pickModel)?.name ?? pickModel;
      setDefaultLabel(`${prov?.providerName ?? pickProvider} \xB7 ${name}`);
      setShowPicker(false);
      if (pendingGenerate) {
        setPendingGenerate(false);
        await runGenerate(pickProvider, pickModel);
      } else {
        setMessage({ kind: "ok", text: "\u5DF2\u4FDD\u5B58\u9ED8\u8BA4\u6A21\u578B" });
      }
    } catch {
      setPickMessage({ kind: "error", text: "\u4FDD\u5B58\u9ED8\u8BA4\u6A21\u578B\u5931\u8D25" });
    } finally {
      setBusy(false);
    }
  };
  const onSelect = async (cardId) => {
    setEditingCardId(null);
    setBusy(true);
    try {
      const res = await englishApi.select(cardId);
      setState(res.state);
      setMessage({ kind: "ok", text: "\u5DF2\u5207\u6362\u5F53\u524D\u8BDD\u9898\u5361" });
    } catch (error) {
      setMessage({ kind: "error", text: error.message });
    } finally {
      setBusy(false);
    }
  };
  const onDeleteCard = (cardId, topic2) => {
    setConfirmDelete({ cardId, topic: topic2 });
  };
  const confirmDeleteCard = async () => {
    if (confirmDelete === null) return;
    const { cardId, topic: topic2 } = confirmDelete;
    setConfirmDelete(null);
    setBusy(true);
    try {
      const res = await englishApi.deleteCard(cardId);
      if (res.ok) {
        setState(res.state);
        setMessage({ kind: "ok", text: `\u5DF2\u5220\u9664\u8BDD\u9898\u5361\u300C${topic2}\u300D` });
      } else {
        setMessage({ kind: "error", text: "\u5220\u9664\u5931\u8D25" });
      }
    } catch {
      setMessage({ kind: "error", text: "\u5220\u9664\u5931\u8D25" });
    } finally {
      setBusy(false);
    }
  };
  const onSaveCardConfig = async () => {
    const cardId = editingCardId ?? state?.currentCardId;
    if (cardId === null || cardId === void 0) return;
    setBusy(true);
    try {
      const res = await englishApi.updateCard(cardId, { topic, mode, mastery, threshold, sessionSize });
      if (res.ok) {
        setState(res.state);
        setEditingCardId(null);
        setMessage({ kind: "ok", text: "\u8BDD\u9898\u5361\u914D\u7F6E\u5DF2\u4FDD\u5B58" });
      } else {
        setMessage({ kind: "error", text: "\u4FDD\u5B58\u5931\u8D25" });
      }
    } catch {
      setMessage({ kind: "error", text: "\u4FDD\u5B58\u5931\u8D25" });
    } finally {
      setBusy(false);
    }
  };
  const onBuiltin = async (id) => {
    setBusy(true);
    setMessage(null);
    try {
      const res = await englishApi.createFromBuiltin(id, mode, mastery, threshold);
      setState(res.state);
      setMessage({ kind: "ok", text: "\u5DF2\u9009\u7528\u5185\u7F6E\u8BCD\u5E93" });
    } catch (error) {
      setMessage({ kind: "error", text: error.message });
    } finally {
      setBusy(false);
    }
  };
  const runGenerate = async (provider, model) => {
    const body = {
      topic: topic.trim(),
      mode,
      mastery,
      threshold,
      nativeLang,
      targetLang
    };
    if (provider !== void 0 && model !== void 0) {
      body.provider = provider;
      body.model = model;
    }
    setBusy(true);
    setMessage(null);
    try {
      const result = await englishApi.generate(body);
      if (result.ok) {
        setState(result.state);
        setMessage({ kind: "ok", text: "\u8BCD\u5E93\u751F\u6210\u6210\u529F\uFF0C\u5DF2\u52A0\u5165\u8BDD\u9898\u5E93" });
      } else {
        setMessage({ kind: "error", text: result.error ?? "\u751F\u6210\u5931\u8D25" });
      }
    } catch {
      setMessage({ kind: "error", text: "\u751F\u6210\u5931\u8D25\uFF1A\u7F51\u7EDC\u6216\u670D\u52A1\u5F02\u5E38" });
    }
    setBusy(false);
  };
  const onGenerate = async () => {
    if (topic.trim() === "") {
      setMessage({ kind: "error", text: "\u8BF7\u5148\u8F93\u5165\u5B66\u4E60\u4E3B\u9898" });
      return;
    }
    try {
      const info = await englishApi.models();
      if (info.hasDefault) {
        await runGenerate();
      } else if (info.providers.length === 0) {
        setMessage({ kind: "error", text: "\u5F53\u524D\u6CA1\u6709\u53EF\u7528\u6A21\u578B\uFF0C\u8BF7\u5148\u5728\u300C\u6A21\u578B\u300D\u8BBE\u7F6E\u91CC\u914D\u7F6E" });
      } else {
        await openPicker(true);
      }
    } catch {
      await openPicker(true);
    }
  };
  const onExport = async () => {
    try {
      const content = await englishApi.exportState();
      const blob = new Blob([content], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "english-data.json";
      a.click();
      URL.revokeObjectURL(url);
      setMessage({ kind: "ok", text: "\u5DF2\u5BFC\u51FA english-data.json" });
    } catch (error) {
      setMessage({ kind: "error", text: error.message });
    }
  };
  const onImport = async (event) => {
    const file = event.target.files?.[0];
    if (file === void 0) return;
    try {
      const content = await file.text();
      const res = await englishApi.importState(content);
      setState(res.state);
      setMessage({ kind: "ok", text: "\u5DF2\u5BFC\u5165\u5B66\u4E60\u6570\u636E" });
    } catch (error) {
      setMessage({ kind: "error", text: error.message });
    } finally {
      event.target.value = "";
    }
  };
  const onReset = () => {
    setShowResetConfirm(true);
  };
  const confirmReset = async () => {
    setShowResetConfirm(false);
    setBusy(true);
    try {
      const res = await englishApi.reset();
      setState(res.state);
      setMessage({ kind: "ok", text: "\u5DF2\u6E05\u7A7A\u5916\u8BED\u5B66\u4E60\u6570\u636E" });
    } catch (error) {
      setMessage({ kind: "error", text: error.message });
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: {
    background: "var(--dsw-alias-bg-layer, #fff)",
    border: "1px solid var(--dsw-alias-border-l2, #ddd)",
    borderRadius: 10,
    padding: "10px 12px",
    marginTop: 8
  }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { style: { ...h3Style, marginTop: 0 }, children: "\u5916\u8BED\u5B66\u4E60" }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: rowStyle2, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: labelStyle, children: "\u5916\u8BED\u5B66\u4E60\u603B\u5F00\u5173" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { style: { display: "flex", alignItems: "center", gap: 6, fontSize: 13 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("input", { type: "checkbox", checked: englishEnabled, onChange: (e) => void onToggleEnglishEnabled(e.target.checked) }),
        "\u542F\u7528\u5916\u8BED\u5B66\u4E60\u5F39\u7A97\uFF08\u6574\u8F6E\u5BF9\u8BDD\u5B8C\u6210\u540E\u5F39\u51FA\u7B54\u9898\u5361\uFF09"
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: rowStyle2, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: labelStyle, children: "\u5F53\u524D\u72B6\u6001" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { style: captionStyle, children: [
        "\u26A1",
        state?.xp ?? 0,
        " XP \xB7 ",
        state?.badge.name ?? "\u9752\u94DC",
        " \xB7 \u{1F525}\u8FDE\u51FB",
        state?.streak ?? 0,
        "\u5929 \xB7 \u2764\uFE0F",
        state?.day.hearts ?? 5
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: rowStyle2, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: subH3Style, children: "\u5B66\u4E60\u4E3B\u9898\u5361" }) }),
    (state?.cards.length ?? 0) === 0 ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: captionStyle, children: "\u8FD8\u6CA1\u6709\u8BDD\u9898\u5361\uFF0C\u8BF7\u5148\u7528\u4E0B\u9762\u6309\u94AE\u9009\u7528\u5185\u7F6E\u8BCD\u5E93\uFF0C\u6216\u8F93\u5165\u4E3B\u9898\u751F\u6210\u3002" }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { display: "flex", flexWrap: "wrap", gap: 10 }, children: (state?.cards ?? []).map((card) => {
      const active = card.id === state?.currentCardId;
      const editing = card.id === editingCardId;
      const percent = card.progress.percent;
      return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
        "div",
        {
          role: "button",
          tabIndex: 0,
          onClick: () => void onSelect(card.id),
          onKeyDown: (e) => {
            if (e.key === "Enter" || e.key === " ") void onSelect(card.id);
          },
          onMouseEnter: () => setHoveredCard(card.id),
          onMouseLeave: () => setHoveredCard(null),
          title: "\u70B9\u51FB\u8BBE\u4E3A\u5F53\u524D\u5B66\u4E60\u8BDD\u9898\u5361",
          style: {
            flex: "0 0 calc(50% - 5px)",
            maxWidth: "calc(50% - 5px)",
            boxSizing: "border-box",
            padding: "10px 12px",
            position: "relative",
            border: "1px solid var(--dsw-alias-border-l2, #ddd)",
            borderRadius: 10,
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            background: active ? "var(--dsw-alias-brand-primary-weak, rgba(0,112,243,0.08))" : editing ? "rgba(0,112,243,0.04)" : "var(--dsw-alias-bg-layer, #fff)",
            cursor: "pointer",
            boxShadow: active ? "0 2px 8px rgba(0,112,243,0.15)" : editing ? "0 2px 8px rgba(0,112,243,0.1)" : hoveredCard === card.id ? "var(--dsw-shadow-lv2, 0 4px 12px rgba(0,0,0,0.12))" : "0 1px 3px rgba(0,0,0,0.06)",
            transform: !active && !editing && hoveredCard === card.id ? "translateY(-1px)" : void 0,
            transition: "box-shadow 120ms ease, border-color 120ms ease, transform 120ms ease"
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: {
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: 1,
                fontWeight: 600,
                fontSize: 14
              }, children: card.topic }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                "button",
                {
                  type: "button",
                  title: "\u7F16\u8F91\u6B64\u8BDD\u9898\u5361\u914D\u7F6E",
                  onClick: (e) => {
                    e.stopPropagation();
                    setEditingCardId(card.id);
                    setTopic(card.topic);
                    setMode(card.mode);
                    setMastery(card.mastery);
                    setThreshold(card.threshold);
                    setSessionSize(card.sessionSize);
                  },
                  onMouseEnter: () => setHoveredEdit(card.id),
                  onMouseLeave: () => setHoveredEdit(null),
                  style: {
                    flex: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 22,
                    height: 22,
                    padding: 0,
                    background: hoveredEdit === card.id ? "var(--dsw-alias-interactive-bg-hover, rgba(0,0,0,0.06))" : "transparent",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                    color: hoveredEdit === card.id ? "var(--dsw-alias-brand-primary, #0070f3)" : "var(--dsw-alias-label-tertiary, #888)"
                  },
                  children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { viewBox: "0 0 24 24", width: "13", height: "13", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }),
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })
                  ] })
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                "button",
                {
                  type: "button",
                  title: "\u67E5\u770B\u8BCD\u5E93\u5185\u5BB9",
                  onClick: (e) => {
                    e.stopPropagation();
                    setViewingCard({ topic: card.topic, items: card.items.map((it) => ({ type: it.type ?? "word", text: it.text, meaning: it.meaning, example: it.example, exampleMeaning: it.exampleMeaning ?? "" })) });
                  },
                  onMouseEnter: () => setHoveredView(card.id),
                  onMouseLeave: () => setHoveredView(null),
                  style: {
                    flex: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 22,
                    height: 22,
                    padding: 0,
                    background: hoveredView === card.id ? "var(--dsw-alias-interactive-bg-hover, rgba(0,0,0,0.06))" : "transparent",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                    color: hoveredView === card.id ? "var(--dsw-alias-brand-primary, #0070f3)" : "var(--dsw-alias-label-tertiary, #888)"
                  },
                  children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { viewBox: "0 0 24 24", width: "13", height: "13", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" }),
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("circle", { cx: "12", cy: "12", r: "3" })
                  ] })
                }
              ),
              !card.locked && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                "button",
                {
                  type: "button",
                  title: "\u5220\u9664\u6B64\u8BDD\u9898\u5361",
                  onClick: (e) => {
                    e.stopPropagation();
                    void onDeleteCard(card.id, card.topic);
                  },
                  onMouseEnter: () => setHoveredDelete(card.id),
                  onMouseLeave: () => setHoveredDelete(null),
                  style: {
                    flex: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 22,
                    height: 22,
                    padding: 0,
                    background: hoveredDelete === card.id ? "var(--dsw-alias-interactive-bg-hover, rgba(0,0,0,0.06))" : "transparent",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                    color: hoveredDelete === card.id ? "var(--dsw-alias-state-error-primary, #c00000)" : "var(--dsw-alias-label-tertiary, #888)"
                  },
                  children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { viewBox: "0 0 24 24", width: "13", height: "13", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M3 6h18" }),
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }),
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" }),
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M10 11v6" }),
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M14 11v6" })
                  ] })
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { style: { fontSize: 12, opacity: 0.75 }, children: [
              card.progress.mastered,
              "/",
              card.progress.total,
              " \u5DF2\u638C\u63E1 \xB7 ",
              percent,
              "%"
            ] })
          ]
        },
        card.id
      );
    }) }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, marginBottom: 4 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { style: { ...subH3Style, visibility: editingCardId !== null ? "hidden" : "visible" }, children: "\u6309\u4E3B\u9898\u751F\u6210\u65B0\u4E3B\u9898\u5361" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: editingCardId !== null ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { type: "button", style: buttonStyle, disabled: busy, onClick: () => void onSaveCardConfig(), children: "\u4FDD\u5B58\u4E3B\u9898\u5361" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { type: "button", style: buttonStyle, disabled: busy, onClick: () => {
              setEditingCardId(null);
              setTopic("");
            }, children: "\u53D6\u6D88\u7F16\u8F91" })
          ] }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { type: "button", style: buttonStyle, disabled: busy, onClick: () => void onGenerate(), children: busy ? "\u751F\u6210\u4E2D\u2026" : "\u751F\u6210\u4E3B\u9898\u5361" }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 6 }, children: [
          editingCardId === null && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "flex", gap: 8, marginTop: 6 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { flex: "0 0 48%", display: "flex", alignItems: "center", gap: 8 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: labelStyle, children: "\u6BCD\u8BED" }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("select", { style: { ...inputStyle2, minWidth: 0, flex: 1 }, value: nativeLang, onChange: (e) => setNativeLang(e.target.value), children: LANGUAGES.map((l) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: l.id, children: l.label }, l.id)) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { flex: "0 0 48%", display: "flex", alignItems: "center", gap: 8 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: labelStyle, children: "\u5916\u8BED" }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("select", { style: { ...inputStyle2, minWidth: 0, flex: 1 }, value: targetLang, onChange: (e) => setTargetLang(e.target.value), children: LANGUAGES.map((l) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: l.id, children: l.label }, l.id)) })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "flex", gap: 8, marginTop: 6 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { flex: "0 0 48%", display: "flex", alignItems: "center", gap: 8 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: labelStyle, children: "\u4E3B\u9898" }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("input", { style: { ...inputStyle2, minWidth: 0, flex: 1 }, value: topic, onChange: (e) => setTopic(e.target.value), disabled: editingCardId !== null, placeholder: "\u4F8B\u5982\uFF1A\u4EBA\u5DE5\u667A\u80FD" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { flex: "0 0 48%", display: "flex", alignItems: "center", gap: 8 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: labelStyle, children: "\u6A21\u5F0F" }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("select", { style: { ...inputStyle2, minWidth: 0, flex: 1 }, value: mode, onChange: (e) => setMode(e.target.value), children: MODES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: m.id, children: m.label }, m.id)) })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "flex", gap: 8 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { flex: "0 0 48%", display: "flex", alignItems: "center", gap: 8 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: labelStyle, children: "\u638C\u63E1\u89C4\u5219" }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("select", { style: { ...inputStyle2, minWidth: 0, flex: 1 }, value: mastery, onChange: (e) => setMastery(e.target.value), children: MASTERY.map((m) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: m.id, children: m.label }, m.id)) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { flex: "0 0 48%", display: "flex", alignItems: "center", gap: 8 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: labelStyle, children: "\u7B54\u5BF9\u6570" }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("input", { type: "number", min: 1, max: 20, style: { ...inputStyle2, minWidth: 0, flex: 1 }, value: threshold, onChange: (e) => setThreshold(Number(e.target.value)) })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { display: "flex", gap: 8 }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { flex: "0 0 48%", display: "flex", alignItems: "center", gap: 8 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: labelStyle, children: "\u6BCF\u6B21\u7B54\u9898\u6570" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("input", { type: "number", min: 1, max: 50, style: { ...inputStyle2, minWidth: 0, flex: 1 }, value: sessionSize, onChange: (e) => setSessionSize(Number(e.target.value)) })
          ] }) })
        ] }),
        editingCardId === null && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: rowStyle2, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: labelStyle, children: "\u751F\u6210\u6A21\u578B" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: captionStyle, children: defaultLabel }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { type: "button", style: buttonStyle, disabled: busy, onClick: () => void openPicker(false), children: "\u9009\u62E9 / \u66F4\u6362\u6A21\u578B" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { style: { ...subH3Style, marginBottom: 6 }, children: "\u6DFB\u52A0\u5185\u7F6E\u8BCD\u5E93\uFF08CEFR \u5206\u7EA7\uFF09\u4E3A\u4E3B\u9898\u5361" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 }, children: builtins.map((b) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("button", { type: "button", style: buttonStyle, onClick: () => void onBuiltin(b.id), children: [
          b.label,
          "\uFF08",
          b.count,
          "\u8BCD\uFF09"
        ] }, b.id)) })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { style: { ...subH3Style, marginTop: 6 }, children: "\u6570\u636E\u7BA1\u7406" }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: rowStyle2, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { type: "button", style: buttonStyle, onClick: () => void onExport(), children: "\u5BFC\u51FA JSON" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { type: "button", style: buttonStyle, onClick: () => fileRef.current?.click(), children: "\u5BFC\u5165 JSON" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { type: "button", style: buttonStyle, onClick: () => void onReset(), children: "\u6E05\u7A7A\u6570\u636E" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("input", { ref: fileRef, type: "file", accept: "application/json,.json", style: { display: "none" }, onChange: (e) => void onImport(e) })
    ] }),
    message !== null && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: message.kind === "ok" ? okStyle : errorStyle, children: message.text }),
    showPicker && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: {
      position: "fixed",
      inset: 0,
      zIndex: 2147483647,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(0,0,0,0.45)"
    }, onClick: pickerCancel, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
      "div",
      {
        style: {
          width: 460,
          maxWidth: "92vw",
          borderRadius: 14,
          padding: 20,
          background: "var(--dsw-alias-bg-layer, #fff)",
          color: "var(--dsw-alias-text-primary, #111)",
          boxShadow: "0 18px 60px rgba(0,0,0,0.35)"
        },
        onClick: (e) => e.stopPropagation(),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { style: { fontSize: 15, margin: "0 0 12px" }, children: "\u9009\u62E9\u751F\u6210\u6A21\u578B" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: rowStyle2, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: labelStyle, children: "\u63D0\u4F9B\u5546" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("select", { style: { ...inputStyle2, flex: 1 }, value: pickProvider, onChange: (e) => onPickProviderChange(e.target.value), children: [
              pickProviders.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "", children: "\uFF08\u65E0\u53EF\u7528\u63D0\u4F9B\u5546\uFF09" }),
              pickProviders.map((p) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: p.provider, children: p.providerName }, p.provider))
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: rowStyle2, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: labelStyle, children: "\u6A21\u578B" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("select", { style: { ...inputStyle2, flex: 1 }, value: pickModel, onChange: (e) => setPickModel(e.target.value), children: [
              (pickProviders.find((p) => p.provider === pickProvider)?.models.length ?? 0) === 0 && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "", children: "\uFF08\u8BE5\u63D0\u4F9B\u5546\u65E0\u6A21\u578B\uFF09" }),
              (pickProviders.find((p) => p.provider === pickProvider)?.models ?? []).map((m) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: m.id, children: m.name }, m.id))
            ] })
          ] }),
          pickMessage !== null && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: pickMessage.kind === "ok" ? okStyle : errorStyle, children: pickMessage.text }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { ...rowStyle2, justifyContent: "flex-end", marginTop: 12 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { type: "button", style: buttonStyle, onClick: pickerCancel, children: "\u53D6\u6D88" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { type: "button", style: { ...buttonStyle, borderColor: "var(--dsw-alias-brand-primary, #0070f3)", color: "var(--dsw-alias-brand-primary, #0070f3)" }, disabled: busy, onClick: () => void pickerConfirm(), children: pendingGenerate ? "\u4FDD\u5B58\u5E76\u751F\u6210" : "\u4FDD\u5B58" })
          ] })
        ]
      }
    ) }),
    confirmDelete !== null && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      "div",
      {
        style: { position: "fixed", inset: 0, zIndex: 1300, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--dsw-alias-bg-mask-1, rgba(0,0,0,0.45))" },
        onMouseDown: (e) => {
          if (e.target === e.currentTarget) setConfirmDelete(null);
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: {
          display: "flex",
          flexDirection: "column",
          gap: 12,
          width: "min(400px, calc(100vw - 48px))",
          padding: 18,
          background: "var(--dsw-alias-bg-base, #fff)",
          border: "1px solid var(--dsw-alias-border-l2, #ddd)",
          borderRadius: 14,
          boxShadow: "var(--dsw-shadow-lv3, 0 18px 60px rgba(0,0,0,0.35))",
          color: "var(--dsw-alias-text-primary, #111)"
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { style: { margin: 0, fontSize: 15, fontWeight: 700 }, children: "\u5220\u9664\u8BDD\u9898\u5361" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("p", { style: { margin: 0, fontSize: 13, lineHeight: 1.5, color: "var(--dsw-alias-label-secondary, #666)" }, children: [
            "\u786E\u5B9A\u8981\u5220\u9664\u8BDD\u9898\u5361\u300C",
            confirmDelete.topic,
            "\u300D\u5417\uFF1F\u6B64\u64CD\u4F5C\u4E0D\u53EF\u64A4\u9500\u3002"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("footer", { style: { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 4 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { type: "button", style: { padding: "5px 12px", fontSize: 12, color: "var(--dsw-alias-text-primary, #111)", background: "transparent", border: "1px solid var(--dsw-alias-border-l2, #ccc)", borderRadius: 8, cursor: "pointer" }, onClick: () => setConfirmDelete(null), children: "\u53D6\u6D88" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { type: "button", style: { padding: "6px 14px", fontSize: 13, fontWeight: 600, color: "#fff", background: "var(--dsw-alias-state-error-primary, #c00000)", border: "none", borderRadius: 8, cursor: "pointer" }, onClick: () => void confirmDeleteCard(), children: "\u5220\u9664" })
          ] })
        ] })
      }
    ),
    viewingCard !== null && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      "div",
      {
        style: { position: "fixed", inset: 0, zIndex: 1300, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--dsw-alias-bg-mask-1, rgba(0,0,0,0.45))" },
        onMouseDown: (e) => {
          if (e.target === e.currentTarget) setViewingCard(null);
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: {
          display: "flex",
          flexDirection: "column",
          gap: 0,
          width: "min(520px, calc(100vw - 48px))",
          maxHeight: "calc(100vh - 280px)",
          background: "var(--dsw-alias-bg-base, #fff)",
          border: "1px solid var(--dsw-alias-border-l2, #ddd)",
          borderRadius: 14,
          boxShadow: "var(--dsw-shadow-lv3, 0 18px 60px rgba(0,0,0,0.35))",
          color: "var(--dsw-alias-text-primary, #111)",
          overflow: "hidden"
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid var(--dsw-alias-border-l2, #eee)" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { style: { margin: 0, fontSize: 15, fontWeight: 700 }, children: viewingCard.topic }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { type: "button", style: { background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--dsw-alias-label-tertiary, #888)", fontSize: 18, lineHeight: 1 }, onClick: () => setViewingCard(null), children: "\u2715" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { flex: 1, overflowY: "auto", padding: "8px 0" }, children: viewingCard.items.map((it, idx) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { padding: "8px 18px", borderBottom: idx < viewingCard.items.length - 1 ? "1px solid var(--dsw-alias-border-l2, #f0f0f0)" : "none" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "flex", alignItems: "baseline", gap: 8 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: {
                flex: "none",
                fontSize: 10,
                fontWeight: 600,
                padding: "1px 5px",
                borderRadius: 4,
                background: it.type === "sentence" ? "rgba(0,112,243,0.1)" : "rgba(0,0,0,0.05)",
                color: it.type === "sentence" ? "var(--dsw-alias-brand-primary, #0070f3)" : "var(--dsw-alias-label-secondary, #666)"
              }, children: it.type === "sentence" ? "\u53E5\u5B50" : "\u5355\u8BCD" }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { style: { fontSize: 14 }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { fontWeight: 600 }, children: it.text }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { style: { color: "var(--dsw-alias-label-secondary, #666)" }, children: [
                  " \uFF5C ",
                  it.meaning
                ] })
              ] })
            ] }),
            it.example !== "" && it.type !== "sentence" && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { fontSize: 12, color: "var(--dsw-alias-label-tertiary, #999)", marginTop: 2, fontStyle: "italic", paddingLeft: 30 }, children: it.example }),
              it.exampleMeaning !== "" && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { fontSize: 12, color: "var(--dsw-alias-label-tertiary, #999)", marginTop: 1, paddingLeft: 30 }, children: it.exampleMeaning })
            ] })
          ] }, idx)) }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { padding: "10px 18px", borderTop: "1px solid var(--dsw-alias-border-l2, #eee)", textAlign: "right" }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { type: "button", style: { padding: "5px 14px", fontSize: 12, color: "var(--dsw-alias-text-primary, #111)", background: "transparent", border: "1px solid var(--dsw-alias-border-l2, #ccc)", borderRadius: 8, cursor: "pointer" }, onClick: () => setViewingCard(null), children: "\u5173\u95ED" }) })
        ] })
      }
    ),
    showResetConfirm && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      "div",
      {
        style: { position: "fixed", inset: 0, zIndex: 1300, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--dsw-alias-bg-mask-1, rgba(0,0,0,0.45))" },
        onMouseDown: (e) => {
          if (e.target === e.currentTarget) setShowResetConfirm(false);
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: {
          display: "flex",
          flexDirection: "column",
          gap: 12,
          width: "min(400px, calc(100vw - 48px))",
          padding: 18,
          background: "var(--dsw-alias-bg-base, #fff)",
          border: "1px solid var(--dsw-alias-border-l2, #ddd)",
          borderRadius: 14,
          boxShadow: "var(--dsw-shadow-lv3, 0 18px 60px rgba(0,0,0,0.35))",
          color: "var(--dsw-alias-text-primary, #111)"
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { style: { margin: 0, fontSize: 15, fontWeight: 700 }, children: "\u6E05\u7A7A\u6570\u636E" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: { margin: 0, fontSize: 13, lineHeight: 1.5, color: "var(--dsw-alias-label-secondary, #666)" }, children: "\u786E\u5B9A\u8981\u6E05\u7A7A\u5168\u90E8\u5916\u8BED\u5B66\u4E60\u6570\u636E\u5417\uFF1F\u6B64\u64CD\u4F5C\u4E0D\u53EF\u6062\u590D\uFF0C\u6240\u6709\u8BDD\u9898\u5361\u3001\u5B66\u4E60\u8FDB\u5EA6\u548C\u7ECF\u9A8C\u503C\u90FD\u5C06\u88AB\u5220\u9664\u3002" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("footer", { style: { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 4 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { type: "button", style: { padding: "5px 12px", fontSize: 12, color: "var(--dsw-alias-text-primary, #111)", background: "transparent", border: "1px solid var(--dsw-alias-border-l2, #ccc)", borderRadius: 8, cursor: "pointer" }, onClick: () => setShowResetConfirm(false), children: "\u53D6\u6D88" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { type: "button", style: { padding: "6px 14px", fontSize: 13, fontWeight: 600, color: "#fff", background: "var(--dsw-alias-state-error-primary, #c00000)", border: "none", borderRadius: 8, cursor: "pointer" }, onClick: () => void confirmReset(), children: "\u6E05\u7A7A" })
          ] })
        ] })
      }
    )
  ] });
}

// src/client/open-prefs.ts
var TERMINAL_OPTIONS = [
  { id: "terminal-default", label: "\u7CFB\u7EDF\u9ED8\u8BA4" },
  { id: "terminal-iterm", label: "iTerm", platforms: ["darwin"] },
  { id: "terminal-wterm", label: "Windows Terminal", platforms: ["win32"] },
  { id: "terminal-gnome", label: "GNOME \u7EC8\u7AEF", platforms: ["linux"] },
  { id: "terminal-konsole", label: "Konsole", platforms: ["linux"] },
  { id: "terminal-xfce", label: "XFCE \u7EC8\u7AEF", platforms: ["linux"] }
];
var EDITOR_OPTIONS = [
  { id: "editor-default", label: "VS Code\uFF08code\uFF09" },
  { id: "editor-insiders", label: "VS Code Insiders\uFF08code-insiders\uFF09" },
  { id: "editor-cursor", label: "Cursor\uFF08cursor\uFF09" },
  { id: "editor-codebuddy", label: "CodeBuddy\uFF08buddy\uFF09" },
  { id: "editor-codebuddycn", label: "CodeBuddyCN\uFF08buddycn\uFF09" },
  { id: "editor-catpaw", label: "CatPaw\uFF08catpaw\uFF09" },
  { id: "editor-catpawai", label: "CatPawAI\uFF08catpawai\uFF09" },
  { id: "editor-trae", label: "Trae\uFF08trae\uFF09" },
  { id: "editor-traecn", label: "TraeCN\uFF08trae-cn\uFF09" },
  { id: "editor-qoder", label: "Qoder\uFF08qoder\uFF09" },
  { id: "editor-qodercn", label: "QoderCN\uFF08qoder-cn\uFF09" }
];
function normalizeTerminalId(id) {
  return typeof id === "string" && id !== "" ? id : "terminal-default";
}
function normalizeEditorId(id) {
  return typeof id === "string" && id !== "" ? id : "editor-default";
}
function currentPlatform() {
  const ua = navigator.userAgent;
  if (/Macintosh|Mac OS X/iu.test(ua)) return "darwin";
  if (/Windows/iu.test(ua)) return "win32";
  return "linux";
}
function terminalOptionsFor(platform) {
  return TERMINAL_OPTIONS.filter((option) => {
    if (option.id === "terminal-default") return true;
    return (option.platforms ?? []).includes(platform);
  });
}
function terminalLabel(id) {
  switch (id) {
    case "terminal-iterm":
      return "iTerm";
    case "terminal-wterm":
      return "Windows Terminal";
    case "terminal-gnome":
      return "GNOME \u7EC8\u7AEF";
    case "terminal-konsole":
      return "Konsole";
    case "terminal-xfce":
      return "XFCE \u7EC8\u7AEF";
    default:
      return "\u9ED8\u8BA4\u7EC8\u7AEF";
  }
}
function editorLabel(id) {
  switch (id) {
    case "editor-insiders":
      return "VS Code Insiders";
    case "editor-cursor":
      return "Cursor";
    case "editor-codebuddy":
      return "CodeBuddy";
    case "editor-codebuddycn":
      return "CodeBuddyCN";
    case "editor-catpaw":
      return "CatPaw";
    case "editor-catpawai":
      return "CatPawAI";
    case "editor-trae":
      return "Trae";
    case "editor-traecn":
      return "TraeCN";
    case "editor-qoder":
      return "Qoder";
    case "editor-qodercn":
      return "QoderCN";
    default:
      return "VSCode";
  }
}
function wrapAppName(name) {
  return name === "\u9ED8\u8BA4\u7EC8\u7AEF" ? name : ` ${name} `;
}
function openMenuLabels(prefs) {
  return [
    { kind: "finder", label: "\u5728 Finder \u4E2D\u6253\u5F00" },
    // 终端：应用名（如「在 iTerm 中打开」）；系统默认 → 「终端」
    { kind: "terminal", label: `\u5728${wrapAppName(terminalLabel(prefs.terminal ?? ""))}\u4E2D\u6253\u5F00` },
    // 编辑器：应用名（「在 Cursor 中打开」等）
    { kind: "vscode", label: `\u5728${wrapAppName(editorLabel(prefs.editor ?? ""))}\u4E2D\u6253\u5F00` }
  ];
}
var EXTRA_OPEN_KINDS = [
  "xcode",
  "android-studio",
  "deveco-studio",
  "wechat-devtools",
  "webstorm",
  "intellij-idea",
  "pycharm",
  "goland"
];
function extraOpenLabel(kind) {
  switch (kind) {
    case "android-studio":
      return "Android Studio";
    case "xcode":
      return "Xcode";
    case "wechat-devtools":
      return "\u5FAE\u4FE1\u5F00\u53D1\u8005\u5DE5\u5177";
    case "intellij-idea":
      return "IntelliJ IDEA";
    case "deveco-studio":
      return "DevEco Studio";
    case "webstorm":
      return "WebStorm";
    case "pycharm":
      return "PyCharm";
    case "goland":
      return "GoLand";
    default:
      return kind;
  }
}
function extraSettingKey(kind) {
  switch (kind) {
    case "android-studio":
      return "androidStudio";
    case "xcode":
      return "xcode";
    case "wechat-devtools":
      return "wechatDevtools";
    case "intellij-idea":
      return "intellijIdea";
    case "deveco-studio":
      return "devecoStudio";
    case "webstorm":
      return "webstorm";
    case "pycharm":
      return "pycharm";
    case "goland":
      return "goland";
    default:
      return kind;
  }
}
function extraOpenMenuItems(openExtra) {
  const items = [];
  for (const kind of EXTRA_OPEN_KINDS) {
    const key = extraSettingKey(kind);
    const on = openExtra[key] ?? true;
    if (!on) continue;
    const spaced = kind === "wechat-devtools";
    items.push({ kind, label: spaced ? `\u5728${extraOpenLabel(kind)}\u4E2D\u6253\u5F00` : `\u5728 ${extraOpenLabel(kind)} \u4E2D\u6253\u5F00` });
  }
  return items;
}

// src/client/SettingsSection.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
var rowStyle3 = { display: "flex", alignItems: "center", gap: 12, padding: "8px 0" };
var labelStyle2 = { minWidth: 72, fontWeight: 400, fontSize: 14 };
var captionStyle2 = { fontSize: 12, color: "var(--dsw-alias-label-tertiary, #888)" };
var buttonStyle2 = {
  padding: "4px 12px",
  borderRadius: 8,
  border: "1px solid var(--dsw-alias-border-l2, #ccc)",
  background: "transparent",
  cursor: "pointer",
  fontSize: 13
};
var inputStyle3 = {
  padding: "4px 8px",
  borderRadius: 8,
  border: "1px solid var(--dsw-alias-border-l2, #ccc)",
  fontSize: 13,
  minWidth: 220
};
var narrowInputStyle = { ...inputStyle3, minWidth: 160 };
var errorStyle2 = { color: "var(--dsw-alias-state-error-primary, #c00000)", fontSize: 13 };
var okStyle2 = { color: "var(--dsw-alias-state-success-primary, #2e8e52)", fontSize: 13 };
var AUTO_SAVE_DELAY_MS = 500;
function SettingsSection({ load, save, saveConfetti, uploadAvatar, resetAvatar, saveOpenPrefs, saveExtraOpen }) {
  const fileRef = (0, import_react6.useRef)(null);
  const [avatarPath, setAvatarPath] = (0, import_react6.useState)("");
  const [text, setText] = (0, import_react6.useState)("");
  const [show, setShow] = (0, import_react6.useState)(true);
  const [sound, setSound] = (0, import_react6.useState)(true);
  const [confettiShow, setConfettiShow] = (0, import_react6.useState)(true);
  const [revision, setRevision] = (0, import_react6.useState)(0);
  const [busy, setBusy] = (0, import_react6.useState)(false);
  const [terminal, setTerminal] = (0, import_react6.useState)("");
  const [editor, setEditor] = (0, import_react6.useState)("");
  const [openExtra, setOpenExtra] = (0, import_react6.useState)({});
  const [message, setMessage] = (0, import_react6.useState)(null);
  const callbacks = (0, import_react6.useRef)({ load, save, saveConfetti, uploadAvatar, resetAvatar, saveOpenPrefs, saveExtraOpen });
  callbacks.current = { load, save, saveConfetti, uploadAvatar, resetAvatar, saveOpenPrefs, saveExtraOpen };
  const savedTextRef = (0, import_react6.useRef)("");
  const latestTextRef = (0, import_react6.useRef)("");
  const saveTimerRef = (0, import_react6.useRef)(void 0);
  const flashTimerRef = (0, import_react6.useRef)(void 0);
  (0, import_react6.useEffect)(() => {
    callbacks.current.load().then((state) => {
      const nextText = typeof state.text === "string" ? state.text : "";
      setAvatarPath(typeof state.avatarPath === "string" ? state.avatarPath : "");
      setText(nextText);
      savedTextRef.current = nextText;
      latestTextRef.current = nextText;
      setShow(typeof state.show === "boolean" ? state.show : true);
      setSound(typeof state.sound === "boolean" ? state.sound : true);
      setTerminal(normalizeTerminalId(typeof state.terminal === "string" ? state.terminal : ""));
      setEditor(normalizeEditorId(typeof state.editor === "string" ? state.editor : ""));
      setOpenExtra(state.openExtra ?? {});
    }, () => {
      setMessage({ kind: "error", text: "\u8BFB\u53D6\u5DE5\u4F5C\u53F0\u8BBE\u7F6E\u5931\u8D25" });
    });
  }, []);
  (0, import_react6.useEffect)(() => {
    return () => {
      if (saveTimerRef.current !== void 0) window.clearTimeout(saveTimerRef.current);
      if (flashTimerRef.current !== void 0) window.clearTimeout(flashTimerRef.current);
      const pending = latestTextRef.current;
      if (pending !== savedTextRef.current) {
        void callbacks.current.save({ text: pending }).catch(() => {
        });
      }
    };
  }, []);
  const onPick = async (event) => {
    const file = event.target.files?.[0];
    if (file === void 0) return;
    setBusy(true);
    setMessage(null);
    try {
      const { avatarPath: next } = await callbacks.current.uploadAvatar(file);
      setAvatarPath(next);
      setRevision((value) => value + 1);
      setMessage({ kind: "ok", text: "\u5934\u50CF\u5DF2\u66F4\u65B0" });
    } catch (error) {
      setMessage({ kind: "error", text: error.message });
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  };
  const onReset = async () => {
    setBusy(true);
    setMessage(null);
    try {
      await callbacks.current.resetAvatar();
      setAvatarPath("");
      setRevision((value) => value + 1);
      setMessage({ kind: "ok", text: "\u5DF2\u6062\u590D\u9ED8\u8BA4\u5934\u50CF" });
    } catch (error) {
      setMessage({ kind: "error", text: error.message });
    } finally {
      setBusy(false);
    }
  };
  const autosaveText = async () => {
    const value = latestTextRef.current;
    if (value === savedTextRef.current) return;
    setMessage(null);
    try {
      await callbacks.current.save({ text: value });
      savedTextRef.current = value;
      setMessage({ kind: "ok", text: "\u95EE\u5019\u8BED\u5DF2\u81EA\u52A8\u4FDD\u5B58" });
      if (flashTimerRef.current !== void 0) window.clearTimeout(flashTimerRef.current);
      flashTimerRef.current = window.setTimeout(() => {
        setMessage((current) => current?.text === "\u95EE\u5019\u8BED\u5DF2\u81EA\u52A8\u4FDD\u5B58" ? null : current);
      }, 1800);
    } catch (error) {
      setMessage({ kind: "error", text: error.message });
    }
  };
  const onTextChange = (event) => {
    const next = event.target.value;
    latestTextRef.current = next;
    setText(next);
    if (saveTimerRef.current !== void 0) window.clearTimeout(saveTimerRef.current);
    saveTimerRef.current = window.setTimeout(() => {
      saveTimerRef.current = void 0;
      void autosaveText();
    }, AUTO_SAVE_DELAY_MS);
  };
  const onTextBlur = () => {
    if (saveTimerRef.current !== void 0) {
      window.clearTimeout(saveTimerRef.current);
      saveTimerRef.current = void 0;
      void autosaveText();
    }
  };
  const onToggleShow = async (next) => {
    setShow(next);
    setBusy(true);
    setMessage(null);
    try {
      await callbacks.current.save({ show: next });
      setMessage({ kind: "ok", text: next ? "\u6A2A\u5E45\u5DF2\u663E\u793A" : "\u6A2A\u5E45\u5DF2\u9690\u85CF" });
    } catch (error) {
      setShow(!next);
      setMessage({ kind: "error", text: error.message });
    } finally {
      setBusy(false);
    }
  };
  const onToggleSound = async (next) => {
    setSound(next);
    setBusy(true);
    setMessage(null);
    try {
      await callbacks.current.saveConfetti({ sound: next });
      setMessage({ kind: "ok", text: next ? "\u5F69\u5E26\u97F3\u6548\u5DF2\u6253\u5F00" : "\u5F69\u5E26\u97F3\u6548\u5DF2\u5173\u95ED" });
    } catch (error) {
      setSound(!next);
      setMessage({ kind: "error", text: error.message });
    } finally {
      setBusy(false);
    }
  };
  const onToggleConfettiShow = async (next) => {
    setConfettiShow(next);
    setBusy(true);
    setMessage(null);
    try {
      await callbacks.current.saveConfetti({ show: next });
      setMessage({ kind: "ok", text: next ? "\u5F69\u5E26\u5DF2\u542F\u7528" : "\u5F69\u5E26\u5DF2\u5173\u95ED" });
    } catch (error) {
      setConfettiShow(!next);
      setMessage({ kind: "error", text: error.message });
    } finally {
      setBusy(false);
    }
  };
  const onPreviewSound = () => {
    setMessage(null);
    playConfettiSound();
  };
  const onTerminalChange = async (next) => {
    const previous = terminal;
    setTerminal(next);
    setBusy(true);
    setMessage(null);
    try {
      await callbacks.current.saveOpenPrefs({ terminal: next });
      setMessage({ kind: "ok", text: "\u7EC8\u7AEF\u504F\u597D\u5DF2\u4FDD\u5B58" });
    } catch (error) {
      setTerminal(previous);
      setMessage({ kind: "error", text: error.message });
    } finally {
      setBusy(false);
    }
  };
  const onEditorChange = async (next) => {
    const previous = editor;
    setEditor(next);
    setBusy(true);
    setMessage(null);
    try {
      await callbacks.current.saveOpenPrefs({ editor: next });
      setMessage({ kind: "ok", text: "\u7F16\u8F91\u5668\u504F\u597D\u5DF2\u4FDD\u5B58" });
    } catch (error) {
      setEditor(previous);
      setMessage({ kind: "error", text: error.message });
    } finally {
      setBusy(false);
    }
  };
  const onExtraToggle = async (key, checked) => {
    const previous = openExtra;
    const next = { ...openExtra, [key]: checked };
    setOpenExtra(next);
    setBusy(true);
    setMessage(null);
    try {
      await callbacks.current.saveExtraOpen({ [key]: checked });
      setMessage({ kind: "ok", text: "\u5DF2\u66F4\u65B0\u6253\u5F00\u65B9\u5F0F" });
    } catch (error) {
      setOpenExtra(previous);
      setMessage({ kind: "error", text: error.message });
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 4 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: {
      background: "var(--dsw-alias-bg-layer, #fff)",
      border: "1px solid var(--dsw-alias-border-l2, #ddd)",
      borderRadius: 10,
      padding: "10px 12px",
      marginTop: 8
    }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h3", { style: { fontSize: 15, margin: "0 0 8px" }, children: "\u5DE5\u4F5C\u53F0\u6A2A\u5E45" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: rowStyle3, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: labelStyle2, children: "\u6A2A\u5E45\u603B\u5F00\u5173" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { style: { display: "flex", alignItems: "center", gap: 6, fontSize: 13 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { type: "checkbox", checked: show, disabled: busy, onChange: (event) => onToggleShow(event.target.checked) }),
          "\u5728\u7A7A\u6001\u9876\u90E8\u663E\u793A\u6A2A\u5E45"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: rowStyle3, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: labelStyle2, children: "\u5934\u50CF" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "img",
          {
            src: `/bga-dsh-workbench/avatar?t=${revision}`,
            alt: "",
            width: 44,
            height: 44,
            style: { borderRadius: "50%", objectFit: "cover" }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { type: "button", style: buttonStyle2, disabled: busy, onClick: () => fileRef.current?.click(), children: "\u66F4\u6362\u56FE\u7247" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "input",
          {
            ref: fileRef,
            type: "file",
            accept: "image/png,image/jpeg,image/gif,image/webp",
            style: { display: "none" },
            onChange: onPick
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { type: "button", style: buttonStyle2, disabled: busy, onClick: onReset, children: "\u6062\u590D\u9ED8\u8BA4" })
      ] }),
      avatarPath.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: { ...rowStyle3, paddingTop: 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: captionStyle2, children: avatarPath }) }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: rowStyle3, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: labelStyle2, children: "\u95EE\u5019\u8BED" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "input",
          {
            style: inputStyle3,
            value: text,
            onChange: onTextChange,
            onBlur: onTextBlur
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: captionStyle2, children: "\u8F93\u5165\u540E\u81EA\u52A8\u4FDD\u5B58" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: {
      background: "var(--dsw-alias-bg-layer, #fff)",
      border: "1px solid var(--dsw-alias-border-l2, #ddd)",
      borderRadius: 10,
      padding: "10px 12px",
      marginTop: 8
    }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h3", { style: { fontSize: 15, margin: "0 0 8px" }, children: "\u5F69\u5E26\u914D\u7F6E" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: rowStyle3, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: labelStyle2, children: "\u5F69\u5E26\u603B\u5F00\u5173" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { style: { display: "flex", alignItems: "center", gap: 6, fontSize: 13 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { type: "checkbox", checked: confettiShow, disabled: busy, onChange: (event) => onToggleConfettiShow(event.target.checked) }),
          "\u542F\u7528\u5F69\u5E26\u7279\u6548\uFF08\u5173\u95ED\u540E\u4E0D\u64AD\u653E\u7279\u6548\u4E0E\u97F3\u6548\uFF09"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: rowStyle3, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: labelStyle2, children: "\u5F69\u5E26\u97F3\u6548" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { style: { display: "flex", alignItems: "center", gap: 6, fontSize: 13 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { type: "checkbox", checked: sound, disabled: busy, onChange: (event) => onToggleSound(event.target.checked) }),
          "\u6574\u8F6E\u5B8C\u6210\u65F6\u64AD\u653E\u5E86\u795D\u97F3\u6548"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { type: "button", style: buttonStyle2, disabled: busy, onClick: onPreviewSound, children: "\u8BD5\u542C" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(EnglishSettings, {}),
    message !== null && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: message.kind === "ok" ? okStyle2 : errorStyle2, children: message.text }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: {
      background: "var(--dsw-alias-bg-layer, #fff)",
      border: "1px solid var(--dsw-alias-border-l2, #ddd)",
      borderRadius: 10,
      padding: "10px 12px",
      marginTop: 8
    }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h3", { style: { fontSize: 15, margin: "0 0 8px" }, children: "\u5DE5\u4F5C\u533A\u6253\u5F00\u65B9\u5F0F" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: rowStyle3, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: labelStyle2, children: "\u9ED8\u8BA4\u7EC8\u7AEF" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "select",
          {
            style: narrowInputStyle,
            value: terminal,
            disabled: busy,
            onChange: (event) => void onTerminalChange(event.target.value),
            children: terminalOptionsFor(currentPlatform()).map((option) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: option.id, children: option.label }, option.id))
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: captionStyle2, children: "\u6253\u5F00\u76EE\u5F55\u65F6\u4F7F\u7528\u7684\u7EC8\u7AEF\uFF08\u4EC5\u663E\u793A\u5F53\u524D\u5E73\u53F0\u53EF\u7528\u9879\uFF09" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: rowStyle3, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: labelStyle2, children: "\u9ED8\u8BA4\u7F16\u8F91\u5668" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "select",
          {
            style: inputStyle3,
            value: editor,
            disabled: busy,
            onChange: (event) => void onEditorChange(event.target.value),
            children: EDITOR_OPTIONS.map((option) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: option.id, children: option.label }, option.id))
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: captionStyle2, children: "\u6253\u5F00\u76EE\u5F55\u65F6\u4F7F\u7528\u7684\u7F16\u8F91\u5668" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8, margin: "12px 0 0" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h3", { style: { fontSize: 13, margin: 0, fontWeight: 600 }, children: "\u9644\u52A0\u6253\u5F00\u65B9\u5F0F" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: captionStyle2, children: "\u52FE\u9009\u540E\u5C55\u793A\u5728\u5DE5\u4F5C\u533A\u83DC\u5355\u5C3E\u90E8\uFF08\u9ED8\u8BA4\u5168\u5F00\uFF09" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: { display: "flex", flexWrap: "wrap", gap: 12, marginTop: 8 }, children: EXTRA_OPEN_KINDS.map((kind, _index) => {
        const key = extraSettingKey(kind);
        const checked = openExtra[key] ?? true;
        return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
          "label",
          {
            style: {
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              whiteSpace: "nowrap"
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                "input",
                {
                  type: "checkbox",
                  checked,
                  disabled: busy,
                  onChange: (event) => void onExtraToggle(key, event.target.checked)
                }
              ),
              extraOpenLabel(kind)
            ]
          },
          kind
        );
      }) })
    ] })
  ] });
}

// src/core/tasks.ts
var ARCHIVABLE_STATUSES = ["done", "failed"];
var TASK_PERMISSIONS = ["read-only", "workspace-write", "danger-full-access"];
function isTaskPermission(value) {
  return typeof value === "string" && TASK_PERMISSIONS.includes(value);
}
var COLUMNS = [
  { status: "backlog", label: "\u5F85\u89C4\u5212" },
  { status: "todo", label: "\u5F85\u529E" },
  { status: "running", label: "\u8FDB\u884C\u4E2D" },
  { status: "done", label: "\u5DF2\u5B8C\u6210" },
  { status: "failed", label: "\u5DF2\u5931\u8D25" }
];
var MANUAL_STATUSES = ["backlog", "todo"];
function normalizeTargetId(value) {
  const trimmed = value?.trim();
  return trimmed === void 0 || trimmed === "" ? void 0 : trimmed;
}
function createTask(input, now, id) {
  return {
    id,
    title: input.title.trim(),
    description: input.description.trim(),
    prompt: input.prompt.trim(),
    status: "todo",
    createdAt: now,
    updatedAt: now,
    executions: [],
    workspaceId: normalizeTargetId(input.workspaceId),
    mode: normalizeTargetId(input.mode),
    permission: isTaskPermission(input.permission) ? input.permission : void 0
  };
}
function withStatus(task, status, now) {
  return { ...task, status, updatedAt: now };
}
function withSchedule(task, patch, now) {
  const current = task.schedule;
  const schedule = {
    enabled: current?.enabled ?? false,
    cron: current?.cron ?? "",
    nextRunAt: current?.nextRunAt,
    lastTriggeredAt: current?.lastTriggeredAt
  };
  if ("enabled" in patch) schedule.enabled = patch.enabled ?? false;
  if ("cron" in patch) schedule.cron = patch.cron ?? "";
  if ("nextRunAt" in patch) schedule.nextRunAt = patch.nextRunAt;
  if ("lastTriggeredAt" in patch) schedule.lastTriggeredAt = patch.lastTriggeredAt;
  return { ...task, updatedAt: now, schedule };
}
function startExecution(task, now, executionId) {
  const execution = {
    id: executionId,
    sessionId: void 0,
    startedAt: now,
    endedAt: void 0,
    result: void 0,
    error: void 0
  };
  return {
    task: { ...task, status: "running", updatedAt: now, executions: [...task.executions, execution] },
    execution
  };
}
function settleExecution(task, executionId, outcome, now, error) {
  const index = task.executions.findIndex((execution2) => execution2.id === executionId);
  if (index === -1) return task;
  const execution = task.executions[index];
  if (execution.endedAt !== void 0) return task;
  const settled = { ...execution, endedAt: now, result: outcome, error };
  const executions = [...task.executions];
  executions[index] = settled;
  const status = outcome === "succeeded" ? "done" : outcome === "failed" ? "failed" : task.status === "running" ? "todo" : task.status;
  return { ...task, status, updatedAt: now, executions };
}
function executionLabel(execution) {
  if (execution.result === "succeeded") return "succeeded";
  if (execution.result === "failed") return "failed";
  if (execution.result === "cancelled") return "cancelled";
  return "running";
}

// src/core/use-cases/task-archive.ts
function applyArchiveTask(tasks, id, now) {
  let applied = false;
  const next = tasks.map((task) => {
    if (task.id !== id || task.archivedAt !== void 0) return task;
    if (!ARCHIVABLE_STATUSES.includes(task.status)) return task;
    applied = true;
    return { ...task, archivedAt: now, updatedAt: now };
  });
  return { tasks: next, archived: applied };
}
function applyRestoreTask(tasks, id, now) {
  let applied = false;
  const next = tasks.map((task) => {
    if (task.id !== id || task.archivedAt === void 0) return task;
    applied = true;
    const { archivedAt: _archived, ...rest } = task;
    return { ...rest, updatedAt: now };
  });
  return { tasks: next, archived: applied };
}

// src/core/use-cases/task-create.ts
function applyCreateTask(tasks, input, now, id) {
  if (input.title.trim() === "") return { task: void 0, tasks };
  const task = createTask(input, now, id);
  return { task, tasks: [...tasks, task] };
}

// src/core/use-cases/task-delete.ts
function applyDeleteTask(tasks, selectedTaskId, id) {
  const next = tasks.filter((task) => task.id !== id);
  return {
    tasks: next,
    selectionCleared: selectedTaskId === id
  };
}

// src/core/schedule.ts
var FIELD_RANGES = [
  [0, 59],
  // 分
  [0, 23],
  // 时
  [1, 31],
  // 日
  [1, 12],
  // 月
  [0, 7]
  // 周（7 与 0 都表示周日）
];
function parseCron(expr) {
  const fields = expr.trim().split(/\s+/);
  if (fields.length !== 5) return null;
  const sets = [];
  for (let index = 0; index < 5; index++) {
    const [min, max] = FIELD_RANGES[index];
    const set = /* @__PURE__ */ new Set();
    if (!parseField(fields[index], min, max, set)) return null;
    sets.push(set);
  }
  const weekdays = /* @__PURE__ */ new Set();
  for (const day of sets[4]) weekdays.add(day === 7 ? 0 : day);
  return {
    minutes: sets[0],
    hours: sets[1],
    days: sets[2],
    months: sets[3],
    weekdays,
    // 记录日/周是否为通配符，供 matches 判断「日或周」的匹配语义
    dayWildcard: fields[2] === "*",
    weekdayWildcard: fields[4] === "*"
  };
}
function isValidCron(expr) {
  return parseCron(expr) !== null;
}
function nextRunAtMs(expr, fromMs) {
  const schedule = parseCron(expr);
  if (schedule === null) return void 0;
  const from = new Date(fromMs);
  const scan = new Date(from.getFullYear(), from.getMonth(), from.getDate(), from.getHours(), from.getMinutes() + 1, 0, 0);
  const limitMs = fromMs + 366 * 24 * 60 * 60 * 1e3;
  while (scan.getTime() <= limitMs) {
    if (matches(schedule, scan)) return scan.getTime();
    scan.setMinutes(scan.getMinutes() + 1);
  }
  return void 0;
}
function parseField(field, min, max, out) {
  if (field === "*") {
    for (let value = min; value <= max; value++) out.add(value);
    return true;
  }
  for (const part of field.split(",")) {
    if (part === "") return false;
    const [range, stepRaw] = part.split("/");
    let low;
    let high;
    if (range === "*") {
      low = min;
      high = max;
    } else if (range.includes("-")) {
      const [a, b] = range.split("-");
      if (a === "" || b === "" || !isDigits(a) || !isDigits(b)) return false;
      low = Number(a);
      high = Number(b);
    } else if (isDigits(range)) {
      low = Number(range);
      high = Number(range);
    } else {
      return false;
    }
    if (low < min || high > max || low > high) return false;
    const step = stepRaw === void 0 ? 1 : isDigits(stepRaw) ? Number(stepRaw) : NaN;
    if (!Number.isInteger(step) || step < 1) return false;
    for (let value = low; value <= high; value += step) out.add(value);
  }
  return true;
}
function matches(schedule, date) {
  if (!schedule.minutes.has(date.getMinutes())) return false;
  if (!schedule.hours.has(date.getHours())) return false;
  if (!schedule.months.has(date.getMonth() + 1)) return false;
  const dayMatches = schedule.days.has(date.getDate());
  const weekdayMatches = schedule.weekdays.has(date.getDay());
  if (schedule.dayWildcard) return weekdayMatches;
  if (schedule.weekdayWildcard) return dayMatches;
  return dayMatches || weekdayMatches;
}
function isDigits(value) {
  return /^\d+$/.test(value);
}

// src/core/use-cases/task-schedule.ts
function applySetSchedule(tasks, id, patch, now) {
  const task = tasks.find((candidate) => candidate.id === id);
  if (task === void 0) return { tasks, applied: false };
  const current = task.schedule;
  const cron = (patch.cron ?? current?.cron ?? "").trim();
  if (cron === "" || !isValidCron(cron)) return { tasks, applied: false };
  const enabled = patch.enabled ?? current?.enabled ?? false;
  const nextRunAt = enabled ? nextRunAtMs(cron, now) : void 0;
  return {
    tasks: tasks.map((candidate) => candidate.id === id ? withSchedule(candidate, { enabled, cron, nextRunAt }, now) : candidate),
    applied: true
  };
}
function applyScheduleNextRun(tasks, id, nextRunAt, lastTriggeredAt, now) {
  return tasks.map((task) => task.id === id && task.schedule !== void 0 ? withSchedule(task, { nextRunAt, lastTriggeredAt }, now) : task);
}

// src/core/use-cases/task-update.ts
function normalizeTargetId2(value) {
  return value !== void 0 && value.trim() === "" ? void 0 : value;
}
function normalizePermission(current, value) {
  if (value === void 0) return void 0;
  return isTaskPermission(value) ? value : current;
}
function applyUpdateTask(tasks, id, patch, now) {
  return tasks.map((task) => {
    if (task.id !== id) return task;
    const workspaceId = "workspaceId" in patch ? normalizeTargetId2(patch.workspaceId) : void 0;
    const mode = "mode" in patch ? normalizeTargetId2(patch.mode) : void 0;
    const permission = "permission" in patch ? normalizePermission(task.permission, patch.permission) : void 0;
    const next = { ...task, ...patch, updatedAt: now };
    if (workspaceId !== void 0 || "workspaceId" in patch) next.workspaceId = workspaceId;
    if (mode !== void 0 || "mode" in patch) next.mode = mode;
    if (permission !== void 0 || "permission" in patch) next.permission = permission;
    return next;
  });
}

// src/core/controller.ts
function selectedTaskOf(snapshot) {
  if (snapshot.selectedTaskId === void 0) return void 0;
  return snapshot.tasks.find((task) => task.id === snapshot.selectedTaskId);
}
function randomUuid() {
  const bytes = globalThis.crypto?.getRandomValues(new Uint8Array(16));
  if (bytes === void 0) {
    return `t-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
  bytes[6] = bytes[6] & 15 | 64;
  bytes[8] = bytes[8] & 63 | 128;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
function currentOf(sessions) {
  return sessions.list.getSnapshot().current;
}
var BoardController = class {
  /** 构造控制器：注入依赖，配置默认时钟/ID 生成器 */
  constructor(deps) {
    this.deps = deps;
    this.now = deps.now ?? (() => Date.now());
    this.uuid = deps.uuid ?? randomUuid;
  }
  /** 任务列表（内存副本，变更后立即落盘） */
  tasks = [];
  /** 看板是否打开（全屏面板可见） */
  boardOpen = false;
  /** 是否处于归档视图 */
  archiveView = false;
  /** 当前选中的任务 ID（详情弹窗） */
  selectedTaskId;
  /** 执行选项（工作区/预设列表），由外部推送 */
  executionOptions = { workspaces: [], presets: [] };
  /** 状态订阅者集合 */
  listeners = /* @__PURE__ */ new Set();
  /** 生命周期清理函数集合（dispose 时逐一执行） */
  disposers = [];
  /** 时钟函数（可注入以便测试） */
  now;
  /** ID 生成函数（可注入以便测试） */
  uuid;
  /**
   * 启动控制器：
   * 1. 从存储加载任务；
   * 2. 立即调和（reconcile）运行中任务的真实结局；
   * 3. 订阅外部存储改动与会话变化；
   * 4. 通知一次初始快照。
   */
  start() {
    this.tasks = this.deps.store.load();
    void this.reconcileRunningTasks();
    const unsubscribeExternal = this.deps.store.subscribeExternal?.(() => {
      this.tasks = this.deps.store.load();
      this.notify();
    });
    if (unsubscribeExternal !== void 0) this.disposers.push(unsubscribeExternal);
    this.disposers.push(this.deps.sessions.list.subscribe(() => {
      this.onSessionsChanged();
    }));
    this.notify();
  }
  /** 释放控制器：清理订阅、定时器与监听者 */
  dispose() {
    for (const dispose of this.disposers.splice(0)) dispose();
    this.listeners.clear();
    if (this.reconcileTimer !== void 0) clearTimeout(this.reconcileTimer);
    this.reconcileTimer = void 0;
  }
  /** 获取当前状态快照（React 组件渲染用） */
  getSnapshot() {
    return {
      tasks: this.tasks,
      boardOpen: this.boardOpen,
      archiveView: this.archiveView,
      selectedTaskId: this.selectedTaskId,
      executionOptions: this.executionOptions
    };
  }
  /** 订阅快照变化，返回取消订阅函数 */
  subscribe(fn) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }
  /**
   * 打开看板（全屏面板）。
   * 记录打开瞬间的当前会话，用于会话切换时自动关闭。
   */
  openBoard() {
    if (this.boardOpen) return;
    this.lastCurrent = currentOf(this.deps.sessions);
    this.boardOpen = true;
    this.notify();
  }
  /** 关闭看板 */
  closeBoard() {
    if (!this.boardOpen) return;
    this.boardOpen = false;
    this.notify();
  }
  /** 切换看板开关 */
  toggleBoard() {
    if (this.boardOpen) this.closeBoard();
    else this.openBoard();
  }
  /** 切换归档视图 */
  toggleArchiveView() {
    this.archiveView = !this.archiveView;
    if (!this.archiveView && this.selectedTaskId !== void 0) {
      const selected = this.tasks.find((task) => task.id === this.selectedTaskId);
      if (selected?.archivedAt !== void 0) this.selectedTaskId = void 0;
    }
    this.notify();
  }
  /** 选中（打开详情）某任务；任务不存在则忽略 */
  openTask(id) {
    if (this.tasks.some((task) => task.id === id)) {
      this.selectedTaskId = id;
      this.notify();
    }
  }
  /** 关闭任务详情弹窗 */
  closeTask() {
    if (this.selectedTaskId === void 0) return;
    this.selectedTaskId = void 0;
    this.notify();
  }
  /** 创建新任务（标题为空时返回 undefined 表示失败） */
  createTask(input) {
    const { task, tasks } = applyCreateTask(this.tasks, input, this.now(), this.uuid());
    if (task === void 0) return void 0;
    this.tasks = [...tasks];
    this.persistAndNotify();
    return task;
  }
  /** 更新任务（补丁合并后落盘） */
  updateTask(id, patch) {
    this.tasks = [...applyUpdateTask(this.tasks, id, patch, this.now())];
    this.persistAndNotify();
  }
  /** 从外部推送执行选项（工作区/预设列表） */
  setExecutionOptions(patch) {
    this.executionOptions = { ...this.executionOptions, ...patch };
    this.notify();
  }
  /** 手动移动任务到目标状态 */
  moveTask(id, status) {
    this.tasks = this.tasks.map((task) => task.id === id ? withStatus(task, status, this.now()) : task);
    this.persistAndNotify();
  }
  /** 删除任务（如删除的是当前选中任务，清空选中态） */
  deleteTask(id) {
    const { tasks, selectionCleared } = applyDeleteTask(this.tasks, this.selectedTaskId, id);
    this.tasks = [...tasks];
    if (selectionCleared) this.selectedTaskId = void 0;
    this.persistAndNotify();
  }
  /** 归档任务：仅已完成/已失败可归档，返回是否成功 */
  archiveTask(id) {
    const { tasks, archived } = applyArchiveTask(this.tasks, id, this.now());
    if (!archived) return false;
    this.tasks = [...tasks];
    this.persistAndNotify();
    return true;
  }
  /** 恢复归档任务，返回是否成功 */
  restoreTask(id) {
    const { tasks, archived } = applyRestoreTask(this.tasks, id, this.now());
    if (!archived) return false;
    this.tasks = [...tasks];
    this.persistAndNotify();
    return true;
  }
  /**
   * 设置任务的定时规则（启用 + cron），返回是否应用成功。
   * cron 非法或任务不存在时返回 false（不会落盘）。
   */
  setSchedule(id, patch) {
    const { tasks, applied } = applySetSchedule(this.tasks, id, patch, this.now());
    if (!applied) return false;
    this.tasks = [...tasks];
    this.persistAndNotify();
    return true;
  }
  /** 调度器回写某任务的下次运行/上次触发时间 */
  applyScheduleNextRun(id, nextRunAt, lastTriggeredAt) {
    const next = applyScheduleNextRun(this.tasks, id, nextRunAt, lastTriggeredAt, this.now());
    this.tasks = [...next];
    this.persistAndNotify();
  }
  /** 从存储重新加载任务列表（不通知，供调度器刷新快照） */
  reloadFromStore() {
    this.tasks = this.deps.store.load();
  }
  /** 跳转到某个执行会话 */
  openSession(sessionId) {
    this.deps.sessions.open(sessionId);
  }
  /**
   * 执行任务：启动一次执行并监听结局事件。
   * 任务不存在或已在运行时返回 false；否则：
   * 1. 落盘置为 running 并追加执行记录；
   * 2. 记录执行 ID 到 activeExecutionIds（调和时跳过）；
   * 3. 交给 ExecutionService.run 驱动真实 agent 会话。
   */
  async runTask(id) {
    const task = this.tasks.find((candidate) => candidate.id === id);
    if (task === void 0 || task.status === "running") return false;
    const { task: next, execution } = startExecution(task, this.now(), this.uuid());
    this.tasks = this.tasks.map((candidate) => candidate.id === id ? next : candidate);
    this.persistAndNotify();
    this.activeExecutionIds.add(execution.id);
    await this.deps.exec.run(next, execution, (event) => {
      this.handleExecutionEvent(event);
    });
    return true;
  }
  /** 重新执行任务：先移回 todo（若未在运行），再启动执行 */
  async rerunTask(id) {
    const task = this.tasks.find((candidate) => candidate.id === id);
    if (task === void 0) return;
    if (task.status !== "running") {
      this.tasks = this.tasks.map((candidate) => candidate.id === id ? withStatus(candidate, "todo", this.now()) : candidate);
      this.persistAndNotify();
    }
    await this.runTask(id);
  }
  /** 处理执行事件：started 挂上会话 ID；settled 落定结果与状态 */
  handleExecutionEvent(event) {
    if (event.kind === "started") {
      this.tasks = this.tasks.map((task) => task.id === event.taskId ? attachSessionId(task, event.executionId, event.sessionId, this.now()) : task);
      this.persistAndNotify();
      return;
    }
    this.activeExecutionIds.delete(event.executionId);
    this.tasks = this.tasks.map((task) => task.id === event.taskId ? settleExecution(task, event.executionId, event.outcome, this.now(), event.error) : task);
    this.persistAndNotify();
  }
  /**
   * 会话变化回调：
   * 1. 总是调度一次运行中任务的调和（会话可能已消失/结束）；
   * 2. 若看板打开且当前会话已切换，自动关闭看板。
   */
  onSessionsChanged() {
    this.scheduleReconcile();
    if (!this.boardOpen) return;
    const current = currentOf(this.deps.sessions);
    if (current !== this.lastCurrent) this.closeBoard();
    this.lastCurrent = current;
  }
  /** 打开看板时记录的会话 ID（用于会话切换检测） */
  lastCurrent = void 0;
  /** 在途执行 ID 集合（调和时跳过，等待事件回调处理） */
  activeExecutionIds = /* @__PURE__ */ new Set();
  /** 调和定时器句柄 */
  reconcileTimer = void 0;
  /** 调和进行中标记（防重入） */
  reconcileInFlight = false;
  /** 去抖调度一次运行中任务调和 */
  scheduleReconcile() {
    if (this.reconcileTimer !== void 0) return;
    this.reconcileTimer = setTimeout(() => {
      this.reconcileTimer = void 0;
      void this.reconcileRunningTasks();
    }, this.deps.reconcileDebounceMs ?? 350);
  }
  /**
   * 调和运行中任务：对每个「不在途」的运行中任务，向执行服务询问真实结局
   * （会话消失 → 视为取消；会话空闲 → 按 lastAgentError 判定成败），
   * 并一次性落盘与通知。
   */
  async reconcileRunningTasks() {
    if (this.reconcileInFlight) return;
    this.reconcileInFlight = true;
    try {
      const events = [];
      for (const task of this.tasks) {
        if (task.status !== "running") continue;
        const execution = task.executions[task.executions.length - 1];
        if (execution !== void 0 && this.activeExecutionIds.has(execution.id)) continue;
        const event = await this.deps.exec.reconcile(task);
        if (event !== void 0 && event.kind === "settled") events.push({ taskId: task.id, event });
      }
      if (events.length === 0) return;
      let changed = false;
      for (const { taskId, event } of events) {
        const task = this.tasks.find((candidate) => candidate.id === taskId);
        if (task === void 0) continue;
        const next = settleExecution(task, event.executionId, event.outcome, this.now(), event.error);
        if (next === task) continue;
        this.tasks = this.tasks.map((candidate) => candidate.id === taskId ? next : candidate);
        changed = true;
      }
      if (changed) this.persistAndNotify();
    } finally {
      this.reconcileInFlight = false;
    }
  }
  /** 落盘并通知订阅者（每次状态变更的标准出口） */
  persistAndNotify() {
    this.deps.store.save(this.tasks);
    this.notify();
  }
  /** 通知所有订阅者快照已变化 */
  notify() {
    for (const fn of [...this.listeners]) fn();
  }
};
function attachSessionId(task, executionId, sessionId, now) {
  return {
    ...task,
    updatedAt: now,
    executions: task.executions.map((execution) => execution.id === executionId ? { ...execution, sessionId } : execution)
  };
}

// src/core/execution.ts
function messageOf(error) {
  if (error instanceof Error) return error.message;
  return String(error);
}
function presetAlreadyRuns(error, mode) {
  if (typeof error !== "object" || error === null) return false;
  const details = error.details;
  if (typeof details !== "object" || details === null) return false;
  return details.existingPreset === mode;
}
function isErrorTurnEnd(data) {
  if (typeof data !== "object" || data === null) return false;
  const reason = data.reason;
  return typeof reason === "object" && reason !== null && reason.kind === "error";
}
var ExecutionService = class {
  /** 构造执行服务，注入环境依赖 */
  constructor(env) {
    this.env = env;
  }
  /**
   * 执行一个任务：
   * 1. 连接会话；
   * 2. 应用模式（agent 预设）与权限；
   * 3. 重命名会话、发送 prompt；
   * 4. 监听回合结束并结算。
   * 任何一步失败都会以 settled-failed 事件回传。
   */
  async run(task, execution, onEvent) {
    const settleFailed = (error) => {
      onEvent({ kind: "settled", taskId: task.id, executionId: execution.id, outcome: "failed", error });
    };
    try {
      const sessionId = await this.connectSession(task.workspaceId);
      onEvent({ kind: "started", taskId: task.id, executionId: execution.id, sessionId });
      const driver = this.driverOf(sessionId);
      if (driver === void 0) {
        settleFailed("execution session is not ready");
        return;
      }
      if (!await this.applyMode(task, sessionId, settleFailed)) return;
      if (!await this.applyPermission(driver, task, settleFailed)) return;
      await driver.rename(task.title).catch(() => {
      });
      const baseline = driver.getSnapshot().turnEnds.size;
      const accepted = await this.sendPrompt(driver, task);
      if (!accepted.ok) {
        settleFailed(messageOf(accepted.error));
        return;
      }
      this.watchForSettlement(driver, task.id, execution.id, onEvent, baseline);
    } catch (error) {
      settleFailed(messageOf(error));
    }
  }
  /**
   * 应用任务钉住的模式（agent 预设）：
   * - 未钉住 → 直接通过；
   * - 会话非空白（已有历史）→ 拒绝，因为换预设会丢失会话上下文；
   * - 已处于目标预设 → 通过；
   * - 部署不支持预设 → 拒绝；
   * - 切换被拒但错误表明目标预设已在运行 → 视作成功。
   */
  async applyMode(task, sessionId, settleFailed) {
    const mode = task.mode;
    if (mode === void 0 || mode === "") return true;
    const summary = this.env.sessions.list.getSnapshot().byId[sessionId];
    if (summary?.blank === false) {
      settleFailed(`cannot switch agent preset to ${mode}: the execution session is not blank`);
      return false;
    }
    if (summary?.agentPreset === mode) return true;
    if (this.env.presets === void 0) {
      settleFailed(`this deployment does not support agent presets (task asks for ${mode})`);
      return false;
    }
    try {
      const result = await this.env.presets.select(sessionId, mode);
      if (!result.ok) {
        if (presetAlreadyRuns(result.error, mode)) {
          this.env.sessions.noteAgentPreset?.(sessionId, mode);
          return true;
        }
        settleFailed(`agent preset switch to ${mode} rejected: ${messageOf(result.error)}`);
        return false;
      }
    } catch (error) {
      settleFailed(`agent preset switch to ${mode} failed: ${messageOf(error)}`);
      return false;
    }
    this.env.sessions.noteAgentPreset?.(sessionId, mode);
    return true;
  }
  /**
   * 应用任务钉住的权限：向会话执行 `/permission <档位>` 命令。
   * 未钉住 → 通过；命令未识别或执行失败 → 拒绝。
   */
  async applyPermission(driver, task, settleFailed) {
    const permission = task.permission;
    if (permission === void 0) return true;
    const line = `/permission ${permission}`;
    try {
      const result = await driver.command(line);
      if (!result.ok) {
        settleFailed(`permission command rejected: ${messageOf(result.error)}`);
        return false;
      }
      if (!result.matched) {
        settleFailed(`permission command not recognized: ${line}`);
        return false;
      }
    } catch (error) {
      settleFailed(`permission command failed: ${messageOf(error)}`);
      return false;
    }
    return true;
  }
  /**
   * 调和：为遗留运行中的任务查回真实结局（页面刷新/会话结束等场景）。
   * 逻辑：
   * - 执行记录不完整（无会话或无结束时间）→ 不处理；
   * - 会话仓库未就绪 → 不处理；
   * - 会话已不存在 → 视为取消；
   * - 会话仍在运行 → 不处理；
   * - 会话有已结束轮次 → 按 lastAgentError 判定成败；
   * - 否则回看历史尾部有无错误回合。
   */
  async reconcile(task) {
    const execution = task.executions[task.executions.length - 1];
    if (execution === void 0 || execution.sessionId === void 0 || execution.endedAt !== void 0) return void 0;
    const list = this.env.sessions.list.getSnapshot();
    if (list.phase !== "ready") return void 0;
    const summary = list.byId[execution.sessionId];
    if (summary === void 0) {
      return { kind: "settled", taskId: task.id, executionId: execution.id, outcome: "cancelled", error: "execution session no longer exists" };
    }
    if (summary.running) return void 0;
    const driver = this.driverOf(execution.sessionId);
    if (driver !== void 0) {
      const snapshot = driver.getSnapshot();
      if (snapshot.turnEnds.size > 0) {
        const outcome = snapshot.lastAgentError !== null ? "failed" : "succeeded";
        return {
          kind: "settled",
          taskId: task.id,
          executionId: execution.id,
          outcome,
          error: snapshot.lastAgentError ?? void 0
        };
      }
    }
    const failed = await this.historyShowsFailure(execution.sessionId);
    if (failed) {
      return { kind: "settled", taskId: task.id, executionId: execution.id, outcome: "failed", error: "agent turn failed" };
    }
    return { kind: "settled", taskId: task.id, executionId: execution.id, outcome: "succeeded" };
  }
  /** 回看会话历史尾部是否存在「错误回合」事件（兜底判定失败） */
  async historyShowsFailure(sessionId) {
    const history = this.env.history;
    if (history === void 0) return false;
    try {
      const tail = await history.loadTail(sessionId);
      if (tail === void 0) return false;
      return tail.events.some((event) => event.type === "turn/end" && isErrorTurnEnd(event.data));
    } catch (error) {
      console.error("[bga-dsh-workbench] history failure probe failed", error);
      return false;
    }
  }
  /**
   * 连接执行会话：任务钉了工作区则校验其可用并连接之；
   * 未钉时使用最近使用的工作区（兜底第一个工作区）。
   */
  async connectSession(taskWorkspaceId) {
    const workspace = this.env.workspaces.list.getSnapshot();
    if (taskWorkspaceId !== void 0 && taskWorkspaceId !== "") {
      if (!workspace.items.some((item) => item.workspaceId === taskWorkspaceId)) {
        throw new Error(`task workspace is not available: ${taskWorkspaceId}`);
      }
      return this.env.workspaces.connectWorkspace(taskWorkspaceId);
    }
    const workspaceId = workspace.recentWorkspaceId ?? workspace.items[0]?.workspaceId;
    if (workspaceId === void 0) {
      throw new Error("no workspace available to run the task in");
    }
    return this.env.workspaces.connectWorkspace(workspaceId);
  }
  /** 通过会话绑定获取驱动句柄 */
  driverOf(sessionId) {
    return this.env.sessions.binding(sessionId)?.session;
  }
  /** 发送 prompt：任务 prompt 为空时回退用标题；排队模式等待回合开始 */
  async sendPrompt(driver, task) {
    const text = task.prompt.trim() !== "" ? task.prompt : task.title;
    try {
      const result = await driver.prompt([{ type: "text", text }], "queue");
      return result;
    } catch (error) {
      return { ok: false, error };
    }
  }
  /**
   * 监听回合结束并结算：
   * 订阅会话变化，每当已结束轮次数超过基线且会话不再运行时，
   * 依据 lastAgentError 判定成功/失败，并发出唯一的 settled 事件。
   */
  watchForSettlement(driver, taskId, executionId, onEvent, baseline) {
    let settled = false;
    let unsubscribe = () => {
    };
    const check = () => {
      if (settled) return;
      const snapshot = driver.getSnapshot();
      if (snapshot.running || snapshot.turnEnds.size <= baseline) return;
      settled = true;
      unsubscribe();
      onEvent({
        kind: "settled",
        taskId,
        executionId,
        outcome: snapshot.lastAgentError !== null ? "failed" : "succeeded",
        error: snapshot.lastAgentError ?? void 0
      });
    };
    unsubscribe = driver.subscribe(check);
    check();
  }
};

// src/core/scheduler.ts
var SchedulerService = class {
  /** 构造调度器，注入依赖 */
  constructor(deps) {
    this.deps = deps;
  }
  /** setInterval 句柄 */
  timer;
  /** visibilitychange 监听器（用于页面恢复可见时补扫） */
  environmentListener;
  /** 是否已释放（dispose 后不再工作） */
  disposed = false;
  /** 是否已启动 */
  started = false;
  /** 启动调度：立即补一次 tick，随后进入固定间隔循环，并可选挂上可见性监听 */
  start() {
    if (this.disposed) return;
    if (this.started) return;
    this.started = true;
    this.tick();
    this.timer = setInterval(() => {
      this.tick();
    }, this.deps.tickMs ?? 6e4);
    if (this.deps.environment !== void 0) {
      this.environmentListener = () => {
        this.tick();
      };
      this.deps.environment.addEventListener("visibilitychange", this.environmentListener);
    }
  }
  /** 停止调度（等价于 dispose） */
  stop() {
    this.dispose();
  }
  /** 释放全部资源：清定时器、移除监听、标记已释放 */
  dispose() {
    if (this.disposed && this.timer === void 0 && this.environmentListener === void 0) return;
    this.disposed = true;
    this.started = false;
    if (this.timer !== void 0) {
      clearInterval(this.timer);
      this.timer = void 0;
    }
    if (this.environmentListener !== void 0 && this.deps.environment !== void 0) {
      this.deps.environment.removeEventListener("visibilitychange", this.environmentListener);
      this.environmentListener = void 0;
    }
  }
  /**
   * 执行一轮扫描：
   * 1. 刷新任务快照；
   * 2. 为缺失 nextRunAt 的启用任务补算；
   * 3. 到点且未超时（宽限期 = 2 个 tick）的任务触发执行，
   *    超时的任务仅滚动下次时间而不执行（标注错过）。
   */
  async tick() {
    if (this.disposed) return;
    if (this.deps.ready !== void 0 && !this.deps.ready()) return;
    this.deps.refresh?.();
    const now = this.deps.now();
    const graceMs = 2 * (this.deps.tickMs ?? 6e4);
    for (const task of this.deps.tasks()) {
      const schedule = task.schedule;
      if (schedule === void 0 || !schedule.enabled) continue;
      if (schedule.nextRunAt === void 0) {
        const repaired = nextRunAtMs(schedule.cron, now);
        if (repaired === void 0) continue;
        this.deps.applySchedule(task.id, repaired, void 0);
        continue;
      }
      if (schedule.nextRunAt > now) continue;
      if (now - schedule.nextRunAt > graceMs) {
        const next2 = nextRunAtMs(schedule.cron, now);
        this.deps.applySchedule(task.id, next2, void 0);
        continue;
      }
      let next = nextRunAtMs(schedule.cron, schedule.nextRunAt);
      if (next !== void 0 && next <= now) next = nextRunAtMs(schedule.cron, now);
      const accepted = await this.deps.runTask(task.id);
      if (accepted) this.deps.applySchedule(task.id, next, now);
    }
  }
};

// src/core/file-store.ts
var TASKS_URL = "/bga-dsh-workbench/tasks";
var FileTaskStore = class {
  /** 读取任务列表：GET 端点并解析 JSON；任何失败都容错返回空数组 */
  load() {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", TASKS_URL, false);
      xhr.send();
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        return Array.isArray(data) ? data : [];
      }
    } catch {
    }
    return [];
  }
  /** 整体写回：POST 序列化后的任务 JSON（宿主校验并落盘） */
  save(tasks) {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", TASKS_URL, false);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify(tasks));
    } catch (error) {
      console.error("[bga-dsh-workbench] task ledger write failed", error);
    }
  }
  /** 清空任务：DELETE 端点的任务文件 */
  clear() {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open("DELETE", TASKS_URL, false);
      xhr.send();
    } catch (error) {
      console.error("[bga-dsh-workbench] task ledger clear failed", error);
    }
  }
};

// src/client/task-board/apply-guard.ts
function claimTaskBoardApply() {
  if (globalThis.__bgaDshWorkbenchTaskBoardApplied === true) return false;
  globalThis.__bgaDshWorkbenchTaskBoardApplied = true;
  return true;
}
function releaseTaskBoardApply() {
  globalThis.__bgaDshWorkbenchTaskBoardApplied = void 0;
}

// src/client/task-board/board-mount.tsx
var import_client = require("react-dom/client");

// src/client/task-board/board/TaskBoard.tsx
var import_react11 = require("react");
var import_react_dom3 = require("react-dom");

// src/client/task-board/locales.ts
var zh = {
  "entry.label": "BGA \u4EFB\u52A1\u770B\u677F",
  // ===== 看板主界面：标题 / 关闭 / 新建 / 搜索 / 快速添加 / 空态 / 归档视图 =====
  "board.title": "BGA \u4EFB\u52A1\u770B\u677F",
  "board.close": "\u8FD4\u56DE\u5BF9\u8BDD",
  "board.new": "\u65B0\u5EFA\u4EFB\u52A1",
  "board.search": "\u7B5B\u9009\u4EFB\u52A1\u2026",
  "board.quickAdd": "\u8F93\u5165\u540E\u56DE\u8F66\u5FEB\u901F\u6DFB\u52A0\u5F85\u529E",
  "board.empty": "\u6682\u65E0\u4EFB\u52A1",
  "board.filterAll": "\u5168\u90E8",
  "board.archive": "\u5F52\u6863",
  "board.archiveView": "\u5F52\u6863 ({count})",
  "board.backToBoard": "\u8FD4\u56DE\u770B\u677F",
  "archive.empty": "\u6CA1\u6709\u5DF2\u5F52\u6863\u7684\u4EFB\u52A1",
  "board.status": "\u72B6\u6001",
  // ===== 看板列：状态标签 / 状态名 / 执行次数 / 更新时间 =====
  "board.status.backlog": "\u5F85\u89C4\u5212",
  "board.status.todo": "\u5F85\u529E",
  "board.status.running": "\u8FDB\u884C\u4E2D",
  "board.status.done": "\u5DF2\u5B8C\u6210",
  "board.status.failed": "\u5DF2\u5931\u8D25",
  "board.runs": "\u6B21\u6267\u884C",
  "board.updated": "\u66F4\u65B0\u4E8E",
  "board.created": "\u521B\u5EFA\u4E8E",
  // ===== 新建任务弹窗：标题 / 描述 / 执行 Prompt 及校验提示 =====
  "new.title": "\u6807\u9898",
  "new.titlePlaceholder": "\u4E00\u53E5\u8BDD\u63CF\u8FF0\u8981\u505A\u4EC0\u4E48",
  "new.description": "\u63CF\u8FF0",
  "new.descriptionPlaceholder": "\u8865\u5145\u80CC\u666F\u3001\u8303\u56F4\u4E0E\u9A8C\u6536\uFF08\u53EF\u9009\uFF09",
  "new.prompt": "\u6267\u884C Prompt",
  "new.promptPlaceholder": "\u53D1\u7ED9 agent \u7684\u5B8C\u6574\u6307\u4EE4\uFF08\u7559\u7A7A\u5219\u4F7F\u7528\u6807\u9898\uFF09",
  "new.submit": "\u521B\u5EFA",
  "new.cancel": "\u53D6\u6D88",
  "new.required": "\u6807\u9898\u4E0D\u80FD\u4E3A\u7A7A",
  // ===== 任务详情：标题 / 关闭 / 执行记录 / 运行结果 =====
  "detail.title": "\u4EFB\u52A1\u8BE6\u60C5",
  "detail.close": "\u5173\u95ED",
  "detail.prompt": "\u6267\u884C Prompt",
  "detail.description": "\u63CF\u8FF0",
  "detail.execution": "\u6267\u884C\u8BB0\u5F55",
  "detail.noExecution": "\u5C1A\u672A\u6267\u884C",
  "detail.run": "\u6267\u884C",
  "detail.rerun": "\u91CD\u65B0\u6267\u884C",
  "detail.delete": "\u5220\u9664",
  "detail.archive": "\u5F52\u6863",
  "detail.restore": "\u6062\u590D",
  "detail.archivedAt": "\u5DF2\u5F52\u6863 \xB7 {time}",
  "detail.viewSession": "\u67E5\u770B\u4F1A\u8BDD",
  "detail.noSession": "\u6682\u65E0\u4F1A\u8BDD",
  "detail.executionStarted": "\u5DF2\u542F\u52A8",
  "detail.executionEnded": "\u5DF2\u7ED3\u675F",
  "detail.result.succeeded": "\u6210\u529F",
  "detail.result.failed": "\u5931\u8D25",
  "detail.result.cancelled": "\u5DF2\u53D6\u6D88",
  "detail.result.running": "\u8FDB\u884C\u4E2D",
  // ===== 删除确认弹窗 =====
  "delete.title": "\u5220\u9664\u4EFB\u52A1",
  "delete.confirm": "\u786E\u5B9A\u5220\u9664\u300C{name}\u300D\u5417\uFF1F\u5220\u9664\u540E\u4E0D\u53EF\u6062\u590D\u3002",
  "delete.ok": "\u5220\u9664",
  "delete.cancel": "\u53D6\u6D88",
  // ===== 状态移动按钮 =====
  "status.move.backlog": "\u79FB\u5230\u5F85\u89C4\u5212",
  "status.move.todo": "\u79FB\u5230\u5F85\u529E",
  // ===== 执行错误与运行失败提示 =====
  "exec.error.noWorkspace": "\u6CA1\u6709\u53EF\u7528\u5DE5\u4F5C\u533A\uFF0C\u65E0\u6CD5\u6267\u884C\u4EFB\u52A1",
  "exec.error.promptRejected": "Prompt \u88AB\u62D2\u7EDD",
  "run.failed": "\u6267\u884C\u5931\u8D25\uFF1A{error}",
  // ===== 相对时间显示 =====
  "time.justNow": "\u521A\u521A",
  // ===== 定时执行：开关 / Cron 输入 / 预设 / 下次与上次运行 =====
  "detail.schedule": "\u5B9A\u65F6\u8FD0\u884C",
  "detail.schedule.enable": "\u542F\u7528\u5B9A\u65F6\u6267\u884C",
  "detail.schedule.cron": "Cron \u8868\u8FBE\u5F0F",
  "detail.schedule.presets": "\u9884\u8BBE",
  "detail.schedule.preset.daily9": "\u6BCF\u5929 09:00",
  "detail.schedule.preset.hourly": "\u6BCF\u5C0F\u65F6",
  "detail.schedule.preset.tenMin": "\u6BCF 10 \u5206\u949F",
  "detail.schedule.preset.weeklyMon9": "\u6BCF\u5468\u4E00 09:00",
  "detail.schedule.nextRun": "\u4E0B\u6B21\u8FD0\u884C",
  "detail.schedule.lastTriggered": "\u4E0A\u6B21\u89E6\u53D1",
  "detail.schedule.invalid": "Cron \u8868\u8FBE\u5F0F\u65E0\u6548",
  "detail.schedule.notScheduled": "\u5C1A\u672A\u6392\u7A0B",
  "detail.schedule.dueSoon": "\u5373\u5C06\u8FD0\u884C",
  // ===== 看板卡片角标 =====
  "card.scheduled": "\u5B9A\u65F6",
  "card.delete": "\u5220\u9664\u4EFB\u52A1",
  // ===== 执行设置：工作区 / 模式（agent 预设）/ 权限（新建任务与任务详情共用） =====
  "new.workspace": "\u5DE5\u4F5C\u533A",
  "new.mode": "\u6A21\u5F0F",
  "new.permission": "\u6743\u9650",
  "exec.workspace.recent": "\u6700\u8FD1\u4F7F\u7528\uFF08\u9ED8\u8BA4\uFF09",
  "exec.mode.default": "\u90E8\u7F72\u9ED8\u8BA4",
  "exec.mode.defaultSuffix": "\uFF08\u9ED8\u8BA4\uFF09",
  "exec.mode.brokenSuffix": "\uFF08\u4E0D\u53EF\u7528\uFF09",
  "exec.mode.removed": "\uFF08\u5DF2\u79FB\u9664\uFF09",
  "exec.permission.default": "\u4F1A\u8BDD\u9ED8\u8BA4",
  "exec.permission.read-only": "\u53EA\u8BFB",
  "exec.permission.workspace-write": "\u5DE5\u4F5C\u533A\u53EF\u5199",
  "exec.permission.danger-full-access": "\u5B8C\u5168\u8BBF\u95EE",
  "detail.executionSettings": "\u6267\u884C\u8BBE\u7F6E",
  // 执行设置的说明文案：解释三个选项在执行时如何生效。
  "exec.hint": "\u6267\u884C\u65F6\u751F\u6548\uFF1A\u5DE5\u4F5C\u533A\u51B3\u5B9A\u6267\u884C\u4F1A\u8BDD\u843D\u5728\u54EA\u4E2A\u5DE5\u4F5C\u533A\uFF1B\u6A21\u5F0F\u51B3\u5B9A\u4F1A\u8BDD\u7684 agent \u9884\u8BBE\uFF1B\u6743\u9650\u7ECF /permission \u547D\u4EE4\u5E94\u7528\u5230\u4F1A\u8BDD\u3002\u7559\u7A7A\u5219\u4F7F\u7528\u8FD0\u884C\u65F6\u9ED8\u8BA4\u3002",
  // ===== 设置页：插件设置卡片 =====
  "settings.title": "BGA \u4EFB\u52A1\u770B\u677F",
  "settings.description": "\u63A7\u5236\u770B\u677F\u5728 agent \u7CFB\u7EDF\u63D0\u793A\u4E2D\u7684\u64AD\u62A5\u884C\u4E3A\u3002",
  "settings.enabled": "\u542F\u7528\u4EFB\u52A1\u770B\u677F",
  "settings.enabledHint": "\u5173\u95ED\u540E\u9690\u85CF\u4FA7\u8FB9\u680F\u5165\u53E3\u4E0E\u770B\u677F\u89C6\u56FE\u3002",
  "settings.announceToAgent": "\u5411 agent \u64AD\u62A5\u4EFB\u52A1\u770B\u677F",
  "settings.announceToAgentHint": "\u5F00\u542F\uFF1A\u6BCF\u6761 agent \u7CFB\u7EDF\u63D0\u793A\u90FD\u4F1A\u5305\u542B\u672C\u770B\u677F\u7684\u8BF4\u660E\uFF1B\u5173\u95ED\uFF1A\u4E0D\u64AD\u62A5\uFF0Cagent \u4EC5\u5728\u7528\u6237\u4E3B\u52A8\u63D0\u53CA\u65F6\u4E86\u89E3\u770B\u677F\u3002",
  "settings.inherit": "\u7EE7\u627F",
  "settings.on": "\u5F00",
  "settings.off": "\u5173",
  "settings.overridden": "\u5DF2\u8986\u76D6",
  "settings.reset": "\u6062\u590D\u9ED8\u8BA4",
  "settings.notExposed": "\u5F53\u524D DSH \u7248\u672C\u672A\u5411\u8BBE\u7F6E\u9875\u66B4\u9732\u672C\u63D2\u4EF6\u7684\u914D\u7F6E\u547D\u540D\u7A7A\u95F4\uFF0C\u8868\u5355\u4E0D\u53EF\u7528\u3002\u53EF\u7F16\u8F91 ~/.dsh/settings.yaml \u76F4\u63A5\u914D\u7F6E\uFF0C\u6216\u4E3A dsh-host-apiproxy \u7684 WEB_SETTINGS_NAMESPACES \u767D\u540D\u5355\u8865\u5145\u672C\u547D\u540D\u7A7A\u95F4\u540E\u91CD\u542F\u3002",
  "settings.readOnly": "\u5F53\u524D\u90E8\u7F72\u7684\u8BBE\u7F6E\u53EA\u8BFB\u3002",
  "settings.expand": "\u5C55\u5F00\u8BBE\u7F6E",
  "settings.collapse": "\u6536\u8D77\u8BBE\u7F6E",
  "settings.save": "\u4FDD\u5B58",
  "settings.saving": "\u4FDD\u5B58\u4E2D\u2026",
  "settings.discard": "\u653E\u5F03",
  "settings.unsaved": "\u672A\u4FDD\u5B58",
  "settings.saveFailed": "\u90E8\u7F72\u672A\u63A5\u53D7\u8FD9\u4E9B\u503C\uFF0C\u5DF2\u4FDD\u7559\u4F9B\u4F60\u4FEE\u6539\u3002",
  "settings.invalidNumber": "\u8BF7\u8F93\u5165\u6570\u5B57\uFF0C\u7559\u7A7A\u5219\u4F7F\u7528\u9ED8\u8BA4\u503C\u3002"
};
var en = {
  "entry.label": "BGA Task Board",
  // ===== Board main UI =====
  "board.title": "BGA Task Board",
  "board.close": "Back to chat",
  "board.new": "New Task",
  "board.search": "Filter tasks\u2026",
  "board.quickAdd": "Enter to add to To-do",
  "board.empty": "No tasks in this column",
  "board.filterAll": "All",
  "board.archive": "Archive",
  "board.archiveView": "Archived ({count})",
  "board.backToBoard": "Back to board",
  "archive.empty": "No archived tasks",
  "board.status": "Status",
  // ===== Board columns: status labels / counts / time =====
  "board.status.backlog": "Backlog",
  "board.status.todo": "To Do",
  "board.status.running": "In Progress",
  "board.status.done": "Done",
  "board.status.failed": "Failed",
  "board.runs": "runs",
  "board.updated": "Updated",
  "board.created": "Created",
  // ===== New task dialog =====
  "new.title": "Title",
  "new.titlePlaceholder": "What should be done, in one line",
  "new.description": "Description",
  "new.descriptionPlaceholder": "Background, scope, acceptance criteria (optional)",
  "new.prompt": "Run Prompt",
  "new.promptPlaceholder": "The full instruction sent to the agent (title is used when blank)",
  "new.submit": "Create",
  "new.cancel": "Cancel",
  "new.required": "Title is required",
  // ===== Task detail =====
  "detail.title": "Task Detail",
  "detail.close": "Close",
  "detail.prompt": "Run Prompt",
  "detail.description": "Description",
  "detail.execution": "Execution History",
  "detail.noExecution": "Not executed yet",
  "detail.run": "Run",
  "detail.rerun": "Run Again",
  "detail.delete": "Delete",
  "detail.archive": "Archive",
  "detail.restore": "Restore",
  "detail.archivedAt": "Archived \xB7 {time}",
  "detail.viewSession": "View Session",
  "detail.noSession": "No session",
  "detail.executionStarted": "Started",
  "detail.executionEnded": "Ended",
  "detail.result.succeeded": "Succeeded",
  "detail.result.failed": "Failed",
  "detail.result.cancelled": "Cancelled",
  "detail.result.running": "Running",
  // ===== Delete confirmation =====
  "delete.title": "Delete Task",
  "delete.confirm": 'Delete "{name}"? This cannot be undone.',
  "delete.ok": "Delete",
  "delete.cancel": "Cancel",
  "status.move.backlog": "Move to Backlog",
  "status.move.todo": "Move to To Do",
  // ===== Execution errors / run failures =====
  "exec.error.noWorkspace": "No workspace is available to run the task",
  "exec.error.promptRejected": "Prompt rejected",
  "run.failed": "Run failed: {error}",
  // ===== Relative time =====
  "time.justNow": "just now",
  // ===== Scheduled runs =====
  "detail.schedule": "Scheduled Runs",
  "detail.schedule.enable": "Enable scheduled runs",
  "detail.schedule.cron": "Cron expression",
  "detail.schedule.presets": "Presets",
  "detail.schedule.preset.daily9": "Every day 09:00",
  "detail.schedule.preset.hourly": "Every hour",
  "detail.schedule.preset.tenMin": "Every 10 minutes",
  "detail.schedule.preset.weeklyMon9": "Every Monday 09:00",
  "detail.schedule.nextRun": "Next run",
  "detail.schedule.lastTriggered": "Last triggered",
  "detail.schedule.invalid": "Invalid cron expression",
  "detail.schedule.notScheduled": "Not scheduled yet",
  "detail.schedule.dueSoon": "Due soon",
  "card.scheduled": "scheduled",
  "card.delete": "Delete task",
  // ===== Execution settings: workspace / mode / permission =====
  "new.workspace": "Workspace",
  "new.mode": "Mode",
  "new.permission": "Permission",
  "exec.workspace.recent": "Most recent (default)",
  "exec.mode.default": "Deployment default",
  "exec.mode.defaultSuffix": " (default)",
  "exec.mode.brokenSuffix": " (unavailable)",
  "exec.mode.removed": " (removed)",
  "exec.permission.default": "Session default",
  "exec.permission.read-only": "Read-only",
  "exec.permission.workspace-write": "Workspace Write",
  "exec.permission.danger-full-access": "Full Access",
  "detail.executionSettings": "Execution Settings",
  "exec.hint": "Applied when the task runs: the workspace decides where the execution session lands; the mode composes the session's agent preset; the permission is applied through the /permission command. Blank = runtime default.",
  // ===== Settings page: plugin settings card =====
  "settings.title": "BGA Task Board",
  "settings.description": "How the board announces itself in each agent system prompt.",
  "settings.enabled": "Enable the task board",
  "settings.enabledHint": "When off, the sidebar entry and board view are hidden.",
  "settings.announceToAgent": "Announce the task board to agents",
  "settings.announceToAgentHint": "On: every agent system prompt includes a note about this board. Off: no announcement; agents learn about the board only when you mention it.",
  "settings.inherit": "Inherit",
  "settings.on": "On",
  "settings.off": "Off",
  "settings.overridden": "Overridden",
  "settings.reset": "Reset to default",
  "settings.notExposed": "This DSH version does not expose this plugin's settings namespace to the configuration page, so the form is unavailable. Edit ~/.dsh/settings.yaml directly, or add the namespace to dsh-host-apiproxy's WEB_SETTINGS_NAMESPACES allowlist and restart.",
  "settings.readOnly": "This deployment stores settings read-only.",
  "settings.expand": "Show settings",
  "settings.collapse": "Hide settings",
  "settings.save": "Save",
  "settings.saving": "Saving\u2026",
  "settings.discard": "Discard",
  "settings.unsaved": "Unsaved",
  "settings.saveFailed": "The deployment did not accept these values; they were left for you to correct.",
  "settings.invalidNumber": "Enter a number, or leave blank to use the default."
};
function dictionary() {
  const lang = typeof document !== "undefined" ? document.documentElement.lang : "zh";
  return lang.toLowerCase().startsWith("en") ? en : zh;
}
function t(key, params) {
  let text = dictionary()[key];
  if (params !== void 0) {
    for (const [name, value] of Object.entries(params)) {
      text = text.replaceAll(`{${name}}`, value);
    }
  }
  return text;
}

// src/client/task-board/kanban.module.css
var kanban_default = {
  "bga-kb-entry": "kanban_bga-kb-entry",
  "bga-kb-entry-icon": "kanban_bga-kb-entry-icon",
  "bga-kb-entry-label": "kanban_bga-kb-entry-label",
  "bga-kb-board": "kanban_bga-kb-board",
  "bga-kb-board-header": "kanban_bga-kb-board-header",
  "bga-kb-search": "kanban_bga-kb-search",
  "bga-kb-quick": "kanban_bga-kb-quick",
  "bga-kb-cols": "kanban_bga-kb-cols",
  "bga-kb-col": "kanban_bga-kb-col",
  "bga-kb-col-header": "kanban_bga-kb-col-header",
  "bga-kb-col-title": "kanban_bga-kb-col-title",
  "bga-kb-col-count": "kanban_bga-kb-col-count",
  "bga-kb-dot": "kanban_bga-kb-dot",
  "bga-kb-cards": "kanban_bga-kb-cards",
  "bga-kb-col-empty": "kanban_bga-kb-col-empty",
  "bga-kb-card": "kanban_bga-kb-card",
  "bga-kb-card-top": "kanban_bga-kb-card-top",
  "bga-kb-card-title": "kanban_bga-kb-card-title",
  "bga-kb-card-delete": "kanban_bga-kb-card-delete",
  "bga-kb-card-excerpt": "kanban_bga-kb-card-excerpt",
  "bga-kb-card-meta": "kanban_bga-kb-card-meta",
  "bga-kb-card-time": "kanban_bga-kb-card-time",
  "bga-kb-card-schedule": "kanban_bga-kb-card-schedule",
  "bga-kb-card-run": "kanban_bga-kb-card-run",
  "bga-kb-card-session": "kanban_bga-kb-card-session",
  "bga-kb-card-running": "kanban_bga-kb-card-running",
  "bga-kb-card-spinner": "kanban_bga-kb-card-spinner",
  dshTbSpin: "kanban_dshTbSpin",
  "bga-kb-btn-primary": "kanban_bga-kb-btn-primary",
  "bga-kb-btn-ghost": "kanban_bga-kb-btn-ghost",
  "bga-kb-btn-danger": "kanban_bga-kb-btn-danger",
  "bga-kb-btn-icon": "kanban_bga-kb-btn-icon",
  "bga-kb-btn-link": "kanban_bga-kb-btn-link",
  "bga-kb-modal-bg": "kanban_bga-kb-modal-bg",
  "bga-kb-modal": "kanban_bga-kb-modal",
  "bga-kb-modal-sm": "kanban_bga-kb-modal-sm",
  "bga-kb-modal-title": "kanban_bga-kb-modal-title",
  "bga-kb-modal-msg": "kanban_bga-kb-modal-msg",
  "bga-kb-modal-foot": "kanban_bga-kb-modal-foot",
  "bga-kb-fld": "kanban_bga-kb-fld",
  "bga-kb-fld-label": "kanban_bga-kb-fld-label",
  "bga-kb-input": "kanban_bga-kb-input",
  "bga-kb-select": "kanban_bga-kb-select",
  "bga-kb-fld-error": "kanban_bga-kb-fld-error",
  "bga-kb-det": "kanban_bga-kb-det",
  "bga-kb-det-close": "kanban_bga-kb-det-close",
  "bga-kb-det-header": "kanban_bga-kb-det-header",
  "bga-kb-det-title": "kanban_bga-kb-det-title",
  "bga-kb-badge": "kanban_bga-kb-badge",
  "bga-kb-det-body": "kanban_bga-kb-det-body",
  "bga-kb-det-section": "kanban_bga-kb-det-section",
  "bga-kb-det-text": "kanban_bga-kb-det-text",
  "bga-kb-sch-toggle": "kanban_bga-kb-sch-toggle",
  "bga-kb-sch-row": "kanban_bga-kb-sch-row",
  "bga-kb-sch-input": "kanban_bga-kb-sch-input",
  "bga-kb-sch-input--err": "kanban_bga-kb-sch-input--err",
  "bga-kb-sch-preset": "kanban_bga-kb-sch-preset",
  "bga-kb-sch-meta": "kanban_bga-kb-sch-meta",
  "bga-kb-prompt": "kanban_bga-kb-prompt",
  "bga-kb-ex-list": "kanban_bga-kb-ex-list",
  "bga-kb-ex-row": "kanban_bga-kb-ex-row",
  "bga-kb-ex-badge": "kanban_bga-kb-ex-badge",
  "bga-kb-ex-times": "kanban_bga-kb-ex-times",
  "bga-kb-ex-error": "kanban_bga-kb-ex-error",
  "bga-kb-move": "kanban_bga-kb-move",
  "bga-kb-det-foot": "kanban_bga-kb-det-foot",
  "bga-kb-det-meta": "kanban_bga-kb-det-meta"
};

// src/client/task-board/board/ConfirmDialog.tsx
var import_react7 = require("react");
var import_jsx_runtime5 = require("react/jsx-runtime");
function ConfirmDialog({ title, message, confirmLabel, danger, onCancel, onConfirm }) {
  const blurActive = () => {
    const el = document.activeElement;
    if (el instanceof HTMLElement && el !== document.body) el.blur();
  };
  (0, import_react7.useEffect)(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onCancel();
        blurActive();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onCancel]);
  return (
    // 遮罩：只有点击遮罩本身（而非对话框内部）时才取消。
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: kanban_default["bga-kb-modal-bg"], onMouseDown: (event) => {
      if (event.target === event.currentTarget) onCancel();
    }, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: kanban_default["bga-kb-modal-sm"], role: "alertdialog", "aria-label": title, children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("h2", { className: kanban_default["bga-kb-modal-title"], children: title }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { className: kanban_default["bga-kb-modal-msg"], children: message }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("footer", { className: kanban_default["bga-kb-modal-foot"], children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", className: kanban_default["bga-kb-btn-ghost"], onClick: onCancel, children: t("delete.cancel") }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          "button",
          {
            type: "button",
            className: danger ? kanban_default["bga-kb-btn-danger"] : kanban_default["bga-kb-btn-primary"],
            onClick: onConfirm,
            children: confirmLabel
          }
        )
      ] })
    ] }) })
  );
}

// src/client/task-board/board/NewTaskModal.tsx
var import_react8 = require("react");
var import_react_dom = require("react-dom");
var import_jsx_runtime6 = require("react/jsx-runtime");
function NewTaskModal({ controller, onClose }) {
  const [title, setTitle] = (0, import_react8.useState)("");
  const [description, setDescription] = (0, import_react8.useState)("");
  const [prompt, setPrompt] = (0, import_react8.useState)("");
  const [workspaceId, setWorkspaceId] = (0, import_react8.useState)("");
  const [mode, setMode] = (0, import_react8.useState)("");
  const [permission, setPermission] = (0, import_react8.useState)("");
  const [error, setError] = (0, import_react8.useState)(void 0);
  const [options, setOptions] = (0, import_react8.useState)(controller.getSnapshot().executionOptions);
  (0, import_react8.useEffect)(
    () => controller.subscribe(() => setOptions(controller.getSnapshot().executionOptions)),
    [controller]
  );
  const blurActive = () => {
    const el = document.activeElement;
    if (el instanceof HTMLElement && el !== document.body) el.blur();
  };
  (0, import_react8.useEffect)(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        blurActive();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);
  const submit = () => {
    const task = controller.createTask({
      title,
      description,
      prompt,
      // 空字符串统一转 undefined：让执行端使用运行时默认目标。
      workspaceId: workspaceId === "" ? void 0 : workspaceId,
      mode: mode === "" ? void 0 : mode,
      permission: permission === "" ? void 0 : permission
    });
    if (task === void 0) {
      setError(t("new.required"));
      return;
    }
    onClose();
  };
  return (0, import_react_dom.createPortal)(
    // 遮罩：点击遮罩本身（而非弹窗内部）即关闭。
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: kanban_default["bga-kb-modal-bg"], onMouseDown: (event) => {
      if (event.target === event.currentTarget) onClose();
    }, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
      "form",
      {
        className: kanban_default["bga-kb-modal"],
        role: "dialog",
        "aria-label": t("board.new"),
        onSubmit: (event) => {
          event.preventDefault();
          submit();
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("h2", { className: kanban_default["bga-kb-modal-title"], children: t("board.new") }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("label", { className: kanban_default["bga-kb-fld"], children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: kanban_default["bga-kb-fld-label"], children: t("new.title") }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
              "input",
              {
                className: kanban_default["bga-kb-input"],
                value: title,
                autoFocus: true,
                placeholder: t("new.titlePlaceholder"),
                onChange: (event) => {
                  setTitle(event.target.value);
                  setError(void 0);
                }
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("label", { className: kanban_default["bga-kb-fld"], children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: kanban_default["bga-kb-fld-label"], children: t("new.description") }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
              "textarea",
              {
                className: kanban_default["bga-kb-input"],
                rows: 3,
                value: description,
                placeholder: t("new.descriptionPlaceholder"),
                onChange: (event) => {
                  setDescription(event.target.value);
                }
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("label", { className: kanban_default["bga-kb-fld"], children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: kanban_default["bga-kb-fld-label"], children: t("new.prompt") }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
              "textarea",
              {
                className: kanban_default["bga-kb-input"],
                rows: 4,
                value: prompt,
                placeholder: t("new.promptPlaceholder"),
                onChange: (event) => {
                  setPrompt(event.target.value);
                }
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("label", { className: kanban_default["bga-kb-fld"], children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: kanban_default["bga-kb-fld-label"], children: t("new.workspace") }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
              "select",
              {
                className: kanban_default["bga-kb-select"],
                value: workspaceId,
                onChange: (event) => {
                  setWorkspaceId(event.target.value);
                },
                children: [
                  "// \u5DE5\u4F5C\u533A\u9009\u62E9\uFF1A\u7A7A\u503C = \u6700\u8FD1\u4F7F\u7528\uFF08\u9ED8\u8BA4\uFF09\u3002",
                  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("option", { value: "", children: t("exec.workspace.recent") }),
                  options.workspaces.map((workspace) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("option", { value: workspace.workspaceId, children: workspace.title }, workspace.workspaceId))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("label", { className: kanban_default["bga-kb-fld"], children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: kanban_default["bga-kb-fld-label"], children: t("new.mode") }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
              "select",
              {
                className: kanban_default["bga-kb-select"],
                value: mode,
                onChange: (event) => {
                  setMode(event.target.value);
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("option", { value: "", children: t("exec.mode.default") }),
                  "// \u6A21\u5F0F\u9009\u62E9\uFF1A\u7A7A\u503C = \u90E8\u7F72\u9ED8\u8BA4\uFF1BisDefault \u9884\u8BBE\u8FFD\u52A0\u300C(\u9ED8\u8BA4)\u300D\uFF0C // broken \u7684\u9884\u8BBE\uFF08\u914D\u7F6E\u6587\u4EF6\u5931\u6548\uFF09\u7981\u7528\u5E76\u6807\u6CE8\u300C(\u4E0D\u53EF\u7528)\u300D\u3002",
                  options.presets.map((preset) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("option", { value: preset.id, disabled: preset.broken !== void 0, children: [
                    preset.name ?? preset.id,
                    preset.isDefault ? t("exec.mode.defaultSuffix") : "",
                    preset.broken !== void 0 ? t("exec.mode.brokenSuffix") : ""
                  ] }, preset.id))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("label", { className: kanban_default["bga-kb-fld"], children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: kanban_default["bga-kb-fld-label"], children: t("new.permission") }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
              "select",
              {
                className: kanban_default["bga-kb-select"],
                value: permission,
                onChange: (event) => {
                  setPermission(event.target.value);
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("option", { value: "", children: t("exec.permission.default") }),
                  "// \u6743\u9650\u9009\u62E9\uFF1A\u7A7A\u503C = \u4F1A\u8BDD\u9ED8\u8BA4\uFF1B\u679A\u4E3E\u6765\u81EA TASK_PERMISSIONS\u3002",
                  TASK_PERMISSIONS.map((id) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("option", { value: id, children: t(`exec.permission.${id}`) }, id))
                ]
              }
            )
          ] }),
          error !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { className: kanban_default["bga-kb-fld-error"], children: error }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("footer", { className: kanban_default["bga-kb-modal-foot"], children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("button", { type: "button", className: kanban_default["bga-kb-btn-ghost"], onClick: onClose, children: t("new.cancel") }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("button", { type: "submit", className: kanban_default["bga-kb-btn-primary"], children: t("new.submit") })
          ] })
        ]
      }
    ) }),
    document.body
  );
}

// src/client/task-board/board/TaskCard.tsx
var import_react9 = require("react");
var import_jsx_runtime7 = require("react/jsx-runtime");
function formatTime(ms) {
  const date = new Date(ms);
  const now = Date.now();
  const minutes = Math.floor((now - ms) / 6e4);
  if (minutes < 1) return t("time.justNow");
  if (minutes < 60) return `${minutes}m`;
  if (minutes < 60 * 24) return `${Math.floor(minutes / 60)}h`;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
var TrashIcon = () => /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("svg", { viewBox: "0 0 24 24", width: "14", height: "14", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
  /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M3 6h18" }),
  /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }),
  /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" }),
  /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M10 11v6" }),
  /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M14 11v6" })
] });
function TaskCardInner({ task, onClick, onDelete }) {
  const latest = task.executions[task.executions.length - 1];
  const runs = task.executions.length;
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
    "div",
    {
      className: kanban_default["bga-kb-card"],
      "data-status": task.status,
      role: "button",
      tabIndex: 0,
      onClick,
      onKeyDown: (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      },
      title: task.description !== "" ? task.description : task.title,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { className: kanban_default["bga-kb-card-top"], children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: kanban_default["bga-kb-card-title"], children: task.title }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            "button",
            {
              type: "button",
              className: kanban_default["bga-kb-card-delete"],
              "aria-label": t("card.delete"),
              onClick: (event) => {
                event.preventDefault();
                event.stopPropagation();
                onDelete(task.id);
              },
              children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(TrashIcon, {})
            }
          )
        ] }),
        task.description !== "" && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: kanban_default["bga-kb-card-excerpt"], children: task.description }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { className: kanban_default["bga-kb-card-meta"], children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { className: kanban_default["bga-kb-card-time"], children: [
            t("board.updated"),
            " ",
            formatTime(task.updatedAt)
          ] }),
          task.schedule?.enabled === true && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            "span",
            {
              className: kanban_default["bga-kb-card-schedule"],
              title: task.schedule.nextRunAt !== void 0 ? `${t("card.scheduled")} \xB7 ${new Date(task.schedule.nextRunAt).toLocaleString()}` : t("card.scheduled"),
              children: t("card.scheduled")
            }
          ),
          latest !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { className: kanban_default["bga-kb-card-run"], "data-result": latest.result, children: [
            runs,
            " ",
            t("board.runs")
          ] }),
          latest?.sessionId !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: kanban_default["bga-kb-card-session"], title: latest.sessionId, children: "\u2301" }),
          task.status === "running" && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: kanban_default["bga-kb-card-spinner"], "aria-hidden": "true" })
        ] }),
        latest !== void 0 && executionLabel(latest) === "running" && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { className: kanban_default["bga-kb-card-running"], children: [
          t("detail.result.running"),
          "\u2026"
        ] })
      ]
    }
  );
}
var TaskCard = (0, import_react9.memo)(TaskCardInner);

// src/client/task-board/board/TaskDetail.tsx
var import_react10 = require("react");
var import_react_dom2 = require("react-dom");
var import_jsx_runtime8 = require("react/jsx-runtime");
var RESULT_KEY = {
  succeeded: "detail.result.succeeded",
  failed: "detail.result.failed",
  cancelled: "detail.result.cancelled"
};
var STATUS_KEY = {
  backlog: "board.status.backlog",
  todo: "board.status.todo",
  running: "board.status.running",
  done: "board.status.done",
  failed: "board.status.failed"
};
function ExecutionRow({ execution, onOpen }) {
  const result = execution.result;
  return (
    // 整行带 data-result 属性：行与徽标的颜色由 CSS 按结果（succeeded/failed/…）决定。
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("li", { className: kanban_default["bga-kb-ex-row"], "data-result": result, children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: kanban_default["bga-kb-ex-badge"], "data-result": result, children: result === void 0 ? t("detail.result.running") : t(RESULT_KEY[result]) }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("span", { className: kanban_default["bga-kb-ex-times"], children: [
        t("detail.executionStarted"),
        " ",
        formatTime(execution.startedAt),
        execution.endedAt !== void 0 && ` \xB7 ${t("detail.executionEnded")} ${formatTime(execution.endedAt)}`
      ] }),
      execution.sessionId !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
        "button",
        {
          type: "button",
          className: kanban_default["bga-kb-btn-link"],
          onClick: () => {
            onOpen(execution.sessionId);
          },
          title: execution.sessionId,
          children: [
            t("detail.viewSession"),
            " \u2301"
          ]
        }
      ),
      execution.error !== void 0 && execution.error !== "" && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: kanban_default["bga-kb-ex-error"], children: execution.error })
    ] })
  );
}
var SCHEDULE_PRESETS = [
  { cron: "0 9 * * *", label: "detail.schedule.preset.daily9" },
  { cron: "0 * * * *", label: "detail.schedule.preset.hourly" },
  { cron: "*/10 * * * *", label: "detail.schedule.preset.tenMin" },
  { cron: "0 9 * * 1", label: "detail.schedule.preset.weeklyMon9" }
];
function ExecutionSettingsSection({ controller, task }) {
  const [options, setOptions] = (0, import_react10.useState)(controller.getSnapshot().executionOptions);
  (0, import_react10.useEffect)(
    () => controller.subscribe(() => setOptions(controller.getSnapshot().executionOptions)),
    [controller]
  );
  const workspaceId = task.workspaceId ?? "";
  const mode = task.mode ?? "";
  const permission = task.permission ?? "";
  const workspaceKnown = workspaceId === "" || options.workspaces.some((item) => item.workspaceId === workspaceId);
  const modeKnown = mode === "" || options.presets.some((item) => item.id === mode);
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("section", { className: kanban_default["bga-kb-det-section"], children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("h4", { children: t("detail.executionSettings") }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { className: kanban_default["bga-kb-det-text"], children: t("exec.hint") }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("label", { className: kanban_default["bga-kb-fld"], children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: kanban_default["bga-kb-fld-label"], children: t("new.workspace") }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
        "select",
        {
          className: kanban_default["bga-kb-select"],
          value: workspaceId,
          onChange: (event) => {
            controller.updateTask(task.id, { workspaceId: event.target.value });
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("option", { value: "", children: t("exec.workspace.recent") }),
            !workspaceKnown && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("option", { value: workspaceId, children: [
              workspaceId,
              t("exec.mode.removed")
            ] }),
            options.workspaces.map((workspace) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("option", { value: workspace.workspaceId, children: workspace.title }, workspace.workspaceId))
          ]
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("label", { className: kanban_default["bga-kb-fld"], children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: kanban_default["bga-kb-fld-label"], children: t("new.mode") }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
        "select",
        {
          className: kanban_default["bga-kb-select"],
          value: mode,
          onChange: (event) => {
            controller.updateTask(task.id, { mode: event.target.value });
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("option", { value: "", children: t("exec.mode.default") }),
            !modeKnown && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("option", { value: mode, children: [
              mode,
              t("exec.mode.removed")
            ] }),
            options.presets.map((preset) => /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("option", { value: preset.id, disabled: preset.broken !== void 0, children: [
              preset.name ?? preset.id,
              preset.isDefault ? t("exec.mode.defaultSuffix") : "",
              preset.broken !== void 0 ? t("exec.mode.brokenSuffix") : ""
            ] }, preset.id))
          ]
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("label", { className: kanban_default["bga-kb-fld"], children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: kanban_default["bga-kb-fld-label"], children: t("new.permission") }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
        "select",
        {
          className: kanban_default["bga-kb-select"],
          value: permission,
          onChange: (event) => {
            controller.updateTask(task.id, { permission: event.target.value === "" ? void 0 : event.target.value });
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("option", { value: "", children: t("exec.permission.default") }),
            TASK_PERMISSIONS.map((id) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("option", { value: id, children: t(`exec.permission.${id}`) }, id))
          ]
        }
      )
    ] })
  ] });
}
function ScheduleSection({ controller, task }) {
  const schedule = task.schedule;
  const [cron, setCron] = (0, import_react10.useState)(schedule?.cron ?? "0 9 * * *");
  const [enabled, setEnabled] = (0, import_react10.useState)(schedule?.enabled ?? false);
  const [nextRunAt, setNextRunAt] = (0, import_react10.useState)(schedule?.nextRunAt);
  const [lastTriggeredAt, setLastTriggeredAt] = (0, import_react10.useState)(schedule?.lastTriggeredAt);
  const [error, setError] = (0, import_react10.useState)(void 0);
  (0, import_react10.useEffect)(() => {
    setCron(schedule?.cron ?? "0 9 * * *");
    setEnabled(schedule?.enabled ?? false);
    setNextRunAt(schedule?.nextRunAt);
    setLastTriggeredAt(schedule?.lastTriggeredAt);
    setError(void 0);
  }, [task.id, schedule?.enabled, schedule?.cron, schedule?.nextRunAt, schedule?.lastTriggeredAt]);
  const saveCron = (value) => {
    const trimmed = value.trim();
    setCron(trimmed);
    if (trimmed === "" || !isValidCron(trimmed)) {
      setError(t("detail.schedule.invalid"));
      return;
    }
    setError(void 0);
    controller.setSchedule(task.id, { cron: trimmed });
  };
  const toggleEnabled = (next) => {
    const trimmed = cron.trim();
    if (next && (trimmed === "" || !isValidCron(trimmed))) {
      setError(t("detail.schedule.invalid"));
      return;
    }
    setError(void 0);
    if (next && trimmed !== schedule?.cron) controller.setSchedule(task.id, { cron: trimmed });
    if (controller.setSchedule(task.id, { enabled: next })) setEnabled(next);
  };
  const applyPreset = (preset) => {
    if (preset === "") return;
    setCron(preset);
    setError(void 0);
    controller.setSchedule(task.id, { cron: preset });
  };
  const nextLabel = !enabled || nextRunAt === void 0 ? t("detail.schedule.notScheduled") : nextRunAt <= Date.now() ? t("detail.schedule.dueSoon") : new Date(nextRunAt).toLocaleString();
  const lastLabel = lastTriggeredAt === void 0 ? "\u2014" : new Date(lastTriggeredAt).toLocaleString();
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("section", { className: kanban_default["bga-kb-det-section"], children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("h4", { children: t("detail.schedule") }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("label", { className: kanban_default["bga-kb-sch-toggle"], children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
        "input",
        {
          type: "checkbox",
          checked: enabled,
          onChange: (event) => {
            toggleEnabled(event.target.checked);
          }
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { children: t("detail.schedule.enable") })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: kanban_default["bga-kb-sch-row"], children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
        "input",
        {
          className: `${kanban_default["bga-kb-input"]} ${kanban_default["bga-kb-sch-input"]}${error !== void 0 ? ` ${kanban_default["bga-kb-sch-input--err"]}` : ""}`,
          value: cron,
          placeholder: "0 9 * * *",
          spellCheck: false,
          "aria-label": t("detail.schedule.cron"),
          onChange: (event) => {
            setCron(event.target.value);
            setError(void 0);
          },
          onBlur: () => {
            saveCron(cron);
          },
          onKeyDown: (event) => {
            if (event.key === "Enter") saveCron(cron);
          }
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
        "select",
        {
          className: kanban_default["bga-kb-sch-preset"],
          value: "",
          "aria-label": t("detail.schedule.presets"),
          onChange: (event) => {
            applyPreset(event.target.value);
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("option", { value: "", children: [
              t("detail.schedule.presets"),
              "\u2026"
            ] }),
            SCHEDULE_PRESETS.map((preset) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("option", { value: preset.cron, children: t(preset.label) }, preset.cron))
          ]
        }
      )
    ] }),
    error !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { className: kanban_default["bga-kb-fld-error"], children: error }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("p", { className: kanban_default["bga-kb-sch-meta"], children: [
      t("detail.schedule.nextRun"),
      " ",
      nextLabel,
      " \xB7 ",
      t("detail.schedule.lastTriggered"),
      " ",
      lastLabel
    ] })
  ] });
}
function TitleField({ controller, task }) {
  const editable = task.status === "backlog" || task.status === "todo";
  const [draft, setDraft] = (0, import_react10.useState)(task.title);
  (0, import_react10.useEffect)(() => {
    setDraft(task.title);
  }, [task.id, task.title]);
  const save = () => {
    const trimmed = draft.trim();
    setDraft(trimmed);
    if (trimmed !== "" && trimmed !== task.title) controller.updateTask(task.id, { title: trimmed });
  };
  if (!editable) {
    return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("h2", { className: kanban_default["bga-kb-det-title"], children: task.title });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
    "input",
    {
      className: kanban_default["bga-kb-input"],
      "aria-label": t("detail.title"),
      value: draft,
      spellCheck: false,
      onChange: (event) => {
        setDraft(event.target.value);
      },
      onBlur: save,
      onKeyDown: (event) => {
        if (event.key === "Enter") save();
      }
    }
  );
}
function DescriptionSection({ controller, task }) {
  const editable = task.status === "backlog" || task.status === "todo";
  const [draft, setDraft] = (0, import_react10.useState)(task.description);
  (0, import_react10.useEffect)(() => {
    setDraft(task.description);
  }, [task.id, task.description]);
  const save = () => {
    const trimmed = draft.trim();
    setDraft(trimmed);
    if (trimmed !== task.description) controller.updateTask(task.id, { description: trimmed });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("section", { className: kanban_default["bga-kb-det-section"], children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("h4", { children: t("detail.description") }),
    editable ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
      "textarea",
      {
        className: kanban_default["bga-kb-input"],
        rows: 3,
        value: draft,
        spellCheck: false,
        onChange: (event) => {
          setDraft(event.target.value);
        },
        onBlur: save,
        onKeyDown: (event) => {
          if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) save();
        }
      }
    ) : /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { className: kanban_default["bga-kb-det-text"], children: task.description !== "" ? task.description : "\u2014" })
  ] });
}
function PromptSection({ controller, task }) {
  const editable = task.status === "backlog" || task.status === "todo";
  const [draft, setDraft] = (0, import_react10.useState)(task.prompt);
  (0, import_react10.useEffect)(() => {
    setDraft(task.prompt);
  }, [task.id, task.prompt]);
  const save = () => {
    const trimmed = draft.trim();
    setDraft(trimmed);
    if (trimmed !== task.prompt) controller.updateTask(task.id, { prompt: trimmed });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("section", { className: kanban_default["bga-kb-det-section"], children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("h4", { children: t("detail.prompt") }),
    editable ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
      "textarea",
      {
        className: kanban_default["bga-kb-input"],
        rows: 4,
        value: draft,
        placeholder: t("new.promptPlaceholder"),
        spellCheck: false,
        onChange: (event) => {
          setDraft(event.target.value);
        },
        onBlur: save,
        onKeyDown: (event) => {
          if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) save();
        }
      }
    ) : /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("pre", { className: kanban_default["bga-kb-prompt"], children: task.prompt !== "" ? task.prompt : task.title })
  ] });
}
function TaskDetail({ controller, task }) {
  const [confirmDelete, setConfirmDelete] = (0, import_react10.useState)(false);
  const blurActive = () => {
    const el = document.activeElement;
    if (el instanceof HTMLElement && el !== document.body) el.blur();
  };
  (0, import_react10.useEffect)(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape" && !confirmDelete) {
        controller.closeTask();
        blurActive();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [controller, confirmDelete]);
  const running = task.status === "running";
  const [latest, setLatest] = (0, import_react10.useState)(task);
  (0, import_react10.useEffect)(() => {
    setLatest(task);
  }, [task]);
  const current = latest;
  return (0, import_react_dom2.createPortal)(
    // 遮罩：点击遮罩本身（而非详情面板）即关闭。
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: kanban_default["bga-kb-modal-bg"], onMouseDown: (event) => {
      if (event.target === event.currentTarget) controller.closeTask();
    }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: kanban_default["bga-kb-det"], role: "dialog", "aria-label": t("detail.title"), children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
          "button",
          {
            type: "button",
            className: kanban_default["bga-kb-det-close"],
            "aria-label": t("detail.close"),
            onClick: () => {
              controller.closeTask();
            },
            children: "\xD7"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("header", { className: kanban_default["bga-kb-det-header"], children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(TitleField, { controller, task: current }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: kanban_default["bga-kb-badge"], "data-status": current.status, children: t(STATUS_KEY[current.status]) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: kanban_default["bga-kb-det-body"], children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(DescriptionSection, { controller, task: current }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(PromptSection, { controller, task: current }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(ExecutionSettingsSection, { controller, task: current }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(ScheduleSection, { controller, task: current }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("section", { className: kanban_default["bga-kb-det-section"], children: [
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("h4", { children: t("detail.execution") }),
            current.executions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { className: kanban_default["bga-kb-det-text"], children: t("detail.noExecution") }) : /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("ul", { className: kanban_default["bga-kb-ex-list"], children: [...current.executions].reverse().map((execution) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
              ExecutionRow,
              {
                execution,
                onOpen: (sessionId) => {
                  controller.openSession(sessionId);
                }
              },
              execution.id
            )) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("section", { className: kanban_default["bga-kb-det-section"], children: [
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("h4", { children: t("board.status") }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: kanban_default["bga-kb-move"], children: MANUAL_STATUSES.map((status) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
              "button",
              {
                type: "button",
                className: kanban_default["bga-kb-btn-ghost"],
                disabled: current.status === status || running,
                onClick: () => {
                  controller.moveTask(current.id, status);
                },
                children: t(`status.move.${status}`)
              },
              status
            )) })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("footer", { className: kanban_default["bga-kb-det-foot"], children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
            "button",
            {
              type: "button",
              className: kanban_default["bga-kb-btn-primary"],
              disabled: running,
              onClick: () => {
                controller.closeTask();
                void controller.rerunTask(current.id);
              },
              children: current.executions.length === 0 ? t("detail.run") : t("detail.rerun")
            }
          ),
          current.archivedAt !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
            "button",
            {
              type: "button",
              className: kanban_default["bga-kb-btn-primary"],
              onClick: () => {
                controller.restoreTask(current.id);
                controller.closeTask();
              },
              children: t("detail.restore")
            }
          ) : (current.status === "done" || current.status === "failed") && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
            "button",
            {
              type: "button",
              className: kanban_default["bga-kb-btn-ghost"],
              onClick: () => {
                controller.archiveTask(current.id);
                controller.closeTask();
              },
              children: t("detail.archive")
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
            "button",
            {
              type: "button",
              className: kanban_default["bga-kb-btn-danger"],
              onClick: () => {
                setConfirmDelete(true);
              },
              children: t("detail.delete")
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("span", { className: kanban_default["bga-kb-det-meta"], children: [
            t("board.created"),
            " ",
            formatTime(current.createdAt),
            current.archivedAt !== void 0 && ` \xB7 ${t("detail.archivedAt", { time: formatTime(current.archivedAt) })}`
          ] })
        ] })
      ] }),
      confirmDelete && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
        ConfirmDialog,
        {
          title: t("delete.title"),
          message: t("delete.confirm", { name: current.title }),
          confirmLabel: t("delete.ok"),
          danger: true,
          onCancel: () => {
            setConfirmDelete(false);
          },
          onConfirm: () => {
            setConfirmDelete(false);
            controller.deleteTask(current.id);
            controller.closeTask();
          }
        }
      )
    ] }),
    document.body
  );
}

// src/client/task-board/board/TaskBoard.tsx
var import_jsx_runtime9 = require("react/jsx-runtime");
var STATUS_KEY2 = {
  backlog: "board.status.backlog",
  todo: "board.status.todo",
  running: "board.status.running",
  done: "board.status.done",
  failed: "board.status.failed"
};
function matchesFilter(task, filter) {
  if (filter.trim() === "") return true;
  const needle = filter.trim().toLowerCase();
  return task.title.toLowerCase().includes(needle) || task.description.toLowerCase().includes(needle);
}
var MemoTaskCard = (0, import_react11.memo)(function MemoTaskCard2({ task, onOpen, onDelete }) {
  const onClick = (0, import_react11.useCallback)(() => {
    onOpen(task.id);
  }, [task.id, onOpen]);
  const onDeleteTask = (0, import_react11.useCallback)(() => {
    onDelete(task.id);
  }, [task.id, onDelete]);
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(TaskCard, { task, onClick, onDelete: onDeleteTask });
});
function TaskBoard({ controller, embedded = false }) {
  const [snapshot, setSnapshot] = (0, import_react11.useState)(controller.getSnapshot());
  (0, import_react11.useEffect)(
    () => controller.subscribe(() => setSnapshot(controller.getSnapshot())),
    [controller]
  );
  const [filter, setFilter] = (0, import_react11.useState)("");
  const [quick, setQuick] = (0, import_react11.useState)("");
  const [showNew, setShowNew] = (0, import_react11.useState)(false);
  const [confirmDeleteId, setConfirmDeleteId] = (0, import_react11.useState)(void 0);
  const selected = selectedTaskOf(snapshot);
  const archiveView = snapshot.archiveView;
  const confirmTarget = confirmDeleteId === void 0 ? void 0 : snapshot.tasks.find((task) => task.id === confirmDeleteId);
  const visible = snapshot.tasks.filter(
    (task) => (archiveView ? task.archivedAt !== void 0 : task.archivedAt === void 0) && matchesFilter(task, filter)
  );
  const openTask = (0, import_react11.useCallback)((id) => {
    controller.openTask(id);
  }, [controller]);
  const requestDelete = (0, import_react11.useCallback)((id) => {
    setConfirmDeleteId(id);
  }, []);
  const quickAdd = (0, import_react11.useCallback)(() => {
    const title = quick.trim();
    if (title === "") return;
    controller.createTask({ title, description: "", prompt: "" });
    setQuick("");
  }, [quick, controller]);
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: kanban_default["bga-kb-board"], "data-bga-kb-root": "", children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("header", { className: kanban_default["bga-kb-board-header"], children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
        "input",
        {
          className: kanban_default["bga-kb-search"],
          type: "search",
          placeholder: t("board.search"),
          value: filter,
          onChange: (event) => {
            setFilter(event.target.value);
          },
          "aria-label": t("board.search")
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
        "button",
        {
          type: "button",
          className: archiveView ? kanban_default["bga-kb-btn-primary"] : kanban_default["bga-kb-btn-ghost"],
          onClick: () => {
            controller.toggleArchiveView();
          },
          children: archiveView ? t("board.backToBoard") : t("board.archiveView", { count: String(snapshot.tasks.filter((task) => task.archivedAt !== void 0).length) })
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
        "button",
        {
          type: "button",
          className: kanban_default["bga-kb-btn-primary"],
          onClick: () => {
            setShowNew(true);
          },
          children: [
            "+ ",
            t("board.new")
          ]
        }
      ),
      !embedded && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
        "button",
        {
          type: "button",
          className: kanban_default["bga-kb-btn-ghost"],
          onClick: () => {
            controller.closeBoard();
          },
          children: t("board.close")
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
        "input",
        {
          className: kanban_default["bga-kb-quick"],
          type: "text",
          placeholder: t("board.quickAdd"),
          value: quick,
          onChange: (event) => {
            setQuick(event.target.value);
          },
          onKeyDown: (event) => {
            if (event.key === "Enter") quickAdd();
          },
          "aria-label": t("board.quickAdd")
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: kanban_default["bga-kb-cols"], children: archiveView ? /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("section", { className: kanban_default["bga-kb-col"], "data-status": "archived", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("header", { className: kanban_default["bga-kb-col-header"], children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("h3", { className: kanban_default["bga-kb-col-title"], children: t("board.archive") }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: kanban_default["bga-kb-col-count"], children: visible.length })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: kanban_default["bga-kb-cards"], children: [
        visible.map((task) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(MemoTaskCard, { task, onOpen: openTask, onDelete: requestDelete }, task.id)),
        visible.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: kanban_default["bga-kb-col-empty"], children: t("archive.empty") })
      ] })
    ] }) : COLUMNS.map((column) => {
      const tasks = visible.filter((task) => task.status === column.status);
      return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("section", { className: kanban_default["bga-kb-col"], "data-status": column.status, children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("header", { className: kanban_default["bga-kb-col-header"], children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: kanban_default["bga-kb-dot"], "data-status": column.status, "aria-hidden": "true" }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("h3", { className: kanban_default["bga-kb-col-title"], children: t(STATUS_KEY2[column.status]) }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: kanban_default["bga-kb-col-count"], children: tasks.length })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: kanban_default["bga-kb-cards"], children: [
          tasks.map((task) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(MemoTaskCard, { task, onOpen: openTask, onDelete: requestDelete }, task.id)),
          tasks.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: kanban_default["bga-kb-col-empty"], children: t("board.empty") })
        ] })
      ] }, column.status);
    }) }),
    selected !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(TaskDetail, { controller, task: selected }),
    showNew && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
      NewTaskModal,
      {
        controller,
        onClose: () => {
          setShowNew(false);
        }
      }
    ),
    confirmTarget !== void 0 && (0, import_react_dom3.createPortal)(
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
        ConfirmDialog,
        {
          title: t("delete.title"),
          message: t("delete.confirm", { name: confirmTarget.title }),
          confirmLabel: t("delete.ok"),
          danger: true,
          onCancel: () => {
            setConfirmDeleteId(void 0);
          },
          onConfirm: () => {
            controller.deleteTask(confirmTarget.id);
            setConfirmDeleteId(void 0);
          }
        }
      ),
      document.body
    )
  ] });
}

// src/client/task-board/board-mount.tsx
var import_jsx_runtime10 = require("react/jsx-runtime");
var CENTER_SELECTOR = '[data-pane="conversation"], [class*="centerCol"]';
var VIEW_ATTR = "data-bga-kb-view";
var OPEN_ATTR = "data-bga-kb-open";
var BGA_PANEL_EVENT = "bga-kb-panel-activate";
var BGA_PANEL_ID = "bga-kb";
function isRivalAttr(name) {
  return name.startsWith("data-") && name !== OPEN_ATTR && (name.endsWith("-active") || name.endsWith("-open"));
}
function rivalAttrsOnHtml() {
  const el = document.documentElement;
  const attrs = [];
  for (const { name } of el.attributes) {
    if (isRivalAttr(name)) attrs.push(name);
  }
  return attrs;
}
function clearRivalAttrs() {
  for (const name of rivalAttrsOnHtml()) {
    document.documentElement.removeAttribute(name);
  }
}
function closeAnyActiveSidebarEntry() {
  const btn = document.querySelector("[data-active]");
  if (btn !== null && document.documentElement.contains(btn)) {
    btn.click();
  }
}
function findCenter() {
  return document.querySelector(CENTER_SELECTOR) ?? void 0;
}
function mountBoard(controller) {
  let root;
  let container;
  let active = false;
  const ensure = () => {
    if (container !== void 0) return;
    const center = findCenter();
    if (center === void 0) return;
    container = document.createElement("div");
    container.setAttribute(VIEW_ATTR, "");
    Object.assign(container.style, {
      position: "absolute",
      inset: "0",
      zIndex: "60",
      display: "none",
      background: "var(--dsw-alias-bg-base)"
    });
    center.appendChild(container);
    root = (0, import_client.createRoot)(container);
    root.render(/* @__PURE__ */ (0, import_jsx_runtime10.jsx)(TaskBoard, { controller }));
  };
  const applyOpen = () => {
    const open = controller.getSnapshot().boardOpen;
    if (open && !active) {
      ensure();
      active = true;
      document.documentElement.setAttribute(OPEN_ATTR, "");
      clearRivalAttrs();
      if (container !== void 0) container.style.display = "flex";
      closeAnyActiveSidebarEntry();
      document.dispatchEvent(new CustomEvent(BGA_PANEL_EVENT, { detail: BGA_PANEL_ID }));
    } else if (!open && active) {
      active = false;
      document.documentElement.removeAttribute(OPEN_ATTR);
      if (container !== void 0) container.style.display = "none";
    }
  };
  const onBgaPanel = (e) => {
    if (e.detail !== BGA_PANEL_ID) controller.closeBoard();
  };
  document.addEventListener(BGA_PANEL_EVENT, onBgaPanel);
  const observer = new MutationObserver((mutations) => {
    if (!controller.getSnapshot().boardOpen) return;
    for (const m of mutations) {
      const name = m.attributeName ?? "";
      if (m.type === "attributes" && isRivalAttr(name) && document.documentElement.hasAttribute(name)) {
        controller.closeBoard();
        return;
      }
    }
  });
  observer.observe(document.documentElement, { attributes: true });
  const SIDEBAR_SEL = '[class*="sessionRow"], [class*="projectRow"], [class*="searchResultRow"], [class*="searchResultWorkspace"], [class*="newSession"]';
  const onSidebarClick = (e) => {
    if (!controller.getSnapshot().boardOpen) return;
    if (e.target?.closest(SIDEBAR_SEL) !== null) controller.closeBoard();
  };
  document.addEventListener("click", onSidebarClick, true);
  const unsub = controller.subscribe(applyOpen);
  applyOpen();
  return () => {
    observer.disconnect();
    document.removeEventListener(BGA_PANEL_EVENT, onBgaPanel);
    document.removeEventListener("click", onSidebarClick, true);
    document.documentElement.removeAttribute(OPEN_ATTR);
    unsub();
    root?.unmount();
    root = void 0;
    container?.remove();
    container = void 0;
  };
}

// src/client/task-board/embed-mount.tsx
var import_client2 = require("react-dom/client");

// src/client/task-board/TaskBoardEmbed.tsx
var import_react12 = require("react");

// src/client/hide-hero-headline.ts
var HERO_HEADLINES = ["\u63A2\u7D22\u672A\u81F3\u4E4B\u5883", "Into the Unknown"];
var HIDE_HERO_MARK = "bgaHeroHidden";
function setupHeroHeadlineHider() {
  let timer;
  const hidePass = () => {
    const root = document.querySelector("[data-phase]");
    if (root === null || root.getAttribute("data-phase") !== "hero") return;
    for (const span of root.querySelectorAll("span")) {
      const text = span.textContent?.trim();
      if (text === void 0 || text.length === 0 || !HERO_HEADLINES.includes(text)) continue;
      const row = span.parentElement;
      if (row === null || row.dataset[HIDE_HERO_MARK] !== void 0) continue;
      row.dataset[HIDE_HERO_MARK] = "";
      row.style.display = "none";
    }
  };
  const schedule = () => {
    if (timer !== void 0) return;
    timer = window.setTimeout(() => {
      timer = void 0;
      hidePass();
    }, 50);
  };
  hidePass();
  const observer = new MutationObserver(schedule);
  observer.observe(document.body, { childList: true, subtree: true });
  return () => {
    observer.disconnect();
    if (timer !== void 0) window.clearTimeout(timer);
  };
}

// src/client/task-board/embed.module.css
var embed_default = {
  "bga-kb-embed": "embed_bga-kb-embed",
  "bga-kb-embed-welcome": "embed_bga-kb-embed-welcome",
  "bga-kb-embed-body": "embed_bga-kb-embed-body"
};

// src/client/WelcomeBannerRow.tsx
var import_jsx_runtime11 = require("react/jsx-runtime");
var avatarStyle2 = {
  width: 40,
  height: 40,
  borderRadius: "50%",
  objectFit: "cover",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)"
};
var textStyle2 = {
  fontSize: 18,
  lineHeight: 1.2,
  fontWeight: 600,
  color: "var(--dsw-alias-label-primary, #222)"
};
function WelcomeBannerRow() {
  const config = useBannerConfig(DEFAULT_TEXT);
  if (!config.show) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: embed_default["bga-kb-embed-welcome"], "data-bga-welcome-row": "", children: [
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("img", { src: AVATAR_URL, alt: "", style: avatarStyle2 }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: textStyle2, children: config.text })
  ] });
}

// src/client/task-board/TaskBoardEmbed.tsx
var import_jsx_runtime12 = require("react/jsx-runtime");
var CENTER_SELECTOR2 = '[data-pane="conversation"], [class*="centerCol"]';
var OPEN_ATTR2 = "data-bga-kb-open";
var EMBED_ATTR = "data-bga-kb-embed";
var SEAT_SELECTOR = "[data-composer-seat]";
var EMBED_INSET = 4;
var EMBED_BOTTOM_GAP = -8;
function TaskBoardEmbed({ controller }) {
  const ref = (0, import_react12.useRef)(null);
  (0, import_react12.useEffect)(() => {
    const el = ref.current;
    if (el === null) return;
    let lastPhase = null;
    let lastKey = "";
    let observedRoot = null;
    let resizeObserver;
    const ensureObserved = (root) => {
      if (root === null || root === observedRoot) return;
      if (typeof ResizeObserver !== "undefined") {
        resizeObserver?.disconnect();
        resizeObserver = new ResizeObserver(update);
        resizeObserver.observe(root);
      }
      observedRoot = root;
    };
    const hide = (current) => {
      document.documentElement.removeAttribute(EMBED_ATTR);
      current.style.display = "none";
    };
    const update = () => {
      const current = ref.current;
      if (current === null) return;
      const root = document.querySelector("[data-phase]");
      ensureObserved(root);
      const phase = root?.getAttribute("data-phase") ?? null;
      const hidden = phase !== "hero" || document.documentElement.hasAttribute(OPEN_ATTR2);
      if (phase !== lastPhase) {
        lastPhase = phase;
        lastKey = "";
      }
      if (hidden) {
        hide(current);
        return;
      }
      const column = root.querySelector(CENTER_SELECTOR2) ?? root;
      const rect = column.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) {
        hide(current);
        return;
      }
      const seat = root.querySelector(SEAT_SELECTOR);
      const seatRect = seat?.getBoundingClientRect();
      const top = rect.top + 12;
      const bottom = seatRect !== void 0 && seatRect.height > 0 ? seatRect.top - EMBED_BOTTOM_GAP : Math.min(rect.bottom - 240, top + 560);
      const key = `${Math.round(rect.left)}x${Math.round(top)}x${Math.round(bottom)}x${Math.round(rect.width)}`;
      if (key === lastKey && current.style.display === "flex") return;
      lastKey = key;
      current.style.display = "flex";
      current.style.left = `${rect.left + EMBED_INSET}px`;
      current.style.top = `${Math.round(top)}px`;
      current.style.width = `${Math.max(0, rect.width - EMBED_INSET * 2)}px`;
      current.style.height = `${Math.max(220, Math.round(bottom - top))}px`;
      document.documentElement.setAttribute(EMBED_ATTR, "");
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-phase"]
    });
    observer.observe(document.documentElement, { attributes: true });
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener("resize", update);
      document.documentElement.removeAttribute(EMBED_ATTR);
    };
  }, []);
  (0, import_react12.useEffect)(() => setupHeroHeadlineHider(), []);
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { ref, className: embed_default["bga-kb-embed"], "data-bga-kb-embed-view": "", children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(WelcomeBannerRow, {}),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: embed_default["bga-kb-embed-body"], children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(TaskBoard, { controller, embedded: true }) })
  ] });
}

// src/client/task-board/embed-mount.tsx
var import_jsx_runtime13 = require("react/jsx-runtime");
var CONTAINER_ATTR = "data-bga-kb-embed-root";
function mountBoardEmbed(controller) {
  if (typeof document !== "undefined" && document.querySelector(`[${CONTAINER_ATTR}]`) !== null) {
    return () => {
    };
  }
  const container = document.createElement("div");
  container.setAttribute(CONTAINER_ATTR, "");
  container.style.display = "contents";
  document.body.appendChild(container);
  const root = (0, import_client2.createRoot)(container);
  root.render(/* @__PURE__ */ (0, import_jsx_runtime13.jsx)(TaskBoardEmbed, { controller }));
  return () => {
    root.unmount();
    container.remove();
  };
}

// src/client/task-board/sidebar-entry.ts
var LAUNCHER_ATTR = "data-bga-kb-launcher";
var ICON_SVG = `<svg viewBox="0 0 16 16" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2.5" width="12" height="11" rx="1.5"/><path d="M2 6.5h12M6.5 6.5v7"/></svg>`;
function findSidebarRoot() {
  const col = document.querySelector('[data-pane="sidebar"], [class*="sidebarCol"]');
  if (col === null) return void 0;
  const logoOwner = col.querySelector('[class*="logoRow"]')?.parentElement;
  return logoOwner ?? col.firstElementChild;
}
function findNewSessionBtn(root) {
  const nested = root.querySelector('button[class*="newSession"]');
  if (nested !== null) return nested;
  for (const child of root.children) {
    if (child.tagName === "BUTTON") return child;
  }
  return void 0;
}
function buildLauncher(controller) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.setAttribute(LAUNCHER_ATTR, "");
  btn.setAttribute("aria-label", t("entry.label"));
  Object.assign(btn.style, {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    width: "100%",
    height: "32px",
    padding: "0 12px 0 7px",
    background: "transparent",
    border: "none",
    borderRadius: "8px",
    color: "var(--dsw-alias-label-secondary)",
    cursor: "pointer",
    fontSize: "13px",
    whiteSpace: "nowrap",
    textAlign: "left",
    font: "inherit"
  });
  const icon = document.createElement("span");
  icon.innerHTML = ICON_SVG;
  Object.assign(icon.style, { display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none" });
  const label = document.createElement("span");
  label.textContent = t("entry.label");
  Object.assign(label.style, { overflow: "hidden", textOverflow: "ellipsis", flex: "1" });
  btn.append(icon, label);
  btn.addEventListener("mouseenter", () => {
    btn.style.background = "var(--dsw-specific-sidebar-nav-item-hover)";
    btn.style.color = "var(--dsw-alias-label-primary)";
  });
  btn.addEventListener("mouseleave", () => {
    if (!controller.getSnapshot().boardOpen) {
      btn.style.background = "transparent";
      btn.style.color = "var(--dsw-alias-label-secondary)";
    }
  });
  btn.addEventListener("click", () => {
    controller.getSnapshot().boardOpen ? controller.closeBoard() : controller.openBoard();
  });
  return btn;
}
function mountSidebarEntry(controller) {
  if (typeof document !== "undefined" && document.querySelector(`[${LAUNCHER_ATTR}]`) !== null) {
    return () => {
    };
  }
  const launcher = buildLauncher(controller);
  const state = { hovering: false };
  const isCollapsed = () => document.querySelector("[data-sidebar-collapsed]") !== null;
  const applyColors = () => {
    const open = controller.getSnapshot().boardOpen;
    const collapsed = isCollapsed();
    launcher.style.background = state.hovering || open ? "var(--dsw-specific-sidebar-nav-item-active)" : collapsed ? "transparent" : "var(--dsw-specific-sidebar-nav-item-hover)";
    launcher.style.color = "var(--dsw-alias-label-primary)";
    launcher.style.fontWeight = open ? "600" : "normal";
    launcher.style.marginTop = collapsed ? "-10px" : "0";
  };
  launcher.addEventListener("mouseenter", () => {
    state.hovering = true;
    applyColors();
  });
  launcher.addEventListener("mouseleave", () => {
    state.hovering = false;
    applyColors();
  });
  let root;
  let placed = false;
  const place = () => {
    if (root !== void 0 && !root.isConnected) {
      root = void 0;
      placed = false;
    }
    if (placed && document.body.contains(launcher)) return;
    root ??= findSidebarRoot();
    if (root === void 0) return;
    const anchor = findNewSessionBtn(root);
    if (anchor?.parentElement === root) {
      root.insertBefore(launcher, anchor.nextSibling);
      placed = true;
    }
  };
  place();
  const unsub = controller.subscribe(applyColors);
  applyColors();
  let raf;
  const tick = () => {
    place();
    applyColors();
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => {
    if (raf !== void 0) cancelAnimationFrame(raf);
    unsub();
    launcher.remove();
  };
}

// src/client/task-board/PluginSettingsCard.tsx
var import_react13 = require("react");

// src/client/task-board/cfg-card.module.css
var cfg_card_default = {
  "bga-kb-cfg": "cfg_card_bga-kb-cfg",
  "bga-kb-cfg--open": "cfg_card_bga-kb-cfg--open",
  "bga-kb-cfg-header": "cfg_card_bga-kb-cfg-header",
  "bga-kb-cfg-head-text": "cfg_card_bga-kb-cfg-head-text",
  "bga-kb-cfg-name": "cfg_card_bga-kb-cfg-name",
  "bga-kb-cfg-desc": "cfg_card_bga-kb-cfg-desc",
  "bga-kb-cfg-pending": "cfg_card_bga-kb-cfg-pending",
  "bga-kb-cfg-chevron": "cfg_card_bga-kb-cfg-chevron",
  "bga-kb-cfg-chevron--open": "cfg_card_bga-kb-cfg-chevron--open",
  "bga-kb-cfg-body": "cfg_card_bga-kb-cfg-body",
  "bga-kb-cfg-ro": "cfg_card_bga-kb-cfg-ro",
  "bga-kb-cfg-hidden": "cfg_card_bga-kb-cfg-hidden",
  "bga-kb-cfg-foot": "cfg_card_bga-kb-cfg-foot",
  "bga-kb-cfg-failed": "cfg_card_bga-kb-cfg-failed",
  "bga-kb-cfg-discard": "cfg_card_bga-kb-cfg-discard",
  "bga-kb-cfg-save": "cfg_card_bga-kb-cfg-save",
  "bga-kb-cfg-field": "cfg_card_bga-kb-cfg-field",
  "bga-kb-cfg-head": "cfg_card_bga-kb-cfg-head",
  "bga-kb-cfg-label": "cfg_card_bga-kb-cfg-label",
  "bga-kb-cfg-badges": "cfg_card_bga-kb-cfg-badges",
  "bga-kb-cfg-badge": "cfg_card_bga-kb-cfg-badge",
  "bga-kb-cfg-reset": "cfg_card_bga-kb-cfg-reset",
  "bga-kb-cfg-input": "cfg_card_bga-kb-cfg-input",
  "bga-kb-cfg-select": "cfg_card_bga-kb-cfg-select",
  "bga-kb-cfg-input--err": "cfg_card_bga-kb-cfg-input--err",
  "bga-kb-cfg-invalid": "cfg_card_bga-kb-cfg-invalid",
  "bga-kb-cfg-hint": "cfg_card_bga-kb-cfg-hint"
};

// src/client/task-board/PluginSettingsCard.tsx
var import_jsx_runtime14 = require("react/jsx-runtime");
function PluginSettingsCard(props) {
  const [open, setOpen] = (0, import_react13.useState)(false);
  const { state } = props;
  if (!state.available) return null;
  const title = props.t(props.titleKey);
  const description = props.t(props.descriptionKey);
  const blocked = !state.dirty || state.invalid || state.saving;
  const cardClass = open ? `${cfg_card_default["bga-kb-cfg--open"]} ${cfg_card_default["bga-kb-cfg"]}` : cfg_card_default["bga-kb-cfg"];
  if (!state.exposed) {
    return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("li", { className: cardClass, children: [
      /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
        "button",
        {
          type: "button",
          className: cfg_card_default["bga-kb-cfg-header"],
          "aria-expanded": open,
          "aria-label": `${props.t(open ? "settings.collapse" : "settings.expand")}: ${title}`,
          onClick: () => {
            setOpen(!open);
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("span", { className: cfg_card_default["bga-kb-cfg-head-text"], children: [
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: cfg_card_default["bga-kb-cfg-name"], title, children: title }),
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: cfg_card_default["bga-kb-cfg-desc"], title: description, children: description })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
              "svg",
              {
                width: "14",
                height: "14",
                viewBox: "0 0 14 14",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg",
                className: open ? `${cfg_card_default["bga-kb-cfg-chevron"]} ${cfg_card_default["bga-kb-cfg-chevron--open"]}` : cfg_card_default["bga-kb-cfg-chevron"],
                children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
                  "path",
                  {
                    d: "M11.8486 5.5L11.4238 5.92383L8.69727 8.65137C8.44157 8.90706 8.21562 9.13382 8.01172 9.29785C7.79912 9.46883 7.55595 9.61756 7.25 9.66602C7.08435 9.69222 6.91565 9.69222 6.75 9.66602C6.44405 9.61756 6.20088 9.46883 5.98828 9.29785C5.78438 9.13382 5.55843 8.90706 5.30273 8.65137L2.57617 5.92383L2.15137 5.5L3 4.65137L3.42383 5.07617L6.15137 7.80273C6.42595 8.07732 6.59876 8.24849 6.74023 8.3623C6.87291 8.46904 6.92272 8.47813 6.9375 8.48047C6.97895 8.48703 7.02105 8.48703 7.0625 8.48047C7.07728 8.47813 7.12709 8.46904 7.25977 8.3623C7.40124 8.24849 7.57405 8.07732 7.84863 7.80273L10.5762 5.07617L11 4.65137L11.8486 5.5Z",
                    fill: "currentColor"
                  }
                )
              }
            )
          ]
        }
      ),
      open ? /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: cfg_card_default["bga-kb-cfg-body"], children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("p", { className: cfg_card_default["bga-kb-cfg-hidden"], role: "status", children: props.t("settings.notExposed") }) }) : null
    ] });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("li", { className: cardClass, children: [
    /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
      "button",
      {
        type: "button",
        className: cfg_card_default["bga-kb-cfg-header"],
        "aria-expanded": open,
        "aria-label": `${props.t(open ? "settings.collapse" : "settings.expand")}: ${title}`,
        onClick: () => {
          setOpen(!open);
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("span", { className: cfg_card_default["bga-kb-cfg-head-text"], children: [
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: cfg_card_default["bga-kb-cfg-name"], title, children: title }),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: cfg_card_default["bga-kb-cfg-desc"], title: description, children: description })
          ] }),
          state.dirty ? /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: cfg_card_default["bga-kb-cfg-pending"], title: props.t("settings.unsaved"), children: props.t("settings.unsaved") }) : null,
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
            "svg",
            {
              width: "14",
              height: "14",
              viewBox: "0 0 14 14",
              fill: "none",
              xmlns: "http://www.w3.org/2000/svg",
              className: open ? `${cfg_card_default["bga-kb-cfg-chevron"]} ${cfg_card_default["bga-kb-cfg-chevron--open"]}` : cfg_card_default["bga-kb-cfg-chevron"],
              children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
                "path",
                {
                  d: "M11.8486 5.5L11.4238 5.92383L8.69727 8.65137C8.44157 8.90706 8.21562 9.13382 8.01172 9.29785C7.79912 9.46883 7.55595 9.61756 7.25 9.66602C7.08435 9.69222 6.91565 9.69222 6.75 9.66602C6.44405 9.61756 6.20088 9.46883 5.98828 9.29785C5.78438 9.13382 5.55843 8.90706 5.30273 8.65137L2.57617 5.92383L2.15137 5.5L3 4.65137L3.42383 5.07617L6.15137 7.80273C6.42595 8.07732 6.59876 8.24849 6.74023 8.3623C6.87291 8.46904 6.92272 8.47813 6.9375 8.48047C6.97895 8.48703 7.02105 8.48703 7.0625 8.48047C7.07728 8.47813 7.12709 8.46904 7.25977 8.3623C7.40124 8.24849 7.57405 8.07732 7.84863 7.80273L10.5762 5.07617L11 4.65137L11.8486 5.5Z",
                  fill: "currentColor"
                }
              )
            }
          )
        ]
      }
    ),
    open ? /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: cfg_card_default["bga-kb-cfg-body"], children: [
      !state.writable ? /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("p", { className: cfg_card_default["bga-kb-cfg-ro"], role: "status", children: props.t("settings.readOnly") }) : null,
      props.children,
      /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: cfg_card_default["bga-kb-cfg-foot"], children: [
        state.failed ? /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("p", { className: cfg_card_default["bga-kb-cfg-failed"], role: "status", children: [
          props.t("settings.saveFailed"),
          state.failedReason ? " - " + state.failedReason : ""
        ] }) : null,
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
          "button",
          {
            type: "button",
            className: cfg_card_default["bga-kb-cfg-discard"],
            disabled: !state.dirty || state.saving,
            onClick: props.onDiscard,
            children: props.t("settings.discard")
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
          "button",
          {
            type: "button",
            className: cfg_card_default["bga-kb-cfg-save"],
            disabled: blocked,
            onClick: props.onSave,
            children: props.t(!state.saving ? "settings.save" : "settings.saving")
          }
        )
      ] })
    ] }) : null
  ] });
}
function BooleanField(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: cfg_card_default["bga-kb-cfg-field"], children: [
    /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: cfg_card_default["bga-kb-cfg-head"], children: [
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("label", { className: cfg_card_default["bga-kb-cfg-label"], htmlFor: props.id, children: props.label }),
      props.overridden ? /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("span", { className: cfg_card_default["bga-kb-cfg-badges"], children: [
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: cfg_card_default["bga-kb-cfg-badge"], children: props.overriddenLabel }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
          "button",
          {
            type: "button",
            className: cfg_card_default["bga-kb-cfg-reset"],
            disabled: props.disabled,
            onClick: props.onReset,
            children: props.resetLabel
          }
        )
      ] }) : null
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
      "select",
      {
        id: props.id,
        className: cfg_card_default["bga-kb-cfg-select"],
        value: props.text,
        disabled: props.disabled,
        onChange: (event) => {
          props.onEdit(event.target.value);
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("option", { value: "", children: props.inheritLabel }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("option", { value: "true", children: props.onLabel }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("option", { value: "false", children: props.offLabel })
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("p", { className: cfg_card_default["bga-kb-cfg-hint"], children: props.hint })
  ] });
}

// src/client/task-board/settings-form.ts
var import_client3 = require("@deepseek-ai/dsh-client-runtime/client");
function booleanField(field) {
  return {
    field,
    format: (value) => typeof value === "boolean" ? String(value) : "",
    parse: (text) => {
      const trimmed = text.trim();
      if (trimmed === "") return { kind: "clear" };
      if (trimmed === "true") return { kind: "set", value: true };
      if (trimmed === "false") return { kind: "set", value: false };
      return void 0;
    }
  };
}
var CardForm = class {
  /**
   * @param scope 该卡片对应的设置作用域（读写入口 + 变更订阅源）。
   * @param specs 本卡片管理的字段规格列表。
   */
  constructor(scope, specs) {
    this.scope = scope;
    this.specs = new Map(specs.map((spec) => [spec.field, spec]));
    scope.subscribe(() => {
      this.publish();
    });
  }
  specs;
  staged = /* @__PURE__ */ new Map();
  listeners = /* @__PURE__ */ new Set();
  saving = false;
  failed = false;
  failedReason;
  /**
   * 把一段「投影函数」绑定为一个可订阅的 SnapshotStore。
   *
   * 投影函数读取表单状态（如 shell() + field() 的组合）；每次内部状态
   * 发布时自动更新 store，React 组件订阅 store 即可被动刷新。
   *
   * @param project 投影函数。
   * @returns 初始值为 project() 结果的 SnapshotStore。
   */
  bind(project) {
    const store = (0, import_client3.createSnapshotStore)(project());
    this.listeners.add(() => {
      store.set(project());
    });
    return store;
  }
  /**
   * 计算卡片外壳状态（CardShell）。
   *
   * 通过 plan() 判断是否存在脏编辑与非法字段；并透传作用域的
   * 加载状态、暴露状态与可写性。
   */
  shell() {
    const snapshot = this.scope.getSnapshot();
    const plan = this.plan();
    return {
      // 作用域还在加载中时不可用（UI 不渲染卡片）。
      available: snapshot.status !== "loading",
      // 只有 ready 才说明命名空间对设置页暴露了。
      exposed: snapshot.status === "ready",
      writable: snapshot.writable,
      // 存在任何待执行的写入计划即为「脏」。
      dirty: plan.length > 0,
      // 计划中存在 run 为 undefined 的非法项即为 invalid。
      invalid: plan.some((item) => item.run === void 0),
      saving: this.saving,
      failed: this.failed,
      // 仅在确有失败原因时带上 failedReason，避免多余字段。
      ...this.failedReason === void 0 ? {} : { failedReason: this.failedReason }
    };
  }
  /**
   * 读取单个字段的可订阅状态（FieldState）。
   *
   * 有暂存编辑时，以暂存文本为准并重新解析出 overridden / invalid；
   * 没有暂存编辑时，回落到当前作用域值格式化出的文本。
   */
  field(field) {
    const spec = this.specOf(field);
    const staged = this.staged.get(field);
    if (staged === void 0) {
      return { text: spec.format(this.sectionValue(field)), overridden: this.stored(field), invalid: false };
    }
    const write = staged.clear ? { kind: "clear" } : spec.parse(staged.text);
    return {
      text: staged.text,
      // 解析出 set 写入才意味着用户覆盖了一个真实值。
      overridden: write?.kind === "set",
      // 解析失败 -> invalid。
      invalid: write === void 0
    };
  }
  /**
   * 暴露给 UI 的动作集合（CardActions）。
   *
   * 所有动作仅操作内部状态并发布通知，真正的落库只在 save() 里发生。
   */
  actions() {
    return {
      // 编辑：写入暂存区（非清除）。
      edit: (field, text) => {
        this.stage(field, { text, clear: false });
      },
      // 重置：把字段文本设为基值（base，部署默认）并标记为待清除。
      resetField: (field) => {
        this.stage(field, { text: this.specOf(field).format(this.baseValue(field)), clear: true });
      },
      // 保存：fire-and-forget 触发异步保存流程。
      save: () => {
        void this.save();
      },
      // 放弃：无暂存且未失败时无事可做；否则清空暂存与失败标记。
      discard: () => {
        if (this.staged.size === 0 && !this.failed) return;
        this.staged.clear();
        this.failed = false;
        this.failedReason = void 0;
        this.publish();
      }
    };
  }
  /**
   * 保存所有暂存编辑。
   *
   * 流程：1) 生成写入计划，过滤出合法的部分（run 未定义视为非法）；
   * 2) 无计划 / 正在保存 / 存在非法项时不动作；3) 优先走批量 mutate，
   * 否则逐字段执行 run 回写；4) 对每个字段记录是否真正落库（landed）；
   * 5) 清掉已落库字段的暂存，按「落库数 == 计划数」判定整体成败并发布。
   *
   * @returns 无返回值（异步完成后通过状态/通知让 UI 感知结果）。
   */
  async save() {
    const plan = this.plan();
    const valid = plan.filter((item) => item.run !== void 0);
    if (plan.length === 0 || this.saving || valid.length !== plan.length) return;
    const plannedWrites = valid.map((item) => item.op);
    const fields = new Set(plan.map((item) => item.field));
    this.saving = true;
    this.failed = false;
    this.failedReason = void 0;
    this.publish();
    const landed = /* @__PURE__ */ new Set();
    const batch = this.batchedScope();
    if (batch !== void 0) {
      const result = await batch.mutate(plannedWrites);
      if (result.ok) {
        for (const field of result.fields) {
          if (field.landed) landed.add(field.field);
        }
      } else {
        this.failedReason = result.message;
      }
    } else {
      for (const item of valid) {
        if (await item.run()) landed.add(item.field);
      }
    }
    for (const field of fields) {
      if (landed.has(field)) this.staged.delete(field);
    }
    this.saving = false;
    this.failed = landed.size !== fields.size;
    this.publish();
  }
  /**
   * 探测作用域是否支持批量写入；不支持时返回 undefined。
   */
  batchedScope() {
    const candidate = this.scope;
    return typeof candidate?.mutate === "function" ? candidate : void 0;
  }
  /**
   * 生成写入计划：逐个字段把暂存编辑翻译成 BatchWrite 与回写函数。
   *
   * 规则：
   * - 暂存为 clear：若该字段当前确实有用户覆盖，则计划 unset + 删除回写；
   * - 暂存文本与当前生效值相同：无变化，跳过；
   * - 解析成功：set（或 clear）写入；
   * - 解析失败：计划仍产生一项但 run 为 undefined（作为 invalid 标记）。
   */
  plan() {
    const plan = [];
    for (const [field, staged] of this.staged) {
      const spec = this.specOf(field);
      if (staged.clear) {
        if (this.stored(field)) plan.push({ field, op: { field, op: "unset" }, run: () => this.clear(field) });
        continue;
      }
      if (staged.text === spec.format(this.sectionValue(field))) continue;
      const write = spec.parse(staged.text);
      if (write === void 0) {
        plan.push({ field, op: { field, op: "unset" }, run: void 0 });
      } else if (write.kind === "clear") {
        plan.push({ field, op: { field, op: "unset" }, run: () => this.clear(field) });
      } else {
        plan.push({ field, op: { field, op: "set", value: write.value }, run: () => this.store(field, write.value) });
      }
    }
    return plan;
  }
  /**
   * 清除某字段的用户覆盖（unset），返回是否成功（该字段不再被覆盖）。
   */
  async clear(field) {
    await this.scope.unset(field);
    return !this.stored(field);
  }
  /**
   * 写入某字段的值（set），返回是否成功落库。
   *
   * 敏感字段（secret）不做回读比对、直接视为成功；
   * 普通字段通过与用户层（user）当前值比对来确认落库。
   */
  async store(field, value) {
    await this.scope.set(field, value);
    if (this.specOf(field).secret) return true;
    return this.userLayer()?.[field] === value;
  }
  /**
   * 写入暂存区并发布（同时清除上次的失败标记）。
   */
  stage(field, edit) {
    this.staged.set(field, edit);
    this.failed = false;
    this.failedReason = void 0;
    this.publish();
  }
  /**
   * 按字段名取出规格，不存在时抛错（配置错误）。
   */
  specOf(field) {
    const spec = this.specs.get(field);
    if (spec === void 0) throw new Error(`settings card has no field ${field}`);
    return spec;
  }
  /**
   * 取当前作用域快照。
   */
  snapshotOf() {
    return this.scope.getSnapshot();
  }
  /**
   * 取当前生效值（覆盖用户叠加后的最终值）中的某字段。
   */
  sectionValue(field) {
    return this.snapshotOf().value?.[field];
  }
  /**
   * 取基值（部署默认值）中的某字段。
   */
  baseValue(field) {
    return this.snapshotOf().base?.[field];
  }
  /**
   * 取用户层（用户自己的覆盖项）字典。
   */
  userLayer() {
    return this.snapshotOf().user;
  }
  /**
   * 判断某字段当前是否被用户显式覆盖过。
   */
  stored(field) {
    const user = this.userLayer();
    return user !== void 0 && Object.hasOwn(user, field);
  }
  /**
   * 发布状态变更：通知所有订阅的监听器（bind 出的 store 随之更新）。
   */
  publish() {
    for (const listener of this.listeners) listener();
  }
};

// src/client/task-board/TaskBoardSettingsCard.tsx
var import_jsx_runtime15 = require("react/jsx-runtime");
var TaskBoardSettingsCardController = class {
  form;
  store;
  /**
   * @param scope 本插件配置命名空间的设置作用域（读写入口 + 订阅源）。
   */
  constructor(scope) {
    this.form = new CardForm(scope, [
      booleanField("enabled"),
      booleanField("announceToAgent")
    ]);
    this.store = this.form.bind(() => this.projection());
  }
  /**
   * 投影函数：把表单外壳状态 + 逐字段状态合成可订阅快照。
   */
  projection() {
    return {
      ...this.form.shell(),
      enabled: this.form.field("enabled"),
      announceToAgent: this.form.field("announceToAgent")
    };
  }
  /**
   * 向槽位注入（inject）：返回动作集合 + 状态 hooks，供宿主消费。
   */
  inject() {
    return { hooks: { taskBoardSettingsCard: this.store }, ...this.form.actions() };
  }
};
function TaskBoardSettingsCard(props) {
  const { t: t2 } = props;
  const state = props.useTaskBoardSettingsCard((snapshot) => snapshot);
  const disabled = !state.writable;
  const fieldProps = {
    overriddenLabel: t2("settings.overridden"),
    resetLabel: t2("settings.reset"),
    invalidLabel: t2("settings.invalidNumber"),
    disabled
  };
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(
    PluginSettingsCard,
    {
      t: t2,
      titleKey: "settings.title",
      descriptionKey: "settings.description",
      state,
      onSave: props.save,
      onDiscard: props.discard,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
          BooleanField,
          {
            id: "settings-task-board-enabled",
            label: t2("settings.enabled"),
            hint: t2("settings.enabledHint"),
            inheritLabel: t2("settings.inherit"),
            onLabel: t2("settings.on"),
            offLabel: t2("settings.off"),
            ...fieldProps,
            ...state.enabled,
            onEdit: (text) => {
              props.edit("enabled", text);
            },
            onReset: () => {
              props.resetField("enabled");
            }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
          BooleanField,
          {
            id: "settings-task-board-announce",
            label: t2("settings.announceToAgent"),
            hint: t2("settings.announceToAgentHint"),
            inheritLabel: t2("settings.inherit"),
            onLabel: t2("settings.on"),
            offLabel: t2("settings.off"),
            ...fieldProps,
            ...state.announceToAgent,
            onEdit: (text) => {
              props.edit("announceToAgent", text);
            },
            onReset: () => {
              props.resetField("announceToAgent");
            }
          }
        )
      ]
    }
  );
}

// src/client/task-board-apply.ts
var NS = "bga-dsh-workbench-task-board";
var TASK_BOARD_NS = "bga-dsh-workbench-task-board";
function applyTaskBoard(ctx) {
  if (!claimTaskBoardApply()) return;
  ctx.effect(() => releaseTaskBoardApply, "task-board: apply claim");
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), "task-board: dictionaries");
  const binder = ctx.get("webUiSettings") ?? ctx.settingsScope;
  const settingsScope = binder.bind({ namespace: TASK_BOARD_NS });
  const settingsCard = new TaskBoardSettingsCardController(settingsScope);
  ctx.slots.inject("web-ui.plugin.item", () => ctx.slots.register({
    name: "web-ui.plugin.item",
    id: "bga-dsh-workbench-task-board",
    order: 110,
    locale: NS,
    inject: () => settingsCard.inject()
  }, TaskBoardSettingsCard));
  let uiDisposer;
  const mountUi = () => {
    if (uiDisposer !== void 0) return;
    const sessions = ctx.sessions;
    const workspaces = ctx.workspaces;
    const connection = ctx.get("connection");
    const store = new FileTaskStore();
    const exec = new ExecutionService({
      // 会话能力适配：登记列表查询与「按 id 绑定会话」的方式。
      // binding 返回的会话包装只暴露黑板需要的少量方法（改名/提问/命令/快照/订阅），
      // 返回结果归一化为 { ok, ... } 二元形态，屏蔽不同运行时返回结构的差异。
      sessions: {
        list: sessions.list,
        binding: (id) => {
          const binding = sessions.binding(id);
          if (binding === void 0) return void 0;
          const { session } = binding;
          return {
            session: {
              rename: (title) => session.rename(title),
              prompt: (content, mode) => session.prompt(content, mode).then((result) => result.ok ? { ok: true } : { ok: false, error: result.error }),
              command: (line) => session.command(line).then((result) => result.ok ? { ok: true, matched: result.value.matched } : { ok: false, error: result.error }),
              getSnapshot: () => session.getSnapshot(),
              subscribe: (fn) => session.subscribe(fn)
            }
          };
        },
        noteAgentPreset: (sessionId, agentPreset) => sessions.noteAgentPreset(sessionId, agentPreset)
      },
      workspaces: {
        list: workspaces.list,
        connectWorkspace: (id) => workspaces.connectWorkspace(id)
      },
      // agent 预设能力：仅当连接可用时提供（用于任务运行参数中的「模式/预设」选择）
      presets: connection !== void 0 ? {
        select: async (sessionId, agentPreset) => {
          try {
            const response = await connection.api.agentPresets.select({ sessionId, agentPreset });
            return response.result.ok ? { ok: true } : { ok: false, error: response.result.error };
          } catch (error) {
            return { ok: false, error };
          }
        }
      } : void 0,
      // 会话历史能力：仅当连接可用时提供（用于任务执行时的上下文预热/拼接）
      history: connection !== void 0 ? {
        loadTail: async (sessionId) => {
          const response = await connection.api.sessions.history({
            sessionId,
            maxMessages: 20
          });
          return response.result.ok ? { events: response.result.value.events.map((entry) => entry.event) } : void 0;
        }
      } : void 0
    });
    const controller = new BoardController({
      store,
      exec,
      sessions: {
        list: sessions.list,
        open: (id) => sessions.open(id)
      }
    });
    controller.start();
    const scheduler = new SchedulerService({
      tasks: () => controller.getSnapshot().tasks,
      refresh: () => controller.reloadFromStore(),
      now: () => Date.now(),
      runTask: (id) => controller.runTask(id),
      applySchedule: (id, nextRunAt, lastTriggeredAt) => controller.applyScheduleNextRun(id, nextRunAt, lastTriggeredAt),
      ready: () => sessions.list.getSnapshot().phase === "ready",
      environment: {
        addEventListener: (type, listener) => document.addEventListener(type, listener),
        removeEventListener: (type, listener) => document.removeEventListener(type, listener)
      }
    });
    scheduler.start();
    const disposers = [];
    const pushWorkspaceOptions = () => {
      const snapshot = workspaces.list.getSnapshot();
      controller.setExecutionOptions({
        workspaces: snapshot.items.map((item) => ({
          workspaceId: item.workspaceId,
          title: item.title !== "" ? item.title : item.path
        }))
      });
    };
    pushWorkspaceOptions();
    disposers.push(workspaces.list.subscribe(pushWorkspaceOptions));
    if (connection !== void 0) {
      const pushPresetOptions = async () => {
        try {
          const response = await connection.api.agentPresets.list({});
          if (!response.result.ok) return;
          controller.setExecutionOptions({
            presets: response.result.value.presets.map((preset) => ({
              id: preset.id,
              name: preset.name,
              description: preset.description,
              broken: preset.broken,
              isDefault: preset.isDefault
            }))
          });
        } catch (error) {
          console.error("[bga-dsh-workbench] agent preset roster read failed", error);
        }
      };
      void pushPresetOptions();
      disposers.push(ctx.on("connection/reset", () => {
        void pushPresetOptions();
      }));
    }
    try {
      disposers.push(mountSidebarEntry(controller));
      disposers.push(mountBoard(controller));
      disposers.push(mountBoardEmbed(controller));
    } catch (error) {
      console.error("[bga-dsh-workbench] mount failed:", error);
    }
    uiDisposer = () => {
      for (const dispose of disposers.splice(0)) dispose();
      scheduler.dispose();
      controller.dispose();
      uiDisposer = void 0;
    };
  };
  const syncEnabled = () => {
    const snapshot = settingsScope.getSnapshot();
    const enabled = snapshot.status === "ready" ? snapshot.value?.enabled ?? true : snapshot.status === "unavailable";
    if (enabled) mountUi();
    else uiDisposer?.();
  };
  settingsScope.subscribe(syncEnabled);
  syncEnabled();
}

// src/client/workspace-open.ts
var OPEN_URL = "/bga-dsh-workbench/open";
var CONFIG_URL3 = "/bga-dsh-workbench/config";
var INJECTED_MARK = "data-bga-open-injected";
function openDisplayName(kind) {
  switch (kind) {
    case "finder":
      return "Finder";
    case "terminal":
      return "\u7EC8\u7AEF";
    case "vscode":
      return "VSCode";
    default:
      return extraOpenLabel(kind);
  }
}
var GROUP_MARK = "data-bga-open-group";
var WORKSPACE_ARIA_PATTERNS = [
  /^工作区[“"「『]?\s*(.+?)\s*[”"」』]?的操作$/u,
  /^Workspace actions for\s+(.+?)\s*$/u
];
function workspaceLabelFromAria(aria) {
  for (const pattern of WORKSPACE_ARIA_PATTERNS) {
    const match = pattern.exec(aria);
    if (match !== null) return match[1].trim();
  }
  return void 0;
}
function basenameOf(path) {
  const trimmed = path.replace(/[/\\]+$/u, "");
  const parts = trimmed.split(/[/\\]/u);
  return parts[parts.length - 1] ?? path;
}
function resolveWorkspacePath(items, label) {
  const byTitle = items.find((item) => item.title === label);
  if (byTitle !== void 0) return byTitle.path;
  return items.find((item) => basenameOf(item.path) === label)?.path;
}
function workspaceLabelFromRow(row) {
  if (row === null) return void 0;
  const title = row.querySelector('[class*="projectText"] span');
  const text = title?.textContent?.trim();
  return text !== void 0 && text.length > 0 ? text : void 0;
}
function isWorkspaceMenu(menu) {
  return /删除工作区|Delete workspace/u.test(menu.textContent ?? "");
}
function findRenameItem(menu) {
  const buttons = menu.querySelectorAll('button[role="menuitem"]');
  for (const button of buttons) {
    const text = button.textContent?.trim() ?? "";
    if (text === "\u91CD\u547D\u540D" || text === "Rename") return button;
  }
  return null;
}
function findDeleteItem(menu) {
  const buttons = menu.querySelectorAll('button[role="menuitem"]');
  for (const button of buttons) {
    const text = button.textContent?.trim() ?? "";
    if (text === "\u5220\u9664\u5DE5\u4F5C\u533A" || text === "Delete Workspace" || text === "\u5220\u9664") return button;
  }
  return null;
}
var itemStyle = () => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  width: "100%",
  minHeight: "40px",
  padding: "8px 10px",
  border: "none",
  borderRadius: "10px",
  background: "transparent",
  cursor: "pointer",
  fontSize: "14px",
  lineHeight: "22px",
  color: "var(--dsw-alias-label-primary)",
  textAlign: "left"
});
function buildIcon(icon) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "16");
  svg.setAttribute("height", "16");
  svg.setAttribute("viewBox", icon.viewBox ?? "0 0 16 16");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  for (const entry of icon.paths) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", entry.d);
    if (entry.stroke === true) {
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "currentColor");
      path.setAttribute("stroke-width", "1.3");
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("stroke-linejoin", "round");
    } else {
      path.setAttribute("fill", entry.fill ?? "currentColor");
    }
    if (entry.opacity !== void 0) path.setAttribute("opacity", entry.opacity);
    svg.appendChild(path);
  }
  return svg;
}
var FINDER_ICON = {
  viewBox: "0 0 1024 1024",
  paths: [
    { d: "M605.8432 102.4c-89.03424 136.17152-139.66592 288.06784-158.87488 448.6976l187.68768 0c-15.712 61.10592-25.31712 121.34272-27.05792 180.70784 99.50976-9.60384 186.8032-35.77728 240.07296-69.83936l31.424 40.15744c-73.33632 42.76992-168.49152 70.70976-271.49824 81.18528 1.5744 31.05152 5.0944 61.14944 10.4832 91.06432 0.7296 3.95776 1.46048 7.9168 2.26432 11.86816 0.05888 0.29952 0.11904 0.59904 0.17792 0.89856 3.17824 15.49952 6.97344 30.94144 11.31904 46.32192L1024 933.46176 1024 102.4 605.8432 102.4zM744.6528 351.18208l-53.25824 0 0-123.08352 53.25824 0L744.6528 351.18208z", fill: "#009FE8" },
    { d: "M552.78464 788.77568c-0.13056-1.41824-0.1984-2.11968-0.1984-1.95968-134.42944 5.22496-279.3472-20.07808-401.54752-81.21088l25.30304-40.13184c14.16576 6.66496 28.58624 12.79232 43.19488 18.43456 0.69504 0.2688 1.38496 0.55168 2.08128 0.81792 5.55392 2.12352 11.14368 4.15104 16.7488 6.13248 9.85984 3.48416 19.78752 6.77504 29.78432 9.82656 11.66848 3.56224 23.4176 6.83136 35.22176 9.82144 0.09216 0.02304 0.18432 0.04864 0.27648 0.07168 2.01984 0.51072 4.04608 0.98944 6.06976 1.4848 1.95072 0.47616 3.8976 0.96896 5.8496 1.43104 1.14176 0.27008 2.28736 0.5184 3.4304 0.78336 2.83648 0.65664 5.67296 1.31712 8.51456 1.94304 1.68576 0.3712 3.37408 0.71424 5.06112 1.07392 2.304 0.49152 4.60672 0.99584 6.91328 1.46688 2.06592 0.4224 4.13568 0.81408 6.20416 1.21984 1.92768 0.37888 3.85536 0.77312 5.78432 1.13664 2.79808 0.52864 5.59744 1.02272 8.39808 1.52192 1.2032 0.21376 2.40512 0.44544 3.60832 0.65408 5.67808 0.98688 11.35872 1.89184 17.03936 2.75968 3.47648 0.5312 6.95296 1.0432 10.42816 1.53088 6.3552 0.89088 12.70656 1.71648 19.0528 2.46144 0.5056 0.05888 1.0112 0.128 1.5168 0.1856 47.97184 5.55264 95.55968 7.02464 141.056 5.056 1.23648-43.08224 5.728-86.45888 13.11104-129.20704L383.24864 606.08c0.64768-7.43552 1.3824-14.82624 2.15808-22.19776 0.1728-1.63584 0.35456-3.26656 0.53248-4.89984 0.672-6.15168 1.38624-12.2816 2.14528-18.38848 0.16512-1.33248 0.32384-2.67008 0.4928-4 0.94336-7.38816 1.9392-14.74816 3.00928-22.06848 0.08448-0.57984 0.1792-1.15456 0.26368-1.73312 0.94208-6.37696 1.93792-12.72448 2.97344-19.04896 0.37248-2.27968 0.75648-4.55424 1.14176-6.82752 0.79232-4.66944 1.61408-9.32224 2.45888-13.96352 0.47232-2.60224 0.93312-5.21088 1.4208-7.80416 1.09824-5.82144 2.23488-11.62112 3.41376-17.39776 0.9152-4.49536 1.87904-8.96256 2.8416-13.43104 0.38528-1.7792 0.76416-3.56224 1.15584-5.3376C435.31264 321.5936 482.76096 205.60512 545.05856 102.4L0 102.4l0 831.06304 572.87168 0C561.0752 887.12704 554.59968 838.41408 552.78464 788.77568zM247.936 228.09728l53.23136 0 0 123.08352L247.936 351.1808 247.936 228.09728z", fill: "#D2ECFA" }
  ]
};
var TERMINAL_ICON = {
  viewBox: "0 0 1024 1024",
  paths: [
    { d: "M514.2 514h-135c-1.2 0-2.2 0-3.4-0.2-1.2-0.2-2.2-0.2-3.2-0.4s-2.2-0.4-3.2-0.8-2-0.6-3.2-1.2c-1-0.4-2-0.8-3-1.4-1-0.6-2-1-2.8-1.8-1-0.6-1.8-1.2-2.6-2s-1.6-1.4-2.4-2.2c-0.8-0.8-1.6-1.6-2.2-2.4-0.8-0.8-1.4-1.8-2-2.6-0.6-1-1.2-1.8-1.8-2.8-0.6-1-1-2-1.4-3-0.4-1-0.8-2-1.2-3.2s-0.6-2.2-0.8-3.2c-0.2-1-0.4-2.2-0.4-3.2-0.2-1.2-0.2-2.2-0.2-3.4 0-1.2 0-2.2 0.2-3.4 0.2-1.2 0.2-2.2 0.4-3.2s0.4-2.2 0.8-3.2 0.6-2 1.2-3.2c0.4-1 0.8-2 1.4-3s1-2 1.8-2.8 1.2-1.8 2-2.6 1.4-1.6 2.2-2.4c0.8-0.8 1.6-1.6 2.4-2.2 0.8-0.8 1.8-1.4 2.6-2s1.8-1.2 2.8-1.8c1-0.6 2-1 3-1.4 1-0.4 2-0.8 3.2-1.2 1-0.4 2.2-0.6 3.2-0.8 1-0.2 2.2-0.4 3.2-0.4 1.2-0.2 2.2-0.2 3.4-0.2h135c1.2 0 2.2 0 3.4 0.2 1.2 0.2 2.2 0.2 3.2 0.4s2.2 0.4 3.2 0.8 2 0.6 3.2 1.2c1 0.4 2 0.8 3 1.4 1 0.6 2 1 2.8 1.8s1.8 1.2 2.6 2 1.6 1.4 2.4 2.2c0.8 0.8 1.6 1.6 2.2 2.4 0.8 0.8 1.4 1.8 2 2.6 0.6 1 1.2 1.8 1.8 2.8 0.6 1 1 2 1.4 3 0.4 1 0.8 2 1.2 3.2 0.4 1 0.6 2.2 0.8 3.2 0.2 1 0.4 2.2 0.4 3.2 0.2 1.2 0.2 2.2 0.2 3.4 0 1.2 0 2.2-0.2 3.4-0.2 1.2-0.2 2.2-0.4 3.2s-0.4 2.2-0.8 3.2-0.6 2-1.2 3.2c-0.4 1-0.8 2-1.4 3-0.6 1-1 2-1.8 2.8-0.6 1-1.2 1.8-2 2.6s-1.4 1.6-2.2 2.4c-0.8 0.8-1.6 1.6-2.4 2.2-0.8 0.8-1.8 1.4-2.6 2-1 0.6-1.8 1.2-2.8 1.8-1 0.6-2 1-3 1.4-1 0.4-2 0.8-3.2 1.2-1 0.4-2.2 0.6-3.2 0.8-1 0.2-2.2 0.4-3.2 0.4-1.2 0.2-2.2 0.2-3.4 0.2z m-337.4 0c-1.8 0-3.4-0.2-5.2-0.4-1.8-0.2-3.4-0.6-5-1.2s-3.2-1.2-4.8-2c-1.6-0.8-3-1.6-4.4-2.6-1.4-1-2.8-2.2-4-3.4-1.2-1.2-2.4-2.6-3.4-3.8-1-1.4-2-2.8-2.8-4.4-0.8-1.6-1.6-3.2-2-4.8-0.6-1.6-1-3.4-1.4-5s-0.6-3.4-0.6-5.2 0-3.4 0.2-5.2c0.2-1.8 0.6-3.4 1-5s1-3.2 1.8-4.8c0.8-1.6 1.6-3 2.6-4.6 1-1.4 2-2.8 3.2-4 1.2-1.2 2.4-2.4 3.8-3.6l135.8-108.6-135.8-108.6c-0.8-0.6-1.6-1.4-2.4-2.2-0.8-0.8-1.6-1.6-2.2-2.4-0.8-0.8-1.4-1.8-2-2.6-0.6-1-1.2-1.8-1.8-2.8s-1-2-1.4-3c-0.4-1-0.8-2-1.2-3.2-0.4-1-0.6-2.2-0.8-3.2-0.2-1-0.4-2.2-0.6-3.2-0.2-1-0.2-2.2-0.2-3.4 0-1.2 0-2.2 0.2-3.4 0-1.2 0.2-2.2 0.4-3.2s0.4-2.2 0.8-3.2 0.6-2.2 1-3.2 0.8-2 1.4-3c0.6-1 1-2 1.6-2.8 0.6-1 1.2-1.8 2-2.6s1.4-1.6 2.2-2.4c0.8-0.8 1.6-1.6 2.4-2.2 0.8-0.8 1.8-1.4 2.6-2 1-0.6 1.8-1.2 2.8-1.8 1-0.6 2-1 3-1.4 1-0.4 2-0.8 3.2-1.2 1-0.4 2.2-0.6 3.2-0.8 1-0.2 2.2-0.4 3.2-0.6 1-0.2 2.2-0.2 3.4-0.2 1.2 0 2.2 0 3.4 0.2 1.2 0 2.2 0.2 3.2 0.4s2.2 0.4 3.2 0.8 2.2 0.6 3.2 1 2 0.8 3 1.4c1 0.6 2 1 2.8 1.6 1 0.6 1.8 1.2 2.6 2l168.8 135c1 0.8 2 1.6 2.8 2.6 0.8 0.8 1.8 1.8 2.6 2.8 0.8 1 1.6 2 2.2 3 0.6 1 1.2 2.2 1.8 3.4 0.6 1.2 1 2.4 1.4 3.4 0.4 1.2 0.8 2.4 1 3.6 0.2 1.2 0.4 2.4 0.6 3.8 0.2 1.2 0.2 2.6 0.2 3.8 0 1.2 0 2.6-0.2 3.8-0.2 1.2-0.4 2.4-0.6 3.8-0.2 1.2-0.6 2.4-1 3.6-0.4 1.2-0.8 2.4-1.4 3.4-0.6 1.2-1.2 2.2-1.8 3.4-0.6 1-1.4 2-2.2 3s-1.6 2-2.6 2.8c-0.8 0.8-1.8 1.8-2.8 2.6L198 507c-3 2.4-6.2 4.2-10 5.4-3.6 1-7.4 1.6-11.2 1.6zM885.4 41.6H143c-2.2 0-4.4 0-6.6 0.2s-4.4 0.2-6.6 0.4c-2.2 0.2-4.4 0.4-6.6 0.8l-6.6 1.2c-2.2 0.4-4.4 1-6.4 1.4-2.2 0.6-4.2 1.2-6.4 1.8-2.2 0.6-4.2 1.4-6.2 2-2 0.8-4.2 1.6-6.2 2.4-2 0.8-4 1.8-6 2.6l-6 3c-2 1-3.8 2.2-5.8 3.2-1.8 1.2-3.8 2.4-5.6 3.6-1.8 1.2-3.6 2.4-5.4 3.8-1.8 1.4-3.6 2.6-5.2 4s-3.4 2.8-5 4.4-3.2 3-4.8 4.6-3 3.2-4.6 4.8c-1.4 1.6-3 3.4-4.4 5s-2.8 3.4-4 5.2c-1.4 1.8-2.6 3.6-3.8 5.4-1.2 1.8-2.4 3.8-3.6 5.6-1.2 1.8-2.2 3.8-3.2 5.8l-3 6c-1 2-1.8 4-2.6 6s-1.6 4-2.4 6.2c-0.8 2-1.4 4.2-2 6.2-0.6 2.2-1.2 4.2-1.8 6.4-0.6 2.2-1 4.2-1.4 6.4l-1.2 6.6c-0.4 2.2-0.6 4.4-0.8 6.6-0.2 2.2-0.4 4.4-0.4 6.6C8 172 8 174.2 8 176.6v675c0 2.2 0 4.4 0.2 6.6 0.2 2.2 0.2 4.4 0.4 6.6 0.2 2.2 0.4 4.4 0.8 6.6l1.2 6.6c0.4 2.2 1 4.4 1.4 6.4 0.6 2.2 1.2 4.2 1.8 6.4 0.6 2.2 1.4 4.2 2 6.2 0.8 2 1.6 4.2 2.4 6.2 0.8 2 1.8 4 2.6 6l3 6c1 2 2.2 3.8 3.2 5.8 1.2 1.8 2.4 3.8 3.6 5.6 1.2 1.8 2.4 3.6 3.8 5.4 1.4 1.8 2.6 3.6 4 5.2 1.4 1.8 2.8 3.4 4.4 5 1.4 1.6 3 3.2 4.6 4.8 1.6 1.6 3.2 3 4.8 4.6s3.4 3 5 4.4c1.8 1.4 3.4 2.8 5.2 4 1.8 1.4 3.6 2.6 5.4 3.8 1.8 1.2 3.8 2.4 5.6 3.6 1.8 1.2 3.8 2.2 5.8 3.2l6 3c2 1 4 1.8 6 2.6s4 1.6 6.2 2.4c2 0.8 4.2 1.4 6.2 2 2.2 0.6 4.2 1.2 6.4 1.8 2.2 0.6 4.2 1 6.4 1.4l6.6 1.2c2.2 0.4 4.4 0.6 6.6 0.8 2.2 0.2 4.4 0.4 6.6 0.4s4.4 0.2 6.6 0.2h742.4c2.2 0 4.4 0 6.6-0.2s4.4-0.2 6.6-0.4c2.2-0.2 4.4-0.4 6.6-0.8l6.6-1.2c2.2-0.4 4.4-1 6.4-1.4 2.2-0.6 4.2-1.2 6.4-1.8 2.2-0.6 4.2-1.4 6.2-2s4.2-1.6 6.2-2.4c2-0.8 4-1.8 6-2.6l6-3c2-1 3.8-2.2 5.8-3.2 1.8-1.2 3.8-2.4 5.6-3.6 1.8-1.2 3.6-2.4 5.4-3.8 1.8-1.4 3.6-2.6 5.2-4 1.8-1.4 3.4-2.8 5-4.4s3.2-3 4.8-4.6c1.6-1.6 3-3.2 4.6-4.8 1.4-1.6 3-3.4 4.4-5 1.4-1.8 2.8-3.4 4-5.2 1.4-1.8 2.6-3.6 3.8-5.4 1.2-1.8 2.4-3.8 3.6-5.6 1.2-1.8 2.2-3.8 3.2-5.8l3-6c1-2 1.8-4 2.6-6s1.6-4 2.4-6.2c0.8-2 1.4-4.2 2-6.2s1.2-4.2 1.8-6.4c0.6-2.2 1-4.2 1.4-6.4l1.2-6.6c0.4-2.2 0.6-4.4 0.8-6.6 0.2-2.2 0.4-4.4 0.4-6.6 0.2-2.2 0.2-4.4 0.2-6.6V176.6c0-2.2 0-4.4-0.2-6.6-0.2-2.2-0.2-4.4-0.4-6.6-0.2-2.2-0.4-4.4-0.8-6.6l-1.2-6.6c-0.4-2.2-1-4.4-1.4-6.4-0.6-2.2-1.2-4.2-1.8-6.4-0.6-2.2-1.4-4.2-2-6.2-0.8-2-1.6-4.2-2.4-6.2-0.8-2-1.8-4-2.6-6l-3-6c-1-2-2.2-3.8-3.2-5.8-1.2-1.8-2.4-3.8-3.6-5.6-1.2-1.8-2.4-3.6-3.8-5.4-1.4-1.8-2.6-3.6-4-5.2-1.4-1.8-2.8-3.4-4.4-5-1.4-1.6-3-3.2-4.6-4.8s-3.2-3-4.8-4.6c-1.6-1.4-3.4-3-5-4.4-1.8-1.4-3.4-2.8-5.2-4s-3.6-2.6-5.4-3.8c-1.8-1.2-3.8-2.4-5.6-3.6-1.8-1.2-3.8-2.2-5.8-3.2l-6-3c-2-1-4-1.8-6-2.6s-4-1.6-6.2-2.4c-2-0.8-4.2-1.4-6.2-2-2.2-0.6-4.2-1.2-6.4-1.8-2.2-0.6-4.2-1-6.4-1.4l-6.6-1.2c-2.2-0.4-4.4-0.6-6.6-0.8-2.2-0.2-4.4-0.4-6.6-0.4s-4-0.4-6.4-0.4z" }
  ]
};
var VSCODE_ICON = {
  viewBox: "0 0 1024 1024",
  paths: [
    { d: "M746.222933 102.239573l-359.799466 330.820267L185.347413 281.4976 102.2464 329.864533l198.20544 182.132054-198.20544 182.132053 83.101013 48.510293 201.076054-151.558826 359.799466 330.676906 175.527254-85.251413V187.4944z m0 217.57952v384.341334l-255.040853-192.177494z", fill: "#2196F3" }
  ]
};
var ANDROID_STUDIO_ICON = {
  viewBox: "0 0 1024 1024",
  paths: [
    // 白色高光底层（淡影）
    { d: "M398.824 987.936c-15.824-3.752-29.072-12.528-47.6-31.544-30.968-31.768-56.104-44.992-99.776-52.512-45.312-7.8-65.44-24.64-77.552-64.864-14.936-49.648-30.56-73.424-64.864-98.768-38.928-28.752-48.912-54.112-39.416-100.056 8.8-42.56 5.432-72.808-12.44-111.712C35.84 482.08 38.48 457.28 68.776 419.24c27.76-34.856 36.48-57.904 40.632-107.448 4.192-50 18.104-70.52 59.08-87.12 34.192-13.856 63.44-37.912 79.664-65.504 18.752-31.92 21.488-35.576 33.112-44.24 18.752-13.992 33.912-17.864 62.784-16.056 50.16 3.144 77.04-2.88 110.72-24.8 43.92-28.592 70.544-28.592 114.456 0 33.68 21.92 60.56 27.944 110.72 24.8 47.432-2.976 67.168 9.472 96.08 60.616 14.32 25.336 43.608 50 75.664 63.72 45.648 19.536 58.912 37.36 62.28 83.704 3.648 50.184 13.936 78.24 41.192 112.328 30.352 37.96 33 62.784 11.656 109.24-17.864 38.904-21.24 69.16-12.44 111.712 9.504 45.944-0.488 71.304-39.408 100.056-34.312 25.336-49.928 49.12-64.872 98.768-12.104 40.224-32.24 57.064-77.552 64.864-43.76 7.536-68.92 20.8-99.76 52.616-34.2 35.256-58.712 41.08-106.512 25.272-39.096-12.92-69.2-12.976-108.136-0.192-27.28 8.952-41.816 10.512-59.312 6.36z", fill: "#FFFFFF", opacity: "0.2" },
    // 绿色头部/身体主体
    { d: "M398.824 978.568c-15.824-3.76-29.072-12.536-47.6-31.552-30.968-31.76-56.104-44.992-99.776-52.504-45.312-7.8-65.44-24.648-77.552-64.864-14.936-49.656-30.56-73.44-64.864-98.776-38.928-28.752-48.912-54.104-39.416-100.056 8.8-42.56 5.432-72.808-12.44-111.712-21.328-46.408-18.696-71.208 11.6-109.24 27.76-34.856 36.48-57.896 40.632-107.448 4.192-50 18.104-70.52 59.08-87.12 34.192-13.856 63.44-37.912 79.664-65.504 18.752-31.92 21.488-35.568 33.112-44.24 18.752-13.992 33.912-17.864 62.784-16.056 50.16 3.144 77.04-2.88 110.72-24.8 43.92-28.592 70.544-28.592 114.456 0 33.68 21.92 60.56 27.944 110.72 24.8 47.432-2.976 67.168 9.472 96.08 60.616 14.32 25.336 43.608 50 75.664 63.72 45.648 19.536 58.912 37.36 62.28 83.704 3.648 50.184 13.936 78.24 41.192 112.328 30.352 37.96 33 62.784 11.656 109.24-17.864 38.904-21.24 69.16-12.44 111.712 9.504 45.944-0.488 71.304-39.408 100.056-34.312 25.344-49.928 49.12-64.872 98.776-12.104 40.216-32.24 57.064-77.552 64.864-43.76 7.528-68.92 20.8-99.76 52.608-34.2 35.264-58.712 41.08-106.512 25.28-39.096-12.928-69.2-12.984-108.136-0.2-27.28 8.952-41.816 10.512-59.312 6.368z", fill: "#3DDC84" },
    // 头部斑点 + 身体细节（绿色）
    { d: "M680.04 472.24a12.112 12.112 0 0 1 5.6-16.208 12.112 12.112 0 0 1 16.208 5.6 12.112 12.112 0 0 1-5.6 16.208 12.112 12.112 0 0 1-16.208-5.6z m58.616 120.48a12.104 12.104 0 0 1 5.6-16.208 12.112 12.112 0 0 1 16.208 5.6 12.112 12.112 0 0 1-5.6 16.208 12.104 12.104 0 0 1-16.208-5.6z m5.12-156.328c-38.56-27.528-88.856-34.64-135.424-16.624l127.288 261.744c42.896-25.48 68.32-69.52 70.488-116.8l48.312 3.424a5.008 5.008 0 0 0 5.36-4.696 5 5 0 0 0-4.696-5.36l-48.92-3.496c-0.48-20.6-5.416-41.624-15.24-61.864-9.816-20.184-23.312-37.048-39.216-50.184l27.472-40.664a5.04 5.04 0 0 0-8.32-5.664l-27.104 40.12", fill: "#3DDC84" },
    // 蓝色左臂 + 头部天线
    { d: "M626.424 534.944c-35.904 17.352-74.52 26.144-114.76 26.144a264.056 264.056 0 0 1-221.024-119.28 12.048 12.048 0 0 0-17.232-3.064l-46.2 34.032a12.16 12.16 0 0 0-2.776 16.624 345.488 345.488 0 0 0 287.232 153.136c52.592 0 103.136-11.504 150.184-34.216l-35.424-73.376zM511.248 245.36h25v-55.232c0-13.8-11.2-25-25-25a25.016 25.016 0 0 0-25 25v55.24h25z", fill: "#4285F4" },
    // 蓝色右臂 + 双腿
    { d: "M446.184 353.2L274.312 706.936a58.464 58.464 0 0 0-5.904 24.456l-1.024 46.328c-0.24 11.984 13.616 18.736 22.896 11.144l35.784-29.4a58.72 58.72 0 0 0 15.6-19.76l169.4-348.736-64.824-37.712-0.056-0.056zM754.136 731.336a59.384 59.384 0 0 0-5.904-24.464L576.368 353.136l-64.824 37.84 169.4 348.608a59.304 59.304 0 0 0 15.6 19.76l35.784 29.4c9.28 7.592 23.2 0.84 22.896-11.144l-1.024-46.32-0.064 0.056z", fill: "#4285F4" },
    // 深色颈部关节
    { d: "M511.24 240.968c-41.384 0-75 33.68-75 75 0 41.328 33.68 75 75 75 41.328 0 75-33.68 75-75 0-41.328-33.672-75-75-75z m0 116.264a41.328 41.328 0 0 1-41.264-41.264 41.288 41.288 0 0 1 41.264-41.264 41.288 41.288 0 0 1 41.272 41.264 41.288 41.288 0 0 1-41.272 41.264z", fill: "#073042" }
  ]
};
var XCODE_ICON = {
  viewBox: "0 0 1024 1024",
  paths: [
    // 蓝色锤头
    { d: "M69.024 335.776l86.016 544.8a32 32 0 0 0 36.416 26.624l672.736-102.368a32 32 0 0 0 26.784-36.608L804.96 223.424a32 32 0 0 0-36.416-26.624L95.808 299.168a32 32 0 0 0-26.784 36.608z", fill: "#488CF3" },
    // 深色手柄
    { d: "M1017.696 233.728l-28.48 106.08a24 24 0 0 1-29.376 16.96l-44-11.744a23.04 23.04 0 0 1-15.104-14.528 64.48 64.48 0 0 0-47.68-35.392c-34.112-9.152-59.904-1.216-64.48 15.84l-9.92 37.024a32 32 0 0 1-39.2 22.624l-123.584-33.056a32 32 0 0 1-22.624-39.168l17.504-65.216a15.584 15.584 0 0 0-11.04-18.944c-85.024-23.872-137.792 28.704-168.512 83.648a16.16 16.16 0 0 1-17.28 7.104l-9.504-2.56a12.16 12.16 0 0 1-8.448-14.976v-0.128c28.448-105.888 163.2-201.152 263.552-174.272l155.104 41.504a23.04 23.04 0 0 1 15.136 14.528 64.48 64.48 0 0 0 47.648 35.392c19.584 7.424 41.6 4.864 58.976-6.848a23.04 23.04 0 0 1 20.352-5.024l44 11.776a24 24 0 0 1 16.96 29.376zM632.32 377.184l73.6 19.712c12.8 3.424 20.512 16.48 17.376 29.376l-109.344 447.136a65.184 65.184 0 0 1-80.128 47.456l-14.72-3.936a65.088 65.088 0 0 1-45.664-81.152l129.088-441.824a24.448 24.448 0 0 1 29.76-16.768z", fill: "#475266" }
  ]
};
var WECHAT_DEVTOOLS_ICON = {
  viewBox: "0 0 1024 1024",
  paths: [
    // 外框 + 底部平台（微信绿 #07C160）
    { d: "M950.1 797.1H72.8c-13.8 0-25-11.2-25-25V164c0-13.8 11.2-25 25-25h877.3c13.8 0 25 11.2 25 25v608.1c0 13.8-11.2 25-25 25z m-872.3-30h867.3V169H77.8v598.1zM755.9 872H271.3c-14.8 0-26.9-12.1-26.9-26.9 0-14.8 12.1-26.9 26.9-26.9h484.5c14.8 0 26.9 12.1 26.9 26.9 0.1 14.8-12 26.9-26.8 26.9z", fill: "#07C160" },
    // 双聊天气泡（微信绿 #07C160）
    { d: "M617.9 380.4c6.9 0 13.7 0.5 20.6 1.2-18.4-77.7-110.2-135.4-214.9-135.4-117.1 0-213 72.2-213 164 0 53 31.9 96.5 85.2 130.2l-21.3 58 74.5-33.8c26.6 4.7 48 9.6 74.6 9.6 6.7 0 13.3-0.3 19.9-0.7-4.1-12.9-6.6-26.4-6.6-40.5 0-84.2 79.9-152.6 181-152.6z m-114.5-52.3c16.1 0 26.7 9.6 26.7 24.1 0 14.4-10.6 24.1-26.7 24.1-15.9 0-31.9-9.7-31.9-24.1 0-14.6 16-24.1 31.9-24.1z m-149 48.2c-16 0-32.1-9.7-32.1-24.1 0-14.5 16.1-24.1 32.1-24.1s26.6 9.5 26.6 24.1c0 14.4-10.6 24.1-26.6 24.1z m458 154.4c0-77.1-85.2-139.9-181-139.9-101.4 0-181.1 62.9-181.1 139.9 0 77.3 79.8 139.9 181.1 139.9 21.2 0 42.6-4.8 63.9-9.6l58.4 29-16-48.2c42.8-29.1 74.7-67.6 74.7-111.1z m-239.7-24.1c-10.6 0-21.3-9.5-21.3-19.3 0-9.6 10.7-19.3 21.3-19.3 16.2 0 26.7 9.7 26.7 19.3 0 9.7-10.5 19.3-26.7 19.3z m117.1 0c-10.5 0-21.2-9.5-21.2-19.3 0-9.6 10.6-19.3 21.2-19.3 16 0 26.7 9.7 26.7 19.3 0 9.7-10.6 19.3-26.7 19.3z", fill: "#07C160" }
  ]
};
var INTELLIJ_IDEA_ICON = {
  viewBox: "0 0 1024 1024",
  paths: [
    { d: "M301.333333 750.677333l-206.656-162.666666 102.656-190.677334L491.989333 512z", fill: "#F57C00" },
    { d: "M938.666667 313.344l-16 493.333333L594.666667 938.666667l-197.333334-128 288-298.666667z", fill: "#1E88E5" },
    { d: "M938.666667 313.344L678.656 620.010667 560 234.666667l113.344-136z", fill: "#2962FF" },
    { d: "M740.010667 418.666667L496 793.344 154.666667 917.333333l54.677333-192 70.656-237.333333z", fill: "#AB47BC" },
    { d: "M280 488L85.333333 422.677333 209.344 85.333333l266.666667 32 264 301.333334z", fill: "#E91E63" },
    { d: "M234.666667 234.666667h533.333333v533.333333H234.666667z", fill: "#000001" },
    { d: "M298.666667 672h192V704h-192z m138.666666-333.333333V298.666667h-106.666666v40H362.666667v138.666666h-32v40h106.666666v-40h-28.608v-138.666666z m104 184c-40 0-61.248-23.424-69.333333-33.024l30.101333-34.24c5.44 6.016 20.565333 21.930667 39.232 21.930666 24 0 29.333333-24 29.333334-37.333333V298.666667H618.666667v141.333333c0 13.312 0 34.666667-16 56-11.2 14.933333-37.333333 26.666667-61.333334 26.666667z", fill: "#FFFFFF" }
  ]
};
var DEVECO_STUDIO_ICON = {
  viewBox: "0 0 1024 1024",
  paths: [
    { d: "M943.157895 635.284211H569.990737v168.650105h273.394526z", fill: "#1296db" },
    { d: "M615.774316 121.263158H407.403789l-0.458105 0.309895 436.439579 682.361263L943.157895 635.270737z", fill: "#1296db" },
    { d: "M408.225684 121.263158h208.370527l0.458105 0.309895-436.439579 682.361263L80.842105 635.270737z", fill: "#1296db" },
    { d: "M80.842105 635.284211h373.167158v168.650105H180.614737z", fill: "#1296db" }
  ]
};
var WEBSTORM_ICON = {
  viewBox: "0 0 1024 1024",
  paths: [
    { d: "M0 107.2l137.6 817.6L704 1024 878.4 137.6 568 17.6l-150.4 80L256 1.6 0 107.2z", fill: "#07C3F2" },
    { d: "M878.4 137.6L704 1024 137.6 924.8 878.4 137.6z", fill: "#C793F3" },
    { d: "M878.4 137.6L137.6 924.8 0 107.2 256 1.6l161.6 96 150.4-80 310.4 120z", fill: "#0793F3" },
    { d: "M941.28 144L281.6 355.2 652.8 0l238.4 20.8L941.28 144z", fill: "#FCF84A" },
    { d: "M912 464l112 209.6L568 944l-187.2-129.6-99.2-459.2L941.28 144 1024 347.2 912 464z", fill: "#0793F3" },
    { d: "M819.2 297.6L912 464l112-116.8L942.4 144l-123.2 153.6z", fill: "#07C3F2" },
    { d: "M192 832h640V192H192v640z" },
    { d: "M566.88 504.48l35.2-42.24a123.84 123.84 0 0 0 80.96 32.8c24.32 0 39.04-9.6 39.04-25.44v-0.8c0-15.04-9.28-22.88-54.56-34.4-54.56-13.92-89.92-29.12-89.92-82.88 0-49.12 39.52-81.76 94.88-81.76a158.08 158.08 0 0 1 100.8 34.24l-31.04 44.96A128 128 0 0 0 672 321.6c-22.88 0-34.88 10.4-34.88 23.68v0.8c0 17.76 11.52 23.68 58.4 35.52 55.04 14.4 85.92 34.08 85.92 81.44 0 53.92-40.96 84-99.52 84a172.48 172.48 0 0 1-114.88-43.2M516.32 272l-39.52 154.88L431.52 272h-44.96l-45.28 154.88L301.92 272H240l75.84 272h49.76l43.52-153.6 42.88 153.6h50.4l75.68-272h-61.76zM256 752h240v-40H256V752z", fill: "#FFFFFF" }
  ]
};
var PYCHARM_ICON = {
  viewBox: "0 0 1024 1024",
  paths: [
    { d: "M572.8 579.2h156.8l179.2 49.6 108.8-219.2-299.2-248-145.6 417.6z", fill: "#07C3F2" },
    { d: "M438.4 0L62.4 156.8 0 819.2l206.4-22.4 147.2-62.4 4.8-105.6L416 323.2 668.8 152 438.4 0z", fill: "#21D789" },
    { d: "M288 388.8L0 819.2 350.4 1024l94.4-110.4L416 323.2l-128 65.6z", fill: "#FCF84A" },
    { d: "M761.6 0L448 280h355.2L761.6 0z", fill: "#21D789" },
    { d: "M464 280l-48 43.2-120 582.4 416 116.8L1024 915.2 896 432l-201.6 78.4L718.4 256 464 280z", fill: "#FCF84A" },
    { d: "M192 832h640V192H192v640z" },
    { d: "M256 752h240v-40H256V752zM359.68 409.12A41.12 41.12 0 0 0 405.44 368c0-26.88-17.92-41.12-46.88-41.12h-44.8v83.04zM256 272h107.36c62.72 0 100.64 38.4 100.64 94.08v0.8c0 62.88-47.2 96-106.24 96h-44V544H256z m227.04 136.96a134.72 134.72 0 0 1 138.4-137.12 136.48 136.48 0 0 1 104.48 40.96l-37.12 42.88a97.92 97.92 0 0 0-67.84-29.92A78.56 78.56 0 0 0 544 407.52a78.56 78.56 0 0 0 76.8 83.36 96 96 0 0 0 69.76-31.04l37.12 37.6a135.84 135.84 0 0 1-108.8 48 134.08 134.08 0 0 1-136-136.48", fill: "#FFFFFF" }
  ]
};
var GOLAND_ICON = {
  viewBox: "0 0 1024 1024",
  paths: [
    { d: "M0 0v1024h1024V0z m288.597333 128a232.448 232.448 0 0 1 166.058667 57.856L396.117333 256.512A155.818667 155.818667 0 0 0 285.696 213.333333c-68.266667 0-121.344 59.733333-121.344 131.413334v1.194666c0 77.312 53.077333 133.973333 128 133.973334a147.968 147.968 0 0 0 87.381333-25.429334V393.728H286.208v-80.213333H469.333333v183.296a274.261333 274.261333 0 0 1-180.394666 67.072c-131.242667 0-221.696-92.330667-221.696-217.258667v-1.194667A216.746667 216.746667 0 0 1 288.597333 128z m445.098667 0c130.218667 0 223.744 97.109333 223.744 217.088v1.194667a218.282667 218.282667 0 0 1-224.938667 218.453333c-130.389333-0.853333-223.914667-97.962667-223.914666-218.112v-1.194667A218.282667 218.282667 0 0 1 733.696 128z m-1.194667 85.333333A126.293333 126.293333 0 0 0 605.866667 344.234667v1.194666a128.341333 128.341333 0 0 0 128 132.778667 126.293333 126.293333 0 0 0 126.464-131.584v-1.194667A128.170667 128.170667 0 0 0 732.501333 213.333333zM96.085333 832h384V896h-384z" }
  ]
};
function extraOpenIcon(kind) {
  switch (kind) {
    case "android-studio":
      return ANDROID_STUDIO_ICON;
    case "xcode":
      return XCODE_ICON;
    case "wechat-devtools":
      return WECHAT_DEVTOOLS_ICON;
    case "intellij-idea":
      return INTELLIJ_IDEA_ICON;
    case "deveco-studio":
      return DEVECO_STUDIO_ICON;
    case "webstorm":
      return WEBSTORM_ICON;
    case "pycharm":
      return PYCHARM_ICON;
    case "goland":
      return GOLAND_ICON;
    default:
      return INTELLIJ_IDEA_ICON;
  }
}
var OPEN_ACTIONS = [
  { kind: "finder", label: "\u5728 Finder \u4E2D\u6253\u5F00", icon: FINDER_ICON },
  { kind: "terminal", label: "\u5728\u7EC8\u7AEF\u4E2D\u6253\u5F00", icon: TERMINAL_ICON },
  { kind: "vscode", label: "\u5728 VSCode \u4E2D\u6253\u5F00", icon: VSCODE_ICON }
];
function buildButtonGroup(onRequest, path, labels = OPEN_ACTIONS) {
  const group = document.createElement("div");
  group.setAttribute(GROUP_MARK, "");
  const separator = document.createElement("div");
  separator.setAttribute("role", "separator");
  separator.style.height = "1px";
  separator.style.margin = "4px 2px";
  separator.style.background = "var(--dsw-alias-border-l1)";
  group.appendChild(separator);
  for (const action of labels) {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("role", "menuitem");
    button.setAttribute("data-bga-open-kind", action.kind);
    Object.assign(button.style, itemStyle());
    const iconWrap = document.createElement("span");
    iconWrap.style.display = "inline-flex";
    iconWrap.style.flex = "none";
    iconWrap.style.width = "16px";
    iconWrap.style.height = "16px";
    iconWrap.style.alignItems = "center";
    iconWrap.style.justifyContent = "center";
    iconWrap.style.color = "var(--dsw-alias-label-tertiary)";
    iconWrap.appendChild(buildIcon(action.icon));
    button.appendChild(iconWrap);
    const label = document.createElement("span");
    label.textContent = action.label;
    label.style.flex = "1";
    label.style.minWidth = "0";
    label.style.overflow = "hidden";
    label.style.textOverflow = "ellipsis";
    label.style.whiteSpace = "nowrap";
    button.appendChild(label);
    button.addEventListener("mouseenter", () => {
      button.style.background = "var(--dsw-alias-interactive-bg-hover)";
    });
    button.addEventListener("mouseleave", () => {
      button.style.background = "transparent";
    });
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      event.preventDefault();
      onRequest(action.kind, path);
    });
    group.appendChild(button);
  }
  return group;
}
function buildExtraOpenGroup(items, path, onRequest) {
  const group = document.createElement("div");
  group.setAttribute(GROUP_MARK, "");
  const separator = document.createElement("div");
  separator.setAttribute("role", "separator");
  separator.style.height = "1px";
  separator.style.margin = "4px 2px";
  separator.style.background = "var(--dsw-alias-border-l1)";
  group.appendChild(separator);
  for (const item of items) {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("role", "menuitem");
    button.setAttribute("data-bga-open-kind", item.kind);
    Object.assign(button.style, itemStyle());
    const iconWrap = document.createElement("span");
    iconWrap.style.display = "inline-flex";
    iconWrap.style.flex = "none";
    iconWrap.style.width = "16px";
    iconWrap.style.height = "16px";
    iconWrap.style.alignItems = "center";
    iconWrap.style.justifyContent = "center";
    iconWrap.style.color = "var(--dsw-alias-label-tertiary)";
    iconWrap.appendChild(buildIcon(extraOpenIcon(item.kind)));
    button.appendChild(iconWrap);
    const label = document.createElement("span");
    label.textContent = item.label;
    label.style.flex = "1";
    label.style.minWidth = "0";
    label.style.overflow = "hidden";
    label.style.textOverflow = "ellipsis";
    label.style.whiteSpace = "nowrap";
    button.appendChild(label);
    button.addEventListener("mouseenter", () => {
      button.style.background = "var(--dsw-alias-interactive-bg-hover)";
    });
    button.addEventListener("mouseleave", () => {
      button.style.background = "transparent";
    });
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      event.preventDefault();
      onRequest(item.kind, path);
    });
    group.appendChild(button);
  }
  return group;
}
function injectOpenButtons(menu, path, onRequest, prefs = {}, openExtra) {
  if (menu.hasAttribute(INJECTED_MARK)) return false;
  if (!isWorkspaceMenu(menu)) return false;
  const renameItem = findRenameItem(menu);
  if (renameItem === null || renameItem.parentElement === null) return false;
  const labels = openMenuLabels(prefs).map((action) => ({
    ...action,
    icon: OPEN_ACTIONS.find((item) => item.kind === action.kind).icon
  }));
  const deleteItem = findDeleteItem(menu);
  const owner = deleteItem?.parentElement ?? renameItem.parentElement;
  if (owner === null) {
    menu.setAttribute(INJECTED_MARK, "");
    return true;
  }
  const openGroup = buildButtonGroup(onRequest, path, labels);
  owner.insertBefore(openGroup, deleteItem !== null ? deleteItem.nextSibling : null);
  const extraItems = openExtra !== void 0 ? extraOpenMenuItems(openExtra) : [];
  if (extraItems.length > 0) {
    const extraGroup = buildExtraOpenGroup(extraItems, path, onRequest);
    owner.insertBefore(extraGroup, openGroup.nextSibling);
  }
  menu.setAttribute(INJECTED_MARK, "");
  return true;
}
async function loadOpenPrefs() {
  try {
    const response = await fetch(CONFIG_URL3, { cache: "no-store" });
    if (!response.ok) return { terminal: "", editor: "", openExtra: {} };
    const value = await response.json();
    const open = value.open ?? {};
    const openExtra = value.openExtra ?? {};
    return {
      terminal: typeof open.terminal === "string" ? open.terminal : "",
      editor: typeof open.editor === "string" ? open.editor : "",
      openExtra: {
        androidStudio: typeof openExtra.androidStudio === "boolean" ? openExtra.androidStudio : true,
        xcode: typeof openExtra.xcode === "boolean" ? openExtra.xcode : true,
        wechatDevtools: typeof openExtra.wechatDevtools === "boolean" ? openExtra.wechatDevtools : true,
        intellijIdea: typeof openExtra.intellijIdea === "boolean" ? openExtra.intellijIdea : true,
        devecoStudio: typeof openExtra.devecoStudio === "boolean" ? openExtra.devecoStudio : true,
        webstorm: typeof openExtra.webstorm === "boolean" ? openExtra.webstorm : true,
        pycharm: typeof openExtra.pycharm === "boolean" ? openExtra.pycharm : true,
        goland: typeof openExtra.goland === "boolean" ? openExtra.goland : true
      }
    };
  } catch {
    return { terminal: "", editor: "", openExtra: {} };
  }
}
function mountWorkspaceOpenMenu(ctx) {
  const workspaces = ctx.workspaces;
  let currentPath;
  const onCaptureClick = (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest("button[aria-label]");
    if (button === null) return;
    const aria = button.getAttribute("aria-label") ?? "";
    let label = workspaceLabelFromAria(aria);
    if (label === void 0) {
      label = workspaceLabelFromRow(button.closest('[role="treeitem"]'));
    }
    if (label === void 0) {
      currentPath = void 0;
      return;
    }
    const items = workspaces?.list.getSnapshot().items ?? [];
    currentPath = resolveWorkspacePath(items, label);
    if (currentPath === void 0) {
      console.warn(`[bga-dsh-workbench] could not resolve workspace path for label "${label}"`);
    }
  };
  document.addEventListener("click", onCaptureClick, true);
  let toastEl = null;
  let toastTimer;
  function showToast(message, displayName) {
    if (toastEl === null) {
      toastEl = document.createElement("div");
      toastEl.setAttribute("role", "status");
      toastEl.style.cssText = [
        "position: fixed",
        "z-index: 2147483647",
        "right: 16px",
        "bottom: 16px",
        "max-width: 360px",
        "padding: 10px 14px",
        "border-radius: 8px",
        "background: #cf222e",
        "color: #ffffff",
        'font: 13px/1.5 -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif',
        "box-shadow: 0 4px 16px rgba(0,0,0,0.28)"
      ].join(";");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = `\u300C${displayName}\u300D\u6253\u5F00\u5931\u8D25\uFF1A${message}`;
    toastEl.style.display = "block";
    if (toastTimer !== void 0) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      if (toastEl !== null) toastEl.style.display = "none";
    }, 6e3);
  }
  const requestOpen = (kind, path) => {
    void fetch(OPEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, path })
    }).then(async (response) => {
      const value = await response.json().catch(() => null);
      if (value?.ok !== true) {
        const reason = value?.error ?? `HTTP ${response.status}`;
        console.warn(`[bga-dsh-workbench] open ${kind} ${path} failed:`, reason);
        showToast(reason, openDisplayName(kind));
      }
    }).catch((error) => {
      const reason = String(error instanceof Error ? error.message : error);
      console.warn(`[bga-dsh-workbench] open ${kind} ${path} failed:`, error);
      showToast(reason, openDisplayName(kind));
    });
  };
  let prefLoading = false;
  const observer = new MutationObserver(() => {
    if (currentPath === void 0) return;
    if (prefLoading) return;
    prefLoading = true;
    void loadOpenPrefs().then((prefs) => {
      prefLoading = false;
      if (currentPath === void 0) return;
      for (const menu of document.querySelectorAll('[role="menu"]')) {
        injectOpenButtons(menu, currentPath, requestOpen, prefs, prefs.openExtra);
      }
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
  return () => {
    document.removeEventListener("click", onCaptureClick, true);
    observer.disconnect();
    if (toastTimer !== void 0) clearTimeout(toastTimer);
    if (toastEl !== null) {
      toastEl.remove();
      toastEl = null;
    }
  };
}

// src/client/index.tsx
var import_jsx_runtime16 = require("react/jsx-runtime");
var inject = ["slots", "sessions", "workspaces", "connection", "settingsScope", "locale"];
var CONFIG_URL4 = "/bga-dsh-workbench/config";
var SETTINGS_URL = "/bga-dsh-workbench/settings";
var AVATAR_URL2 = "/bga-dsh-workbench/avatar";
function apiFailure(status, operation) {
  if (status === 404 || status === 405) {
    return new Error(`${operation}\u5931\u8D25\uFF1A\u5BBF\u4E3B\u63D2\u4EF6\u4E3A\u65E7\u7248\u672C\uFF0C\u8BF7\u91CD\u542F Harness \u540E\u91CD\u8BD5`);
  }
  return new Error(`${operation}\u5931\u8D25 (${status})`);
}
var CONFIG_CHANGED_EVENT = "bga-dsh-workbench:config-changed";
function notifyConfigChanged() {
  window.dispatchEvent(new Event(CONFIG_CHANGED_EVENT));
}
function apply(ctx) {
  ctx.effect(() => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = (0, import_client4.createRoot)(container);
    root.render(/* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(import_jsx_runtime16.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(WorkbenchBanner, {}),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(ConfettiLayer, {}),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(EnglishLearningLayer, {})
    ] }));
    return () => {
      root.unmount();
      container.remove();
    };
  }, "bga-dsh-workbench: banner");
  ctx.slots.inject("settings.section", () => ctx.slots.register({
    name: "settings.section",
    id: "bga-dsh-workbench",
    order: 60,
    // 区块在同页内容中的排序权重（数值越大越靠后）
    label: () => "BGA \u5DE5\u4F5C\u53F0\u8BBE\u7F6E",
    inject: () => ({
      // 读取当前配置：请求 /config 并做逐字段类型校验，
      // 类型不符或缺省的字段回退到默认值，避免后端数据结构变化导致前端崩溃。
      load: async () => {
        const response = await fetch(CONFIG_URL4, { cache: "no-store" });
        if (!response.ok) throw apiFailure(response.status, "\u8BFB\u53D6\u8BBE\u7F6E");
        const value = await response.json();
        const banner = value.banner ?? {};
        return {
          avatarPath: typeof banner.avatarPath === "string" ? banner.avatarPath : "",
          text: typeof banner.text === "string" ? banner.text : "",
          show: typeof banner.show === "boolean" ? banner.show : true,
          sound: typeof value.confetti?.sound === "boolean" ? value.confetti.sound : true,
          terminal: typeof value.open?.terminal === "string" ? value.open.terminal : "",
          editor: typeof value.open?.editor === "string" ? value.open.editor : "",
          openExtra: {
            androidStudio: typeof value.openExtra?.androidStudio === "boolean" ? value.openExtra.androidStudio : true,
            xcode: typeof value.openExtra?.xcode === "boolean" ? value.openExtra.xcode : true,
            wechatDevtools: typeof value.openExtra?.wechatDevtools === "boolean" ? value.openExtra.wechatDevtools : true,
            intellijIdea: typeof value.openExtra?.intellijIdea === "boolean" ? value.openExtra.intellijIdea : true,
            devecoStudio: typeof value.openExtra?.devecoStudio === "boolean" ? value.openExtra.devecoStudio : true,
            webstorm: typeof value.openExtra?.webstorm === "boolean" ? value.openExtra.webstorm : true,
            pycharm: typeof value.openExtra?.pycharm === "boolean" ? value.openExtra.pycharm : true,
            goland: typeof value.openExtra?.goland === "boolean" ? value.openExtra.goland : true
          }
        };
      },
      // 保存横幅配置（局部更新），成功后广播配置变更，让横幅等组件立即刷新。
      save: async (patch) => {
        const response = await fetch(SETTINGS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ banner: patch })
        });
        if (!response.ok) throw apiFailure(response.status, "\u4FDD\u5B58");
        notifyConfigChanged();
      },
      // 保存彩带配置（目前只有音效开关）。音效开关由本区块内部状态管理，无需广播。
      saveConfetti: async (patch) => {
        const response = await fetch(SETTINGS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ confetti: patch })
        });
        if (!response.ok) throw apiFailure(response.status, "\u4FDD\u5B58");
      },
      // 上传头像图片：请求体即文件二进制；后端返回新的头像路径。
      // 校验响应里的 ok 与 avatarPath，成功后再通知全局刷新（让横幅头像立即生效）。
      uploadAvatar: async (file) => {
        const response = await fetch(AVATAR_URL2, {
          method: "POST",
          headers: { "Content-Type": file.type || "application/octet-stream" },
          body: file
        });
        const value = await response.json();
        if (!response.ok || value.ok !== true || typeof value.avatarPath !== "string") {
          throw new Error(value.error ?? apiFailure(response.status, "\u4E0A\u4F20").message);
        }
        notifyConfigChanged();
        return { avatarPath: value.avatarPath };
      },
      // 恢复默认头像：向后端写空头像路径，并广播配置变更。
      resetAvatar: async () => {
        const response = await fetch(SETTINGS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ banner: { avatarPath: "" } })
        });
        if (!response.ok) throw apiFailure(response.status, "\u6062\u590D\u9ED8\u8BA4");
        notifyConfigChanged();
      },
      saveOpenPrefs: async (patch) => {
        const response = await fetch(SETTINGS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ open: patch })
        });
        if (!response.ok) throw apiFailure(response.status, "\u4FDD\u5B58");
      },
      saveExtraOpen: async (patch) => {
        const response = await fetch(SETTINGS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ openExtra: patch })
        });
        if (!response.ok) throw apiFailure(response.status, "\u4FDD\u5B58");
      }
    })
  }, SettingsSection));
  applyTaskBoard(ctx);
  ctx.effect(() => mountWorkspaceOpenMenu(ctx), "bga-dsh-workbench: workspace open menu");
}
return module.exports; } });
//# sourceMappingURL=client.js.map
