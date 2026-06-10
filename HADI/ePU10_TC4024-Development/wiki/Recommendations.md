# Recommendations: Identified Inconsistencies and Risks

This section lists actionable recommendations based on a codebase-wide audit of Object FB interfaces, naming conventions, diagnostics registration, and safety-method wiring.

## 1) Object FB interface inconsistencies
The intended pattern for every Object FB is:
- `VAR_INPUT set : ST_<Name>_Set` — main-program → object commands
- `VAR_OUTPUT get : ST_<Name>_Get` — object → main-program status
- `VAR_IN_OUT CONSTANT st_params : ST_<Name>_Params` — persistent parameters
- Methods: `GetDiagnostics`, `Reset`, `EMstop`

**Current deviations:**

| FB | Issue |
|---|---|
| FB_CoolingSystem | `st_params` declared as plain `VAR` instead of `VAR_IN_OUT CONSTANT`. Risk: the parameter block is a local copy, so changes made via the parameter-management / recipe system will not propagate, and values will revert to defaults on a restart. |
| FB_CoolingSystem | No `set` struct — uses individual primitives in VAR_INPUT instead. |
| FB_InternalPowerSupply | No `set` struct — uses power-demand structs directly. |
| FB_NeutralTransformer | No `set` struct — uses individual primitives in VAR_INPUT instead. |
| FB_DCSwitchgear | Stub implementation only — no VAR_INPUT, no st_params, no methods. Either complete the implementation or remove the placeholder. |

**Recommendation:** Align all Object FBs to the canonical interface pattern. For FBs that intentionally omit the `set` struct (because the main program has no commands for them), document the reason in a comment at the declaration.

## 2) Missing Reset and EMstop methods
`Reset` and `EMstop` are the two safety-relevant methods called from MainSFC during error recovery and emergency shutdown sequences.

**Missing Reset method (5 FBs):** FB_ACSwitchgear, FB_Enclosure, FB_GenComm, FB_HartingIO, FB_PeakshaveBox.
**Missing EMstop method (6 FBs):** FB_ACSwitchgear, FB_Enclosure, FB_GenComm, FB_HartingIO, FB_PeakshaveBox, FB_NeutralTransformer.

**Risk:** These objects cannot be driven to a safe state during emergency-shutdown, and will not participate in error recovery. If any of them hold contactor commands, relay outputs, or communication sessions that need to be reset, this is a safety gap.

**Recommendation:** Add at minimum a no-op `Reset` and `EMstop` method to every Object FB so the main program can call them uniformly. Implement actual safe-state logic where the object controls physical outputs.

## 3) EMstop method naming inconsistency
Two naming variants exist in the codebase: `EMstop` (FB_PowerStack, FB_InternalPowerSupply) and `EMSTOP` (FB_BMS, FB_CoolingSystem). Because Structured Text is case-insensitive this compiles, but it creates maintenance confusion and makes grep-based auditing unreliable.

**Recommendation:** Standardise on one spelling — `EMstop` (PascalCase) matches the project's method naming convention — and rename the others.

## 4) Struct type naming inconsistencies
The naming convention for get/set structs is `ST_<ObjectName>_Get` / `ST_<ObjectName>_Set` (PascalCase). Several FBs deviate:

| FB | Declared type | Expected |
|---|---|---|
| FB_PeakshaveBox | `ST_peakshaveBox_set` | `ST_PeakshaveBox_Set` |
| FB_PeakshaveBox | `ST_PeakshaveBox_get` | `ST_PeakshaveBox_Get` |
| FB_ACSwitchgear | `ST_ACswitchgear_set` | `ST_ACSwitchgear_Set` |
| FB_PLCState | `ST_PLCstate_get` | `ST_PLCState_Get` |
| FB_SurgeProtection | `ST_surgeprotection_get` | `ST_SurgeProtection_Get` |
| FB_PowerQualityMonitoring | `ST_PowerMonitor_get` | `ST_PowerMonitor_Get` |

**Recommendation:** Rename the DUT files and all references to follow PascalCase consistently. Although TwinCAT is case-insensitive, consistent casing prevents confusion in HMI symbol binding and external tooling.

## 5) Diagnostics registration gaps
Two objects instantiated in MAIN_Fast do not have their `GetDiagnostics` called in the `ErrorHandling` program:
- **FB_DCSwitchgear** — not registered (also has no GetDiagnostics method).
- **FB_PLCState** — not registered (also has no GetDiagnostics method).

**Risk:** Any internal faults in these objects are invisible to operators and the HMI diagnostics view.

**Recommendation:** Either add `GetDiagnostics` to these FBs and register them in ErrorHandling, or document explicitly that they are intentionally excluded (and why).

## 6) Incomplete Reset/EMstop wiring in MAIN_Fast
In MAIN_Fast, the Reset and EMstop call sites only cover a subset of objects. Objects without these methods (see §2 above) are silently skipped, but even some objects that *do* have the methods are not consistently wired.

**Recommendation:** After adding the missing methods (§2), ensure every object instance has its `Reset()` called in the MainSFC Reset state and its `EMstop()` called in the emergency-shutdown / quick-shutdown action.

## 7) Variable prefix violations
The naming-convention prefix table (see [Naming Conventions](Naming-Conventions.md)) is not consistently followed. Example violations found in FB_BMS:
- `DeviceIDcounter : WORD` → should be `w_DeviceIDcounter`
- `ReadOK : BOOL` → should be `b_ReadOK`
- `WriteOK : BOOL` → should be `b_WriteOK`
- `SBMUID : BYTE` → should be `by_SBMUID`
- `LoopCounter : INT` → should be `i_LoopCounter`

Similar violations are likely present in other Object FBs.

**Recommendation:** Perform a project-wide prefix audit and rename incrementally. Prioritise public variables (VAR_INPUT / VAR_OUTPUT) because they appear in HMI bindings and external documentation; internal VARs can be cleaned up opportunistically.

## 8) Summary priority table

| Priority | Item | Risk |
|---|---|---|
| **Critical** | Add Reset to 5 FBs, EMstop to 6 FBs, and wire all in MAIN_Fast | Safety: objects not driven to safe state |
| **Critical** | Complete or remove FB_DCSwitchgear stub | Dead code / missing diagnostics |
| **High** | Fix FB_CoolingSystem st_params to VAR_IN_OUT CONSTANT | Parameter persistence / consistency |
| **High** | Register missing objects in ErrorHandling diagnostics | Silent fault conditions |
| **Medium** | Standardise struct PascalCase naming | Maintenance / HMI tooling |
| **Medium** | Standardise EMstop method casing | Maintenance / audit reliability |
| **Low** | Variable prefix audit | Code readability |
