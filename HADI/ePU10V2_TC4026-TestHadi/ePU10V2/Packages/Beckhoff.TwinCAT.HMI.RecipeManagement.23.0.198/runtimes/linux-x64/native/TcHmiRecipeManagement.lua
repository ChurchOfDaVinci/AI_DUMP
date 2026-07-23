-- luacheck: globals TcHmiRecipeManagement
-- TcHmiRecipeManagement.lua


local hmi = require("TcHmiSrv")

TcHmiRecipeManagement = {}
TcHmiRecipeManagement.__index = TcHmiRecipeManagement

function TcHmiRecipeManagement.replace_default_content()
    return false
end

function TcHmiRecipeManagement.show_diagnostics(content_name)
    return true
end

return TcHmiRecipeManagement
