# Software Engineering Guideline: Inter-Object Data Exchange

When objects (function blocks) need to exchange data with each other, use **individual VAR_INPUT / VAR_OUTPUT variables** — not the `get` / `set` structs.

## Why
The `get` and `set` structs (e.g. `ST_PowerStack_Get`, `ST_PowerStack_Set`) are designed for the interface between the object and the **main program** (HMI, external control, parameter storage). If Object B reads Object A's `get` struct directly, Object B becomes dependent on Object A's struct type definition. This couples the two objects and prevents reuse of Object B in other programs where Object A does not exist.

## Rule
- **Between objects**: pass only primitive or widely-shared types through dedicated `VAR_INPUT` / `VAR_OUTPUT` variables.
- **Between the main program and an object**: use the `get` / `set` structs as before.

## Example — FB_PowerStack
`FB_PowerStack` needs battery voltage and DC-ready status from the battery system, and exposes cooling control and MCCB feedback to other objects. Instead of referencing a BMS struct, it declares individual inputs and outputs:

```
FUNCTION_BLOCK FB_PowerStack
VAR_INPUT
    set                       : ST_PowerStack_Set;       // main program interface
    b_BatteryDCReady          : BOOL;                    // ← from BMS, individual variable
    r_BatteryDCVoltage        : REAL;                    // ← from BMS, individual variable
    by_CoolingPowerRequest    : BYTE;                    // ← from cooling system
    b_ExtGridCodeTrip         : BOOL;                    // ← from grid controller
    ...
END_VAR

VAR_OUTPUT
    get                       : ST_PowerStack_Get;       // main program interface
    b_InternalPsuACOk         : BOOL;                    // → to other objects
    by_CoolingControl         : BYTE;                    // → to cooling system
    ...
END_VAR
```

The main program wires these individual variables between objects:
```
fbPowerStack.r_BatteryDCVoltage := fbBMS.r_DCVoltage;
fbPowerStack.b_BatteryDCReady   := fbBMS.b_DCReady;
fbCooling.by_PowerRequest       := fbPowerStack.by_CoolingControl;
```

This keeps each object independently reusable: any program that can supply the required primitive inputs can instantiate the object without importing another object's type library.
