<tr>
    <td colspan="3">
        <h1><%= localize.localize("reports", domain) %></h1>
        <br />
        <span id="r-error-container">
            <!-- Current error messages -->
        </span>
    </td>
</tr>

<% if config_access then %>
<tr>
    <td colspan="3">
        <table class="r-report-config">
            <tr>
                <td><%= localize.localize("selectRuntimeTitle", domain) %></td>
                <td>
                    <select id="r-server-select" onchange="TcHmiReporting.Callbacks.selectServer(this);"></select>
                </td>
            </tr>
        </table>
    </td>
</tr>
<% end %>    

<% if add_resource_access then %>
<tr>
    <td colspan="3">
        <h2><%= localize.localize("uploadResourcesTitle", domain) %></h2>
        <table class="r-report-config">
            <tr>
                <td>
                    <input type="file" id="r-css-file" multiple/>
                </td>
                <td>
                    <button id="r-upload-css-btn" onclick="TcHmiReporting.Callbacks.submitResourceFile()">
                        <%= localize.localize("uploadTitle", domain) %>
                    </button>
                </td>
            </tr>
        </table>
    </td>
</tr>
<% end %>

<% if config_access and order_report_access then %>
<tr>
    <td colspan="3">
        <h2><%= localize.localize("reportGenerationTitle", domain) %></h2>
        <table class="r-report-generation">
            <tr>
                <td>
                    <select id="r-report-select">
                        <!-- Inserted via JS -->
                    </select>
                </td>
                <td>
                    <button id="r-report-create-btn" onclick="TcHmiReporting.Callbacks.orderReport()">
                        <%= localize.localize("createTitle", domain) %>
                    </button>
                </td>
            </tr>
            <tr>
                <td colspan="3">
                    <button id="r-report-download-btn" onclick="TcHmiReporting.Callbacks.downloadReport(this);">
                        <%= localize.localize("downloadReportTitle", domain) %>
                    </button>
                    <b class="msg error hidden-field" id="r-report-download-err"></b>
                </td>
            </tr>
        </table>
    </td>
</tr>

<% if diagnostics_access then %>
<tr id="r-reports-in-progress-container" class="hidden-field">
    <td colspan="3">
        <h2><%= localize.localize("reportsInProgressTitle", domain) %></h2>
        <table class="r-reports-in-progress">
        </table>
    </td>
</tr>
<% end %>
<% end %>

<tr>
    <td colspan="3">
        <h2><%= localize.localize("lastReportTitle", domain) %></h2>
        <p class="msg" id="r-last-report-preview-msg">
            <%= localize.localize("reportPreviewTitle", domain) %>
        </p>
        <iframe id="r-last-report" class="hidden-field">
        </iframe>
    </td>
</tr>
