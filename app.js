// ===== Daily Sales Report Generator =====
// Generates remarks in natural, simple tone matching actual report samples

const STORAGE_KEY = 'salesReportEntries';

// ===== REMARK GENERATION ENGINE =====
// Based on real samples - simple, direct, conversational language

// Opening phrases - how each entry starts (matched from samples)
const openings = {
    sales: [
        "Discussed with sales person",
        "Discussed with Sales person",
        "Disscussed with sales person",
        "Discussed with the sales person",
        "Spoke with sales person"
    ],
    contracting: [
        "Discussed with contracting incharge",
        "Discussed with contracting manager",
        "Discussed with contract person",
        "Disscussed with contracting incharge and followed up"
    ],
    operation: [
        "Discussed with Operation person",
        "Discussed with operation incharge",
        "Disscussed with Operation incharge"
    ],
    team: [
        "Met the team, and discussed",
        "Discussed with the team",
        "Met the team and discussed"
    ],
    booking_incharge: [
        "Discussed with booking incharge",
        "Discussed with reservation incharge"
    ],
    account_manager: [
        "Discussed with our account manager",
        "Discussed with New account manager"
    ],
    admin: [
        "Discussed with admin",
        "Discussed with Admin officer"
    ],
    md: [
        "Discussed with MD of the company"
    ],
    director: [
        "Met the director and talked about our rates"
    ],
    company: [
        "Discussed with company person",
        "Met business development person"
    ]
};

// Connectors and transition words used in samples
const connectors = [
    ", and",
    ", and he advised that",
    ", and she advised that",
    ", and they advised that",
    ". However",
    ". Also",
    ". Currently",
    ". Due to",
    ". As per"
];

// Rate related phrases
const ratePhrases = [
    "rates has been given",
    "rates has been offered",
    "rates have been given",
    "I have offered",
    "rates has been given and offered",
    "and rates has been given"
];

// Waiting phrases
const waitingPhrases = [
    "waiting for the final update from them",
    "waiting for the final update",
    "waiting for their update",
    "waiting for the update",
    "and waiting for the final update from them"
];

// Request phrases
const requestPhrases = [
    "and requested him to support",
    "and requested her to confirm this inquiry",
    "and requested them to push",
    "Requested him to confirm this request with us",
    "Requested to start offering our rates for their clients",
    "and request to support",
    "requested her to support in the same way",
    "requested them to offer rates whenever there is inquiries"
];

// Random pick helper
function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// ===== MAIN REMARK GENERATOR =====
function generateRemark(data) {
    const { personRole, discussionType, keyPoints, travelDates, rooms, rateOffered, roomType, mealPlan, supplement, duration, gender } = data;

    let remark = '';

    switch (discussionType) {
        case 'inquiry':
            remark = buildInquiryRemark(data);
            break;
        case 'group_inquiry':
            remark = buildGroupInquiryRemark(data);
            break;
        case 'fit_inquiry':
            remark = buildFITInquiryRemark(data);
            break;
        case 'followup':
            remark = buildFollowupRemark(data);
            break;
        case 'confirmed':
            remark = buildConfirmedRemark(data);
            break;
        case 'new_agency':
            remark = buildNewAgencyRemark(data);
            break;
        case 'rates_discussion':
            remark = buildRatesDiscussionRemark(data);
            break;
        case 'market_update':
            remark = buildMarketUpdateRemark(data);
            break;
        case 'parity_issue':
            remark = buildParityRemark(data);
            break;
        case 'corporate':
            remark = buildCorporateRemark(data);
            break;
        default:
            remark = buildGenericRemark(data);
    }

    return cleanText(remark);
}

function buildInquiryRemark(data) {
    let parts = [];
    const g = data.gender || 'he';
    const G = g.charAt(0).toUpperCase() + g.slice(1);

    parts.push(pick(openings[data.personRole] || openings.sales));

    if (data.keyPoints) {
        parts.push(`, ${processKeyPoints(data.keyPoints, data)}`);
    } else {
        parts.push(`, and ${g} advised that they have inquiry`);
        
        if (data.travelDates) {
            parts.push(` for ${data.travelDates}`);
        }

        if (data.rooms) {
            parts.push(` ${data.rooms}`);
        }

        if (data.roomType) {
            parts.push(` ${data.roomType}`);
        }

        if (data.mealPlan) {
            parts.push(` with ${data.mealPlan}`);
        }
    }

    if (data.rateOffered) {
        parts.push(` and ${pick(ratePhrases)} ${data.rateOffered}`);
    }

    if (data.supplement) {
        parts.push(`. Also ${data.supplement} supplement`);
    }

    parts.push(`. ${pick(waitingPhrases)}.`);

    return parts.join('');
}

function buildGroupInquiryRemark(data) {
    let parts = [];
    const g = data.gender || 'he';

    parts.push(pick(openings[data.personRole] || openings.sales));
    parts.push(`, and they have group inquiry`);

    if (data.travelDates) {
        parts.push(` for ${data.travelDates}`);
    }

    if (data.rooms) {
        parts.push(`. Room Requirements: ${data.rooms}`);
    }

    if (data.roomType) {
        parts.push(` ${data.roomType}`);
    }

    if (data.mealPlan) {
        parts.push(` with ${data.mealPlan}`);
    }

    if (data.rateOffered) {
        parts.push(` and ${pick(ratePhrases)} ${data.rateOffered}`);
    }

    if (data.supplement) {
        parts.push(`. ${data.supplement} supplement given`);
    }

    if (data.duration) {
        parts.push(`. Duration: ${data.duration}`);
    }

    if (data.keyPoints) {
        parts.push(`. ${processKeyPoints(data.keyPoints, data)}`);
    }

    parts.push(`. ${pick(waitingPhrases)}.`);

    return parts.join('');
}

function buildFITInquiryRemark(data) {
    let parts = [];
    const g = data.gender || 'he';

    parts.push(pick(openings[data.personRole] || openings.sales));
    parts.push(`, and they have FIT inquiry`);

    if (data.travelDates) {
        parts.push(` for ${data.travelDates}`);
    }

    if (data.rooms) {
        parts.push(` ${data.rooms}`);
    }

    if (data.roomType) {
        parts.push(` ${data.roomType} room`);
    }

    if (data.rateOffered) {
        parts.push(` and ${pick(ratePhrases)} ${data.rateOffered}`);
    }

    if (data.mealPlan) {
        parts.push(` on ${data.mealPlan} basis`);
    }

    if (data.supplement) {
        parts.push(`. Also ${data.supplement} supplement`);
    }

    if (data.keyPoints) {
        parts.push(`. ${processKeyPoints(data.keyPoints, data)}`);
    }

    parts.push(`. ${pick(waitingPhrases)}.`);

    return parts.join('');
}

function buildFollowupRemark(data) {
    let parts = [];
    const g = data.gender || 'he';

    parts.push(`Followed up with ${g === 'he' ? 'him' : 'her'}`);

    if (data.keyPoints) {
        parts.push(` ${processKeyPoints(data.keyPoints, data)}`);
    } else {
        parts.push(` for future bookings and events inquiry`);
        parts.push(` and ${g} advised that already ${g} is offering our rates`);
    }

    if (data.rateOffered) {
        parts.push(`. Rates of ${data.rateOffered} has been offered`);
    }

    parts.push(`. ${pick(waitingPhrases)}.`);

    return parts.join('');
}

function buildConfirmedRemark(data) {
    let parts = [];

    parts.push(`Managed to confirm`);

    if (data.rooms) {
        parts.push(` ${data.rooms}`);
    }

    if (data.travelDates) {
        parts.push(` for ${data.travelDates}`);
    }

    if (data.duration) {
        parts.push(` for ${data.duration}`);
    }

    if (data.rateOffered) {
        parts.push(` and rates confirmed ${data.rateOffered}`);
    }

    if (data.mealPlan) {
        parts.push(` on ${data.mealPlan}`);
    }

    if (data.keyPoints) {
        parts.push(`. ${processKeyPoints(data.keyPoints, data)}`);
    }

    return parts.join('');
}

function buildNewAgencyRemark(data) {
    const templates = [
        "New travel agency, approached and rates has been given and request to start offering our rates for their clients.",
        "New Travel agency, approached and rates has been given and requested to start offering our rates for their clients.",
        "New B2b Portal discussed with them, and rates and our hotel details has been shared with them.",
        "New agency partner, approached and our rates and hotel information has been shared. Requested them to start offering our hotel."
    ];

    let remark = pick(templates);

    if (data.keyPoints) {
        remark += ` ${processKeyPoints(data.keyPoints, data)}`;
    }

    return remark;
}

function buildRatesDiscussionRemark(data) {
    let parts = [];
    const g = data.gender || 'he';

    parts.push(pick(openings[data.personRole] || openings.sales));
    parts.push(` and talked about our rates for summer and winter`);

    if (data.keyPoints) {
        parts.push(`. ${processKeyPoints(data.keyPoints, data)}`);
    } else {
        parts.push(`. ${G} advised that they are start receiving inquiries`);
    }

    if (data.rateOffered) {
        parts.push(`. Rates has been given ${data.rateOffered}`);
    }

    parts.push(`. ${pick(requestPhrases)}.`);

    return parts.join('');
}

function buildMarketUpdateRemark(data) {
    let parts = [];
    const g = data.gender || 'he';

    parts.push(pick(openings[data.personRole] || openings.sales));

    if (data.keyPoints) {
        parts.push(`, and ${g} advised that ${processKeyPoints(data.keyPoints, data)}`);
    } else {
        parts.push(`, and ${g} advised that market is slowly starting`);
    }

    if (data.rateOffered) {
        parts.push(`. Our rates has been given ${data.rateOffered}`);
    }

    parts.push(`. ${pick(waitingPhrases)}.`);

    return parts.join('');
}

function buildParityRemark(data) {
    let parts = [];
    const g = data.gender || 'he';

    parts.push(pick(openings[data.personRole] || openings.sales));
    parts.push(` for the future rates and promotion`);
    parts.push(`. ${G === 'He' ? 'He' : 'She'} advised that ${g} have problem with rate parity issues`);

    if (data.keyPoints) {
        parts.push(`, ${processKeyPoints(data.keyPoints, data)}`);
    } else {
        parts.push(`, and I have advised him so much discounted we cant do, however we will consider and update special rates on their portal`);
    }

    parts.push('.');

    return parts.join('');
}

function buildCorporateRemark(data) {
    let parts = [];
    const g = data.gender || 'he';

    parts.push(pick(openings[data.personRole] || openings.company));
    parts.push(`, and their corporate company, discussed about hotel and rates`);

    if (data.keyPoints) {
        parts.push(`. ${processKeyPoints(data.keyPoints, data)}`);
    } else {
        parts.push(`. ${G === 'He' ? 'He' : 'She'} advised that for ${g === 'he' ? 'his' : 'her'} staff ${g} will book hotel`);
    }

    if (data.rateOffered) {
        parts.push(`. Rates offered ${data.rateOffered}`);
    }

    parts.push('.');

    return parts.join('');
}

function buildGenericRemark(data) {
    let parts = [];
    const g = data.gender || 'he';

    parts.push(pick(openings[data.personRole] || openings.sales));

    if (data.keyPoints) {
        parts.push(`, ${processKeyPoints(data.keyPoints, data)}`);
    }

    if (data.rateOffered) {
        parts.push(`. Rates has been offered ${data.rateOffered}`);
    }

    parts.push(`. ${pick(waitingPhrases)}.`);

    return parts.join('');
}

// Process key points - convert bullets into flowing natural text
function processKeyPoints(text, data) {
    if (!text || text.trim() === '') return '';

    // Split by newlines or dashes/bullets
    let points = text.split(/[\n\r]+/)
        .map(p => p.replace(/^[-•*]\s*/, '').trim())
        .filter(p => p.length > 0);

    if (points.length === 0) return text.trim();
    if (points.length === 1) return points[0];

    // Join naturally with "and", "Also", "However" like in samples
    let result = points[0];
    for (let i = 1; i < points.length; i++) {
        const connectorOptions = ['. Also ', '. ', ', and ', '. However '];
        // Use "Also" for additional info, "However" for contrast
        const point = points[i].toLowerCase();
        if (point.startsWith('however') || point.startsWith('but')) {
            result += `. However ${points[i].replace(/^(however|but)\s*/i, '')}`;
        } else if (point.startsWith('also')) {
            result += `. Also ${points[i].replace(/^also\s*/i, '')}`;
        } else {
            // Alternate between connectors
            if (i % 2 === 0) {
                result += `. Also ${points[i]}`;
            } else {
                result += `, and ${points[i]}`;
            }
        }
    }

    return result;
}

// Clean up text - fix double periods, spacing
function cleanText(text) {
    return text
        .replace(/\s+/g, ' ')
        .replace(/\.\./g, '.')
        .replace(/\s\./g, '.')
        .replace(/,\s*\./g, '.')
        .replace(/\.\s*,/g, ', ')
        .replace(/,,/g, ',')
        .trim();
}

// ===== DATA MANAGEMENT =====

function getEntries() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function saveEntries(entries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const day = date.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];

    let suffix = 'th';
    if (day === 1 || day === 21 || day === 31) suffix = 'st';
    else if (day === 2 || day === 22) suffix = 'nd';
    else if (day === 3 || day === 23) suffix = 'rd';

    return `${day}${suffix} ${month}`;
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== RENDER TABLE =====
function renderTable() {
    const entries = getEntries();
    const tbody = document.getElementById('reportBody');
    const noData = document.getElementById('noData');
    const table = document.getElementById('reportTable');

    if (entries.length === 0) {
        table.style.display = 'none';
        noData.style.display = 'block';
        return;
    }

    table.style.display = 'table';
    noData.style.display = 'none';

    // Sort by date (newest first)
    const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));

    tbody.innerHTML = sorted.map(entry => `
        <tr>
            <td>${formatDate(entry.date)}</td>
            <td>${escapeHtml(entry.company)}</td>
            <td>${escapeHtml(entry.person)}</td>
            <td>${escapeHtml(entry.remarks)}<br><button class="delete-btn" onclick="deleteEntry('${entry.id}')">❌</button></td>
        </tr>
    `).join('');
}

// ===== FORM SUBMISSION =====
document.getElementById('reportForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const data = {
        personRole: document.getElementById('personRole').value,
        discussionType: document.getElementById('discussionType').value,
        keyPoints: document.getElementById('keyPoints').value.trim(),
        travelDates: document.getElementById('travelDates').value.trim(),
        rooms: document.getElementById('rooms').value.trim(),
        rateOffered: document.getElementById('rateOffered').value.trim(),
        roomType: document.getElementById('roomType').value.trim(),
        mealPlan: document.getElementById('mealPlan').value,
        supplement: document.getElementById('supplement').value.trim(),
        duration: document.getElementById('duration').value.trim(),
        gender: document.getElementById('gender').value
    };

    // Generate the remark automatically
    const remark = generateRemark(data);

    const entry = {
        id: generateId(),
        date: document.getElementById('entryDate').value,
        company: document.getElementById('companyName').value.trim(),
        person: document.getElementById('personName').value.trim(),
        remarks: remark
    };

    const entries = getEntries();
    entries.push(entry);
    saveEntries(entries);
    renderTable();

    // Reset form but keep date
    const dateVal = document.getElementById('entryDate').value;
    this.reset();
    document.getElementById('entryDate').value = dateVal;

    showNotification('Report entry generated! ✅');
    document.getElementById('reportTable').scrollIntoView({ behavior: 'smooth' });
});

// Delete entry
function deleteEntry(id) {
    if (!confirm('Delete this entry?')) return;
    let entries = getEntries();
    entries = entries.filter(e => e.id !== id);
    saveEntries(entries);
    renderTable();
}

// ===== EXPORT EXCEL =====
document.getElementById('exportExcel').addEventListener('click', function() {
    const entries = getEntries();
    if (entries.length === 0) { alert('No entries to export!'); return; }

    const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));
    const excelData = sorted.map(entry => ({
        'Date': formatDate(entry.date),
        'Company Name': entry.company,
        'Person Name': entry.person,
        'Remarks': entry.remarks
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    ws['!cols'] = [{ wch: 12 }, { wch: 22 }, { wch: 18 }, { wch: 90 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Sales Report');

    const today = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `Daily_Sales_Report_${today}.xlsx`);
    showNotification('Excel exported! 📥');
});

// ===== PRINT =====
document.getElementById('printReport').addEventListener('click', function() {
    const entries = getEntries();
    if (entries.length === 0) { alert('No entries to print!'); return; }

    const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));
    let rows = sorted.map(entry => `
        <tr>
            <td>${formatDate(entry.date)}</td>
            <td>${escapeHtml(entry.company)}</td>
            <td>${escapeHtml(entry.person)}</td>
            <td>${escapeHtml(entry.remarks)}</td>
        </tr>
    `).join('');

    document.getElementById('printArea').innerHTML = `
        <h2 style="text-align:center;margin-bottom:15px;">Daily Sales Visit Report</h2>
        <table class="report-table" style="width:100%;border-collapse:collapse;border:2px solid #000;">
            <thead><tr style="background:#ffff00;">
                <th style="border:1px solid #000;padding:10px;">Date</th>
                <th style="border:1px solid #000;padding:10px;">Company Name</th>
                <th style="border:1px solid #000;padding:10px;">Person Name</th>
                <th style="border:1px solid #000;padding:10px;">Remarks</th>
            </tr></thead>
            <tbody>${rows}</tbody>
        </table>
    `;
    window.print();
});

// ===== CLEAR ALL =====
document.getElementById('clearAll').addEventListener('click', function() {
    if (!confirm('⚠️ Delete ALL entries?')) return;
    localStorage.removeItem(STORAGE_KEY);
    renderTable();
    showNotification('All entries cleared!');
});

// ===== NOTIFICATION =====
function showNotification(message) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('entryDate').value = new Date().toISOString().split('T')[0];
    renderTable();
});
