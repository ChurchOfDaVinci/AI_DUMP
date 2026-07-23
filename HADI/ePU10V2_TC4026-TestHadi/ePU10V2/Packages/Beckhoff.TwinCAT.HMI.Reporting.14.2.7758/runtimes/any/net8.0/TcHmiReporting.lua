-- TcHmiReporting.lua

local helper = require("lua.helper")
local hmi = require("TcHmiSrv")
local Globals = require("lua.globals")

local TcHmiReporting = {}
TcHmiReporting.__index = TcHmiReporting

local function get_symbol_access_cmds(symbols)
    local cmds = {}
    for _, symbol in pairs(symbols) do
        table.insert(cmds, {
            symbol = "GetSymbolAccess",
            writeValue = symbol
        })
    end
    return cmds
end

function TcHmiReporting.replace_default_content()
    return false
end

function TcHmiReporting.print_script_content(name, query)
    return ""
end

function TcHmiReporting.print_custom_content(name, query)
    local config_access, add_resource_access, order_report_access, diagnostics_access = hmi.eval(get_symbol_access_cmds({
        name .. ".Config",
        name .. ".AddResource",
        name .. ".OrderReport",
        name .. ".Diagnostics"
    }))
    local html = helper.lp_to_html('TcHmiReporting.lp', {
        domain = name,
        config_access = Globals.Functions.has_access(config_access, hmi.Access_Read),
        add_resource_access = Globals.Functions.has_access(add_resource_access, hmi.Access_ReadWrite),
        order_report_access = Globals.Functions.has_access(order_report_access, hmi.Access_ReadWrite),
        diagnostics_access = Globals.Functions.has_access(diagnostics_access, hmi.Access_Read)
    })
    return html
end

return TcHmiReporting
