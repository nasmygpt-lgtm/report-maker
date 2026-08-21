// ===== Smart Daily Sales Report Generator =====

const STORAGE_KEY = 'salesReportEntries';

// ===== REMARK GENERATION ENGINE =====
// Templates and varied language to avoid repetition

const openingPhrases = {
    sales: [
        "Discussed with the sales person",
        "Had a detailed discussion with sales representative",
        "Spoke with the sales team member",
        "Connected with the sales contact",
        "Met with the sales executive"
    ],
    contracting: [
        "Discussed with the contracting manager",
        "Had a conversation with contracting incharge",
        "Spoke with the contracting team",
        "Connected with the contracting manager",
        "Met with the contracting representative"
    ],
    operation: [
        "Discussed with the operation incharge",
        "Had a discussion with operations person",
        "Spoke with the operations manager",
        "Connected with the operation team",
        "Met with the operations incharge"
    ],
    team: [
        "Met the team and had a detailed discussion",
        "Had a meeting with the team",
        "Discussed with the team members",
        "Connected with the entire team",
        "Sat with the team for a discussion"
    ],
    company: [
        "Discussed with the company representative",
        "Had a conversation with company person",
        "Spoke with the company contact",
        "Met with the company representative",
        "Connected with their representative"
    ]
};

const inquiryPhrases = [
    "they have an inquiry for",
    "there is an inquiry for",
    "they received an inquiry for",
    "they have a booking request for",
    "an inquiry has come in for"
];

const ratesPhrases = [
    "rates has been given",
    "rates have been offered",
    "we have offered rates of",
    "pricing has been shared at",
    "rates provided at"
];

const waitingPhrases = [
    "waiting for the final update from them",
    "awaiting their confirmation",
    "pending their final response",
    "waiting for them to revert with confirmation",
    "expecting their feedback shortly"
];

const pushPhrases = [
    "and requested them to push for confirmation",
    "and encouraged them to convert this booking",
    "and urged them to confirm at the earliest",
    "and requested to expedite the confirmation",
    "and asked them to follow up for a positive response"
];

const confirmPhrases = [
    "Managed to confirm",
    "Successfully secured confirmation for",
    "The booking has been confirmed for",
    "Received confirmation for",
    "Booking confirmed successfully for"
];

const newAgencyPhrases = [
    "New travel agency, approached and rates has been given and requested to start offering our rates for their clients.",
    "A new agency partner was approached, rates and hotel details have been shared, and requested them to start promoting our property.",
    "New travel partner identified. Rates and property details shared, requesting them to begin offering our hotel to their clientele.",
    "Approached this new agency, provided our rates and property information, and invited them to start sending bookings our way.",
    "New agency contact established. Our competitive rates have been shared and they have been encouraged to include our hotel in their offerings."
];

const seasonPhrases = [
    "discussed about our summer and winter rates and requested to push to their market",
    "talked about our rates for the upcoming seasons and encouraged them to promote our hotel",
    "reviewed seasonal pricing and requested them to actively market our property",
    "discussed current and upcoming seasonal rates, encouraging them to push our hotel in their network",
    "went over our seasonal rates and requested increased promotion across their channels"
];

const parityPhrases = [
    "advised that they have rate parity issues",
    "mentioned concerns about rate parity across channels",
    "raised the issue of rate discrepancies on their platform",
    "highlighted parity concerns between different booking channels",
    "brought up rate parity challenges they are facing"
];

// Random picker helper
function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Track used phrases to avoid repetition within same session
let usedOpenings = new Set();

function pickUnique(arr, category) {
    const available = arr.filter((_, i) => !usedOpenings.has(category + i));
    if (available.length === 0) {
        // Reset if all used
        arr.forEach((_, i) => usedOpenings.delete(category + i));
        return pick(arr);
    }
    const chosen = pick(available);
    const idx = arr.indexOf(chosen);
    usedOpenings.add(category + idx);
    return chosen;
}

// ===== MAIN REMARK GENERATOR =====
function generateRemark(data) {
    const { personRole, discussionType, keyPoints, travelDates, rooms, rateOffered, roomType, mealPlan, supplement, duration } = data;

    let remark = '';

    switch (discussionType) {
        case 'inquiry':
            remark = generateInquiryRemark(data);
            break;
        case 'followup':
            remark = generateFollowupRemark(data);
            break;
        case 'confirmed':
            remark = generateConfirmedRemark(data);
            break;
        case 'new_agency':
            remark = generateNewAgencyRemark(data);
            break;
        case 'rates_discussion':
            remark = generateRatesDiscussionRemark(data);
            break;
        case 'group_inquiry':
            remark = generateGroupInquiryRemark(data);
            break;
        case 'fit_inquiry':
            remark = generateFITInquiryRemark(data);
            break;
        case 'parity_issue':
            remark = generateParityRemark(data);
            break;
        default:
            remark = generateGenericRemark(data);
    }

    return remark;
}

function generateInquiryRemark(data) {
    let parts = [];
    
    parts.push(pickUnique(openingPhrases[data.personRole], data.personRole));
    
    if (data.travelDates) {
        parts.push(`and ${pick(inquiryPhrases)} ${data.travelDates}`);
    } else if (data.keyPoints) {
        parts.push(`and ${pick(inquiryPhrases)} the mentioned dates`);
    }

    if (data.rooms) {
        parts.push(`for ${data.rooms}`);
    }

    if (data.roomType) {
        parts.push(`(${data.roomType})`);
    }

    if (data.mealPlan) {
        parts.push(`on ${data.mealPlan} basis`);
    }

    if (data.rateOffered) {
        parts.push(`and ${pick(ratesPhrases)} ${data.rateOffered}`);
    }

    if (data.supplement) {
        parts.push(`with ${data.supplement} supplement`);
    }

    parts.push(`. ${pick(waitingPhrases)} ${pick(pushPhrases)}.`);

    // Add any extra key points
    if (data.keyPoints) {
        const extraInfo = parseKeyPoints(data.keyPoints);
        if (extraInfo) {
            parts.push(` ${extraInfo}`);
        }
    }

    return cleanRemark(parts.join(' '));
}

function generateFollowupRemark(data) {
    let parts = [];

    parts.push(`Followed up with ${getRoleText(data.personRole)}`);

    if (data.keyPoints) {
        const points = parseKeyPoints(data.keyPoints);
        parts.push(`, ${points}`);
    } else {
        parts.push(' regarding pending inquiries and bookings');
    }

    if (data.rateOffered) {
        parts.push(`. Rates of ${data.rateOffered} were previously offered`);
    }

    parts.push(`. ${pick(waitingPhrases)}.`);

    return cleanRemark(parts.join(''));
}

function generateConfirmedRemark(data) {
    let parts = [];

    parts.push(pick(confirmPhrases));

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
        parts.push(` and rates confirmed at ${data.rateOffered}`);
    }

    if (data.mealPlan) {
        parts.push(` on ${data.mealPlan} basis`);
    }

    if (data.keyPoints) {
        parts.push(`. ${parseKeyPoints(data.keyPoints)}`);
    }

    parts.push('.');

    return cleanRemark(parts.join(''));
}

function generateNewAgencyRemark(data) {
    let remark = pick(newAgencyPhrases);

    if (data.keyPoints) {
        remark += ` ${parseKeyPoints(data.keyPoints)}`;
    }

    return cleanRemark(remark);
}

function generateRatesDiscussionRemark(data) {
    let parts = [];

    parts.push(pickUnique(openingPhrases[data.personRole], data.personRole));
    parts.push(`, ${pick(seasonPhrases)}`);

    if (data.rateOffered) {
        parts.push(`. Current rates shared at ${data.rateOffered}`);
    }

    if (data.keyPoints) {
        parts.push(`. ${parseKeyPoints(data.keyPoints)}`);
    }

    parts.push(`. ${pick(pushPhrases)}.`);

    return cleanRemark(parts.join(''));
}

function generateGroupInquiryRemark(data) {
    let parts = [];

    parts.push(pickUnique(openingPhrases[data.personRole], data.personRole));
    parts.push(', and they have a group inquiry');

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
        parts.push(` and ${pick(ratesPhrases)} ${data.rateOffered}`);
    }

    if (data.supplement) {
        parts.push(` plus ${data.supplement} supplement`);
    }

    if (data.duration) {
        parts.push(`. Duration: ${data.duration}`);
    }

    parts.push(`. Requested to convert this group with us. ${pick(waitingPhrases)}.`);

    if (data.keyPoints) {
        parts.push(` ${parseKeyPoints(data.keyPoints)}`);
    }

    return cleanRemark(parts.join(''));
}

function generateFITInquiryRemark(data) {
    let parts = [];

    parts.push(pickUnique(openingPhrases[data.personRole], data.personRole));
    parts.push(', and they have a FIT inquiry');

    if (data.travelDates) {
        parts.push(` for ${data.travelDates}`);
    }

    if (data.rooms) {
        parts.push(` for ${data.rooms}`);
    }

    if (data.roomType) {
        parts.push(` ${data.roomType} room`);
    }

    if (data.rateOffered) {
        parts.push(` and ${pick(ratesPhrases)} ${data.rateOffered}`);
    }

    if (data.mealPlan) {
        parts.push(` on ${data.mealPlan} basis`);
    }

    if (data.supplement) {
        parts.push(`. Also ${data.supplement} supplement applied`);
    }

    parts.push(`. ${pick(waitingPhrases)}.`);

    if (data.keyPoints) {
        parts.push(` ${parseKeyPoints(data.keyPoints)}`);
    }

    return cleanRemark(parts.join(''));
}

function generateParityRemark(data) {
    let parts = [];

    parts.push(pickUnique(openingPhrases[data.personRole], data.personRole));
    parts.push(`, and ${pick(parityPhrases)}`);

    if (data.keyPoints) {
        parts.push(`. ${parseKeyPoints(data.keyPoints)}`);
    } else {
        parts.push('. Have advised management and will review special rates on their portal');
    }

    parts.push('.');

    return cleanRemark(parts.join(''));
}

function generateGenericRemark(data) {
    let parts = [];
    parts.push(pickUnique(openingPhrases[data.personRole], data.personRole));
    
    if (data.keyPoints) {
        parts.push(`. ${parseKeyPoints(data.keyPoints)}`);
    }

    parts.push(`. ${pick(waitingPhrases)}.`);
    return cleanRemark(parts.join(''));
}

// Helper: parse key points into flowing text
function parseKeyPoints(text) {
    if (!text || text.trim() === '') return '';

    // Split by newlines or dashes
    let points = text.split(/[\n\r]+/)
        .map(p => p.replace(/^[-•*]\s*/, '').trim())
        .filter(p => p.length > 0);

    if (points.length === 0) return text.trim();
    if (points.length === 1) return capitalizeFirst(points[0]);

    // Join points into flowing sentence
    let result = capitalizeFirst(points[0]);
    for (let i = 1; i < points.length; i++) {
        if (i === points.length - 1) {
            result += ` and ${points[i].toLowerCase()}`;
        } else {
            result += `, ${points[i].toLowerCase()}`;
        }
    }
    return result;
}

function getRoleText(role) {
    const map = {
        sales: 'the sales person',
        contracting: 'the contracting manager',
        operation: 'the operation incharge',
        team: 'the team',
        company: 'the company representative'
    };
    return map[role] || 'the contact person';
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function cleanRemark(text) {
    // Fix double spaces, double periods, spacing issues
    return text
        .replace(/\s+/g, ' ')
        .replace(/\.\./g, '.')
        .replace(/\s\./g, '.')
        .replace(/,\s*,/g, ',')
        .replace(/\.\s*,/g, '.')
        .replace(/\s+\)/g, ')')
        .replace(/\(\s+/g, '(')
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
            <td>${escapeHtml(entry.remarks)}</td>
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
        duration: document.getElementById('duration').value.trim()
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

    // Scroll to table
    document.getElementById('reportTable').scrollIntoView({ behavior: 'smooth' });
});

// ===== EXPORT EXCEL =====
document.getElementById('exportExcel').addEventListener('click', function() {
    const entries = getEntries();
    if (entries.length === 0) {
        alert('No entries to export!');
        return;
    }

    const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));

    const excelData = sorted.map(entry => ({
        'Date': formatDate(entry.date),
        'Company Name': entry.company,
        'Person Name': entry.person,
        'Remarks': entry.remarks
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    ws['!cols'] = [
        { wch: 12 },
        { wch: 22 },
        { wch: 18 },
        { wch: 85 }
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Sales Report');

    const today = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `Daily_Sales_Report_${today}.xlsx`);
    showNotification('Excel exported! 📥');
});

// ===== PRINT =====
document.getElementById('printReport').addEventListener('click', function() {
    const entries = getEntries();
    if (entries.length === 0) {
        alert('No entries to print!');
        return;
    }

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
        <h2 style="text-align:center; margin-bottom:15px;">Daily Sales Visit Report</h2>
        <table class="report-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Company Name</th>
                    <th>Person Name</th>
                    <th>Remarks</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;

    window.print();
});

// ===== CLEAR ALL =====
document.getElementById('clearAll').addEventListener('click', function() {
    if (!confirm('⚠️ Delete ALL entries? This cannot be undone!')) return;
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
