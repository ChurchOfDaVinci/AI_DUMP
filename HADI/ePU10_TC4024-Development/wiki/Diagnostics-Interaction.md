# Software Engineering Topic: Diagnostics Interaction

This section describes how the centralised diagnostics system works and how object FBs participate in it.

## 1) Architecture overview
The `ErrorHandling` program owns a fixed-size array of `FB_AddErrorST` instances (`AddError[0..i_maxevents]`, 401 elements with `i_maxevents` constant = 400) and a parallel array of `ST_ErrorStruct` records (`a_ActiveEvents[0..i_maxevents]`). Every refresh cycle (500 ms or on first scan), it calls the `GetDiagnostics` method on every registered object FB. Each `GetDiagnostics` call populates a contiguous slice of the shared arrays, using a running index (`w_ErrorIndex`) that the ErrorHandling program resets to 0 at the start of each cycle. After all objects have been queried, the final index value is stored in `w_Totalerrors`.

## 2) ST_ErrorStruct — what each diagnostics entry stores
Every diagnostics slot is an `ST_ErrorStruct` containing:
- `b_ErrorActive` — TRUE while the fault condition is present.
- `s_Severity` — text representation of the `eSeverity` enum (Warning / NormalShutdown / QuickShutdown / EmergencyShutdown).
- `w_ID` — unique numeric identifier = `w_ErrorID + eObject_ID` base offset (see below).
- `s_Message` — human-readable description, auto-prefixed with the object-ID name.
- `s_DateError` / `s_TimeError` — timestamp when the error was first raised.
- `s_TimeCleared` — timestamp when the error condition disappeared (empty while still active).
- `b_SMSEnable` — whether this event triggers an SMS notification.

## 3) FB_AddErrorST — the diagnostics instance
Each `FB_AddErrorST` instance represents one potential diagnostic event. Key inputs:
- `b_ErrorTrig` — the live boolean condition from the object.
- `w_ErrorID` — a number local to the object (1, 2, 3, …).
- `e_ObjectID` — the `eObject_ID` enum value that provides the base offset.
- `s_Message` — descriptive text.
- `e_sev` — severity level (`eSeverity`).
- `t_TriggerTime` — on-delay before the event is raised.
- `b_AutoClear` — if TRUE, the event clears itself when the trigger disappears (only for severities below NormalShutdown).

The instance computes the globally unique ID as: `w_ID := w_ErrorID + eObject_ID`. For example, PowerStack error 3 → `3 + 100 = 103`. This keeps IDs unique across all objects as long as each object's local IDs stay within its allocated range.

When `b_ErrorTrig` is TRUE (after the on-delay), the instance sets the corresponding GVL severity flag (`GVL.b_WarningActive`, `GVL.b_NormalShutdownActive`, `GVL.b_QuickShutdownActive`, or `GVL.b_EmergencyShutdownActive`), which the ErrorSFC reads to trigger the appropriate shutdown branch. Info-level events do not set a GVL flag since they require no system-level reaction.

## 4) eObject_ID — base offsets
The `eObject_ID` enum assigns each object a numeric base value that creates a reserved ID range:
- Safety = 10, PowerStack = 100, NetContactor = 150, PowerModuleMaster = 200, PowerModuleSlave = 300, PowerMonitor = 400, InternalPowerSupply = 500, UPS = 550, NeutralTransformer = 600, HartingIO = 650, Battery = 700, Cooling = 800, HeatPump = 850, AC_Switchgear = 900, DC_Switchgear = 950, RCM = 1000, SurgeProtection = 1010, InsulationMonitor = 1020, Firedetection = 1030, OCP = 1050, Enclosure_LED = 1200, Enclosure_doors = 1210, Enclosure_climate = 1220, PLC = 2000, Router = 2100, PNcontroller = 2200, IotController = 2300, PeakshaveBox = 2400, GenGridController = 3000, PowerController = 3100, System = 3200, Genset = 4000.

When adding a new object, choose a base value that does not overlap with any existing range, and add it to the enum.

## 5) eSeverity — severity levels
- `Info (1)` — informational, no shutdown.
- `Warning (2)` — warning, no shutdown.
- `NormalShutdown (3)` — triggers an orderly shutdown via ErrorSFC.
- `QuickShutdown (4)` — triggers an immediate shutdown.
- `EmergencyShutdown (5)` — reserved for Safety program only.

## 6) GetDiagnostics method — the object-side contract
Every object FB that participates in diagnostics must implement a `GetDiagnostics` method with the following signature:

```
METHOD PUBLIC GetDiagnostics
VAR_IN_OUT
    AddError        : ARRAY [*] OF FB_AddErrorST;
    a_ActiveEvents  : ARRAY [*] OF ST_ErrorStruct;
    w_Index         : WORD;
END_VAR
```

Inside the method, each diagnostic event is inserted by calling an `AddError[w_Index]` instance, binding the live trigger, error-ID, object-ID, message, and severity. After each insert, `w_Index` must be incremented:

```
AddError[w_Index](
    b_ErrorTrig   := <condition>,
    out_ST_Error  := a_ActiveEvents[w_Index],
    w_ErrorID     := <local number>,
    e_ObjectID    := eObject_ID.<Object>,
    s_Message     := '<description>',
    e_sev         := eSeverity.<level>
);
w_Index := w_Index + 1;
```

## 7) ErrorHandling program — the orchestrator
The `ErrorHandling` program resets `w_ErrorIndex := 0` at the start, then calls `GetDiagnostics` on every registered object. Each call advances `w_ErrorIndex` by the number of events that object inserts. After the last call, `w_Totalerrors := w_ErrorIndex` captures the total slot count. The `a_ActiveEvents` array is exposed to the HMI for display.

## 8) Checklist for adding a new object to diagnostics
1. Add a new entry to the `eObject_ID` enum with a unique base offset that does not overlap with existing ranges.
2. Implement a `GetDiagnostics` method in the object FB following the signature and pattern above. Increment `w_Index` after each insert.
3. Add a `<ObjectInstance>.GetDiagnostics(AddError, a_ActiveEvents, w_errorindex)` call in the `ErrorHandling` program body.
4. Verify that the total number of diagnostic inserts across all objects stays below the array limit of 400 (`i_maxevents`). The running total is tracked in `w_Totalerrors`.
