<tr>
    <td colspan="3" class="audit-trail-validation-result" style="display:'none'"></td>
</tr>

<% if verify_signature_access_given then %>
<tr>
    <td colspan="3">
        <table class="at-sig-verification">
            <tr>
                <td colspan="3"><h3><%=localize.localize("verifySignature", domain)%></h3></td>
            </tr>
            <tr>
                <td colspan="3" id="at-sig-verification-result" class="hidden-field"></td>
            </tr>
            <tr>
                <td class="at-verify-sig-label">
                    <%=localize.localize("zipFile", domain)%>:
                </td>
                <td class="at-verify-sig-zip-col">
                    <input type="file" id="at-verify-sig-zip"/>
                </td>
                <td class="at-verify-sig-btn">
                    <input type="button" value="<%=localize.localize("verifySigBtn", domain)%>" id="at-verify-sig" onclick="verifySignature()"/>
                </td>
            </tr>
        </table>
    </td>
</tr>
<% end %>

<% if audit_trail_access_given then %>
<tr>
    <td colspan="3">
        <table id="auditTrailTableGenerated">
            <thead id="auditTrailTableGeneratedHeader">
                <tr class="audit-trail-item">
                    <th class="at-timestamp audit-trail-item-column">
                        <%=localize.localize("timestamp", domain)%>
                    </th>
                    <th class="at-type audit-trail-item-column">
                        <%=localize.localize("type", domain)%>
                    </th>
                    <th class="at-symbol-name audit-trail-item-column">
                        <%=localize.localize("name", domain)%>
                    </th>
                    <th class="at-oldvalue audit-trail-item-column">
                        <%=localize.localize("oldValue", domain)%>
                    </th>
                    <th class="at-newvalue audit-trail-item-column">
                        <%=localize.localize("newValue", domain)%>
                    </th>
                    <th class="at-username audit-trail-item-column">
                        <%=localize.localize("userName", domain)%>
                    </th>
                    <th class="at-sessionid audit-trail-item-column">
                        <%=localize.localize("sessionId", domain)%>
                    </th>
                    <th class="at-comment audit-trail-item-column">
                        <%=localize.localize("comment", domain)%>
                    </th>
                    <th class="at-error audit-trail-item-column">
                        <%=localize.localize("error", domain)%>
                    </th>
                    <th style="width: 14px"></th>
                </tr>
            </thead>
            <tbody id="auditTrailTableGeneratedBody">
                <tr class="iml-item audit-trail-item hidden-field" value="" id="audit-trail-dummy-row">
                    <td class="at-timestamp audit-trail-item-column"></td>
                    <td class="at-type audit-trail-item-column"></td>
                    <td class="at-symbol-name audit-trail-item-column"></td>
                    <td class="at-oldvalue audit-trail-item-column"></td>
                    <td class="at-newvalue audit-trail-item-column"></td>
                    <td class="at-username audit-trail-item-column"></td>
                    <td class="at-sessionid audit-trail-item-column"></td>
                    <td class="at-comment audit-trail-item-column"></td>
                    <td class="at-error audit-trail-item-column"></td>
                </tr>
            </tbody>
        </table>
    </td>
</tr>
<tr>
    <td colspan="2">
        <div class="at-table-legend">
            <span class="audit-trail-item-error"></span>
            <%= localize.localize("configPageFailedCommands", domain) %>
        </div>
    </td>
    <td colspan="1">
        <div style="display: flex; float: right;">
            <input style="width: 30px;" class="audit-trail-btn prev-page-btn" type="button" value="<" onclick="prevPage()"/>
            <span id="pages-list"></span>
            <input style="width: 30px;" class="audit-trail-btn next-page-btn" type="button" value=">" onclick="nextPage()"/>
        </div>
    </td>
</tr>

<tr>
    <td colspan="3">
        <table class="filter-function-div">
            <tr>
                <td>
                    <p><%=localize.localize("filter", domain)%>:</p>
                </td>
                <td>
                    <input id="auditTrailFilter" type="text"/>
                    <select id="auditTrailTypeSelect" class="hidden-field">
                        <option value="" selected>-</option>
                        <option value="Symbol">Symbol</option>
                        <option value="Function">Function</option>
                        <option value="Event">Event</option>
                        <option value="AuditLogEntry">AuditLogEntry</option>
                    </select>
                </td>
                <td>
                    <select id="auditTrialsFilterSelect">
                        <option value="name" selected>
                            <%=localize.localize("name", domain)%>
                        </option>
                        <option value="type">
                            <%=localize.localize("type", domain)%>
                        </option>
                        <option value="userName">
                            <%=localize.localize("userName", domain)%>
                        </option>
                        <option value="sessionId">
                            <%=localize.localize("sessionId", domain)%>
                        </option>
                        <option value="comment">
                            <%=localize.localize("comment", domain)%>
                        </option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>
                    <p><%=localize.localize("startTimestamp", domain)%>:</p>
                </td>
                <td>
                    <input id="audit-trail-filter-timestamp-start" type="datetime-local"/>
                </td>
            </tr>
            <tr>
                <td>
                    <p><%=localize.localize("endTimestamp", domain)%>:</p>
                </td>
                <td>
                    <input id="audit-trail-filter-timestamp-end" type="datetime-local"/>
                </td>
            </tr>
            <tr>
                <td colspan="3">
                    <input type="button" id="audit-trail-filter-apply-btn" value="<%=localize.localize("applyFilter", domain)%>"/>
                </td>
            </tr>
        </table>
    </td>
</tr>
<% end %>

<% if audit_trail_access_given or reset_database_access_given then%>
<tr>
    <td colspan="3" class="audit-trail-btn-section">
    <% if error_log_exists then %>
        <div>
            <a class="audit-trail-btn" type="button" id="audit-trail-export-log-btn" href="<%=export_log_url%>" download>
                <%=localize.localize("exportErrorLogBtn", domain)%>
            </a>
        </div>
    <% end %>
        <div>
            <input class="audit-trail-btn" type="button" value="<%=localize.localize("exportBtn", domain)%>" id="audit-trail-export-btn" onclick="toggleAuditTrailExport()"/>
        </div>
<% if reset_database_access_given then %>
        <div>
            <input class="audit-trail-btn" type="button" value="<%=localize.localize("resetBtn", domain)%>" id="auditTrailResetDatabase"/>
        </div>
<% end %>
    </td>
</tr>
<% end %>
