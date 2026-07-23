/* global WS, QH, Command, CommandGroup */

function setToast(res, action = 'Update', customMsg = false) {
    if (typeof res == 'string') {
        document.getElementById('r-error-container').innerHTML = customMsg ? `<b class="msg">${res}</b>` : 
            `<b class="err msg">${action} failed: ${res}</b>`;
    } else if (res.error) {
        const codeStr = '[Code: ' + res.error.code + ']';
        document.getElementById('r-error-container').innerHTML =
            `<b class="err msg">${action} failed: ${res.error.reason ? res.error.reason : codeStr}</b>`;
        return false;
    } else {
        document.getElementById('r-error-container').innerHTML = '<b class="msg">' + action + ' successful</b>';
        return true;
    }
}

const ResourceType = {
    CSS: 0,
    JavaScript: 1
};

class ReportingResource {
    constructor(name, data, type, runtime) {
        this.name = name;
        this.data = data;
        this.type = type;
        this.runtime = runtime;
    }
}

var TcHmiReporting = {
    Cache: {
        configName: "",
        currentRuntime: null,
        currentReports: null,
        reportsInProgress: null,
        triggeredGuids: []
    },

    Functions: {
        updateReportsInProgress: function (data) {
            let reportsChanged = false;
            let showReportsInProgress = false;

            const el = document.querySelector('.r-reports-in-progress');
            const rows = [];
            for (const [key, value] of Object.entries(data)) {
                if (!TcHmiReporting.Cache.reportsInProgress || !TcHmiReporting.Cache.reportsInProgress[key] ||
                    TcHmiReporting.Cache.reportsInProgress[key].length != value.length) {
                    reportsChanged = true;
                }

                const guidsHtml = [];
                for (const guid of value) {
                    showReportsInProgress = true;
                    guidsHtml.push(`<li id="r-report-in-progress-item-${guid}">${guid}</li>`);
                }

                rows.push(
                    `<tr id="r-report-in-progress-${key}">
                    <td colspan="3">
                        <h3>${key}</h3>
                        <ul>
                            ${guidsHtml.join('')}
                        </ul>
                    </td>
                </tr>`);
            }

            if (reportsChanged) {
                el.innerHTML = rows.join('');
            }

            if (showReportsInProgress) {
                QH.byId('r-reports-in-progress-container').classList.remove('hidden-field');
            } else {
                QH.byId('r-reports-in-progress-container').classList.add('hidden-field');
            }
        }
    },
    ServerCommunication: {
        addResources: async function (resources) {
            if (!TcHmiReporting.Cache.currentRuntime) {
                QH.byId('r-error-container').innerHTML = `
                    <b class="error">Please select a runtime</b>
                `;
                return;
            }
            
            const group = new CommandGroup();
            for (const resource of resources) {
                group.add(new Command(window.hmiCurrentDomain() + '.AddResource', resource));
            }

            const errors = [];
            const res = await group.send();

            if (res.error) {
                errors.push(res.error.reason ? res.error.reason : res.error.message);
            } else if (res['commands']) {
                for (cmd of res['commands']) {
                    if (cmd.error) {
                        errors.push(cmd.error.reason ? cmd.error.reason : cmd.error.message);
                    }
                }
            }

            if (errors.length <= 0) {
                QH.byId('r-error-container').innerHTML = `<b class="msg">Resource file${group.commands.length > 1 ? 's' : ''} added</b>`;
            } else {
                QH.byId('r-error-container').innerHTML = `<b class="error">${errors.join('<br/>')}</b>`;
            }

            dirty = false;
        },
        subscribeRuntimes: function (callback) {
            WS.subscribeSymbol(window.hmiCurrentDomain() + '.Config::runtimes', callback);
        },
        subscribeReports: function (callback) {
            WS.subscribeSymbol(window.hmiCurrentDomain() + '.Config::reports', callback);
        },
        orderReport: async function (report) {
            const res = await WS.writeSymbol(
                window.hmiCurrentDomain() + '.OrderReport',
                report
            );
            
            if (res.readValue && res.readValue.currentGuid) {
                setToast(res, `Order report ${res.readValue.currentGuid}`);
                TcHmiReporting.Cache.triggeredGuids.push(res.readValue.currentGuid);
            } else {
                setToast(res, `Order report ${report}`);
            }

            return res;
        },
        subscribeReportsInProgress: function (callback) {
            WS.subscribeSymbol(window.hmiCurrentDomain() + '.Diagnostics::reportsInProgress', callback);
        },
        subscribeReportCreationEvents: function (callback) {
            const group = new CommandGroup();
            group.add({
                "symbol": "ListEvents",
                "filter": [
                    [
                        {
                            "comparator": "==",
                            "path": "name",
                            "value": "reportCreatedMsg"
                        },
                        {
                            "logic": "OR"
                        },
                        {
                            "comparator": "==",
                            "path": "name",
                            "value": "reportGenerationFailedMsg"
                        }
                    ],
                    {
                        "logic": "AND"
                    },
                    {
                        "comparator": "==",
                        "path": "domain",
                        "value": window.hmiCurrentDomain()
                    }
                ],
                "limit": 1
            });

            group.subscribe(1000, callback);
        }
    },

    Callbacks: {
        downloadReport: function (el) {
            fetch(el.dataset.uri).then(async response => {
                if (response.status != 200) {
                    const text = await response.text();
                    setToast(text, 'Download');
                } else {
                    const blob = await response.blob();
                    var a = document.createElement('a');
                    var url = window.URL.createObjectURL(blob);
                    a.href = url;
                    a.download = `Report-${(new Date()).toISOString().replace(/[:.]/g, '_')}.pdf`;
                    document.body.append(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                }
            });
        },
        selectServer: async function (el) {
            TcHmiReporting.Cache.currentRuntime = el.value;

            const rReportSelect = QH.byId('r-report-select');
            if (!TcHmiReporting.Cache.currentReports || !TcHmiReporting.Cache.currentReports[TcHmiReporting.Cache.currentRuntime]) {
                rReportSelect.innerHTML = '';
                return;
            }

            rReportSelect.innerHTML = TcHmiReporting.Cache.currentReports[TcHmiReporting.Cache.currentRuntime]
                .map(r => `<option value=${r}>${r}</option>`).join('');

            QH.byId('r-report-download-btn').dataset.uri =
                window.Lua.PathToBaseDir + '/ExtensionData/' + window.hmiCurrentDomain() + '?ReportingServer=' + TcHmiReporting.Cache.currentRuntime;
        },
        submitResourceFile: function() {
            const rCssFile = QH.byId('r-css-file');
            let remainingFiles = rCssFile.files.length;
            const resources = [];

            for (const file of rCssFile.files) {
                const reader = new FileReader();
                reader.readAsText(file, 'UTF-8');
                reader.onload = function (evt) {
                    remainingFiles--;

                    let type;
                    let fileNameWithoutEnding;
                    if (file.name.endsWith('.css')) {
                        type = ResourceType.CSS;
                        fileNameWithoutEnding = file.name.replace(/\.css$/, "");
                    } else if (file.name.endsWith('.js')) {
                        type = ResourceType.JavaScript;
                        fileNameWithoutEnding = file.name.replace(/\.js/, "");
                    } else {
                        return;
                    }

                    resources.push(new ReportingResource(fileNameWithoutEnding, evt.target.result, type, TcHmiReporting.Cache.currentRuntime));

                    if (remainingFiles <= 0) {
                        TcHmiReporting.ServerCommunication.addResources(resources);
                    }
                }
            }
        },
        orderReport: async function () {
            const report = QH.byId('r-report-select').value;
            const res = await TcHmiReporting.ServerCommunication.orderReport(report);
            if (!res.error && res.readValue && res.readValue.inProgress) {
                TcHmiReporting.Functions.updateReportsInProgress(res.readValue.inProgress);
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const rLastReport = QH.byId('r-last-report');

    rLastReport.src = window.location.origin + window.Lua.PathToBaseDir + '/ExtensionData/' + window.hmiCurrentDomain() + '?Format=html&Latest=true';
    QH.byId('r-last-report').classList.remove('hidden-field');
    QH.byId('r-last-report-preview-msg').classList.add('hidden-field');

    TcHmiReporting.ServerCommunication.subscribeRuntimes(async res => {
        const rServerSelect = QH.byId('r-server-select');
        rServerSelect.innerHTML = "";
        for (const [runtime, config] of Object.entries(res.readValue)) {
            const option = document.createElement('option');
            option.value = runtime;
            option.innerText = runtime;
            rServerSelect.appendChild(option);

            if (!TcHmiReporting.Cache.currentRuntime) {
                TcHmiReporting.Cache.currentRuntime = runtime;
                generateReportOptions();
            }
        }

        QH.byId('r-report-download-btn').dataset.uri =
            window.Lua.PathToBaseDir + '/ExtensionData/' + window.hmiCurrentDomain() + '?ReportingServer=' + TcHmiReporting.Cache.currentRuntime;
    });

    TcHmiReporting.ServerCommunication.subscribeReports(async res => {
        TcHmiReporting.Cache.currentReports = {};
        for (const [key, report] of Object.entries(res.readValue)) {
            if (!TcHmiReporting.Cache.currentReports[report.runtime]) {
                TcHmiReporting.Cache.currentReports[report.runtime] = [];
            }
            TcHmiReporting.Cache.currentReports[report.runtime].push(key);
        }
        generateReportOptions();
    });

    TcHmiReporting.ServerCommunication.subscribeReportCreationEvents(async res => {
        if (res.readValue && res.readValue.length >= 1) {
            if (res.readValue[0].name === "reportCreatedMsg" || res.readValue[0].name === "reportGenerationFailedMsg") {
                const guid = res.readValue[0].payload.params[1];
                const guidIndex = TcHmiReporting.Cache.triggeredGuids.indexOf(guid);

                if (guidIndex < 0) return;

                if (res.readValue[0].name === "reportCreatedMsg") {
                    const rLastReport = QH.byId('r-last-report');
                    rLastReport.src = window.location.origin + window.Lua.PathToBaseDir + '/ExtensionData/' + window.hmiCurrentDomain() + '?Format=html&Latest=true';

                    rLastReport.classList.remove('hidden-field');
                    QH.byId('r-last-report-preview-msg').classList.add('hidden-field');
                }

                TcHmiReporting.Cache.triggeredGuids.splice(guidIndex, 1);
                setToast(res.readValue[0].localizedString, "", true);
            }
        }
    });

    TcHmiReporting.ServerCommunication.subscribeReportsInProgress(async res => {
        TcHmiReporting.Functions.updateReportsInProgress(res.readValue);
    });
});

function generateReportOptions() {
    const rReportSelect = QH.byId('r-report-select');
    rReportSelect.innerHTML = '';

    const rt = TcHmiReporting.Cache.currentRuntime;
    if (rt && TcHmiReporting.Cache.currentReports && TcHmiReporting.Cache.currentReports[rt]) {
        for (const key of TcHmiReporting.Cache.currentReports[rt]) {
            rReportSelect.innerHTML += `<option value="${key}">${key}</option>`;
        }
    }
}