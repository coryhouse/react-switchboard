export default function DevTools() {
  return (
    <>
      {/* Wrap app in ErrorBoundary so DevTools continue to display upon error */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {/* Passing a key to force the app to completely reinitialize when the userId changes. */}
        {appSlot}
      </ErrorBoundary>

      <section
        ref={devToolsWindowRef}
        className={cx(
          "fixed p-4 border shadow-xl max-h-screen overflow-auto bg-white opacity-90",
          {
            "w-16 h-16": !isOpen,
            "bg-yellow-100": !isOpen && hasAppBehaviorChanges,
            "bottom-0": position.includes("bottom"),
            "top-0": position.includes("top"),
            "right-0": position.includes("right"),
            "left-0": position.includes("left"),
          },
          className
        )}
      >
        {isOpen ? (
          <>
            <div className="flex flex-row-reverse">
              <CloseButton aria-label="Close DevTools" onClick={toggleOpen} />
            </div>
            {children}

            <details open>
              <summary className="mt-4 font-bold">HTTP</summary>
              <Field>
                <Input
                  id="globalDelay"
                  width="full"
                  changed={delayChanged}
                  type="number"
                  label="Global Delay"
                  value={delay}
                  onChange={(e) => setDelay(parseInt(e.target.value))}
                />
              </Field>

              <Field>
                <Select
                  width="full"
                  label="Customize Request Handler"
                  // Value need not change since the selected value disappears once selected.
                  value=""
                  onChange={(e) => {
                    setCustomResponses([
                      ...customResponses,
                      {
                        handler: e.target.value as THandler,
                        delay: customResponseDefaults.delay,
                        status: customResponseDefaults.status,
                        response: customResponseDefaults.response,
                      },
                    ]);
                  }}
                >
                  <option>Select Handler</option>
                  {requestHandlers
                    // Filter out handlers that are already customized
                    .filter(
                      (rh) =>
                        !customResponses.some(
                          (r) => r.handler === rh.info.header
                        )
                    )
                    .sort((a, b) => a.info.header.localeCompare(b.info.header))
                    .map((rh) => (
                      <option key={rh.info.header}>{rh.info.header}</option>
                    ))}
                </Select>
              </Field>

              {customResponses.map((setting) => (
                <HttpSettingForm
                  key={setting.handler as string}
                  customResponse={setting}
                  setCustomResponses={setCustomResponses}
                />
              ))}
            </details>

            <details className="mt-4" open>
              <summary className="mt-4 font-bold">General</summary>

              <Field>
                <Select
                  width="full"
                  label="Position"
                  value={position}
                  onChange={(e) =>
                    setPosition(e.target.value as DevToolsPosition)
                  }
                >
                  <option value="top-left">Top left</option>
                  <option value="top-right">Top Right</option>
                  <option value="bottom-left">Bottom left</option>
                  <option value="bottom-right">Bottom right</option>
                </Select>
              </Field>

              <Field>
                <Checkbox
                  id="openByDefault"
                  label="Open by default"
                  onChange={() => setOpenByDefault(!openByDefault)}
                  checked={openByDefault}
                />
              </Field>

              <Field>
                <Checkbox
                  id="closeViaEscapeKey"
                  label="Close via escape key"
                  onChange={() => setCloseViaEscapeKey(!closeViaEscapeKey)}
                  checked={closeViaEscapeKey}
                />
              </Field>

              <Field>
                <Checkbox
                  id="closeViaOutsideClick"
                  label="Close via outside click"
                  onChange={() => {
                    setCloseViaOutsideClick(!closeViaOutsideClick);
                  }}
                  checked={closeViaOutsideClick}
                />
              </Field>

              {/* TODO: Implement Auto Reload */}
              {/* <Field>
              <Checkbox
                label="Auto Reload"
                onChange={(e) => {
                  setDevToolsConfig((config) => {
                    return { ...config, autoReload: e.target.checked };
                  });
                }}
                checked={devToolsConfig.autoReload}
              />
            </Field> */}

              <div className="flex flex-row">
                <Field>
                  <CopySettingsButton
                    className="mr-2 w-32"
                    onClick={copyDevToolsSettingsUrlToClipboard}
                  />
                </Field>

                <Field>
                  <Button
                    className="mr-2"
                    onClick={() => {
                      // TODO: Only clear devtools-related localStorage.
                      localStorage.clear();
                      window.location.reload();
                    }}
                  >
                    Clear Settings
                  </Button>
                </Field>

                <Field>
                  <Button
                    type="submit"
                    onClick={() => window.location.reload()}
                  >
                    Reload
                  </Button>
                </Field>
              </div>
            </details>
          </>
        ) : (
          <OpenButton aria-label="Open DevTools" onClick={toggleOpen} />
        )}
      </section>
    </>
  );
}
