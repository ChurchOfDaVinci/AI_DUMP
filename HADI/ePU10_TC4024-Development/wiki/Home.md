# ePU10 Software Engineering Manual

Welcome to the ePU10 TwinCAT 4024 software engineering wiki. This manual documents the architecture, guidelines, and operational knowledge for the ePU10 codebase.

## Table of Contents

### Guidelines
- [Naming Conventions](Naming-Conventions.md) — Variable prefix rules for type safety and readability.
- [UI Data Shared Between Cycles](UI-Data-Shared-Between-Cycles.md) — When cross-cycle mixed state is acceptable and when atomic updates are required.
- [Inter-Object Data Exchange](Inter-Object-Data-Exchange.md) — How object FBs share data without coupling through get/set structs.

### Architecture Topics
- [FB_PowerControl and FB_GenGridController](FB-PowerControl-and-FB-GenGridController.md) — Control-architecture split between supervisory mode selection and closed-loop P/Q execution.
- [GenGridController SFC — Mode-Driven Sequencing](GenGridController-SFC-Mode-Driven-Sequencing.md) — The GenGridSFC action: breaker modes, SFC states, startup sub-sequencer, contactor sync, mode switching, inverter mode selection, and start/stop conditions.
- [MainSFC, ErrorSFC and Object Interaction](MainSFC-ErrorSFC-and-Object-Interaction.md) — Top-level sequencing, error/shutdown supervisor, the SFCReset mechanism, and how objects are called from the state machine.
- [Diagnostics Interaction](Diagnostics-Interaction.md) — Centralised diagnostics architecture: ErrorHandling, FB_AddErrorST, eObject_ID offsets, severity levels, and the GetDiagnostics contract.

### Recommendations
- [Identified Inconsistencies and Risks](Recommendations.md) — Codebase audit findings with prioritised action items.

### Release History
- [Release Notes](Release-Notes.md) — Version history and changelog.
