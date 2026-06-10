# Software Engineering Guideline: UI Data Shared Between Cycles

- It is acceptable that user-configured data is updated over multiple PLC cycles when values are changed one-by-one from the UI.
- A short-lived mixed state (some values updated, some not yet) is acceptable only if parameters are independent and this does not create unsafe or invalid behavior.
- If multiple parameters must be consistent as a set (for example command/value pairs, limits, mode-dependent settings, or safety-relevant settings), use an explicit commit/handshake mechanism and apply them atomically in PLC logic.
