# Release Notes

## V1.6.0
- New version of External control
	Significant increase in possibilities added to the external control. See External control manual V2 for more details.
	Change only applied to Modbus TCP version as there is no demand for PN so far.
	V1 control version still supported.

- Change also includes:
		Removal of _PN and _MB plc variants. All versions of external control are now available in all hardware variants.
		Monitoring-only mode is now supported
	
	Note: existing _PN and _MB machines need to be updated to the new 3P_O hardware variant which covers all base machines.

- Improved networking functionality:
	 -- supports Wireless networking (Wifi AP and client mode)
	 -- supports automatic restarting of modem and router upon connectivity issues
	 -- expanded available network status information
	 -- set-up auto sim switching between 2 available sim slots
	 --> Change requires rollout of new router configuration

- Moved to Continuous Battery precharging
	In standby mode the main battery would normally charge the UPS and then shutdown to save power.
	When the UPS batteries went low, it would precharge again.
	This power loss turned out to be less than expected while the added cycles put on the UPS batteries are bad for its lifespan.
	Therefore, as long as the system is not in emergency stop or external AC is available, the system is precharged.
	This also keeps the batteries at 100%. In the event of an EMStop, the full battery capacity is available.

- Added support for LG Therma Heatpump

- Machine shutdown now allowed in emergency stop mode.
	This was previously not possible. 
	This created the situation that if an error could not be fixed, the user had no option than to let the machine would drain its battery before shutting off eventually.
	Now the user can choose to shut it down for later assessment.

- Change HMI Droop setting behaviour
	The Droop setting on the main page previously controlled both frequency and voltage droop.
	This proved to be undesirable. Instead, this setting only controls frequency droop and leaves voltage droop as is (wide by default).
	If specific voltage droop is also required, this can be set in the advanced settings.

- Genset scheduler added
	This allows the user to setup 2 timeslots with different generator settings.
	Mostly used to prevent generator operation during nightly hours.
	
- Added flexible IO functionality to Harting IO
	Apart from generator start/stop, the digital output(s) can now be used for variable purposes such as:
		- Fire alarm output to link to building fire alarm system
		- System running status
		- PV enable (to stop PV power delivery if the power has nowhere to go (battery full and backfeed not allowed))
	The digital input can now also be tied to functionality such as:
		- Generator Low fuel warning
		- Stop operation (shuts down the ePU10 gracefully upon receiving an active signal)
		- Emergency stop (inverted, Allows system operation as long as input signal is active, otherwise triggers an emergency stop).

- Improved sychronization and behaviour on weak grid connections.
	Thin and long cables cause large voltage fluctuations that can create system instability.
	System synchronization and settings are now improved to handle these situations.
	
- Implemented AGC150 generator controller communication
	Instead of digital start/stop signal, the ePU10 can control a (previously set-up) AGC150 equipped generator via Modbus TCP
	This also allows for advanced generator functionality such as mode switching.

- Added Datalogging functionality to battery system for warranty purposes.

Small changes:
- Changed system behaviour on powerlock overload
		- System sometimes shut down before the MCCB could be triggered, which is not desired.
		  Instead:
		  Input overload only triggers input MCCB trip
			 Output overload first trigger output MCCB trip, in the case this fails system shuts down after a timeout.
	
- Fixed Coolingsystem emstop bug.
		Cooling system could get stuck in emstop mode. 
		Even though the rest of the system would be reset and appear healthy, the cooling system would prevent operation in the background.
	
- Disable Gridtakeover mode if system is not operation in grid connected mode. 
		The on/off selection would disappear from the HMI, but the current setting would still affect the system.
	
- Fixed conditioning mode bug in which the inverter could keep running for internal conditioning even when the system was put into transport mode.
	
- Diagnostic is now shown if startup fails due to DC pump startup issues.
		Previously the user would only get a general "CoolingSFC" error
	
- Diagnostic now specifies if system operation is inhibited due to all MCCB's being open.
		Although the MCCB state itself was already shown, it didn't explain to the user that this halted system operation

- Manual generator start/stop status cleared when enabling auto start/stop.
		Previously, a manualstart state would be kept in the background. If auto start/stop would then be disabled, the generator suddenly starts.
	
- Disabled LOM detection in Grid operation
		This detection was wrongly enabled creating an increased sensitivity to grid behaviour. 
		This sometimes caused false gridcode trip events
	
- Improved NUC shutdown behaviour. 
		An error in the shutdown sequence could cause the NUC to lose power before shutting down, risking disk corruption.
		The shutdown sequence has now been fixed.
		
- 	Input connection CT ratio correction
		The power measurement of the input connection was falsely set to 1200:5A when 1000:5a CT's were used, causing a measurement error.
		This has been rectified.
	
- Fixed datalogging bugs to Powernet
		Energy in/out counters weren't updated properly
		Diagnostic message length wasn't properly guarded
		Some wearlogging parameters weren't properly written causing data errors.
		Negative measurements were not logged but reset to 0, this was caused by a bug in the threshold functionality.
	
- 400V detection no longer looks at 24V psu status
		This created the issue that an inoperative PSU made the system think no AC was available at all.
		This also killed the heatpump and waterpump.
		
- 	Updated enclosure fancoil logic
		Fan sometimes keep running without requirement
		
- Updated UPS settings
		Battery fullcharge detection wasn't operating properly preventing the charger from switching to float stage.
		This caused battery overcharging and hydrogen generation
 
	


## V1.5.2
 - Added Wearlogging functionality
 - System now displays "EMSTOP" state instead of "init" while waiting on reset input
 - Improved memory usage for string variables
 - Improved powerstack standby and stopped state transitions
 - Lom detection added to conditioning mode
 - Fixed missing "external control active" and "active earthing system" values to external control registers
 - BMS temperature readings of -127 degrees during communication fault no longer initiates system heating
 - MQTT update rates changed

 - Breaking change:
   - MQTT data remapped, gateway OpenRemote needs to be V1.0.9 or later

   
## V1.5.1
 - Manual BMS precharge option added to ST_Params
 - Fixed BMS cumulative energy counter had divide-by-zero bug

## V1.5.0
 - Major update, requires additional update steps. See Update instructions in repo
 - First release of Generator control and interoperation
 - Cooling system overhauled
   - Heatpump errors are now resettable
   - added Heatpump undertemperature protection
   - Cooling control simplified, removed edge cases
   - Wider operational temperature range
   - Wider operational pressure range
   - Inverter cooling now based on inverter temperature instead of coolant temperature
   - Added support for AC pump feedback
  - Improved Inverter precharge limits
  - Improved NAN detection
  - Fixed Left rotating field operation bug
  - UPS battery failure will now cause system HVDC to remain precharged to keep the system online. EMStop will still stop HVDC operation and thus shutdown the machine.
  - Fixed BMS data mapping, data was written to incorrect SBMU ID.
  - Changed the handling of control inputs to allow simultaneous control from different inputs (HMI, external control, IOT)


## V1.4.4
- Fixed false UPS Low battery error
- Cleaned up UPS SOC calculation
- Improved UPS shutdown low battery handling

## V1.4.3
 - Included gracefull NUC shutdown
 - UPS undervoltage threshold increased to 23.5V
 - Cooling pressure warning and alarm threshold lowered to 1 and 0.7Bar
 - Fixed IsNAN function for PNController to check the correct part of the input value. This fixes faulty NaN hits
 - Changed PNController RealTo(U)(D)Int functions to use Var_in_out for the return. This prevents unwanted "0" returns if input data is incorrect.

## V1.4.2
 - Update ORpublish method to catch #NaN and replace by 0
 - disable cyclecount sending: not implemented yet
 - incorrect urgent message content fixed
 - Fixed DCPumpPressurefault issue
 - Fixed HMI autologout
 - Removed incorrect DehumActive Message

## V1.4
 - Fixed Mutesounder button functionality
 - External control Watchdog fault now resets to -3kW instead of 0 to prevent main battery draining
 - External control Watchdog fault reset didn't work, call to reset was never executed. Fixed now.
 - FB_Router, added specific diagnostic for missing SMS number, no send action is taken if no valid number is available
 - FB_BMS: HV_ON status now true when 1 or more strings are connected (instead of all). failed-to-connect strings throw separate diagnostic errors.
 - FB_BMS: Fixed SBMU numbering bug, caused battery data to be written to wrong SBMU ID.
 - FB_Heatpump: Preheating of heatpump now shown in diagnostics window with timer.
 - FB_heatpump: Preheating of heatpump no longer required if the system was operational (powered and preheated, not necessarily running) in the last hour
 - FB_Ledindicator: Brightness set to 0 in transport mode. No external lighting allowed on the road
 - FB_InternalPowerSupply: HV now allowed in transport mode to charge UPS. Charge request
 - FB_InternalPowerSupply: System will now start a shutdown timer of 10 minutes when UPS SOC reaches 40%. Also visible in HMI diagnostics
 - FB_UPS: Replaced voltage based SOC calculation with a current based capacity counter based on Victron documentation. parameters could use additional optimization.

## V1.3
- Changed IsNAN function
- Added auto-shutdown on ups low battery error
- Transport mode may now use grid power as well.

## V1.2
first version extracted from Sourcetree.
