# Software Engineering Topic: MainSFC, ErrorSFC and Object Interaction

This section documents the top-level sequencing architecture in `MAIN_Fast` and how it coordinates with the object function blocks.

## 1) Overall call structure
Every PLC cycle, `MAIN_Fast` executes in this order:
1. All object FBs are called unconditionally (PowerStack, BMS, CoolingSystem, etc.) so that they always process I/O regardless of the system state.
2. The `Reset()` method is called, driven by the user reset command or forced by system-not-ready / VDL-reset conditions.
3. `MainSFC()` is called — the main state machine that orchestrates system-level sequencing.
4. `SystemShutdown()` is called for manual or fire-system-triggered shutdown.

## 2) MainSFC — system state machine
The MainSFC is an IEC 61131-3 Sequential Function Chart that drives the system through its operational lifecycle. Its states and transitions are:

- **Init** → sets `eSystemState.Init`, clears EMstop-completed flag.
- **StandBy** → commands PowerStack to standby, enables HVDC precharge, starts cooling. Reports Conditioning / Dehumidifying / StandBy / Transport state depending on cooling mode and transport-mode flag.
  - *Transition*: `Init → StandBy` when `NOT(Errorhandling.b_QuickShutdownActive)` and the ErrorSFC is in its Init step (i.e. no active error).
- **InitializeMachine** → placeholder for machine-specific initialization.
  - *Transition*: `StandBy → InitializeMachine` when user issues start command (`b_start`) and PowerStack reports `b_StartEnabled`, not in transport mode, and no normal-shutdown active.
- **StartUpRequest** → calls `PowerStack.Startcmd()`, reports `eSystemState.Starting`.
  - *Transition*: `InitializeMachine → StartUpRequest` immediately (TRUE).
- **NormalOperation** → calls `PowerStack.Startcmd()` continuously, reports Running / Discharging_Only / Charging_Only / Stopped depending on PowerStack and BMS status.
  - *Transition*: `StartUpRequest → NormalOperation` when `b_MethodStartFB` (start sequence completed).
- **IdleOperation** → calls `PowerStack.Stopcmd()`, reports `eSystemState.Stopped`.
  - *Transition*: `NormalOperation → IdleOperation` when user issues stop command (`b_Stop`).
  - *Transition*: `IdleOperation → NormalOperation` when user issues start command (`b_Start`).

The MainSFC also contains a **continuous action** (`a_ContinousActions`) that runs every cycle regardless of the active step. This continuous action calls `ErrorSFC()`.

## 3) ErrorSFC — error/shutdown supervisor
The ErrorSFC runs inside the MainSFC continuous action. It monitors error conditions and forces the MainSFC into a safe state when errors occur. Its flow is:

- **Init** → waiting state (initial step).

From the Init step, three branches are evaluated in priority order:
- **Branch0 (Emergency Shutdown)**: triggers on `NOT safety.get.b_SafetyOK` → enters `EmergencyShutdown` step.
  - `EmergencyShutdown` sets `SFCReset := TRUE`, calls `EMStop()` on all objects, disables HVDC, reports `eSystemState.EMstop`.
  - Once all EMStop methods complete (`b_EMstopCompleted`), transitions to `ErrorSequence`.
- **Branch1 (Normal Shutdown)**: triggers on `systemcontrol.toSystem.control.b_Shutdown OR Errorhandling.b_NormalShutdownTrigger` → enters `NormalShutdown` step.
  - `NormalShutdown` sets `SFCReset := TRUE`, calls `PowerStack.Shutdowncmd()`, reports `eSystemState.shutdown`.
  - From NormalShutdown: either completes (`b_shutdownCompleted` → `ErrorSequence`) or escalates to EmergencyShutdown if safety fails.
- **Branch2 (Quick Shutdown / Error)**: triggers on `Errorhandling.b_QuickShutdownActive` → enters `ErrorSequence` directly.
  - Entry action (`_aErrorSequence_entry`): sets `SFCReset := TRUE`.

The **ErrorSequence** step:
- Commands `PowerStack.Shutdowncmd()` to stop the inverter.
- Calls `Reset(FALSE, b_Reset)` to allow the user to reset individual object errors.
- If an emergency shutdown is also active, disables HVDC and reports EMstop state.

**Exiting the error state**: when all errors are cleared (`NOT Errorhandling.b_QuickShutdownActive`), the ErrorSFC transitions from `ErrorSequence` back to Init. The exit action (`a_ErrorSequence_exit`) executes:
- `Reset(FALSE, FALSE)` — stops the reset pulse.
- `SFCReset := FALSE` — **releases the MainSFC** from its held Init state.

## 4) The SFCReset mechanism
`SFCReset` is the key variable that links the ErrorSFC to the MainSFC:
- When `SFCReset := TRUE`, the MainSFC is forced back to its Init step and held there. This is a built-in TwinCAT SFC feature: setting `SFCReset` resets the SFC to its initial step.
- The ErrorSFC sets `SFCReset := TRUE` whenever an error, shutdown, or emergency condition is active.
- Only when the ErrorSFC exits the error sequence (all errors cleared and user reset acknowledged) does it set `SFCReset := FALSE`.
- Once released, the MainSFC resumes from Init and can progress to StandBy and eventually to normal operation when commanded.

This creates a clean separation: the ErrorSFC owns the error lifecycle and the MainSFC owns the operational lifecycle. The only coupling between them is the `SFCReset` flag.

## 5) Object interaction from the MainSFC
The MainSFC interacts with objects through their **methods** rather than by writing to their `set` struct. This keeps the sequencing logic clean and the object interfaces well-defined:

- `PowerStack.Standbycmd()` — called in StandBy state
- `PowerStack.Startcmd()` — called in StartUpRequest and NormalOperation
- `PowerStack.Stopcmd()` — called in IdleOperation
- `PowerStack.Shutdowncmd()` — called in ErrorSequence and NormalShutdown
- `PowerStack.EMstop()`, `CoolingSystem.EMstop()`, `BMS.EMstop()`, etc. — called during EmergencyShutdown
- `PowerStack.Reset()`, `CoolingSystem.Reset()`, `BMS.Reset()`, etc. — called during the Reset method
- `CoolingSystem.Start()`, `CoolingSystem.Shutdown()` — called in StandBy for cooling lifecycle
- `InternalPowerSupply.HVDC_Enable()` / `HVDC_disable()` — called for DC bus management

The `set` struct is written by `SystemControl` (which aggregates HMI/external-control inputs) and passed to each object as a `VAR_INPUT`. The MainSFC does not write to `set` directly — it commands objects exclusively through methods.

## 6) Reset method
The `Reset()` method in `MAIN_Fast` calls `Reset()` on every object in sequence using a bitmask (`w_MethodFbs`). Each object's Reset method returns TRUE when its reset is complete. Only when all bits are set (all objects reset) is the overall reset considered done. The reset is triggered by:
- User reset command (`systemcontrol.toSystem.control.b_Reset`)
- Forced reset when system is not ready (`NOT GVL.b_SystemReady`) or VDL reset is active

## 7) Summary of the error recovery flow
1. An error occurs → `Errorhandling.b_QuickShutdownActive` becomes TRUE (or safety fails, or normal shutdown triggers).
2. ErrorSFC enters the appropriate branch and sets `SFCReset := TRUE`.
3. MainSFC is forced back to Init and held there — the system is in a safe, stopped state.
4. User or system clears the error condition (e.g. acknowledges fault, fixes root cause).
5. User presses Reset → the Reset method calls Reset() on all objects.
6. `Errorhandling.b_QuickShutdownActive` becomes FALSE → ErrorSFC exits ErrorSequence.
7. Exit action sets `SFCReset := FALSE` → MainSFC is released.
8. MainSFC progresses from Init → StandBy → normal operation can be commanded again.
