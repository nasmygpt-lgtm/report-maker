// ===== Daily Sales Report Generator =====
// Enter company + person → Generate Report → editable remark appears

const STORAGE_KEY = 'salesReportData';

// ===== SAMPLE REMARKS LIBRARY =====
// Taken directly from actual report samples - natural tone, simple language

const sampleRemarks = [
    "Discussed with sales person, and they advised that still {market} market not fully started. However they have group inquiry for {rooms} rooms for {month}. Due to their budget {rate} offered and waiting for the final update from them. Also winter rates has been given.",
    "Discussed with sales person and talked about our rates for summer and winter. Currently he has one inquiry for {month} and {rooms} rooms with one comp room and he requesting {rate} with TD. Also informed him will discusse with management and advise on this request.",
    "Discussed with contracting manager, and he advised that they are slowing starting, and {month} he wanted to flat rates without any supplement. I have informed as of now we are not able waive and there will be supplement for Diwali and Big5.",
    "Discussed with Sales person, and they have inquiry for {rooms} Rooms and rates has been given {rate} with one comp room. Details No of Pax: {pax} adults Travelling Date: {traveldate} No of Nights: {nights} nights Room: {roomtype}",
    "Disscussed with sales person, and they have inquiry C/In: {checkin} C/Out: {checkout} Room: {rooms} on {mealplan} with Breakfast Guest: {pax} Adults and rates has been given {rate} TD. Also request to support during summer.",
    "Discussed with Operation person, and they have start offering our hotel for {market} market, and the inquiry dates {traveldate} No. of Pax {pax} Adults and rates has been offered {rate}.",
    "New travel agency, approached and rates has been given and request to start offering our rates for their clients.",
    "Followed up with her for future bookings and events inquiry and she advised that already she is offering our rates. However still not confirmed any inquiries. For today one night she has taken one room with the rates of {rate} on Room only basis.",
    "Discussed with him for the future rates and promotion. He advised that he have problem with rate parity issues, and I have advised him so much discounted we cant do, however we will consider and update special rates on their portal.",
    "Discussed with Sales person and they are handling {market} market, as per currently they don't have much inquiries however one inquiry they have for {traveldate} {rooms} Rooms and I have offered {rate} and requested her to confirm this inquiry.",
    "Discussed with sales person, and they have requested for comp rooms during ATM, and I have advised we will come back after discussing with management. Also {month} and {nextmonth} rates has been giveb as flat rates, {month} {rate} and {nextmonth} {rate2} and requested them to offer this rates.",
    "Discussed with company person, and he wanted to room from {traveldate} and he requsted lowest rates. {month} rates {rate} and {nextmonth} we offered {rate2} for his pernal booking. Waiting for the final update from him.",
    "Discussed with contracting incharge and discussed about reopening the rates for {market} market. He advised that from {month} they are getting few inquiries from {company}, BB and HB rates has been given to them and requested him to support. Currently he have two inquiry and {rate} has been offered.",
    "Managed to confirm {rooms} rooms group for {traveldate} for {nights} nights and rates confirmed {rate} and they have shared VCC as well. Also spoke to him if there is any group inquiry {market} marker we can offer case to case special rates, he advised that already he is offering our rates to their agencies.",
    "Discussed with sales person and followed up if they have any inquiries for Summer and winter. He advised that they are start receiveing inquiries and still not confirmed yet. Also {month} they have FIT request and rates given and waiting for the final update from them.",
    "Met the team, and discussed about our summer and winter rates and requested to push to their market. Sales incharge advised that, currently their agencies are taking mainly excursion from them. However they start receiving inquiries for winter and rates has been given for our hotel.",
    "Discussed with the sales person, he advised that they start receving FIT inquiries and currently {month} they have inquiry and rates has been given. {prevmonth} {rate} and offered {rate2} and waiting for the final update from him.",
    "Discussed with the sales person, they have inquiry for Travel Date: {traveldate} Duration: {duration} for {rooms} rooms. I have offered {rate} and one {supplement} supplement and requested her to confimr with us.",
    "They have Group inquiry for {checkin} Check Out: {checkout} Room Requirements: {rooms} Room with Breakfast and rates has been given {rate} and requested her to convert this group with us. She advised rates has been shared with their agency and waitng for the final update from them.",
    "They have FIT inquiry for {traveldate} one {roomtype} room and rates has been offered {rate} and extra bed price {extrabed}. Also one day {supplement} supplement and waiting for their update.",
    "Discussed with operation incharge, and long time they were operating and now they start receiving inquiries. End of {month} he has one inquiry and dates not confirmed and rates has been given {rate} and waiting for the final update and requested him to start offering our hotel.",
    "Disscussed with sales person, and they have group inquiry Check in:{checkin} Check Out: {checkout} Hotel: Grand Central Hotel No Of Rooms {rooms} and rates has been offered {rate} PRPN BB and he advised that tomorrow will come back with final answer.",
    "Discussed with Sales person, for them we have given NRF 5% and weekdays and weekends different rates. They advised that due to parity from B2B channels they are not able to proude, Hence NRF rates has been revised with 10% discount and request them to push again from them.",
    "Discussed with contracting incharge and our summer rates has been loaded and they just started as of now they are taking beach hotels. City hotels still not start producing, however he will advise his team to push our hotel.",
    "Discussed with Sales manager and they have group request for during {month}, Date: {traveldate} No. of Pax: {pax} Pax (All Adults) Number of rooms: {rooms} Room, and I have offered {rate} with {supplement} Supplement. He will try with agency and advise as earliest.",
    "Discussed with Sales manager regarding summer inquiries and he have one inquiry for Winter: {pax} adults {traveldate} and I have offered {rate} since its begnining of winter season. Requested him to confirm this request with us.",
    "Discussed with contract incharges, and currently they don't have inquiry for Dubai, however they got one inquiry for {traveldate} {nights} nights {rooms} rooms and I have offered {rate} for this inquiry and waiting for the final update from them. This agency last year they start working with us.",
    "Discussed with sales person they have {rooms} rooms for {month} and they have requested to confirm with {rate} due to budget issue. As per him, this booking for another hotel, and they wanted to convert to our hotel. Hence special rates offered and confirmed.",
    "Discussed with sales person, she had one inquiry for one month, and rates offered {rate} special case and she will try with the clients and advise on this.",
    "Discussed with Admin officer, and their corporate company, discussed about hotel and rates. He advised that for his staff he will book hotel. Also requested him arrange meeting with him in order to discusse and start working together.",
    "Met business development person for our hotel website configuration, and discussed with him how its works and the charges. They charge 10% commission for per booking there is no any additional charges. We are waiting for the contract from them.",
    "Met the director and talked about our rates. Corporate account and he will have some clients and need rates for him. Also he advised that regularly he will start booking with us. He requested special rates and advised him depending on the availability.",
    "Discussed with booking incharge and he advised that they were operating but no any technical staffs from another country. However now he got one booking and its booked with us. Corporate account, and he advised soon some of the staffs will come from their company he will offer our rates.",
    "Discussed with booker, and she have inquiry for {month} for {rooms} person meeting rooms initially offered {rate} per person with lunch and tea breaks. She advised that they don't have budget and she wanted to reduce the price and same has been confirmed {rate2} per person and for {nights} days, the total revenue {totalrevenue}.",
    "Disscussed with contracting incharge and followed up for business update from him. As per him currently they don't have much inquiry and soon they will start. Also B2B agreed for pilot property and soon they will start the testing process for B2B and B2c. He advised that once we start this soon we can expect some bookings from them.",
    "Discussed with the team, and release period has been changed to 0 to 1 day in order to avoid any last minute booking issue. Also requested to push our rates to their partners to increase the bookings from them.",
    "Discussed with Sales person, July and {month} they start producing after given special rates. Also he advised that our hotel they will publish on their aniversary magazine with our hotel picture and it will shared with all their partnerts. Also I have requested to start selling winter as well.",
    "Discussed with New account manager talked about current business situation. She advised that due to current situation international tourists are not that much. Also mobile discount has been activated and discussed what other promotion we can do. Next week we will discuss again.",
    "Discussed with Contract person and they have only few inquiries. Also they are not receiving bookings on their B2B system, however our rates are already loaded on their system. She advised that inform their marketing team to push our hotel page.",
    "Discussed with reservation incharge and follow up whether our rates are loaded on their system. He advised that summer rates are loaded abd bookings are less from their market, however for their inquiries they are offering our rates, and request him to push our hotel.",
    "Discussed with Sales person and they have inquiry and yesterday managed to confirm {rooms} rooms, as per him, market bit slow. However for their clients they are offering our special rates and I have informd him our support will be there in the rates and push more business from {market} market.",
    "Discussed with Contract incharge and she advised that still they didn't start the process and she is India. She advised that hopefully by {month} they will start again and start offering our rates and they are doing all Market.",
    "Discussed with Sales, and he advised that there is no much inquiries, our rates has been offered and advised to offer if there is any inquiries. Requested him to support us and push for more business from their side. Also one Room only booking has been confimred for today.",
    "Discussed with Sales incharge, and she advised that still they didn't fully operation, however our summer rates has been given to her. Requested her to offer rates whenever there is inquiries.",
    "Discussed with Sales person and Discussed with him for the summer and winter rates, he advised that rates were loaded on their portal, and hopefully from {month} we can except group and FIT bookings from them.",
    "Discussed with sales person for the upcoming business and she advised that {market} market not started yet, however they have one inquiry for {month} and rates has been offered {rate} and she advised that sent to agency and waiting for the update. Also special rates has been given for FIT and request to support.",
    "Discussed with admin, and she advised that now only start receiving booking for their staff and she will offer our rates. Currently one room booked for {month} with the rates of {rate}.",
    "Discussed with MD of the company, and he advised {market} Market not moving still, however they will start promoting for Winter and rates has been given to them. Also he advised that he has credit request for Refund, I have informed him we can use as credit balance for future bookings.",
    "Discsed with Operation incharge they have multiple inquiry and they agreed to offer for their {market} market our hotel. No. of Pax {pax} Adults Date of Travel {traveldate} and rates has been given {rate}. waiting for their update.",
    "Discussed with our account manager, and their production increased and she advised she doing marketing for our hotel to get more bookings, and we are start receving from them. Also {month} rates has been revised and requested her to support in the same way.",
    "They have inquiry for {month} Check-in: {checkin} Check-out: {checkout} {rooms} rooms and rate has been given {rate} and waiting for the final update. Also they are requesting comp room for Atm.",
    "Summer {month} rates has been revised for them, weekends different price and weekdays different price. Requested them to load the rates as earliest and suppot us during summer."
];

// ===== GENERATE RANDOM REMARK =====
function generateRandomRemark() {
    return pick(sampleRemarks);
}

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// ===== DATA =====
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

    if (entries.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#999;padding:30px;">Click "Generate Report" to add entries</td></tr>';
        return;
    }

    const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));

    tbody.innerHTML = sorted.map(entry => `
        <tr>
            <td>${formatDate(entry.date)}</td>
            <td>${escapeHtml(entry.company)}</td>
            <td>${escapeHtml(entry.person)}</td>
            <td class="remark-cell">
                <div class="remark-text" contenteditable="true" data-id="${entry.id}" onblur="updateRemark(this)">${escapeHtml(entry.remarks)}</div>
                <div class="remark-actions">
                    <button class="btn-suggest" onclick="suggestAnother('${entry.id}')" title="Suggest another remark">🔄 Suggest Another</button>
                    <button class="row-delete" onclick="deleteEntry('${entry.id}')" title="Delete">❌</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ===== BULK GENERATE =====
document.getElementById('bulkGenerateBtn').addEventListener('click', function() {
    const date = document.getElementById('bulkDate').value;
    const bulkText = document.getElementById('bulkInput').value.trim();

    if (!bulkText) {
        alert('Please enter company names and person names');
        return;
    }

    if (!date) {
        alert('Please select a date');
        return;
    }

    // Parse lines: "Company, Person" per line
    const lines = bulkText.split(/[\n\r]+/).filter(l => l.trim());
    const entries = getEntries();

    let added = 0;
    lines.forEach(line => {
        const parts = line.split(',').map(p => p.trim());
        if (parts.length >= 2 && parts[0] && parts[1]) {
            const company = parts[0];
            const person = parts[1];
            const remark = generateRandomRemark();

            entries.push({
                id: generateId(),
                date: date,
                company: company,
                person: person,
                remarks: remark
            });
            added++;
        }
    });

    if (added === 0) {
        alert('Could not parse entries. Use format: Company Name, Person Name (one per line)');
        return;
    }

    saveEntries(entries);
    renderTable();
    document.getElementById('bulkInput').value = '';
    alert(added + ' entries generated!');
});

// ===== GENERATE BUTTON (single) =====
document.getElementById('generateBtn').addEventListener('click', function() {
    const date = document.getElementById('entryDate').value;
    const company = document.getElementById('companyName').value.trim();
    const person = document.getElementById('personName').value.trim();

    if (!company || !person) {
        alert('Please enter Company Name and Person Name');
        return;
    }

    // Generate a random remark from samples
    const remark = generateRandomRemark();

    const entry = {
        id: generateId(),
        date: date,
        company: company,
        person: person,
        remarks: remark
    };

    const entries = getEntries();
    entries.push(entry);
    saveEntries(entries);
    renderTable();

    // Clear company and person for next entry
    document.getElementById('companyName').value = '';
    document.getElementById('personName').value = '';
    document.getElementById('companyName').focus();
});

// ===== SUGGEST ANOTHER REMARK =====
function suggestAnother(id) {
    let entries = getEntries();
    const idx = entries.findIndex(e => e.id === id);
    if (idx === -1) return;

    // Get a different remark than current one
    const currentRemark = entries[idx].remarks;
    let newRemark = generateRandomRemark();
    let attempts = 0;
    while (newRemark === currentRemark && attempts < 10) {
        newRemark = generateRandomRemark();
        attempts++;
    }

    entries[idx].remarks = newRemark;
    saveEntries(entries);
    renderTable();
}

// ===== UPDATE REMARK (editable) =====
function updateRemark(el) {
    const id = el.getAttribute('data-id');
    const newText = el.innerText.trim();
    let entries = getEntries();
    const idx = entries.findIndex(e => e.id === id);
    if (idx !== -1) {
        entries[idx].remarks = newText;
        saveEntries(entries);
    }
}

// ===== DELETE ENTRY =====
function deleteEntry(id) {
    let entries = getEntries();
    entries = entries.filter(e => e.id !== id);
    saveEntries(entries);
    renderTable();
}

// ===== EXPORT EXCEL =====
document.getElementById('exportExcel').addEventListener('click', function() {
    const entries = getEntries();
    if (entries.length === 0) { alert('No entries!'); return; }

    const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));
    const data = sorted.map(entry => ({
        'Date': formatDate(entry.date),
        'Company Name': entry.company,
        'Person Name': entry.person,
        'Remarks': entry.remarks
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    ws['!cols'] = [{ wch: 12 }, { wch: 22 }, { wch: 18 }, { wch: 90 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Sales Report');

    const today = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `Daily_Sales_Report_${today}.xlsx`);
});

// ===== PRINT =====
document.getElementById('printReport').addEventListener('click', function() {
    const entries = getEntries();
    if (entries.length === 0) { alert('No entries!'); return; }

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
        <table style="width:100%;border-collapse:collapse;border:2px solid #000;">
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
    if (!confirm('Clear all entries?')) return;
    localStorage.removeItem(STORAGE_KEY);
    renderTable();
});

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('entryDate').value = today;
    document.getElementById('bulkDate').value = today;
    renderTable();
});
