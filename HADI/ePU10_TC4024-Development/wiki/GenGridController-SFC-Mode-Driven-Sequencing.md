# Software Engineering Topic: GenGridController SFC — Mode-Driven Sequencing

This section documents the `GenGridSFC` action (sequential function chart) inside `FB_GenGridController`. The SFC provides a general-purpose startup/run/stop sequence that adapts to multiple breaker-operation modes (grid feed-through, external grid, genset droop, genset isochronous, genset fixed-power) and manages contactor control and power-control activation accordingly.

## 1) eBreakerOperationMode — the mode axis
The SFC behaviour is parameterised by `BreakerOperationMode`, which is determined at runtime by `SetBreakerAndPowercontrolMode` based on the AC-input type, genset mode, and PeakshaveBox (PSB) settings:

| Mode | Enum value | AC input | Inverter role |
|---|---|---|---|
| None | 0 | No input | Standalone BESS |
| GridFeedthrough | 1 | Utility grid | Grid-following (AFE) or grid-forming when grid drops |
| ExtGrid | 2 | External (PSB) | AFE behind PSB contactor |
| GenDroop | 3 | Genset (droop) | Microgrid / droop alongside genset |
| GenIso | 4 | Genset (isochronous) | Microgrid / isochronous alongside genset |
| GenFix | 5 | Genset (fixed power) | Island or AFE depending on grid-AC detection |

`SetBreakerAndPowercontrolMode` also derives the `ePowerControlMode` (PeakshaveInputGrid, PeakshaveInputGen, PeakshaveExt, None) and asks `ModeSwitch` whether a mode change is permitted.

## 2) SFC states (eGenGridState)
The SFC steps map directly to the `eGenGridState` enum reported in `get.e_state`:

| State | Enum | Meaning |
|---|---|---|
| Init | 0 | Entry/reset state; contactors forced open, power-control disabled |
| Idle | 1 | SFC enabled but not yet triggered; waiting for start condition |
| Waiting_Trigger | 2 | Evaluating start/trigger conditions per breaker mode |
| Starting | 3 | Running the start-up sequence (warmup → sync → close contactor) |
| Running | 4 | Contactor closed, power-control active, monitoring for stop triggers |
| Stopping | 5 | Deloading / opening contactor / genset cooldown |
| Warmup | 6 | Genset warm-up timer active |
| Cooldown | 7 | Genset cool-down timer active after opening contactor |
| Synchronization | 8 | Synchronisation in progress (frequency/voltage/phase alignment) |
| Waiting_Mode_Reconnect | 9 | Mode-transition active, waiting for reconnect |
| Gridcode_Release_Check | 10 | Grid-code reconnection timer not yet expired |
| Waiting_For_AC | 11 | Grid/ext-grid modes waiting for AC to appear |

## 3) SFC flow and transitions
The SFC has six steps: **INIT → IDLE → WAITINGTRIGGER → STARTUP → RUN → STOP → (back to IDLE)**.

- **INIT → IDLE** — transition fires when `SFCEnable` is TRUE (i.e. breaker mode ≠ None, Enable input TRUE, no active faults, no EMstop).
- **IDLE → WAITINGTRIGGER** — fires when `SFCTransTrigger.Q`. In IDLE, for grid/ext-grid modes power-control is deactivated; for genset modes it can be pre-activated if start conditions are met.
- **WAITINGTRIGGER → STARTUP** — fires when `SFCtip` goes TRUE. The trigger depends on breaker mode:
  - GenIso / GenDroop / GenFix: `b_StartCondition` AND no gen-down fault (and BESS ready + busbar AC for GenFix).
  - GridFeedthrough / ExtGrid: breaker AC is OK and grid-code release check passes.
  - `b_ForceOperate` or an already-closed breaker bypass the wait.
  - `ModeTransActive` inhibits the trigger so mode switches complete first.
- **WAITINGTRIGGER → IDLE** — fires on `NOT SFCtip` (start condition lost before triggering).
- **STARTUP → RUN** — fires when `StartSequence` method completes (see §4 below).
- **STARTUP → STOP** — fires when `NOT SFCtip` (start aborted during sequence).
- **RUN → STOP** — fires when `SFCTransTrigger.Q` after a 10 ms debounce. Triggers:
  - GenIso / GenDroop: gen-down detected, or start condition lost (when not in hybrid mode).
  - GenFix: busbar AC lost, or frequency/voltage protection trip.
  - GridFeedthrough / ExtGrid: grid lost; if auto-switching is disabled, a mode-transition is requested instead.
  - Common: powerstack not in control-enabled state, breaker feedback lost, MCCB feedback lost, or mode-transition active.
- **STOP → IDLE** — fires when `SFCTransTrigger.Q` after the stop sequence completes.

Every step except INIT has `ContinousActions` linked as a stored (S) action, which holds the net contactor closed when AMF is enabled.

## 4) StartSequence — the startup sub-sequencer
`StartSequence` is a method-based sequencer (not a nested SFC) that steps through an ordered array of sub-steps depending on mode:

| Mode | Sequence | Steps |
|---|---|---|
| GenIso, GenDroop | SequenceOption1 [1,2,3] | 1 → Warmup, 2 → Close contactor (synchronise), 3 → Wait for breaker feedback |
| GridFeedthrough, ExtGrid, GenFix | SequenceOption3 [2,3] | 2 → Close contactor, 3 → Wait for breaker feedback |

Sub-step details:
- **Step 1 (Warmup)**: sends `b_IOStartStop := TRUE` to the genset, waits for AC on the breaker, then runs the warm-up timer (`t_WarmupTime`). Skipped if genset is already hot.
- **Step 2 (Close contactor)**: calls `InputContactor.Close()` or `ExtContactor.Close()`, sets state to `Synchronization`. For grid/ext-grid this includes synchronisation checks (voltage, frequency, phase). A 20 s timeout retries the sequence; after `st_params.by_SyncRetries` failures a `SynchronisationFault` event is raised.
- **Step 3 (Escape)**: waits for breaker feedback + AC-OK confirmation.

On completion (index reaches 0-terminator), `StartSequence` returns TRUE and the SFC advances to RUN.

## 5) FB_ContactorControl — contactor and synchronisation
Each contactor (input and external) is managed by an `FB_ContactorControl` instance. Key methods:

- **Close()**: if the contactor is already closed or the bus is dead-bus, closes immediately. If `Force` is TRUE, enables sync-check and waits for synchroniser-OK + AC-OK before closing. Otherwise calls `Sync()`.
- **Sync()** (private): enables synchronisation signal, runs `FreqControlPID` (PID-based phase matching using zero-crossing timestamps) or the simpler `FrequencyControl` (frequency offset), plus `VoltageControl` (voltage PID). When frequency-sync, voltage-sync, rotation-field check, and a sync-delay all pass, issues the close command.
- **Open()**: starts the deload procedure (waits for current to drop below threshold or times out), then opens the contactor.
- **Deload()**: monitors current and power; returns TRUE when current is below `ui_DeloadCurrentRelease` or power is below threshold.
- **CheckRotationField()**: verifies the AC rotation (phase sequence) of the reference source matches the bus-bar rotation. Raises `RotationFault` on mismatch.
- **ACcheck** (function): confirms voltage and frequency are within acceptable ranges.

## 6) ModeSwitch — safe mode-transition logic
`ModeSwitch` is called by `SetBreakerAndPowercontrolMode` every cycle. It evaluates whether switching from the current `BreakerOperationMode` to the requested mode is safe:

- **Inhibit conditions**: e.g. grid AC detected at output when switching to GenIso/GenDroop (would cause paralleling); AFE still active; unwanted genset AC at input for GenFix.
- **Acknowledgement-required conditions**: e.g. input contactor still closed and AC present when leaving GridFeedthrough or GenDroop/GenIso — the SFC must first open the contactor before the mode can change.
- **Triggers for forced disconnect** (GridFeedthrough only): emergency-shutdown, normal-shutdown, current-limit trip, or manual toggle. These set `get.b_ModeTransActive := TRUE`, which causes the SFC RUN step to transition to STOP.
- **Current-limit protection**: monitors input current against feed-in/supply limits with a configurable trip delay and retry counter.

A mode switch is allowed when no inhibits are active, no acknowledgement is pending, and no mode-transition is in progress. If the SFC is active, only same-genset-family switches (e.g. GenIso ↔ GenDroop) are permitted without stopping.

## 7) SetInverterMode — inverter mode selection
`SetInverterMode` derives the inverter operating mode (`InverterMode`, `PowerMode`) from the breaker-operation mode and the current contactor/grid state:

| Breaker mode | Contactor open | Contactor closed |
|---|---|---|
| None | Island or AFE (based on grid-AC detection and gridmode setting) | n/a |
| GridFeedthrough | Island or Droop (if no grid-AC or grid-forming forced) | Isochronous (normal) or AFE (grid-code active) |
| GenDroop | Droop | Droop |
| GenIso | Island/Droop (contactor open) | Isochronous or AFE (param-dependent) |
| GenFix | Island (no grid-AC) / AFE (grid-AC detected) | Same |
| ExtGrid | AFE (normal) / Island (AMF + ext-contactor closed) | AFE |

Manual overrides (`eGridMode.following`/`forming`, `eUgridPowerMode`) can force AFE or Droop regardless of the automatic selection.

## 8) StartStopConditions — genset start/stop logic
`StartStopConditions` evaluates four independent triggers and summarises them into `b_StartCondition`:
- **LoadStart**: output load exceeds `r_BatteryloadStart`% (discharge overload).
- **SoCStart**: battery SoC drops below `r_SocStart`%.
- **ChargeLoadStart**: inverter load exceeds threshold during charging (loadbank mode).
- **BatFullStart**: battery SoC exceeds `r_SocMax`% (loadbank mode).
- **Manual**: `eGensetStartStop.Start` forces start, `Stop` forces stop.
- **Battery error**: if `b_StartAtBatteryError` is set and BESS is not ready, genset starts.

The resulting `b_StartCondition` drives the SFC WAITINGTRIGGER → STARTUP transition for genset modes.

## 9) Protection and fault handling
- **GenDownCheck**: monitors for reverse power, zero-power timeout, and frequency/voltage violations on the genset. After `GenDownRetries` consecutive gen-down events, raises `b_GenDownTrip` (latched fault).
- **GenFreqVoltProtections**: over/under frequency and voltage trips with configurable delays, plus overcurrent protection for fixed-power mode.
- **BundleFaultEvents**: aggregates `StartupFault`, `SynchronisationFault`, and `WarmupFault` into `get.b_faultActive`, which forces the SFC back to INIT and disables `SFCEnable`.
- A user `Reset` (via the Reset method) clears fault events and the gen-fail counter.

## 10) Summary: adding a new breaker-operation mode
1. Add the new mode to `eBreakerOperationMode`.
2. Add a mapping case in `SetBreakerAndPowercontrolMode` to derive the breaker mode from AC-input settings.
3. Add a case in `SetInverterMode` to choose the appropriate inverter/power mode.
4. Add transition logic in `WAITINGTRIGGER_active`, `STARTUP_active` (choose sequence), `RUN_active` (stop triggers), and `STOP_active` (stop procedure).
5. Add inhibit/acknowledge checks in `ModeSwitch` if the new mode has paralleling or safety constraints.
6. Add start/stop conditions in `StartStopConditions` if the mode uses genset start/stop logic.
