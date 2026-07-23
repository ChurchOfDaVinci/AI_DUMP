/* global QH, WS, CommandGroup, toggleForm */

// Global variables

var data = [];
var sortOrder = [];
var currentSortColumn = "timestamp";

const htmlDots = `<span class="dots">${window.showValueMsg}</span>`;

var dummyRow = null;
var currentOffset = 0;
var lastPage = 1;

const getAuditTrailId = 101;

var searchFilter = null;
var startTimestamp = null;
var endTimestamp = null;

var resetDatabaseCalled = false;

// END: Global variables

// Functions to modify HTML content.

function insertAuditTrail(el, entries) {
    el.innerHTML = '';
    entries.forEach((element) => {
        var dateString = new Date(element["timestamp"]).toLocaleString();
        var additionalClass = '';

        var newRow = dummyRow.cloneNode(true);
        newRow.classList.remove('hidden-field');
        newRow.setAttribute('value', element.id);
        newRow.className += additionalClass;

        newRow.querySelector('.at-timestamp').innerText = dateString;
        newRow.querySelector('.at-symbol-name').innerHTML = 
            `${element.name}${(element.localizedText && element.localizedText !== element.name) ? "<br><i>" + element.localizedText + "</i>" : ""}`;

        newRow.querySelector('.at-type').innerText = element.type;
        if (element.commandOptions) {
            newRow.querySelector('.at-type').innerText += " (" + element.commandOptions.join(', ') + ")";
        }

        if (element['oldValue'] != undefined) {
            newRow.querySelector('.at-oldvalue').innerHTML = getHTMLOfObject(element["oldValue"], "oldValue" + element["id"])
        }

        if (element['newValue'] != undefined) {
            newRow.querySelector('.at-newvalue').innerHTML = getHTMLOfObject(element["newValue"], "newValue" + element["id"]);
        } else if (element['payload']) {
            newRow.querySelector('.at-newvalue').innerHTML = getHTMLOfObject(element["payload"], "newValue" + element["id"]);
        }

        if (element['userName']) {
            const usernameCol = newRow.querySelector('.at-username');
            usernameCol.innerText = element['userName'];
        }

        if (element['sessionId']) {
            const sessionIdCol = newRow.querySelector('.at-sessionid');
            sessionIdCol.innerText = element['sessionId'];
        }

        if (element['comment']) {
            const commentCol = newRow.querySelector('.at-comment');
            commentCol.innerText = element['comment'];
        }

        if (element['error']) {
            const errorCol = newRow.querySelector('.at-error');
            errorCol.innerHTML = getHTMLOfObject(element['error']);
            newRow.classList.add('audit-trail-item-error');
        }

        el.append(newRow);
    });

    defineJSONExpandOnClick();
}

// END: Functions to modify HTML content.

// Functions to run requests.

async function resetDatabase() {
    const data = await WS.writeSymbol(window.Lua.Name + '.ResetDatabase');
    lastPage = 1;
    if (!data.error) {
        getAuditTrail();
        document.getElementsByClassName('audit-trail-validation-result')[0].classList.remove('hidden-field');
        document.getElementsByClassName('audit-trail-validation-result')[0].innerHTML = '<b class="msg">Reset successful</b>';
    } else {
        document.getElementsByClassName('audit-trail-validation-result')[0].classList.remove('hidden-field');
        document.getElementsByClassName('audit-trail-validation-result')[0].innerHTML = `<b class="err">${window.resetDatabaseErrorMsg}${data.error.reason ? ": " + data.error.reason : ""}</b>`;
    }
}

// END: Functions to run requests.

// Helper Functions

function getValueStringByValueObj(val) {
    var retStr = "";
    var isfirst = true;

    if (typeof val === 'object') {
        for (let num of Object.keys(val)) {
            const element = val[num];
            if (isfirst == false) {
                retStr = retStr + "<br />";
            }
            isfirst = false;
            retStr = retStr + element["valname"] + ":" + element["valval"];
        }
    } else {
        retStr = "" + val;
    }
    return retStr;
}

function sortDataByColumn(column) {
    if (data === undefined) return;
    if (column === "oldValue" || column === "newValue") {
        data = data.sort(function (a, b) {
            var x = getValueStringByValueObj(a[column]).toLowerCase(),
                y = getValueStringByValueObj(b[column]).toLowerCase();
            if (sortOrder[column] == true) {
                return x < y ? -1 : x > y ? 1 : 0;
            } else {
                return x < y ? 1 : x > y ? -1 : 0;
            }
        });
        sortOrder[column] = !sortOrder[column];
    }
    else {
        data = data.sort(function (a, b) {
            var x = a[column].toLowerCase(),
                y = b[column].toLowerCase();
            if (sortOrder[column] == true) {
                return x < y ? -1 : x > y ? 1 : 0;
            } else {
                return x < y ? 1 : x > y ? -1 : 0;
            }
        });
        sortOrder[column] = !sortOrder[column];
    }
}

function getHTMLOfObject(element, jsonElementTitle, divTitle = "", endSign = "") {
    var getPropertiesHTML = function () {
        var html = "";
        var i = 0;

        if (!element) return null;

        for (var key of Object.keys(element)) {
            const value = element[key];
            const complex = (value && typeof value == 'object');
            const lastOne = (i >= Object.keys(element).length - 1);

            html +=
                `<div>
                    <span class="${complex ? 'json-expand-attributes' : ''}" value="${jsonElementTitle}${divTitle}${key}">
                        ${key}: ${complex ? htmlDots : ''}
                    </span>
                    ${getHTMLOfObject(value, jsonElementTitle, divTitle + key + 'Div', (lastOne ? '' : ','))}
                </div>`;

            i++;
        }

        return html;
    };

    var getComplexContainerHTML = function (opener, closer) {
        var html = "";

        html += `<div class="json-element-div${(divTitle != '') ? ' hidden-field' : ''}" id="${jsonElementTitle}${divTitle}">
                    <p>
                        ${opener}
                    </p>
                    <div style=\"padding-left: 10px; border-left: 1px solid rgba(125,125,125,0.5);\">
                        ${getPropertiesHTML()}
                    </div>
                    <p>
                        ${closer}${endSign}
                    </p>
                </div>`;

        return html;
    };

    if (element == null || element == undefined || typeof element != 'object') {
        return "<span>" + element + endSign + "</span>";
    } else if (Array.isArray(element)) {
        return getComplexContainerHTML('[', ']');
    } else {
        return getComplexContainerHTML('{', '}');
    }
}

function getAuditTrail() {
    QH.byId('auditTrailTableGeneratedBody').innerText = window.requestingAuditTrailMsg;

    let filter = [];
    if (searchFilter) {
        filter.push(searchFilter);
    }
    if (startTimestamp) {
        filter.push(`timestamp >= "${startTimestamp}"`);
    }
    if (endTimestamp) {
        filter.push(`timestamp <= "${endTimestamp}"`);
    }

    WS.unsubscribe(getAuditTrailId)
        .then(() => {
            (new CommandGroup()).add({
                "symbol": window.Lua.Name + ".GetAuditTrail",
                "limit": window.configPageMaxEntries,
                "offset": currentOffset,
                "orderBy": "timestamp DESC",
                "filter": (filter.length ? filter.join(' && ') : null),
                "commandOptions": [
                    "SendWriteValue",
                    "SendErrorMessage"
                ]
            }).subscribe(5000, evaluateGetAuditsResponse, getAuditTrailId);
        })
}

// END: Helper Functions

// Event functions

function defineJSONExpandOnClick() {
    QH.addListeners('click', document.getElementsByClassName('json-expand-attributes'), function (data) {
        var $this = data.currentTarget;
        var divId = $this.getAttribute('value') + "Div";
        if (QH.byId(divId).classList.contains('hidden-field')) {
            QH.byId(divId).classList.remove('hidden-field');
            $this.querySelector('.dots').innerText = window.hideValueMsg;
        } else {
            QH.byId(divId).classList.add('hidden-field');
            $this.querySelector('.dots').innerText = window.showValueMsg;
        }
    });
}

function defineOnClickFunctions() {
    QH.addListeners('click', document.querySelectorAll('#auditTrailTableGenerated tbody tr'), function () {
        const allRows = document.querySelectorAll('#auditTrailTableGenerated tbody tr');
        for (const row of allRows) {
            row.classList.remove('selected-invalid-audit-trail');
            row.classList.remove('selected-valid-audit-trail');
        }
    });
}

var initAuditTrailListeners = function () {
    QH.addListener('change', 'auditTrialsFilterSelect', function (data) {
        const isType = (data.currentTarget.value == 'type');
        if (isType) {
            QH.byId('auditTrailTypeSelect').classList.remove('hidden-field');
            QH.byId('auditTrailFilter').classList.add('hidden-field');
        } else {
            QH.byId('auditTrailTypeSelect').classList.add('hidden-field');
            QH.byId('auditTrailFilter').classList.remove('hidden-field');
        }
    });

    QH.addListener('click', 'audit-trail-filter-apply-btn', function () {
        const filterCat = QH.byId('auditTrialsFilterSelect').value;
        const startTimestampVal = QH.byId('audit-trail-filter-timestamp-start').value;
        const endTimestampVal = QH.byId('audit-trail-filter-timestamp-end').value;
        const filterValue = (filterCat == 'type' ? 
            QH.byId('auditTrailTypeSelect').value : QH.byId('auditTrailFilter').value);
        const comparator = (filterCat == 'type' ? '==' : 'contains');

        if (filterValue) {
            searchFilter = `${filterCat} ${comparator} "${filterValue}"`;
        } else {
            searchFilter = null;
        }

        if (startTimestampVal) {
            const date = new Date(startTimestampVal);
            startTimestamp = date.toISOString();
        } else {
            startTimestamp = null;
        }

        if (endTimestampVal) {
            const date = new Date(endTimestampVal);
            endTimestamp = date.toISOString();
        } else {
            endTimestamp = null;
        }

        lastPage = 1;
        currentOffset = 0;
        getAuditTrail();
    });

    QH.addListener('click', 'auditTrailResetDatabase', async function (data) {
        const btn = data.currentTarget;
        btn.setAttribute('disabled', true);
        if (!resetDatabaseCalled && confirm(window.clearConfirmMsg)) {
            await resetDatabase();
        }
        btn.removeAttribute('disabled');
    });
};

// END: Event functions

// Document ready

document.addEventListener('DOMContentLoaded', function () {
    dummyRow = QH.byId('audit-trail-dummy-row');

    if (QH.byId('auditTrailTableGenerated'))
        getAuditTrail();

    initAuditTrailListeners();
});

function generateAuditTrail() {
    data = window.auditListRawData;

    if (data) {
        if (sortOrder.length == 0) {
            sortDataByColumn(currentSortColumn);

            sortOrder["timestamp"] = false;
            sortOrder["name"] = false;
            sortOrder["oldValue"] = false;
            sortOrder["newValue"] = false;
            sortOrder["clientIp"] = false;
            sortOrder["userName"] = false;
        }

        insertAuditTrail(QH.byId('auditTrailTableGeneratedBody'), data);

        defineOnClickFunctions();
    }
}

QH.addListeners('click', document.getElementsByClassName('audit-trail-sort'), function (data) {
    var column = data.currentTarget.value;
    sortDataByColumn(column);
    insertAuditTrail(QH.byId('auditTrailTableGeneratedBody'), window.auditListRawData);
    defineOnClickFunctions();
});

function evaluateGetAuditsResponse(data) {
    const resElement = document.querySelector('.audit-trail-validation-result');
    if (data.error) {
        resElement.classList.remove('hidden-field');
        resElement.innerHTML = `<b class="err">${window.requestAuditTrailErrorMsg}${data.error.reason ? ": " + data.error.reason : ""}</b>`;
    } else {
        resElement.classList.add('hidden-field');
    }

    if (!data.symbol.endsWith('.GetAuditTrail') || !data.readValue) {
        return;
    }

    window.auditListRawData = data.readValue;

    if (data.readValue.length) {
        let firstTimestampSplitted = data.readValue[data.readValue.length - 1].timestamp.split(':');
        firstTimestampSplitted.pop();
        let lastTimestampSplitted = data.readValue[0].timestamp.split(':');
        lastTimestampSplitted.pop();
        QH.byId('audit-trail-export-start-timestamp').value = firstTimestampSplitted.join(':');
        QH.byId('audit-trail-export-end-timestamp').value = lastTimestampSplitted.join(':');
    }

    QH.byId('auditTrailTableGeneratedBody').innerHTML = "";
    generateAuditTrail();

    if (data.readValue.length < window.configPageMaxEntries) {
        document.querySelector('.next-page-btn').setAttribute('readonly', true);
        document.querySelector('.next-page-btn').setAttribute('disabled', true);
    } else {
        document.querySelector('.next-page-btn').removeAttribute('readonly');
        document.querySelector('.next-page-btn').removeAttribute('disabled');
    }

    if (currentOffset <= 0) {
        document.querySelector('.prev-page-btn').setAttribute('readonly', true);
        document.querySelector('.prev-page-btn').setAttribute('disabled', true);
    } else {
        document.querySelector('.prev-page-btn').removeAttribute('readonly');
        document.querySelector('.prev-page-btn').removeAttribute('disabled');
    }

    const incr = (lastPage > 10 ? lastPage - 1 : 1);
    var appendDots = (lastPage > 10);

    QH.byId('pages-list').innerHTML = '';

    for (let i = 1; i <= lastPage; i += incr) {
        var aElement = document.createElement('a');
        if (currentOffset == ((i - 1) * window.configPageMaxEntries)) {
            aElement.classList.add('selected-index');
        }
        aElement.innerText = i;
        aElement.dataset['index'] = i;

        QH.byId('pages-list').appendChild(aElement);
        aElement.addEventListener('click', data => {
            const index = parseInt(data.currentTarget.dataset.index);
            currentOffset = (index - 1) * window.configPageMaxEntries;
            getAuditTrail();
        });

        if (appendDots) {
            var dotsElement = '<span> ... </span>';
            QH.byId('pages-list').innerHTML += dotsElement;
            appendDots = false;
        }
    }
}

function prevPage() {
    currentOffset -= window.configPageMaxEntries;
    if (currentOffset < 0)
        currentOffset = 0;

    getAuditTrail();
}

function nextPage() {
    currentOffset += window.configPageMaxEntries;
    if (parseInt(document.querySelector('.selected-index').dataset.index) >= lastPage) {
        lastPage++;
    }

    getAuditTrail();
}

async function exportAuditTrail() {
    const format = QH.byId('audit-trail-export-format').value;
    
    const exportStartTimestamp = QH.byId('audit-trail-export-start-timestamp');
    const exportEndTimestamp = QH.byId('audit-trail-export-end-timestamp');
    const limit = QH.byId('audit-trail-export-limit');
    const offset = QH.byId('audit-trail-export-offset');
    const order = QH.byId('audit-trail-export-order');
    const filter = QH.byId('audit-trail-export-filter');

    let url = window.location.origin + window.auditTrailExportUrl;
    url += '?format=' + format;

    if (exportStartTimestamp && !exportStartTimestamp.disabled && exportStartTimestamp.value) {
        url += '&since=' + encodeURIComponent(exportStartTimestamp.value);
    }
    if (exportEndTimestamp && !exportEndTimestamp.disabled && exportEndTimestamp.value) {
        url += '&to=' + encodeURIComponent(exportEndTimestamp.value);
    }
    if (limit && !limit.disabled && limit.value) {
        url += '&limit=' + limit.value;
    }
    if (offset && !offset.disabled && offset.value) {
        url += '&offset=' + offset.value;
    }
    if (order && !order.disabled && order.value) {
        url += '&orderby=' + encodeURIComponent('timestamp ' + order.value);
    }
    if (filter && !filter.disabled && filter.value) {
        url += '&filter=' + encodeURIComponent(filter.value);
    }

    QH.byId('audit-trail-export-export-btn').setAttribute('disabled', true);
    QH.byId('audit-trail-export-export-btn').setAttribute('readonly', true);
    QH.byId('audit-trail-export-export-btn').value = "Exporting...";

    const response = await fetch(url);
    const reader = response.body.getReader();
    
    // Create a stream to write chunks directly to a blob
    const stream = new ReadableStream({
        async start(controller) {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                controller.enqueue(value);
            }
            controller.close();
        }
    });

    // Create blob directly from stream
    const blob = await new Response(stream).blob();

    let link = document.createElement('a');
    link.download = `AuditTrail-${(new Date()).toISOString().replace(/[:.]/g, '_')}.zip`;
    link.href = URL.createObjectURL(blob);
    link.click();

    QH.byId('audit-trail-export-export-btn').removeAttribute('disabled');
    QH.byId('audit-trail-export-export-btn').removeAttribute('readonly');
    QH.byId('audit-trail-export-export-btn').value = "Export";
}

function toggleAuditTrailExport() {
    const filterCat = QH.byId('auditTrialsFilterSelect').value;
    const filterValue = (filterCat == 'type' ? 
        QH.byId('auditTrailTypeSelect').value : QH.byId('auditTrailFilter').value);

    const comparator = (filterCat == 'type' ? '==' : 'contains');
    let filter = "";
    if (filterValue != "") {
        filter = `${filterCat} ${comparator} "${filterValue}"`;
    }

    let atExportFilter = QH.byId('audit-trail-export-filter');
    atExportFilter.value = filter;
    QH.byId('audit-trail-export-filter-chk').checked = (filter != "");
    if (filter != "") {
        atExportFilter.removeAttribute('disabled');
        atExportFilter.removeAttribute('readonly');
    } else {
        atExportFilter.setAttribute('disabled', true);
        atExportFilter.setAttribute('readonly', true);
    }

    let atExportOffset = QH.byId('audit-trail-export-offset');
    atExportOffset.value = currentOffset;
    QH.byId('audit-trail-export-offset-chk').checked = (currentOffset > 0);
    if (currentOffset > 0) {
        atExportOffset.removeAttribute('disabled');
        atExportOffset.removeAttribute('readonly');
    } else {
        atExportOffset.setAttribute('disabled', true);
        atExportOffset.setAttribute('readonly', true);
    }

    let atExportStartTimestamp = QH.byId('audit-trail-export-start-timestamp');
    QH.byId('audit-trail-export-start-timestamp-chk').checked = (startTimestamp && true);
    if (startTimestamp) {
        atExportStartTimestamp.value = startTimestamp;
        atExportStartTimestamp.removeAttribute('disabled');
        atExportStartTimestamp.removeAttribute('readonly');
    } else {
        atExportStartTimestamp.setAttribute('disabled', true);
        atExportStartTimestamp.setAttribute('readonly', true);
    }

    let atExportEndTimestamp = QH.byId('audit-trail-export-end-timestamp');
    QH.byId('audit-trail-export-end-timestamp-chk').checked = (endTimestamp && true);
    if (endTimestamp) {
        atExportEndTimestamp.value = endTimestamp;
        atExportEndTimestamp.removeAttribute('disabled');
        atExportEndTimestamp.removeAttribute('readonly');
    } else {
        atExportEndTimestamp.setAttribute('disabled', true);
        atExportEndTimestamp.setAttribute('readonly', true);
    }

    toggleForm('audit-trail-export');
}

async function verifySignature() {
    const zipFile = QH.byId('at-verify-sig-zip');

    if (!zipFile.files.length) return;

    const fileSizeInMB = zipFile.files[0].size / (1024 * 1024);
    const resultElement = QH.byId('at-sig-verification-result');
    
    if (fileSizeInMB > 1) {
        resultElement.classList.remove('hidden-field');
        resultElement.innerHTML = `<b class="error">${window.zipFileTooBigMsg}</b>`;
        return;
    }

    let toBase64 = file => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result.substr(fileReader.result.indexOf(',') + 1));
            }
            fileReader.onerror = reject;
        })
    };

    const zip = await toBase64(zipFile.files[0]);

    const res = await WS.writeSymbol(
        window.Lua.Name + '.VerifySignature',
        {
            zipFile: zip
        },
        [ 'SendErrorMessage' ]
    );

    resultElement.classList.remove('hidden-field');
    if (res.error || res.readValue == false) {
        const error = (res.error ? (res.error.reason ?? res.error.message) : null);
        resultElement.innerHTML = `<b class="error">${error ?? window.signatureInvalidMsg}</b>`;
    } else {
        resultElement.innerHTML = `<b class="msg">${window.signatureValidMsg}</b>`;
    }
}
