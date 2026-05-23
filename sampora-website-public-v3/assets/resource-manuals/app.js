const IMAGES = window.SAMPORA_IMAGES;
const DATA = window.SAMPORA_CONTENT;
const UI = window.SAMPORA_UI;
const RESOURCE_UI = {
  en: {
    brand: 'Online Sample Operations Platform',
    demo: 'View manuals',
    search: 'Search manuals',
    searchTitle: 'Search manuals',
    no: 'No manuals found',
    quick: 'Quick start',
    screenshotsTitle: 'Screenshots',
    cat: 'Categories',
    branches: 'Manuals',
    back: 'Back to category view',
    footer: '© 2026 Anhui Jiayu Enterprise Service Co., Ltd. | 安徽省嘉禹企业服务有限公司'
  },
  zh: {
    brand: '在线样本运营平台',
    demo: '查看手册',
    search: '搜索手册',
    searchTitle: '搜索手册',
    no: '未找到手册',
    quick: '快速开始',
    screenshotsTitle: '截图',
    cat: '分类',
    branches: '手册',
    back: '返回分类视图',
    footer: '© 2026 Anhui Jiayu Enterprise Service Co., Ltd. | 安徽省嘉禹企业服务有限公司'
  },
  hi: {
    brand: 'Online Sample Operations Platform',
    demo: 'View manuals',
    search: 'Search manuals',
    searchTitle: 'Search manuals',
    no: 'No manuals found',
    quick: 'Quick start',
    screenshotsTitle: 'Screenshots',
    cat: 'Categories',
    branches: 'Manuals',
    back: 'Back to category view',
    footer: '© 2026 Anhui Jiayu Enterprise Service Co., Ltd. | 安徽省嘉禹企业服务有限公司'
  }
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

let lang = (() => {
  try {
    const v = localStorage.getItem('sampora_lang') || 'en';
    return UI && UI[v] ? v : 'en';
  } catch (e) {
    return 'en';
  }
})();
let currentDoc = (() => {
  try {
    return localStorage.getItem('sampora_docs_doc') || 'config';
  } catch (e) {
    return 'config';
  }
})();
let currentCategory = null;
let currentArticle = null;

const damagedText = (v, targetLang = '') => {
  if (typeof v !== 'string') return true;
  const t = v.trim();
  if (!t) return true;
  if (/^\?+$/.test(t)) return true;
  if (/\?{3,}/.test(t)) return true;
  if (/^[\s!?.,;:()\[\]{}\-_/\\]+$/.test(t)) return true;
  if (/[\uFFFD\u00C3\u00C2]/.test(t)) return true;
  if (/\u00E2\u20AC/.test(t)) return true;
  if (/[脳鈱漏\uFFFD]/.test(t)) return true;
  if (/[鍦鎵鏌瀹婧閰惧湴弸櫙朓]/.test(t)) return true;
  if (/銆|€/.test(t)) return true;
  if (targetLang === 'zh') return !/[\u3400-\u9FFF]/.test(t);
  if (targetLang === 'hi' && /[\u3400-\u9FFF]/.test(t.replace(/安徽省嘉禹企业服务有限公司/g, ''))) return true;
  return false;
};
const clean = (v, targetLang = '') => damagedText(v, targetLang) ? '' : v;
const u = (k) => clean(UI[lang]?.[k], lang) || clean(RESOURCE_UI[lang]?.[k], lang) || clean(UI.en?.[k], 'en') || clean(RESOURCE_UI.en?.[k], 'en') || '';
const uiList = (k) => {
  const source = Array.isArray(UI[lang]?.[k]) ? UI[lang][k] : UI.en?.[k] || [];
  return source.map((v, i) => clean(v, lang) || clean(UI.en?.[k]?.[i], 'en') || '');
};
const tr = (o) => clean(o?.[lang], lang) || clean(o?.en, 'en') || '';
const hasDoc = (id) => DATA.docs.some((d) => d.id === id);
const doc = (id) => DATA.docs.find((d) => d.id === id) || DATA.docs[0];
const art = (id) => DATA.articles[id];
const CATEGORY_ALIASES = { 'ops-station': 'ops-logs' };
const categoryId = (id) => CATEGORY_ALIASES[id] || id;
const cat = (id) => DATA.docs.flatMap((d) => d.categories.map((c) => ({ ...c, doc: d.id }))).find((c) => c.id === categoryId(id));
const DOC_ANCHORS = { config: 'configuration-guide', ops: 'operation-manual' };
const DEEP_LINK_TARGETS = {
  'configuration-guide': { doc: 'config' },
  'operation-manual': { doc: 'ops' },
  'rollout-notes': { rollout: true }
};
const ROLLOUT_NOTES = {
  en: {
    badge: 'Regional rollout',
    title: 'Rollout notes',
    desc: 'Prepare a Sampora launch with roles, permissions, admin entries, and a launch checklist before teams open live sample operations.',
    items: [
      ['01', 'Launch preparation', 'Confirm project countries, sample sources, domains, notification paths, and settlement rules before opening the workspace.'],
      ['02', 'Roles/permissions', 'Assign tenant admin, operations, finance, supplier, and reviewer roles with least-privilege access.'],
      ['03', 'Admin entries', 'Create organization, department, employee, supplier, and survey execution site admin entries before launch.'],
      ['04', 'Launch checklist', 'Run login, project intake, supplier allocation, callback, review, settlement, and export-control checks before go-live.']
    ]
  },
  zh: {
    badge: '区域上线',
    title: '上线说明',
    desc: '在团队进入正式样本运营前，先完成 Sampora 上线准备、角色权限、管理入口和上线清单。',
    items: [
      ['01', '上线准备', '上线前确认项目国家、样本来源、域名、通知路径和结算规则。'],
      ['02', '角色与权限', '为租户管理员、运营、财务、供应商和审核人员分配最小权限。'],
      ['03', '管理入口', '上线前建立组织、部门、员工、供应商和执行站点管理入口。'],
      ['04', '上线清单', '正式上线前检查登录、项目接收、供应商分配、回调、审核、结算和导出权限。']
    ]
  },
  hi: {
    badge: 'क्षेत्रीय रोलआउट',
    title: 'रोलआउट नोट्स',
    desc: 'Sampora launch से पहले भूमिकाएं, अनुमतियां, व्यवस्थापक प्रविष्टियां और लॉन्च जांच-सूची तैयार करें।',
    items: [
      ['01', 'लॉन्च तैयारी', 'लॉन्च से पहले प्रोजेक्ट देश, सैंपल स्रोत, डोमेन, सूचना मार्ग और सेटलमेंट नियम पुष्टि करें।'],
      ['02', 'भूमिकाएं और अनुमतियां', 'टेनेंट व्यवस्थापक, संचालन, फाइनेंस, सप्लायर और समीक्षा भूमिकाओं को न्यूनतम अनुमतियों के साथ दें।'],
      ['03', 'व्यवस्थापक प्रविष्टियां', 'संगठन, विभाग, कर्मचारी, सप्लायर और सर्वे निष्पादन साइट के व्यवस्थापक रिकॉर्ड लॉन्च से पहले बनाएं।'],
      ['04', 'लॉन्च जांच-सूची', 'लॉगिन, Project Intake, Supplier Allocation, कॉलबैक, समीक्षा, सेटलमेंट और export controls को go-live से पहले जांचें।']
    ]
  }
};

function ensureDeepLinkStyles() {
  if ($('#resourceManualDeepLinkStyles')) return;
  const style = document.createElement('style');
  style.id = 'resourceManualDeepLinkStyles';
  style.textContent = '.anchor-target{scroll-margin-top:112px}.rollout-notes{margin:34px 0 48px;border:1px solid rgba(56,210,255,.18);border-radius:24px;background:linear-gradient(180deg,rgba(14,27,47,.60),rgba(7,16,31,.40));padding:26px}.rollout-notes h2{margin:0 0 10px;font-size:34px;line-height:1.08;letter-spacing:0}.rollout-notes>p{margin:0;color:var(--body);max-width:780px}.rollout-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-top:22px}.rollout-grid article{border:1px solid rgba(129,178,214,.14);border-radius:18px;background:rgba(6,16,31,.30);padding:18px;min-height:178px}.rollout-grid span{display:inline-flex;margin-bottom:16px;color:var(--cyan2);font:800 11px var(--mono);letter-spacing:0}.rollout-grid h3{margin:0 0 8px;font-size:17px;line-height:1.18;letter-spacing:0}.rollout-grid p{margin:0;color:var(--body);font-size:13.5px;line-height:1.58}@media(max-width:1120px){.rollout-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:760px){.rollout-notes{padding:22px}.rollout-notes h2{font-size:28px}.rollout-grid{grid-template-columns:1fr}.rollout-grid article{min-height:0}}';
  document.head.appendChild(style);
}

function removeLegacyAnchorSpans() {
  Object.keys(DEEP_LINK_TARGETS).forEach((id) => {
    const el = document.getElementById(id);
    if (el && el.tagName === 'SPAN' && el.getAttribute('aria-hidden') === 'true') el.remove();
  });
}

function i18n() {
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
  $$('[data-ui]').forEach((e) => { e.innerHTML = u(e.dataset.ui); });
  $$('[data-ui-title]').forEach((e) => { e.setAttribute('title', u(e.dataset.uiTitle)); });
  $$('[data-ui-aria-label]').forEach((e) => { e.setAttribute('aria-label', u(e.dataset.uiAriaLabel)); });
  $$('input').forEach((e) => { e.placeholder = u('search'); });
  const back = $('#backToCategory');
  if (back) back.setAttribute('aria-label', u('back'));
  $$('.lang button').forEach((b) => b.classList.toggle('active', b.dataset.lang === lang));
}

function side() {
  document.getElementById('docSwitch').innerHTML = DATA.docs.map((d, i) => '<button class="doc-btn ' + (d.id === currentDoc ? 'active' : '') + '" data-doc="' + d.id + '"><i>' + (i + 1) + '</i><span><strong>' + tr(d.short) + '</strong><small>' + d.count + ' ' + u('imgs') + '</small></span><b>&rsaquo;</b></button>').join('');
  $$('.doc-btn').forEach((b) => { b.onclick = () => openDoc(b.dataset.doc); });
  const d = doc(currentDoc);
  $('#sideCategories').innerHTML = d.categories.map((c) => '<a data-category="' + c.id + '" class="' + (c.id === currentCategory ? 'active' : '') + '"><span>' + tr(c.title) + '</span><i>' + c.articles.length + '</i></a>').join('');
  $('#sideArticles').innerHTML = d.categories.flatMap((c) => c.articles).slice(0, 12).map((id) => '<a data-article="' + id + '" class="' + (id === currentArticle ? 'active' : '') + '"><span>' + tr(art(id).title) + '</span><i>&rsaquo;</i></a>').join('');
  $$('[data-category]').forEach((a) => { a.onclick = () => openCategory(a.dataset.category); });
  $$('[data-article]').forEach((a) => { a.onclick = () => openArticle(a.dataset.article); });
}

function home() {
  removeLegacyAnchorSpans();
  const chips = uiList('chips');
  const map = ['account-registration', 'domain-configuration', 'supplier-bills', 'survey-station', 'finance-multi-party-settlement', 'organization-permissions'];
  $('#popularChips').innerHTML = chips.map((c, i) => '<button class="chip" data-id="' + map[i] + '">' + c + '</button>').join('');
  $$('.chip').forEach((b) => { b.onclick = () => openArticle(b.dataset.id); });
  $('#docCards').innerHTML = DATA.docs.map((d) => {
    const anchor = DOC_ANCHORS[d.id] ? ' id="' + DOC_ANCHORS[d.id] + '"' : '';
    return '<article' + anchor + ' class="doc-card anchor-target" data-doc="' + d.id + '"><div class="k">' + tr(d.badge) + '</div><h3>' + tr(d.name) + '</h3><p>' + tr(d.desc) + '</p><div class="meta"><span class="pill amber">' + d.count + ' ' + u('imgs') + '</span><span class="pill">' + d.categories.length + ' ' + u('cat') + '</span></div></article>';
  }).join('');
  $$('#docCards .doc-card').forEach((c) => { c.onclick = () => openDoc(c.dataset.doc); });
  renderRolloutNotes();
  const q = ['account-registration', 'domain-configuration', 'station-supplier-config', 'project-list', 'supplier-bills', 'survey-station'].filter((id) => art(id));
  $('#quickCards').innerHTML = q.map((id, i) => '<article class="guide-card" data-article="' + id + '"><div class="icon">' + String(i + 1).padStart(2, '0') + '</div><h3>' + tr(art(id).title) + '</h3><p>' + tr(art(id).desc) + '</p></article>').join('');
  $$('.guide-card').forEach((c) => { c.onclick = () => openArticle(c.dataset.article); });
}

function renderRolloutNotes() {
  const cards = $('#docCards');
  if (!cards) return;
  let node = $('#rollout-notes');
  if (!node) {
    node = document.createElement('section');
    node.id = 'rollout-notes';
    cards.insertAdjacentElement('afterend', node);
  }
  node.className = 'rollout-notes anchor-target';
  node.setAttribute('aria-labelledby', 'rolloutNotesTitle');
  const copy = ROLLOUT_NOTES[lang] || ROLLOUT_NOTES.en;
  node.innerHTML = '<div class="k">' + copy.badge + '</div><h2 id="rolloutNotesTitle">' + copy.title + '</h2><p>' + copy.desc + '</p><div class="rollout-grid">' + copy.items.map((item) => '<article><span>' + item[0] + '</span><h3>' + item[1] + '</h3><p>' + item[2] + '</p></article>').join('') + '</div>';
}

function docView() {
  const d = doc(currentDoc);
  $('#docCrumb').textContent = tr(d.badge);
  $('#docTitle').textContent = tr(d.name);
  $('#docDesc').textContent = tr(d.desc);
  $('#categoryCards').innerHTML = d.categories.map((c) => '<article class="category-card" data-category="' + c.id + '"><div class="k">' + c.articles.length + ' ' + u('arts') + '</div><h3>' + tr(c.title) + '</h3><p>' + tr(c.desc) + '</p><div class="meta">' + c.articles.slice(0, 3).map((id) => '<span class="pill">' + tr(art(id).title) + '</span>').join('') + '</div></article>').join('');
  $$('.category-card').forEach((c) => { c.onclick = () => openCategory(c.dataset.category); });
}

function catView() {
  const c = cat(currentCategory);
  if (!c) return openDoc(currentDoc);
  currentDoc = c.doc;
  $('#categoryCrumb').textContent = tr(doc(currentDoc).short) + ' / ' + tr(c.title);
  $('#categoryTitle').textContent = tr(c.title);
  $('#categoryDesc').textContent = c.articles.length + ' ' + u('arts') + ' / ' + tr(c.desc);
  $('#articleList').innerHTML = c.articles.map((id) => {
    const a = art(id);
    return '<article class="article-card" data-article="' + id + '"><div><h3>' + tr(a.title) + ' &rarr;</h3><p>' + tr(a.desc) + '</p><div class="meta"><span class="pill">' + tr(doc(a.doc).short) + '</span><span class="pill amber">' + (a.img[1] - a.img[0] + 1) + ' ' + u('imgs') + '</span></div></div><div class="arrow">&rsaquo;</div></article>';
  }).join('');
  $$('#articleList .article-card').forEach((c) => { c.onclick = () => openArticle(c.dataset.article); });
}

function imgs(a) {
  const arr = IMAGES[a.doc] || [];
  const s = Math.max(a.img[0] - 1, 0);
  const e = Math.min(a.img[1], arr.length);
  return arr.slice(s, e);
}

function articleView() {
  const a = art(currentArticle);
  if (!a) return openDoc(currentDoc);
  currentDoc = a.doc;
  const d = doc(a.doc);
  const c = d.categories.find((x) => x.articles.includes(currentArticle));
  currentCategory = c?.id;
  $('#readerPath').textContent = tr(d.short) + ' / ' + (c ? tr(c.title) : '');
  $('#readerTitle').textContent = tr(a.title);
  $('#readerDesc').textContent = tr(a.desc);
  const im = imgs(a);
  $('#readerArticle').innerHTML = '<div class="quick"><h3>' + u('quick') + '</h3><ol>' + a.quick.map((x) => '<li>' + tr(x) + '</li>').join('') + '</ol></div><section><h3>' + tr(a.title) + '</h3><p>' + tr(a.body) + '</p></section><section><div class="gallery-tools"><h3>' + u('screenshotsTitle') + '</h3><span class="pill amber">' + im.length + ' ' + u('imgs') + '</span></div><div class="gallery">' + im.map((m, i) => '<figure class="shot"><img src="' + m.src + '" alt="' + tr(a.title) + ' image ' + (i + 1) + '" loading="lazy"><figcaption>' + tr(d.short) + ' / IMG ' + String(a.img[0] + i).padStart(3, '0') + '</figcaption></figure>').join('') + '</div></section>';
}

function search(q) {
  q = q.trim().toLowerCase();
  const rows = Object.entries(DATA.articles).filter(([, a]) => !q || [tr(a.title), tr(a.desc), tr(a.body), tr(doc(a.doc).name)].join(' ').toLowerCase().includes(q));
  $('#searchTitle').textContent = q ? '"' + q + '"' : u('searchTitle');
  $('#searchDesc').textContent = rows.length ? rows.length + ' ' + u('arts') : u('no');
  $('#searchResults').innerHTML = rows.length ? rows.map(([id, a]) => '<article class="article-card" data-article="' + id + '"><div><h3>' + tr(a.title) + ' &rarr;</h3><p>' + tr(a.desc) + '</p><div class="meta"><span class="pill">' + tr(doc(a.doc).short) + '</span></div></div><div class="arrow">&rsaquo;</div></article>').join('') : '<div class="empty">' + u('no') + '</div>';
  $$('#searchResults .article-card').forEach((c) => { c.onclick = () => openArticle(c.dataset.article); });
}

function view(id) {
  ['viewHome', 'viewDoc', 'viewCategory', 'viewArticle', 'viewSearch'].forEach((v) => $('#' + v).classList.toggle('hidden', v !== id));
}
function scrollToAnchor(id) {
  requestAnimationFrame(() => {
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ block: 'start', behavior: 'smooth' });
  });
}
function openDeepLink(id) {
  const target = DEEP_LINK_TARGETS[id];
  if (target?.doc) currentDoc = target.doc;
  currentCategory = currentArticle = null;
  view('viewHome');
  home();
  side();
  scrollToAnchor(id);
}
function openHome() {
  currentCategory = currentArticle = null;
  location.hash = 'home';
  view('viewHome');
  home();
  side();
}
function openDoc(id) {
  if (!hasDoc(id)) id = DATA.docs[0].id;
  currentDoc = id;
  currentCategory = currentArticle = null;
  try { localStorage.setItem('sampora_docs_doc', id); } catch (e) {}
  location.hash = 'doc/' + id;
  view('viewDoc');
  docView();
  side();
}
function openCategory(id) {
  if (!cat(id)) return openDoc(currentDoc);
  currentCategory = categoryId(id);
  currentArticle = null;
  location.hash = 'category/' + id;
  view('viewCategory');
  catView();
  side();
}
function openArticle(id) {
  currentArticle = id;
  const a = art(id);
  if (a) currentDoc = a.doc;
  location.hash = 'article/' + id;
  view('viewArticle');
  articleView();
  side();
  scrollTo({ top: 0, behavior: 'smooth' });
}
function openSearch(q) {
  location.hash = 'search/' + encodeURIComponent(q);
  view('viewSearch');
  search(q);
  side();
}
function route() {
  removeLegacyAnchorSpans();
  const h = location.hash.replace(/^#/, '');
  if (DEEP_LINK_TARGETS[h]) {
    openDeepLink(h);
    return;
  }
  if (!h || h === 'home') {
    view('viewHome');
    home();
    side();
    return;
  }
  const [t, ...r] = h.split('/');
  const val = decodeURIComponent(r.join('/'));
  if (t === 'doc' && hasDoc(val)) {
    currentDoc = val;
    currentCategory = currentArticle = null;
    view('viewDoc');
    docView();
  } else if (t === 'category' && cat(val)) {
    currentCategory = categoryId(val);
    currentArticle = null;
    view('viewCategory');
    catView();
  } else if (t === 'article' && art(val)) {
    currentArticle = val;
    view('viewArticle');
    articleView();
  } else if (t === 'search') {
    view('viewSearch');
    search(val);
  } else {
    view('viewHome');
    home();
  }
  side();
}
function init() {
  ensureDeepLinkStyles();
  removeLegacyAnchorSpans();
  i18n();
  home();
  docView();
  side();
  route();
  try { localStorage.setItem('sampora_lang', lang); } catch (e) {}
}

$$('.lang button').forEach((b) => {
  b.onclick = () => {
    lang = b.dataset.lang;
    try { localStorage.setItem('sampora_lang', lang); } catch (e) {}
    init();
  };
});
['globalSearch', 'sideSearch'].forEach((id) => {
  $('#' + id).onkeydown = (e) => { if (e.key === 'Enter') openSearch(e.target.value); };
  $('#' + id).oninput = (e) => { if (e.target.value.length > 1) openSearch(e.target.value); };
});
$('#backToCategory').onclick = () => currentCategory ? openCategory(currentCategory) : openDoc(currentDoc);
addEventListener('hashchange', route);
document.addEventListener('click', (e) => {
  const img = e.target.closest('.shot img');
  if (img) {
    const modal = $('#imageModal');
    $('#imageModalImg').src = img.currentSrc || img.src;
    $('#imageModalCaption').textContent = img.closest('figure')?.querySelector('figcaption')?.textContent || '';
    modal.classList.add('active');
    document.body.classList.add('image-modal-open');
  }
  if (e.target.closest('[data-close]')) closeModal();
});
function closeModal() {
  $('#imageModal').classList.remove('active');
  document.body.classList.remove('image-modal-open');
  setTimeout(() => $('#imageModalImg').removeAttribute('src'), 150);
}
$('#imageModalClose').onclick = closeModal;
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
init();
