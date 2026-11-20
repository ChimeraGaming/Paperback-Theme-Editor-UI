/* ==============================
   PREVIEW CONTENT
   ============================== */

const titles = ['The Quiet Sea', 'Last Train Home', 'A Small Garden', 'Night Letters', 'The Long Summer', 'Northern Lights'];
const tokens = text => `data-colors="${text}"`;

// These small line icons are drawn here so the preview needs no icon package.
const paths = {
  home: '<path d="m3 11 9-8 9 8M5 10v11h5v-7h4v7h5V10"/>',
  search: '<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>',
  library: '<rect x="3" y="4" width="4" height="17" rx="1"/><rect x="10" y="3" width="4" height="18" rx="1"/><path d="m17 5 4-1 3 16-4 1z"/>',
  history: '<circle cx="12" cy="12" r="9"/><path d="M12 5v7H6"/>',
  settings: '<path d="m9 3 1-2h4l1 2 3 2 2 .5 2 3-1 2v3l1 2-2 3-2 .5-3 2-1 2h-4l-1-2-3-2-2-.5-2-3 1-2v-3l-1-2 2-3L6 5z"/><circle cx="12" cy="12" r="4"/>',
  share: '<path d="M8 8H4v13h16V8h-4M12 15V2m-4 4 4-4 4 4"/>',
  back: '<path d="m15 4-8 8 8 8"/>',
  more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 17v5h16v-5"/>',
  close: '<path d="m5 5 14 14M5 19 19 5"/>',
  theme: '<path d="m15 2 7 7-8 8-7-7zM7 10l-5 9 3 3 9-5M3 18l3 3"/>',
  extension: '<path d="M3 3h7a3 3 0 1 1 4 0h7v7a3 3 0 1 0 0 4v7h-7a3 3 0 1 0-4 0H3v-7a3 3 0 1 0 0-4z"/>',
  cloud: '<path d="M6 19a5 5 0 0 1-1-10 7 7 0 0 1 13-2 6 6 0 0 1 0 12z"/>',
  code: '<path d="m8 5-6 7 6 7m8-14 6 7-6 7M14 2l-4 20"/>'
};
function icon(name) {
  return `<svg viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
}

function cover(index) {
  return `<div class="cover cover-${index + 1}" aria-hidden="true"><small>VOLUME ${index + 1}</small><span>${titles[index]}</span><small>FIELD EDITIONS</small></div>`;
}

function unloadedBooks(indexes) {
  return indexes.map(index => `<div><div class="unloaded-cover" aria-label="Cover unavailable">U</div><p class="book-title" ${tokens('accent')}>${titles[index]}</p></div>`).join('');
}

/* ==============================
   HOME AND LIBRARY
   ============================== */

function homeScreen() {
  return `<div class="home-heading" ${tokens('accent')}>Home<span class="round-control">${icon('more')}</span></div>
    <div class="source-tabs" ${tokens('separator text')}><span class="source-selected" ${tokens('secondary secondaryText')}>${icon('home')} Home</span><span>Source One</span><span>Source Two</span></div>
    <section class="home-section"><p class="source-label" ${tokens('accent')}>Source One</p><h4 ${tokens('accent')}>Popular<i class="preview-chevron" aria-hidden="true"></i></h4><div class="shelf">${unloadedBooks([0, 1, 2])}</div></section>
    <section class="home-section"><p class="source-label" ${tokens('accent')}>Source One</p><h4 ${tokens('accent')}>Most Bookmarked: Weekly<i class="preview-chevron" aria-hidden="true"></i></h4><p class="sort-label" ${tokens('text')}>Sort by: None</p><div class="shelf">${unloadedBooks([3, 4, 5])}</div></section>`;
}

function libraryScreen() {
  const unread = [198, 557, 1, 131, 113, 94, 795, 115, 55];
  return `<div class="home-heading" ${tokens('accent')}>Library<span class="round-control library-download" ${tokens('text separator')}>${icon('download')}</span><span class="round-control">${icon('more')}</span></div>
    ${searchField()}
    <div class="source-tabs library-categories" ${tokens('text separator')}><span>All</span><span class="source-selected" ${tokens('secondary secondaryText')}>Uncategorized</span><span>Novel</span><span>Comic</span></div>
    <div class="shelf library-shelf">${unread.map((count, index) => `<div class="library-book"><div class="library-cover">${cover(index % titles.length)}<span class="unread-count" ${tokens('accent primaryText')}>${count}</span></div><p class="book-title" ${tokens('accent')}>${titles[index % titles.length]}</p><p class="book-meta" ${tokens('text')}>${count} unread</p></div>`).join('')}</div>`;
}

/* ==============================
   SEARCH
   ============================== */

function searchField() {
  return `<div class="preview-search" ${tokens('background textSecondary separator')}>${icon('search')} Search</div>`;
}

function searchScreen() {
  const sources = ['Source One', 'Source Two', 'Source Three', 'Source Four', 'Source Five', 'Source Six', 'Source Seven', 'Source Eight'];
  return `<div class="home-heading" ${tokens('accent')}>Search</div>${searchField()}
    <h4 class="advanced-heading" ${tokens('accent')}>Advanced Search</h4>
    <div class="search-sources">${sources.map((name, index) => `<div class="search-source" ${tokens('foreground')}><span class="source-mark source-mark-${index % 3}" aria-hidden="true">${String.fromCharCode(65 + index)}</span><div><p ${tokens('accent')}>${name}</p><small ${tokens('text')}>v1.0.0 · Sample extension</small></div><i class="preview-chevron" ${tokens('accent')} aria-hidden="true"></i></div>`).join('')}</div>`;
}

/* ==============================
   TITLE DETAILS
   ============================== */

function detailsScreen() {
  return `<section class="title-hero" ${tokens('foreground')}>
    <div class="title-tools"><span class="round-control" ${tokens('background text separator')}>${icon('back')}</span><span class="round-control" ${tokens('background text separator')}>${icon('share')}</span></div>
    <div class="hero-cover">${cover(0)}</div>
    <h4 ${tokens('accent')}>The Quiet Sea</h4><p class="author" ${tokens('textSecondary')}>A. Rivers</p>
    <div class="title-facts"><div><span ${tokens('accent')}>Ongoing</span><small ${tokens('text')}>STATUS</small></div><div><span ${tokens('accent')}>Everyone</span><small ${tokens('text')}>AUDIENCE</small></div></div>
    <div class="title-actions"><div class="sample-primary" ${tokens('primary primaryText')}><strong>Continue</strong><small>Ch. 12 · Page 8</small></div><div class="sample-secondary" ${tokens('secondary secondaryText')}>${icon('library')} In Library</div></div>
    <div class="tablet-tracking"><h5 ${tokens('text')}>Tracking</h5><div class="sample-secondary" ${tokens('secondary secondaryText')}>2 Trackers Available</div></div>
    <h5 ${tokens('accent')}>About</h5><p class="app-description" ${tokens('text')}>A letter arrives in a seaside town. For the first time in years, someone has a reason to return.</p>
    <div class="genre-tags" ${tokens('secondary secondaryText')}><span>Adventure</span><span>Drama</span><span>Mystery</span></div>
    </section><section class="chapters"><h4 ${tokens('text')}>24 Chapters</h4><p class="book-meta" ${tokens('textSecondary')}>From Source One · 12 read · 12 new</p>
    <div class="tablet-sources source-tabs"><span class="source-selected" ${tokens('secondary secondaryText')}>Source One</span><span ${tokens('text separator')}>Source Two</span><span ${tokens('text separator')}>Manage</span></div>
    ${[24, 23, 22, 21, 20, 19, 18, 17].map((n, index) => `<div class="chapter-row" ${tokens('separator')}><p ${tokens('accent')}>Chapter ${n}</p><small ${tokens('textSecondary')}>Sample group · en <span>${index + 1}d</span></small></div>`).join('')}</section>`;
}

/* ==============================
   SETTINGS
   ============================== */

function settingsScreen() {
  const rows = [['settings', 'General Settings'], ['theme', 'Theme Settings'], ['extension', 'Extensions'], ['history', 'Backup and Restore'], ['cloud', 'iCloud Sync'], ['code', 'Developer']];
  return `<div class="settings-brand"><div class="sample-app-mark" aria-hidden="true">pb</div><h4 ${tokens('accent')}>Paperback</h4><p ${tokens('text')}>Layout reference: v0.9-r217</p></div>
    <p class="sample-heading" ${tokens('textSecondary')}>General</p>
    <div class="settings-group" ${tokens('foreground')}>${rows.map(([symbol, name]) => `<div class="settings-row" ${tokens('separator accent')}>${icon(symbol)}<span>${name}</span><i aria-hidden="true"></i></div>`).join('')}</div>`;
}

/* ==============================
   PHONE FRAME
   ============================== */

export function previewMarkup(screen, loading) {
  const active = screen === 'details' ? 'home' : screen;
  const nav = [['home', 'Home'], ['search', 'Search'], ['library', 'Library'], ['history', 'History'], ['settings', 'Settings']];
  return `<div class="phone-status" ${tokens('text')}><span>9:41</span><span class="camera-cutout" aria-hidden="true"></span><span>Wi-Fi 100%</span></div>
    <div class="phone-scroll" tabindex="0" role="region" aria-label="Scrollable app screen" ${tokens('background')}>
    ${{home: homeScreen, library: libraryScreen, search: searchScreen, details: detailsScreen, settings: settingsScreen}[screen]()}
    ${loading ? `<div class="loading-layer" ${tokens('overlay')}><strong ${tokens('foreground text separator')}>Fetching updates...</strong></div>` : ''}</div>
    <div class="phone-bottom"><div class="reading-bar" ${tokens('background separator')}><div><strong ${tokens('accent')}>The Quiet Sea</strong><small ${tokens('text')}>Ch. 12 · Page 8</small></div><span ${tokens('accent')}>${icon('close')}</span></div>
    <div class="app-nav" ${tokens('background separator text')}>${nav.map(([symbol, label]) => `<span class="${symbol === active ? 'active' : ''}" ${tokens(symbol === active ? 'accent foreground' : 'text')}>${icon(symbol)}<small>${label}</small></span>`).join('')}</div></div>`;
}
