# Software Engineering Topic: FB_PowerControl and FB_GenGridController

This section documents the control split between:
- `FB_GenGridController` (supervisory mode/state/target selection)
- `FB_PowerControl` (closed-loop P/Q + droop execution)

## 1) Architectural split and data handoff
- `FB_GenGridController` computes operation context and fills `TargetData: ST_PowerControl_Target`.
- `FB_PowerControl` consumes `TargetData` and produces inverter/genset requests:
  - inverter P/Q (`r_ActivePowerRQInv`, `r_ReactivePowerRQInv`)
  - inverter frequency/voltage/droop requests (`r_FrequencyRQ`, `r_VoltageRQ`, `r_FreqDroopRQ`, `r_VoltDroopRQ`)
  - genset P/Q percentages (`r_ActivePowerRQGen`, `r_ReactivePowerRQGen`) when load-share is enabled.
- Main rule: GenGrid decides *what mode and limits apply*; PowerControl decides *how to reach those targets robustly*.

## 2) FB_GenGridController responsibilities
- Selects breaker mode and power-control mode (`SetBreakerAndPowercontrolMode`).
- Selects inverter mode/powermode (`SetInverterMode`) based on breaker mode, grid mode, AMF, contactor/grid status.
- Builds `TargetData` (`GetControlTarget`) using:
  - `MapGridTarget` for grid/PSB peakshave operation
  - `MapGensetTarget` for genset isochronous/droop/fixed-power operation.
- Supervises generator start/stop triggers (`StartStopConditions`) from load, SoC, charge-load, battery-full and manual/auto modes.
- Applies protections/trips (`GenFreqVoltProtections`) for over/under frequency, over/under voltage, and overload.
- Runs SFC lifecycle (waiting/startup/run/stop/cooldown/warmup) and transition inhibit/ack logic.

## 3) FB_PowerControl responsibilities
- Validates and maps measured target values (`TargetSection`) for P/Q/voltage/current domain.
- Converts PF setpoint into reactive target (`PFToReactiveSetpoint`) with apparent-power limiting.
- Executes droop and SOC-based frequency shifting (`DroopController`):
  - nominal voltage/frequency tracking
  - frequency/voltage droop request generation
  - optional SOC droop bias near SOC low/high thresholds
  - sync override path that temporarily forces requested sync frequency/voltage and low droop.
- Executes active/reactive PID loops (`PIDcontrollers`) with:
  - per-loop enable by `ePIDmode` (`None`, `Q`, `P`, `Both`)
  - activation delays, transition ramps, sync hold behavior
  - parameterized deadbands/windows and output limits.
- Runs peakshave envelope logic (`PeakshaveController`) including voltage-based current-limit correction (`VoltagePeakshavePID`).
- Produces throttling insight bits (`get.ui_ThrottlingType`) to expose current limit and derating causes.

## 4) Mode mapping summary
- `ePowerControlMode.None`: PID generally disabled or fallback behavior, no active peakshave target.
- `ePowerControlMode.PeakshaveInputGrid`: input-grid based peakshave limits/targets.
- `ePowerControlMode.PeakshaveInputGen`: genset-input based targeting (including gen-iso PID path).
- `ePowerControlMode.PeakshaveExt`: external/PSB based targeting.

## 5) P/Q control intent
- Active power loop regulates to a power target constrained by feed/supply current limits and available envelope.
- Reactive loop regulates to either explicit Q setpoint or PF-derived setpoint.
- In `b_GenIsoPID` mode, behavior is adjusted for generator-island operation:
  - Q can be forced to zero for PF=1 operation where required
  - current limits are interpreted as active-power focused.

## 6) Frequency/voltage control intent
- Frequency/voltage requests are generated continuously from nominal setpoints + droop parameters.
- Optional SOC drooping shifts frequency bias:
  - low SOC biases toward charge-support behavior
  - high SOC biases toward discharge-support behavior.
- During explicit synchronization, sync setpoints override normal droop request outputs until sync clears.

## 7) Practical tuning and commissioning guidance
- Tune in this order: measurement validity, then current limits, then active PID, then reactive PID, then droop settings and frequency-shift PID parameters.
- Keep transition ramp/time conservative first; reduce oscillation risk before increasing responsiveness.
- Validate `MapGensetTarget` setpoint hierarchy (min/eff/max load) against real generator behavior before aggressive limits.
- Verify timeslot-dependent setpoints and SOC-target logic transitions; abrupt schedule changes can shift power targets quickly.
- For weak-grid deployments, validate grid-code settings, `b_WeakGridInput`, and transition behavior together.

## 8) Operational guardrails
- Treat `TargetData` as an atomic control contract between supervisory and loop layers.
- Avoid enabling conflicting manual overrides (manual P-set, fixed-power genset mode, and automatic peakshave objectives simultaneously).
- Investigate `get.events` first for PID and transition faults before changing gains.
- Confirm contactor feedback + AC quality + MCCB status when diagnosing unexpected mode fallback.

## 9) Diagnostics focus points
- `FB_GenGridController.get`: breaker mode, power-control mode, run condition, mode-transition flags, genset events.
- `FB_PowerControl.get`: actual P/Q/S/current values, active limits, throttling bits, PID error events.
- Typical failure signatures:
  - unstable or clipped power: PID output max/min limit saturation flags active / invalid limits / voltage correction saturation
  - repeated start/stop cycling: start-condition thresholds or hysteresis mismatch
  - unexpected mode reversion: transition inhibit, missing AC conditions, or synchronization fault events.
