# IT Asset Inventory Web App

## English Overview
A lightweight browser-based IT asset inventory dashboard for junior IT support and help desk workflows.

## Turkish Overview
Junior IT destek ve help desk süreçleri için geliştirilmiş, tarayıcı tabanlı BT cihaz envanteri takip paneli.

## Features
- **Dashboard Stats**: Total devices, active devices, in-repair count, and expiring warranty alerts.
- **Add/Edit Device Form**: Record detailed hardware info, assigned user, location, and warranty dates.
- **Inventory List**: Searchable and filterable data table with status badges and quick actions.
- **Warranty Tracking**: Automatic highlighting for warranties expiring within 90 days or already expired.
- **CSV Export**: Export all asset data into a CSV file (`it-asset-inventory-yyyy-MM-dd.csv`).
- **Demo Data**: Populate the application with sample data instantly to test functionality.
- **Local Storage**: All data is securely stored in your browser's LocalStorage. No database or backend required.
- **XSS Protection**: User inputs are escaped to prevent HTML injection.

## Localization / Dil Desteği

**English**: The app includes Turkish and English UI support. The selected language is saved in localStorage and restored on the next visit.

**Turkish**: Uygulama Türkçe ve İngilizce arayüz desteği içerir. Seçilen dil localStorage içinde saklanır ve sonraki ziyarette korunur.

## Folder Structure
```
it-asset-inventory/
├── index.html
├── styles.css
├── app.js
├── README.md
└── .gitignore
```

## How to Run
This project requires **no installation** or backend servers.
1. Clone the repository or download the files.
2. Double-click `index.html` to open it in any modern web browser.
3. Start managing your IT assets!

## Use Cases
- Ideal for small companies, branch offices, or specific departments lacking an enterprise asset management tool.
- Quick asset tracking for Help Desk analysts and IT Support Specialists.
- Easily manageable and portable due to its offline-first approach.

## CV Usage
**English**: 
- Built a browser-based IT asset inventory dashboard for tracking company devices, assigned users, warranty dates, hardware details, device status, and CSV inventory export.
- Implemented bilingual Turkish/English UI support with persistent language preference using localStorage.

**Türkçe**: 
- Şirket cihazları, atanmış kullanıcılar, garanti tarihleri, donanım bilgileri, cihaz durumları ve CSV envanter çıktısı için tarayıcı tabanlı IT varlık envanteri paneli geliştirdim.
- localStorage ile kalıcı dil tercihi sunan Türkçe/İngilizce arayüz desteği geliştirdim.

## Suggested GitHub Topics
`javascript`, `html`, `css`, `it-support`, `helpdesk`, `asset-management`, `inventory`, `localstorage`, `i18n`

## Author
Mert Merkit
GitHub: [https://github.com/kxgetr](https://github.com/kxgetr)
