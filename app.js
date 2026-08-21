// ===== Daily Sales Report Generator =====

const STORAGE_KEY = 'salesReportEntries';

// Get entries from localStorage
function getEntries() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

// Save entries to localStorage
function saveEntries(entries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    renderEntries();
}

// Format date to display format (e.g., "13th Aug")
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

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Render entries list (quick view)
function renderEntries() {
    const entries = getEntries();
    const container = document.getElementById('entriesList');
    const countEl = document.getElementById('entryCount');
    
    countEl.textContent = entries.length;
    
    if (entries.length === 0) {
        container.innerHTML = '<p class="no-data">No entries yet. Add entries above to generate a report.</p>';
        return;
    }
    
    // Sort by date (newest first)
    const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    container.innerHTML = sorted.map(entry => `
        <div class="entry-item">
            <span class="entry-date">${formatDate(entry.date)}</span>
            <span class="entry-company">${escapeHtml(entry.company)}</span>
            <span class="entry-person">${escapeHtml(entry.person)}</span>
            <span class="entry-remarks" title="${escapeHtml(entry.remarks)}">${escapeHtml(entry.remarks)}</span>
            <button class="entry-delete" onclick="deleteEntry('${entry.id}')" title="Delete">🗑️</button>
        </div>
    `).join('');
}

// Add new entry
document.getElementById('reportForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const entry = {
        id: generateId(),
        date: document.getElementById('entryDate').value,
        company: document.getElementById('companyName').value.trim(),
        person: document.getElementById('personName').value.trim(),
        remarks: document.getElementById('remarks').value.trim()
    };
    
    const entries = getEntries();
    entries.push(entry);
    saveEntries(entries);
    
    // Reset form but keep date
    const dateVal = document.getElementById('entryDate').value;
    this.reset();
    document.getElementById('entryDate').value = dateVal;
    
    showNotification('Entry added! ✅');
});

// Delete entry
function deleteEntry(id) {
    if (!confirm('Delete this entry?')) return;
    let entries = getEntries();
    entries = entries.filter(e => e.id !== id);
    saveEntries(entries);
    showNotification('Entry deleted! 🗑️');
}

// Clear all
document.getElementById('clearAll').addEventListener('click', function() {
    if (!confirm('⚠️ Delete ALL entries? This cannot be undone!')) return;
    localStorage.removeItem(STORAGE_KEY);
    renderEntries();
    document.getElementById('reportPreview').style.display = 'none';
    showNotification('All entries cleared!');
});

// ===== GENERATE REPORT =====
document.getElementById('generateReport').addEventListener('click', function() {
    const entries = getEntries();
    
    if (entries.length === 0) {
        alert('No entries to generate report! Please add some entries first.');
        return;
    }
    
    const title = document.getElementById('reportTitle').value || 'Daily Sales Visit Report';
    const reportHtml = generateReportHTML(entries, title);
    
    document.getElementById('reportOutput').innerHTML = reportHtml;
    document.getElementById('reportPreview').style.display = 'block';
    
    // Scroll to preview
    document.getElementById('reportPreview').scrollIntoView({ behavior: 'smooth' });
    showNotification('Report generated! 📄');
});

// Close preview
document.getElementById('closePreview').addEventListener('click', function() {
    document.getElementById('reportPreview').style.display = 'none';
});

// Generate report HTML (matching sample format exactly)
function generateReportHTML(entries, title) {
    // Group entries by date
    const grouped = {};
    entries.forEach(entry => {
        if (!grouped[entry.date]) {
            grouped[entry.date] = [];
        }
        grouped[entry.date].push(entry);
    });
    
    // Sort dates (newest first)
    const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));
    
    let rows = '';
    sortedDates.forEach(date => {
        grouped[date].forEach(entry => {
            rows += `
                <tr>
                    <td>${formatDate(entry.date)}</td>
                    <td>${escapeHtml(entry.company)}</td>
                    <td>${escapeHtml(entry.person)}</td>
                    <td>${escapeHtml(entry.remarks)}</td>
                </tr>
            `;
        });
    });
    
    return `
        <div class="report-title">${escapeHtml(title)}</div>
        <table class="report-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Company Name</th>
                    <th>Person Name</th>
                    <th>Remarks</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
    `;
}

// ===== EXPORT TO EXCEL =====
document.getElementById('exportExcel').addEventListener('click', function() {
    const entries = getEntries();
    
    if (entries.length === 0) {
        alert('No entries to export! Please add some entries first.');
        return;
    }
    
    // Sort by date (newest first)
    const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Prepare data
    const excelData = sorted.map(entry => ({
        'Date': formatDate(entry.date),
        'Company Name': entry.company,
        'Person Name': entry.person,
        'Remarks': entry.remarks
    }));
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Set column widths
    ws['!cols'] = [
        { wch: 12 },   // Date
        { wch: 22 },   // Company Name
        { wch: 18 },   // Person Name
        { wch: 80 }    // Remarks
    ];
    
    XLSX.utils.book_append_sheet(wb, ws, 'Sales Report');
    
    // Generate filename with date range
    const title = document.getElementById('reportTitle').value || 'Sales_Report';
    const today = new Date().toISOString().split('T')[0];
    const fileName = `${title.replace(/\s+/g, '_')}_${today}.xlsx`;
    
    XLSX.writeFile(wb, fileName);
    showNotification('Excel file downloaded! 📥');
});

// ===== PRINT REPORT =====
document.getElementById('printReport').addEventListener('click', function() {
    const entries = getEntries();
    
    if (entries.length === 0) {
        alert('No entries to print! Please add some entries first.');
        return;
    }
    
    const title = document.getElementById('reportTitle').value || 'Daily Sales Visit Report';
    const reportHtml = generateReportHTML(entries, title);
    
    // Set print area
    document.getElementById('printArea').innerHTML = reportHtml;
    
    // Trigger print
    window.print();
    
    showNotification('Print dialog opened! 🖨️');
});

// ===== NOTIFICATIONS =====
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

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', function() {
    // Set default date to today
    document.getElementById('entryDate').value = new Date().toISOString().split('T')[0];
    
    // Render existing entries
    renderEntries();
});
