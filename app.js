// ===== Daily Sales Report Maker =====

// Data storage using localStorage
const STORAGE_KEY = 'salesReportData';

// Get entries from localStorage
function getEntries() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

// Save entries to localStorage
function saveEntries(entries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

// Format date to display format (e.g., "13th Aug")
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const day = date.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    
    // Add ordinal suffix
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

// Render the table
function renderTable(filter = null) {
    const tbody = document.getElementById('reportBody');
    const noData = document.getElementById('noData');
    const dateLabel = document.getElementById('reportDateLabel');
    
    let entries = getEntries();
    
    // Sort by date (newest first)
    entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Apply filter
    if (filter) {
        entries = entries.filter(e => e.date === filter);
        dateLabel.textContent = `- ${formatDate(filter)}`;
    } else {
        dateLabel.textContent = '';
    }
    
    if (entries.length === 0) {
        tbody.innerHTML = '';
        noData.style.display = 'block';
        document.getElementById('reportTable').style.display = 'none';
        return;
    }
    
    noData.style.display = 'none';
    document.getElementById('reportTable').style.display = 'table';
    
    tbody.innerHTML = entries.map(entry => `
        <tr>
            <td>${formatDate(entry.date)}</td>
            <td>${escapeHtml(entry.company)}</td>
            <td>${escapeHtml(entry.person)}</td>
            <td>${escapeHtml(entry.remarks)}</td>
            <td>
                <div class="action-btns">
                    <button class="btn-edit" onclick="editEntry('${entry.id}')" title="Edit">✏️</button>
                    <button class="btn-delete" onclick="deleteEntry('${entry.id}')" title="Delete">🗑️</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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
    
    this.reset();
    // Set date to today for convenience
    document.getElementById('entryDate').value = new Date().toISOString().split('T')[0];
    
    renderTable(document.getElementById('filterDate').value || null);
    
    showNotification('Entry added successfully! ✅');
});

// Edit entry
function editEntry(id) {
    const entries = getEntries();
    const entry = entries.find(e => e.id === id);
    
    if (!entry) return;
    
    document.getElementById('editId').value = entry.id;
    document.getElementById('editDate').value = entry.date;
    document.getElementById('editCompany').value = entry.company;
    document.getElementById('editPerson').value = entry.person;
    document.getElementById('editRemarks').value = entry.remarks;
    
    document.getElementById('editModal').style.display = 'flex';
}

// Save edited entry
document.getElementById('editForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const id = document.getElementById('editId').value;
    const entries = getEntries();
    const index = entries.findIndex(e => e.id === id);
    
    if (index === -1) return;
    
    entries[index] = {
        id: id,
        date: document.getElementById('editDate').value,
        company: document.getElementById('editCompany').value.trim(),
        person: document.getElementById('editPerson').value.trim(),
        remarks: document.getElementById('editRemarks').value.trim()
    };
    
    saveEntries(entries);
    document.getElementById('editModal').style.display = 'none';
    renderTable(document.getElementById('filterDate').value || null);
    
    showNotification('Entry updated! ✅');
});

// Cancel edit
document.getElementById('cancelEdit').addEventListener('click', function() {
    document.getElementById('editModal').style.display = 'none';
});

// Close modal on outside click
document.getElementById('editModal').addEventListener('click', function(e) {
    if (e.target === this) {
        this.style.display = 'none';
    }
});

// Delete entry
function deleteEntry(id) {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    
    let entries = getEntries();
    entries = entries.filter(e => e.id !== id);
    saveEntries(entries);
    
    renderTable(document.getElementById('filterDate').value || null);
    showNotification('Entry deleted! 🗑️');
}

// Filter by date
document.getElementById('filterDate').addEventListener('change', function() {
    renderTable(this.value || null);
});

// Clear filter
document.getElementById('clearFilter').addEventListener('click', function() {
    document.getElementById('filterDate').value = '';
    renderTable(null);
});

// Export to Excel
document.getElementById('exportExcel').addEventListener('click', function() {
    let entries = getEntries();
    
    if (entries.length === 0) {
        alert('No data to export!');
        return;
    }
    
    // Apply current filter if active
    const filter = document.getElementById('filterDate').value;
    if (filter) {
        entries = entries.filter(e => e.date === filter);
    }
    
    // Sort by date
    entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Prepare data for Excel
    const excelData = entries.map(entry => ({
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
        { wch: 12 },  // Date
        { wch: 20 },  // Company Name
        { wch: 15 },  // Person Name
        { wch: 80 }   // Remarks
    ];
    
    XLSX.utils.book_append_sheet(wb, ws, 'Sales Report');
    
    // Generate filename
    const today = new Date().toISOString().split('T')[0];
    const fileName = filter 
        ? `Sales_Report_${formatDate(filter).replace(' ', '_')}.xlsx`
        : `Sales_Report_${today}.xlsx`;
    
    XLSX.writeFile(wb, fileName);
    showNotification('Excel file downloaded! 📥');
});

// Clear all data
document.getElementById('clearAll').addEventListener('click', function() {
    if (!confirm('⚠️ Are you sure you want to delete ALL report entries? This cannot be undone!')) return;
    if (!confirm('This will permanently remove all data. Continue?')) return;
    
    localStorage.removeItem(STORAGE_KEY);
    renderTable(null);
    showNotification('All data cleared! 🗑️');
});

// Notification toast
function showNotification(message) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2c3e50;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 0.95rem;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add slide-in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Set default date to today
    document.getElementById('entryDate').value = new Date().toISOString().split('T')[0];
    
    // Render existing entries
    renderTable(null);
});
