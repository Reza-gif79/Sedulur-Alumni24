/**
 * Seduulur Alumni - Admin Dashboard
 */

// Admin variables
let currentSection = 'dashboard';
let selectedUnpaidAlumni = [];

// Initialize Admin Dashboard
document.addEventListener('DOMContentLoaded', function() {
    initAdminSidebar();
    initAdminClock();
    loadDashboard();
    loadAlumniTable();
    loadPaymentsTable();
    loadAgendaTable();
    loadGalleryAdmin();
    loadUpcomingAgenda();
    
    // Check auth - only if on admin page
    if (typeof isLoggedIn === 'function') {
        if (!isLoggedIn()) {
            window.location.href = 'login.html';
        }
    }
});

// Initialize Sidebar Navigation
function initAdminSidebar() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.admin-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            
            // Update active nav
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Show section
            sections.forEach(sec => sec.classList.remove('active'));
            document.getElementById(`section-${section}`).classList.add('active');
            
            currentSection = section;
            
            // Load section data
            if (section === 'dashboard') loadDashboard();
            if (section === 'alumni') loadAlumniTable();
            if (section === 'payments') loadPaymentsTable();
            if (section === 'agenda') loadAgendaTable();
            if (section === 'gallery') loadGalleryAdmin();
        });
    });
    
    // Mobile sidebar toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('adminSidebar');
    const sidebarClose = document.getElementById('sidebarClose');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.add('active');
        });
    }
    
    if (sidebarClose) {
        sidebarClose.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    }
}

// Initialize Clock
function initAdminClock() {
    const timeElement = document.getElementById('currentTime');
    if (!timeElement) return;
    
    function updateTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit' 
        };
        timeElement.textContent = now.toLocaleDateString('id-ID', options);
    }
    
    updateTime();
    setInterval(updateTime, 1000);
}

// Load Dashboard
function loadDashboard() {
    // Stats
    const alumni = getAlumni();
    const totalIncome = getTotalIncome();
    const currentMonth = new Date().toLocaleString('id-ID', { month: 'long' });
    const currentYear = new Date().getFullYear();
    const monthlyIncome = getMonthlyIncome(currentMonth, currentYear);
    const unpaidAlumni = getUnpaidAlumni(currentMonth, currentYear);
    
    document.getElementById('totalAlumni').textContent = alumni.length;
    document.getElementById('totalIncome').textContent = formatCurrency(totalIncome);
    document.getElementById('monthlyIncome').textContent = formatCurrency(monthlyIncome);
    document.getElementById('unpaidCount').textContent = unpaidAlumni.length;
    
    // Recent payments
    loadRecentPayments();
}

// Load Recent Payments
function loadRecentPayments() {
    const tableBody = document.getElementById('recentPaymentsTable');
    if (!tableBody) return;
    
    const payments = getPayments()
        .filter(p => p.status === 'paid')
        .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))
        .slice(0, 5);
    
    if (payments.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" class="text-center">Belum ada pembayaran</td></tr>';
        return;
    }
    
    tableBody.innerHTML = payments.map(payment => `
        <tr>
            <td>${payment.name || 'Tidak diketahui'}</td>
            <td>${payment.month} ${payment.year}</td>
            <td>${formatCurrency(payment.amount)}</td>
            <td><span class="status-badge paid">Lunas</span></td>
        </tr>
    `).join('');
}

// Load Upcoming Agenda in Dashboard
function loadUpcomingAgenda() {
    const container = document.getElementById('upcomingAgenda');
    if (!container) return;
    
    const agendas = getUpcomingAgendas();
    
    if (agendas.length === 0) {
        container.innerHTML = '<p class="text-center">Belum ada agenda mendatang</p>';
        return;
    }
    
    container.innerHTML = agendas.map(agenda => `
        <div class="agenda-mini">
            <div class="agenda-date-badge">
                <span class="day">${new Date(agenda.date).getDate()}</span>
                <span class="month">${new Date(agenda.date).toLocaleString('id-ID', { month: 'short' })}</span>
            </div>
            <div class="agenda-mini-info">
                <h4>${agenda.title}</h4>
                <span><i class="fas fa-map-marker-alt"></i> ${agenda.location}</span>
            </div>
        </div>
    `).join('');
}

// Load Alumni Table
function loadAlumniTable() {
    const tableBody = document.getElementById('alumniTable');
    if (!tableBody) return;
    
    const alumni = getAlumni();
    
    if (alumni.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Belum ada alumni</td></tr>';
        return;
    }
    
    tableBody.innerHTML = alumni.map((a, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${a.name}</td>
            <td>${a.email}</td>
            <td>${a.phone}</td>
            <td>${a.graduationYear}</td>
            <td>
                <div class="action-btns">
                    <button class="action-btn" onclick="editAlumni('${a.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteAlumniData('${a.id}')" title="Hapus">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Load Payments Table
function loadPaymentsTable(month = '', year = '') {
    const tableBody = document.getElementById('paymentsTable');
    if (!tableBody) return;
    
    let payments = getPayments();
    
    if (month) {
        payments = payments.filter(p => p.month === month);
    }
    if (year) {
        payments = payments.filter(p => p.year === parseInt(year));
    }
    
    payments = payments.sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate));
    
    if (payments.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" class="text-center">Belum ada pembayaran</td></tr>';
        return;
    }
    
    tableBody.innerHTML = payments.map((p, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${p.name || 'Tidak diketahui'}</td>
            <td>${p.month} ${p.year}</td>
            <td>${formatCurrency(p.amount)}</td>
            <td>${getPaymentMethodLabel(p.paymentMethod)}</td>
            <td>${formatDate(p.paymentDate)}</td>
            <td><span class="status-badge ${p.status}">${p.status === 'paid' ? 'Lunas' : 'Pending'}</span></td>
            <td>
                <div class="action-btns">
                    <button class="action-btn delete" onclick="deletePaymentData('${p.id}')" title="Hapus">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function getPaymentMethodLabel(method) {
    const labels = {
        'transfer_bca': 'Transfer BCA',
        'transfer_mandiri': 'Transfer Mandiri',
        'transfer_bni': 'Transfer BNI',
        'ewallet_dana': 'DANA',
        'ewallet_gopay': 'GoPay',
        'ewallet_ovo': 'OVO',
        'transfer': 'Transfer Bank',
        'ewallet': 'E-Wallet',
        'cash': 'Tunai'
    };
    return labels[method] || method;
}

function filterPayments() {
    const month = document.getElementById('paymentFilterMonth').value;
    const year = document.getElementById('paymentFilterYear').value;
    loadPaymentsTable(month, year);
}

// Load Agenda Table
function loadAgendaTable() {
    const tableBody = document.getElementById('agendaTable');
    if (!tableBody) return;
    
    const agendas = getAgendas().sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (agendas.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center">Belum ada agenda</td></tr>';
        return;
    }
    
    tableBody.innerHTML = agendas.map((a, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${a.title}</td>
            <td>${formatDate(a.date)}</td>
            <td>${a.location}</td>
            <td>${a.type === 'tahunan' ? 'Tahunan' : 'Bulanan'}</td>
            <td><span class="status-badge ${a.active ? 'active' : 'inactive'}">${a.active ? 'Aktif' : 'Nonaktif'}</span></td>
            <td>
                <div class="action-btns">
                    <button class="action-btn" onclick="editAgenda('${a.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteAgendaData('${a.id}')" title="Hapus">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Load Gallery Admin
function loadGalleryAdmin() {
    const grid = document.getElementById('galleryAdminGrid');
    if (!grid) return;
    
    const gallery = getGallery();
    
    if (gallery.length === 0) {
        grid.innerHTML = '<div class="empty-state"><p>Belum ada foto galeri</p></div>';
        return;
    }
    
    grid.innerHTML = gallery.map(item => `
        <div class="gallery-admin-item">
            <img src="${item.image}" alt="${item.title}">
            <div class="gallery-admin-overlay">
                <button class="action-btn delete" onclick="deleteGalleryData('${item.id}')" title="Hapus">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Modal Functions
function openAlumniModal(id = null) {
    const modal = document.getElementById('alumniModal');
    const form = document.getElementById('alumniForm');
    const title = document.getElementById('alumniModalTitle');
    
    form.reset();
    document.getElementById('alumniId').value = '';
    
    if (id) {
        const alumni = getAlumniById(id);
        if (alumni) {
            title.textContent = 'Edit Alumni';
            document.getElementById('alumniId').value = alumni.id;
            document.getElementById('alumniName').value = alumni.name;
            document.getElementById('alumniEmail').value = alumni.email;
            document.getElementById('alumniPhone').value = alumni.phone;
            document.getElementById('alumniGradYear').value = alumni.graduationYear;
            document.getElementById('alumniMajor').value = alumni.major;
            document.getElementById('alumniAddress').value = alumni.address || '';
        }
    } else {
        title.textContent = 'Tambah Alumni';
    }
    
    modal.classList.add('active');
}

function openAgendaModal(id = null) {
    const modal = document.getElementById('agendaModal');
    const form = document.getElementById('agendaForm');
    const title = document.getElementById('agendaModalTitle');
    
    form.reset();
    document.getElementById('agendaId').value = '';
    
    if (id) {
        const agenda = getAgendas().find(a => a.id === id);
        if (agenda) {
            title.textContent = 'Edit Agenda';
            document.getElementById('agendaId').value = agenda.id;
            document.getElementById('agendaTitle').value = agenda.title;
            document.getElementById('agendaDesc').value = agenda.description;
            document.getElementById('agendaDate').value = agenda.date;
            document.getElementById('agendaTime').value = agenda.time;
            document.getElementById('agendaLocation').value = agenda.location;
            document.getElementById('agendaType').value = agenda.type;
            document.getElementById('agendaActive').checked = agenda.active;
        }
    } else {
        title.textContent = 'Tambah Agenda';
    }
    
    modal.classList.add('active');
}

function openGalleryModal() {
    const modal = document.getElementById('galleryModal');
    const form = document.getElementById('galleryForm');
    form.reset();
    modal.classList.add('active');
}

// Form Submissions
document.getElementById('alumniForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const id = document.getElementById('alumniId').value;
    const alumni = {
        name: document.getElementById('alumniName').value,
        email: document.getElementById('alumniEmail').value,
        phone: document.getElementById('alumniPhone').value,
        graduationYear: parseInt(document.getElementById('alumniGradYear').value),
        major: document.getElementById('alumniMajor').value,
        address: document.getElementById('alumniAddress').value,
        joinDate: new Date().toISOString().split('T')[0]
    };
    
    if (id) {
        updateAlumni(id, alumni);
    } else {
        addAlumni(alumni);
    }
    
    closeModal('alumniModal');
    loadAlumniTable();
    loadDashboard();
});

document.getElementById('agendaForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const id = document.getElementById('agendaId').value;
    const agenda = {
        title: document.getElementById('agendaTitle').value,
        description: document.getElementById('agendaDesc').value,
        date: document.getElementById('agendaDate').value,
        time: document.getElementById('agendaTime').value,
        location: document.getElementById('agendaLocation').value,
        type: document.getElementById('agendaType').value,
        active: document.getElementById('agendaActive').checked,
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'
    };
    
    if (id) {
        updateAgenda(id, agenda);
    } else {
        addAgenda(agenda);
    }
    
    closeModal('agendaModal');
    loadAgendaTable();
    loadUpcomingAgenda();
});

document.getElementById('galleryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const gallery = {
        title: document.getElementById('galleryTitle').value,
        description: document.getElementById('galleryDesc').value,
        category: document.getElementById('galleryCategory').value,
        image: document.getElementById('galleryUrl').value
    };
    
    addGallery(gallery);
    
    closeModal('galleryModal');
    loadGalleryAdmin();
});

// Delete Functions
function deleteAlumniData(id) {
    if (confirm('Apakah Anda yakin ingin menghapus alumni ini?')) {
        deleteAlumni(id);
        loadAlumniTable();
        loadDashboard();
    }
}

function deletePaymentData(id) {
    if (confirm('Apakah Anda yakin ingin menghapus pembayaran ini?')) {
        deletePayment(id);
        loadPaymentsTable();
        loadDashboard();
        loadRecentPayments();
    }
}

function deleteAgendaData(id) {
    if (confirm('Apakah Anda yakin ingin menghapus agenda ini?')) {
        deleteAgenda(id);
        loadAgendaTable();
        loadUpcomingAgenda();
    }
}

function deleteGalleryData(id) {
    if (confirm('Apakah Anda yakin ingin menghapus foto ini?')) {
        deleteGallery(id);
        loadGalleryAdmin();
    }
}

// Edit Functions
function editAlumni(id) {
    openAlumniModal(id);
}

function editAgenda(id) {
    openAgendaModal(id);
}

// AI WhatsApp Reminder Functions
function searchUnpaid() {
    const month = document.getElementById('reminderMonth').value;
    const year = document.getElementById('reminderYear').value;
    
    selectedUnpaidAlumni = getUnpaidAlumni(month, year);
    
    const list = document.getElementById('unpaidList');
    const badge = document.getElementById('unpaidCountBadge');
    
    badge.textContent = `${selectedUnpaidAlumni.length} alumni belum membayar`;
    
    if (selectedUnpaidAlumni.length === 0) {
        list.innerHTML = '<div class="empty-state"><i class="fas fa-check-circle"></i><p>Semua alumni sudah membayar!</p></div>';
        document.getElementById('messagePreview').style.display = 'none';
        return;
    }
    
    list.innerHTML = selectedUnpaidAlumni.map(alumni => `
        <div class="unpaid-item">
            <div class="unpaid-info">
                <h4>${alumni.name}</h4>
                <span>${alumni.phone}</span>
            </div>
            <input type="checkbox" class="select-alumni" value="${alumni.id}" checked>
        </div>
    `).join('');
    
    // Show message preview
    showMessagePreview(month, year);
}

function showMessagePreview(month, year) {
    const preview = document.getElementById('messagePreview');
    const message = document.getElementById('aiMessage');
    
    const sampleAlumni = selectedUnpaidAlumni[0] || { name: '[Nama Alumni]', phone: '[No. Telp]' };
    
    const messageTemplate = `Halo ${sampleAlumni.name}! 👋

Saya dari Tim Seduulur Alumni ingin mengingatkan bahwa iuran kas bulan ${month} ${year} sebesar Rp 50.000 belum kami terima. 

Bantuan Anda sangat berarti untuk keberlangsungan acara-alumni kita. 

Silakan melakukan pembayaran melalui:
- Transfer BCA: 1234 5678 9012 (Seduulur Alumni)
- DANA: 0812 3456 7890

Terima kasih atas perhatiannya! 🙏

Salam hangat,
Tim Seduulur Alumni`;

    message.value = messageTemplate;
    preview.style.display = 'block';
}

function editMessage() {
    // Allow editing is already enabled via textarea
    alert('Anda dapat mengedit pesan di textarea di bawah.');
}

function sendReminders() {
    const checkboxes = document.querySelectorAll('.select-alumni:checked');
    const selectedIds = Array.from(checkboxes).map(cb => cb.value);
    const alumniToRemind = selectedUnpaidAlumni.filter(a => selectedIds.includes(a.id));
    
    if (alumniToRemind.length === 0) {
        alert('Pilih alumni yang ingin dikirimi pesan terlebih dahulu!');
        return;
    }
    
    const message = document.getElementById('aiMessage').value;
    
    // Open WhatsApp for each selected alumni
    alumniToRemind.forEach((alumni, index) => {
        setTimeout(() => {
            const phone = alumni.phone.replace(/[^0-9]/g, '');
            // Add country code for Indonesia
            const waPhone = phone.startsWith('62') ? phone : '62' + phone.substring(1);
            const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(message)}`;
            window.open(waUrl, '_blank');
        }, index * 1500); // Stagger to avoid blocking
    });
    
    alert(`Membuka WhatsApp untuk ${alumniToRemind.length} alumni...`);
}

// Utility
function formatDate(dateString) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}
