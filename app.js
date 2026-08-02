// Translations
const translations = {
    tr: {
        appTitle: "BT Cihaz Envanteri",
        subtitle: "Bilgisayar, kullanıcı, garanti ve cihaz durumlarını tek panelden takip edin.",
        developedBy: "Geliştiren",
        totalAssets: "Toplam Cihaz",
        activeAssets: "Aktif",
        repairAssets: "Tamirde",
        warrantyExpiring: "Garanti Yaklaşıyor",
        assetFormTitle: "Cihaz Kaydı",
        assetFormSubtitle: "Yeni cihaz ekle veya listedeki cihazı düzenle.",
        resetForm: "Formu Temizle",
        deviceName: "Cihaz Adı",
        brandModel: "Marka / Model",
        serialNumber: "Seri No",
        assignedUser: "Atanan Kullanıcı",
        location: "Lokasyon",
        cpu: "İşlemci",
        ram: "RAM",
        disk: "Disk",
        warrantyEnd: "Garanti Bitiş",
        status: "Durum",
        notes: "Not",
        saveAsset: "Cihazı Kaydet",
        inventoryList: "Envanter Listesi",
        inventorySubtitle: "Arama, filtreleme, CSV export ve demo veri işlemleri.",
        loadDemo: "Demo Veri",
        exportCsv: "CSV İndir",
        searchPlaceholder: "Cihaz, kullanıcı, seri no veya lokasyon ara...",
        allStatuses: "Tüm Durumlar",
        active: "Aktif",
        inRepair: "Tamirde",
        spare: "Yedek",
        retired: "Emekli",
        device: "Cihaz",
        user: "Kullanıcı",
        hardware: "Donanım",
        warranty: "Garanti",
        action: "İşlem",
        edit: "Düzenle",
        delete: "Sil",
        noRecordsTitle: "Kayıt bulunamadı",
        noRecordsText: "Filtreleri temizleyebilir veya demo veri yükleyebilirsin.",
        warrantyExpired: "Süresi doldu",
        daysLeft: "gün kaldı"
    },
    en: {
        appTitle: "IT Asset Inventory",
        subtitle: "Track computers, assigned users, warranty dates, and device status from one dashboard.",
        developedBy: "Developed by",
        totalAssets: "Total Assets",
        activeAssets: "Active",
        repairAssets: "In Repair",
        warrantyExpiring: "Warranty Expiring",
        assetFormTitle: "Asset Record",
        assetFormSubtitle: "Add a new device or edit an existing inventory record.",
        resetForm: "Reset Form",
        deviceName: "Device Name",
        brandModel: "Brand / Model",
        serialNumber: "Serial Number",
        assignedUser: "Assigned User",
        location: "Location",
        cpu: "CPU",
        ram: "RAM",
        disk: "Disk",
        warrantyEnd: "Warranty End",
        status: "Status",
        notes: "Notes",
        saveAsset: "Save Asset",
        inventoryList: "Inventory List",
        inventorySubtitle: "Search, filter, export CSV, and load demo inventory data.",
        loadDemo: "Demo Data",
        exportCsv: "Export CSV",
        searchPlaceholder: "Search by device, user, serial number, location, model, or notes...",
        allStatuses: "All Statuses",
        active: "Active",
        inRepair: "In Repair",
        spare: "Spare",
        retired: "Retired",
        device: "Device",
        user: "User",
        hardware: "Hardware",
        warranty: "Warranty",
        action: "Action",
        edit: "Edit",
        delete: "Delete",
        noRecordsTitle: "No records found",
        noRecordsText: "Clear filters or load demo data to get started.",
        warrantyExpired: "Expired",
        daysLeft: "days left"
    }
};

const LANG_KEY = 'it-asset-inventory:language';
let currentLang = localStorage.getItem(LANG_KEY) || 'tr';

function t(key) {
    if (translations[currentLang] && translations[currentLang][key]) {
        return translations[currentLang][key];
    }
    if (translations['tr'][key]) return translations['tr'][key];
    return key;
}

function setLanguage(lang) {
    if (lang !== 'tr' && lang !== 'en') lang = 'tr';
    currentLang = lang;
    localStorage.setItem(LANG_KEY, currentLang);
    applyTranslations();
    renderTable(); 
    updateStats();
    
    document.querySelectorAll('.btn-lang').forEach(btn => {
        if (btn.getAttribute('data-lang') === currentLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function applyTranslations() {
    document.title = t('appTitle');
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.innerText = t(key);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.setAttribute('placeholder', t(key));
    });
}

// State Management
let devices = [];
const STORAGE_KEY = 'it_asset_inventory_data';

// DOM Elements
const modal = document.getElementById('device-modal');
const form = document.getElementById('device-form');
const deviceIdInput = document.getElementById('device-id');
const tableBody = document.getElementById('device-table-body');
const searchInput = document.getElementById('search-input');
const statusFilter = document.getElementById('filter-status');

// Init
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    
    // initialize lang setup (will render table internally)
    setLanguage(currentLang);
    
    // Lang Switcher Event
    document.querySelectorAll('.btn-lang').forEach(btn => {
        btn.addEventListener('click', (e) => {
            setLanguage(e.target.getAttribute('data-lang'));
        });
    });

    // Event Listeners
    form.addEventListener('submit', handleFormSubmit);
    
    // Modal Listeners
    document.getElementById('btn-add-device').addEventListener('click', () => {
        clearForm();
        openModal();
    });
    document.getElementById('btn-close-modal').addEventListener('click', closeModal);
    document.getElementById('btn-cancel-modal').addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.getElementById('btn-demo-data').addEventListener('click', loadDemoData);
    document.getElementById('btn-export-csv').addEventListener('click', exportCSV);
    searchInput.addEventListener('input', renderTable);
    statusFilter.addEventListener('change', renderTable);
});

// Modal Logic
function openModal() {
    modal.classList.add('active');
}

function closeModal() {
    modal.classList.remove('active');
}

// Utils
function generateId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2, 15);
}

function escapeHTML(str) {
    if (!str) return '';
    return str.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function saveData() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(devices));
        updateStats();
    } catch (error) {
        console.error("Local storage error:", error);
    }
}

function loadData() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            devices = JSON.parse(stored);
            
            // Migrate old Turkish statuses to internal keys
            let migrated = false;
            devices = devices.map(d => {
                if (d.status === 'Aktif') { d.status = 'active'; migrated = true; }
                else if (d.status === 'Tamirde') { d.status = 'repair'; migrated = true; }
                else if (d.status === 'Yedek') { d.status = 'spare'; migrated = true; }
                else if (d.status === 'Emekli') { d.status = 'retired'; migrated = true; }
                return d;
            });
            if (migrated) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(devices));
            }
        }
    } catch (error) {
        console.error("Local storage read error:", error);
        devices = [];
    }
}

// Logic
function handleFormSubmit(e) {
    e.preventDefault();
    
    const id = deviceIdInput.value;
    const deviceData = {
        id: id || generateId(),
        name: document.getElementById('device-name').value.trim(),
        brand: document.getElementById('device-brand').value.trim(),
        serial: document.getElementById('device-serial').value.trim(),
        user: document.getElementById('device-user').value.trim(),
        location: document.getElementById('device-location').value.trim(),
        cpu: document.getElementById('device-cpu').value.trim(),
        ram: document.getElementById('device-ram').value.trim(),
        disk: document.getElementById('device-disk').value.trim(),
        warranty: document.getElementById('device-warranty').value,
        status: document.getElementById('device-status').value, // 'active', 'repair', etc.
        notes: document.getElementById('device-notes').value.trim(),
        updatedAt: new Date().toISOString()
    };
    
    if (!deviceData.name || !deviceData.brand || !deviceData.serial || !deviceData.warranty) {
        return; // Basic validation fallback
    }

    if (id) {
        const index = devices.findIndex(d => d.id === id);
        if (index !== -1) {
            devices[index] = deviceData;
        }
    } else {
        deviceData.createdAt = new Date().toISOString();
        devices.push(deviceData);
    }
    
    saveData();
    renderTable();
    closeModal();
}

window.editDevice = function(id) {
    const device = devices.find(d => d.id === id);
    if (!device) return;
    
    deviceIdInput.value = device.id;
    document.getElementById('device-name').value = device.name || '';
    document.getElementById('device-brand').value = device.brand || '';
    document.getElementById('device-serial').value = device.serial || '';
    document.getElementById('device-user').value = device.user || '';
    document.getElementById('device-location').value = device.location || '';
    document.getElementById('device-cpu').value = device.cpu || '';
    document.getElementById('device-ram').value = device.ram || '';
    document.getElementById('device-disk').value = device.disk || '';
    document.getElementById('device-warranty').value = device.warranty || '';
    document.getElementById('device-status').value = device.status || 'active';
    document.getElementById('device-notes').value = device.notes || '';
    
    openModal();
};

window.deleteDevice = function(id) {
    if (confirm(t('delete') + '?')) { 
        devices = devices.filter(d => d.id !== id);
        saveData();
        renderTable();
    }
};

function clearForm() {
    form.reset();
    deviceIdInput.value = '';
}

function calculateWarranty(dateStr) {
    if (!dateStr) return { text: '-', class: '' };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const warrantyDate = new Date(dateStr);
    
    const diffTime = warrantyDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let formattedDate = '';
    try {
        formattedDate = warrantyDate.toLocaleDateString(currentLang === 'tr' ? 'tr-TR' : 'en-US');
    } catch(e) {
        formattedDate = dateStr;
    }
    
    if (diffDays < 0) {
        return { text: `${formattedDate} (${t('warrantyExpired')})`, class: 'warranty-warning', expiring: false, expired: true };
    } else if (diffDays <= 90) {
        return { text: `${formattedDate} (${diffDays} ${t('daysLeft')})`, class: 'warranty-approaching', expiring: true, expired: false };
    }
    
    return { text: `${formattedDate} (${diffDays} ${t('daysLeft')})`, class: '', expiring: false, expired: false };
}

function getStatusBadge(status) {
    const map = {
        'active': { textKey: 'active', class: 'badge-active', icon: 'ph-check-circle' },
        'repair': { textKey: 'inRepair', class: 'badge-repair', icon: 'ph-wrench' },
        'spare': { textKey: 'spare', class: 'badge-spare', icon: 'ph-package' },
        'retired': { textKey: 'retired', class: 'badge-retired', icon: 'ph-archive' }
    };
    const s = map[status] || map['active'];
    return `<span class="badge ${s.class}"><i class="ph ${s.icon}"></i> ${t(s.textKey)}</span>`;
}

function renderTable() {
    tableBody.innerHTML = '';
    
    const searchTerm = searchInput.value.toLowerCase();
    const statusVal = statusFilter.value;
    
    const filtered = devices.filter(d => {
        const matchSearch = (d.name || '').toLowerCase().includes(searchTerm) ||
                            (d.serial || '').toLowerCase().includes(searchTerm) ||
                            (d.user || '').toLowerCase().includes(searchTerm) ||
                            (d.location || '').toLowerCase().includes(searchTerm) ||
                            (d.brand || '').toLowerCase().includes(searchTerm) ||
                            (d.notes || '').toLowerCase().includes(searchTerm);
        
        const matchStatus = statusVal === 'all' || d.status === statusVal;
        
        return matchSearch && matchStatus;
    });
    
    if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 2rem; color: var(--text-muted)">
            <p style="font-weight: 600;">${t('noRecordsTitle')}</p>
            <p style="font-size: 0.875rem;">${t('noRecordsText')}</p>
        </td></tr>`;
        return;
    }
    
    filtered.forEach(d => {
        const tr = document.createElement('tr');
        
        const warrantyInfo = calculateWarranty(d.warranty);
        
        const hwPills = [];
        if (d.cpu) hwPills.push(`<span class="hardware-pill">${escapeHTML(d.cpu)}</span>`);
        if (d.ram) hwPills.push(`<span class="hardware-pill">${escapeHTML(d.ram)}</span>`);
        if (d.disk) hwPills.push(`<span class="hardware-pill">${escapeHTML(d.disk)}</span>`);
        
        tr.innerHTML = `
            <td>
                <span class="device-title">${escapeHTML(d.name)}</span>
                <span class="device-sub">${escapeHTML(d.brand)} • S/N: ${escapeHTML(d.serial)}</span>
            </td>
            <td>
                <span class="device-title">${escapeHTML(d.user) || '-'}</span>
                <span class="device-sub">${escapeHTML(d.location) || '-'}</span>
            </td>
            <td>
                ${hwPills.length > 0 ? hwPills.join('') : '<span class="device-sub">-</span>'}
            </td>
            <td>
                <div style="margin-bottom: 0.5rem;" class="${warrantyInfo.class}">${warrantyInfo.text}</div>
                ${getStatusBadge(d.status)}
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-secondary" onclick="editDevice('${d.id}')" title="${t('edit')}">
                        <i class="ph ph-pencil-simple"></i>
                    </button>
                    <button class="btn btn-danger" onclick="deleteDevice('${d.id}')" title="${t('delete')}">
                        <i class="ph ph-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

function updateStats() {
    const total = devices.length;
    const active = devices.filter(d => d.status === 'active').length;
    const repair = devices.filter(d => d.status === 'repair').length;
    
    let expiring = 0;
    devices.forEach(d => {
        const wInfo = calculateWarranty(d.warranty);
        if (wInfo.expiring || wInfo.expired) expiring++;
    });
    
    document.getElementById('stat-total').innerText = total;
    document.getElementById('stat-active').innerText = active;
    document.getElementById('stat-repair').innerText = repair;
    document.getElementById('stat-warranty').innerText = expiring;
}

function loadDemoData() {
    if (devices.length > 0) {
        // Confirmation dialog could use translation, but hardcoded both for simplicity
        if (!confirm('Devam edilsin mi? / Continue?')) return;
    }
    
    const today = new Date();
    
    const d1 = new Date(); d1.setDate(today.getDate() + 300);
    const d2 = new Date(); d2.setDate(today.getDate() + 45); 
    const d3 = new Date(); d3.setDate(today.getDate() + 400);
    const d4 = new Date(); d4.setDate(today.getDate() - 10); 
    
    const demoData = [
        {
            id: generateId(), name: 'LT-IST-001', brand: 'Lenovo ThinkPad T14', serial: 'PF10001',
            user: 'Ahmet Yılmaz', location: 'Merkez Ofis', cpu: 'Core i7', ram: '16GB', disk: '512GB NVMe',
            warranty: d1.toISOString().split('T')[0], status: 'active', notes: 'Yazılım departmanı', createdAt: new Date().toISOString()
        },
        {
            id: generateId(), name: 'LT-IST-002', brand: 'Dell Latitude 5420', serial: 'DL20002',
            user: 'Ayşe Demir', location: 'Kat 2', cpu: 'Core i5', ram: '8GB', disk: '256GB SSD',
            warranty: d2.toISOString().split('T')[0], status: 'active', notes: 'Garanti süresi yaklaşıyor.', createdAt: new Date().toISOString()
        },
        {
            id: generateId(), name: 'LT-SPARE-01', brand: 'HP EliteBook 840', serial: 'HP30003',
            user: '', location: 'IT Depo', cpu: 'Core i5', ram: '16GB', disk: '256GB SSD',
            warranty: d3.toISOString().split('T')[0], status: 'spare', notes: 'Format atıldı, yeni kullanıcı bekliyor.', createdAt: new Date().toISOString()
        },
        {
            id: generateId(), name: 'LT-IST-004', brand: 'Acer Swift 3', serial: 'AC40004',
            user: 'Mehmet Kaya', location: 'Şube', cpu: 'Ryzen 5', ram: '8GB', disk: '512GB SSD',
            warranty: d4.toISOString().split('T')[0], status: 'repair', notes: 'Ekran kırık, serviste.', createdAt: new Date().toISOString()
        }
    ];
    
    devices = [...devices, ...demoData];
    saveData();
    renderTable();
}

function exportCSV() {
    if (devices.length === 0) {
        alert(t('noRecordsTitle'));
        return;
    }
    
    const headers = [
        'ID', 
        t('deviceName'), 
        t('brandModel'), 
        t('serialNumber'), 
        t('assignedUser'), 
        t('location'), 
        t('cpu'), 
        t('ram'), 
        t('disk'), 
        t('warrantyEnd'), 
        t('status'), 
        t('notes')
    ];
    
    const rows = devices.map(d => {
        let statusText = d.status;
        if (d.status === 'active') statusText = t('active');
        if (d.status === 'repair') statusText = t('inRepair');
        if (d.status === 'spare') statusText = t('spare');
        if (d.status === 'retired') statusText = t('retired');
        
        return [
            d.id, d.name, d.brand, d.serial, d.user, d.location, d.cpu, d.ram, d.disk, d.warranty, statusText, d.notes
        ]
    });
    
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += headers.join(",") + "\r\n";
    
    rows.forEach(row => {
        const processedRow = row.map(col => {
            if (col === null || col === undefined) return '';
            const str = col.toString().replace(/"/g, '""'); 
            return `"${str}"`; 
        });
        csvContent += processedRow.join(",") + "\r\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    
    link.setAttribute("download", `it-asset-inventory-${yyyy}-${mm}-${dd}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
