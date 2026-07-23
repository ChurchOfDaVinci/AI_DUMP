-- TcHmiAuditTrail.lua

local hmi = require("TcHmiSrv")

local localize = require("lua.localize")
local helper = require("lua.helper")
local Globals = require("lua.globals")

-- luacheck: globals TcHmiAuditTrail
TcHmiAuditTrail = {}
TcHmiAuditTrail.__index = TcHmiAuditTrail

local max_entries = 200

function TcHmiAuditTrail.replace_default_content()
    return false
end

function TcHmiAuditTrail.print_css_content(name, query) -- luacheck: ignore
    local dark_theme_style = [[
        .audit-trail-item-error {
            background-color: #6c4b4b !important;
        }
    ]]
    if not _G.HmiLua.dark_theme then
        dark_theme_style = [[
            @media (prefers-color-scheme: dark) {
                ]] .. dark_theme_style .. [[
            }
        ]]
    end
    return [[<style>]] .. dark_theme_style .. [[</style>]]
end

function TcHmiAuditTrail.print_script_content(name, query)
    local html = ""
    local max_entries_val = hmi.eval({ name .. ".Config::configPageMaxEntries" })

    if max_entries_val ~= nil and max_entries_val:value() ~= nil then
        max_entries = max_entries_val:value()
    end

    html = html .. [[
        window.clearConfirmMsg = "]] .. localize.localize("auditTrailClearConfirmMsg", name) .. [[";
        window.requestingAuditTrailMsg = " ]] .. localize.localize("requestingAuditTrailMsg", name) .. [[";
        window.auditTrailExportUrl = "]] .. _G.HmiLua:url("/ExtensionData/" .. name, true) .. [[";
        window.configPageMaxEntries = ]] .. tostring(max_entries) .. [[;
        window.showValueMsg = "]] .. localize.localize("showValueMsg", name) .. [[";
        window.hideValueMsg = "]] .. localize.localize("hideValueMsg", name) .. [[";
        window.requestAuditTrailErrorMsg = "]] .. localize.localize("requestAuditTrailErrorMsg", name) .. [[";
        window.resetDatabaseErrorMsg = "]] .. localize.localize("resetDatabaseErrorMsg", name) .. [[";
        window.signatureValidMsg = "]] .. localize.localize("signatureValidMsg", name) .. [[";
        window.signatureInvalidMsg = "]] .. localize.localize("signatureInvalidMsg", name) .. [[";
        window.zipFileTooBigMsg = "]] .. localize.localize("zipFileTooBigMsg", name ) .. [[";]]
    return html
end

function TcHmiAuditTrail.print_custom_content(name, query) -- luacheck: ignore
    local audit_trail_access, verify_signature_access, reset_database_access, error_log_exists = hmi.eval({
        {
            symbol = "GetSymbolAccess",
            writeValue = name .. ".GetAuditTrail"
        },
        {
            symbol = "GetSymbolAccess",
            writeValue = name .. ".VerifySignature"
        },
        {
            symbol = "GetSymbolAccess",
            writeValue = name .. ".ResetDatabase"
        },
        {
            symbol = name .. ".ErrorLogExists"
        }
    })

    local html = helper.lp_to_html(name .. "/TcHmiAuditTrail.lp", {
        domain = name,
        localize = localize,
        audit_trail_access_given = Globals.Functions.has_access(audit_trail_access, hmi.Access_Read),
        reset_database_access_given = Globals.Functions.has_access(reset_database_access, hmi.Access_ReadWrite),
        verify_signature_access_given = Globals.Functions.has_access(verify_signature_access, hmi.Access_ReadWrite),
        export_log_url = _G.HmiLua:url('/ExtensionData/' .. name .. '?action=errorlog', true),
        error_log_exists = error_log_exists ~= nil and error_log_exists:value()
    })
    return html
end

function TcHmiAuditTrail.print_forms(name)
    local id = {}

    id['path'] = 'audit-trail-export'
    id['html'] = hmi.html_escape('audit-trail-export')
    id['js'] = Globals.Functions.escape_js(id['html'])

    local export = helper.lp_to_html("lp_snippets/export_filter.lp", {
        id = id,
        on_submit = "exportAuditTrail()",
        available_formats = { "json", "csv" },
        domain = name,
        localize = localize,
        description_wrapper = Globals.Functions.description_wrapper,
        is_event_filter = true,
        default_limit = max_entries,
        filter_description = localize.localize("descExportFilter", name)
    })

    local html = helper.lp_to_html("lp_snippets/overlay_form.lp", {
        id = id,
        title = 'Audit Trail Export',
        content = export
    })

    return html
end

return TcHmiAuditTrail
