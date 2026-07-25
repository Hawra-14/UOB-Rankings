const API_BASE = location.hostname === 'localhost' || location.hostname === '127.0.0.1'
    ? 'http://localhost:3002'
    : 'https://uob-rankings.onrender.com';

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');
if (!token || user.role !== 'admin') window.location.href = 'login.html';

document.getElementById('userName').textContent = user.name || 'Admin';
document.getElementById('userAvatar').textContent = (user.name || 'AD').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

const params = new URLSearchParams(window.location.search);
const cycleId = params.get('cycle');
if (!cycleId) window.location.href = 'admin-cycles.html';
const editMode = params.get('edit') === 'true';

let departments = [];
let allQuestions = [];
let currentAssignQuestionId = null;
let isGreenMetric = false;
let activeGMTab = 'SI';
let activeImpactTab = 'SDG3: Good Health and Wellbeing';

// ── Helpers ────────────────────────────────────────────────
function toggleEditMode() {
    const btn = document.getElementById('editModeBtn');
    const banner = document.getElementById('editBanner');
    const active = btn.classList.toggle('active');
    document.body.classList.toggle('edit-mode', active);
    btn.textContent = active ? '✓ Exit Edit Mode' : '✎ Edit Mode';
    banner.style.display = active ? 'flex' : 'none';
}

function formatDate(d) {
    if (!d) return '—';
    try { const dt = new Date(d); if (isNaN(dt)) return '—'; return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { return '—'; }
}

function getStatusDot(status) {
    if (status === 'submitted') return '<span class="status-dot submitted" title="Submitted"></span>';
    if (status === 'accepted') return '<span class="status-dot accepted" title="Accepted"></span>';
    if (status === 'rejected') return '<span class="status-dot rejected" title="Rejected"></span>';
    if (status === 'queried') return '<span class="status-dot queried" title="Queried"></span>';
    if (status === 'pending') return '<span class="status-dot pending" title="Pending"></span>';
    return '<span class="status-dot" title="No Status"></span>';
}

function toggleSec(id) {
    const b = document.getElementById('body_' + id), t = document.getElementById('tog_' + id);
    const open = b.style.display !== 'none';
    b.style.display = open ? 'none' : '';
    t.innerHTML = open ? '&#9660;' : '&#9650;';
}

function switchTab(tab, type) {
    document.querySelectorAll('.def-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    if (type === 'hist') {
        const taskId = window._selectedTaskId;
        const questionId = window._selectedQuestionId;
        if (!taskId && !questionId) { document.getElementById('defBody').innerHTML = '<p style="color:var(--subtext)">No question selected.</p>'; return; }
        document.getElementById('defBody').innerHTML = '<p style="color:var(--subtext)">Loading history...</p>';
        const histUrl = taskId
            ? `${API_BASE}/api/submissions/history-all/${taskId}`
            : `${API_BASE}/api/submissions/history-by-question/${questionId}`;
        fetch(histUrl, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(r => r.json()).then(rows => {
                if (!rows.length) { document.getElementById('defBody').innerHTML = '<p style="color:var(--subtext)">No previous submissions.</p>'; return; }
                document.getElementById('defBody').innerHTML = rows.map(h => {
                    const date = h.changed_at ? new Date(h.changed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
                    let val = h.answer_text || (h.answer_number !== null ? String(h.answer_number) : '—');
                    try {
                        const parsed = JSON.parse(val);
                        if (parsed && typeof parsed === 'object') {
                            if ('ft' in parsed) {
                                // Equality grid — 2×2 layout
                                val = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:.3rem .8rem;margin-top:.2rem">
                            <div><span style="font-size:.7rem;color:var(--subtext)">Full Time</span><div style="font-weight:600">${parsed.ft}</div></div>
                            <div><span style="font-size:.7rem;color:var(--subtext)">Part Time</span><div style="font-weight:600">${parsed.pt}</div></div>
                            <div><span style="font-size:.7rem;color:var(--subtext)">HC</span><div style="font-weight:600">${parsed.hc}</div></div>
                            <div><span style="font-size:.7rem;color:var(--subtext)">FTE</span><div style="font-weight:600">${parsed.fte}</div></div>
                        </div>`;
                            } else {
                                // Multi-item — look up labels from allQuestions
                                const title = document.getElementById('defTitle').textContent;
                                const q = (window.questions || allQuestions || []).find(q => q.title === title);
                                const items = q?.items || [];
                                const lines = Object.entries(parsed).map(([idx, v]) => {
                                    const item = items[parseInt(idx)];
                                    const label = item ? item.label.split(' — ').pop() : `Field ${parseInt(idx) + 1}`;
                                    if (item?.answer_type === 'checkbox') {
                                        const ticked = v === 'yes';
                                        return `<div style="display:flex;align-items:center;gap:.4rem;margin:.2rem 0">
                                    <span style="display:inline-flex;align-items:center;justify-content:center;width:14px;height:14px;border-radius:3px;border:1.5px solid ${ticked ? 'var(--teal)' : '#d1d5db'};background:${ticked ? 'var(--teal)' : '#fff'};flex-shrink:0;font-size:.65rem;color:#fff">${ticked ? '✓' : ''}</span>
                                    <span style="font-size:.8rem;color:${ticked ? 'var(--text)' : 'var(--subtext)'}">${label}</span>
                                </div>`;
                                    }
                                    const isEmpty = !v || v === '' || v === '<p><br></p>' || v === '<p></p>';
                                    if (isEmpty && item?.answer_type !== 'url' && item?.answer_type !== 'richtext' && item?.answer_type !== 'text') return '';
                                    return `<div style="margin:.25rem 0">
                                        <div style="font-size:.7rem;color:var(--subtext);margin-bottom:.1rem">${label}</div>
                                        <div style="font-size:.8rem;color:var(--text);word-break:break-word">
                                            ${isEmpty ? '<span style="color:var(--subtext);font-style:italic">Not provided</span>' : v}
                                        </div>
                                    </div>`;
                                }).filter(Boolean).join('');
                                val = lines || '—';
                            }
                        }
                    } catch (e) { }
                    return `<div style="border-bottom:1px solid #f0f2f8;padding:.65rem 0">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.25rem">
                            <span style="font-size:.7rem;font-weight:700;background:#eef2ff;color:#3730a3;padding:.15rem .45rem;border-radius:4px">${h.year || ''}</span>
                            <span style="font-size:.7rem;color:var(--subtext)">${date}</span>
                        </div>
                        <div style="font-size:.72rem;color:var(--subtext);margin-bottom:.2rem">${h.changed_by_name || 'Unknown'}</div>
                        <div style="font-size:.8rem;color:var(--text);line-height:1.55">${val}</div>
                    </div>`;
                }).join('');
            }).catch(() => { document.getElementById('defBody').innerHTML = '<p style="color:var(--subtext)">Failed to load history.</p>'; });
    } else {
        document.getElementById('defBody').innerHTML = `<p>${window._selectedDesc || 'No definition available.'}</p>`;
    }
}

function getTableHeaderColor() {
    const name = (currentCycleName || '').toLowerCase();
    if (name.includes('qs sustainability')) return { bg: '#e8f5e9', text: '#2e7d32', border: '#a5d6a7' };
    if (name.includes('qs world university rankings')) return { bg: '#fef9e7', text: '#7a6000', border: '#f0d060' };
    if (name.includes('the world university rankings')) return { bg: '#f3e5f5', text: '#6a1b9a', border: '#ce93d8' };
    if (name.includes('the impact')) return { bg: '#fff7ed', text: '#c2410c', border: '#c2410c' };
    if (name.includes('greenmetric')) return { bg: '#e0f2f1', text: '#00695c', border: '#80cbc4' };
}

function selectRow(row) {
    document.querySelectorAll('.q-table tr.selected').forEach(r => r.classList.remove('selected'));
    row.classList.add('selected');
    const taskId = row.dataset.taskid ? parseInt(row.dataset.taskid) : null;
    const questionId = row.dataset.qid ? parseInt(row.dataset.qid) : null;
    const title = row.dataset.title || '';
    const desc = row.dataset.desc || '';
    window._selectedTaskId = taskId || null;
    window._selectedQuestionId = questionId || null;
    window._selectedDesc = desc;
    document.getElementById('defTitle').textContent = title;
    document.getElementById('defBody').innerHTML = `<p>${desc || 'No definition available.'}</p>`;
    document.querySelectorAll('.def-tab').forEach((t, i) => t.classList.toggle('active', i === 0));
}

function initQuillEditors() {
    document.querySelectorAll('[id^="quill_container_"]').forEach(container => {
        const itemId = container.id.replace('quill_container_', '');
        const toolbarId = 'quill_toolbar_' + itemId;
        const editorEl = document.getElementById(itemId);
        if (!editorEl || editorEl._quill) return;

        const q = (window.questions || allQuestions)?.find(q =>
            (q.items || []).some((_, i) => `item_${q.task_id || q.id}_${i}` === itemId)
        );
        const locked = q ? (q.task_status && q.task_status !== 'pending') : false;

        const quill = new Quill(editorEl, {
            modules: { toolbar: '#' + toolbarId },
            theme: 'snow',
            readOnly: locked
        });

        // Set existing value from the q object directly
        if (q) {
            const itemIndex = parseInt(itemId.split('_').pop());
            let savedVal = '';
            if (q.answer_text) {
                try {
                    const parsed = JSON.parse(q.answer_text);
                    if (parsed && typeof parsed === 'object') {
                        savedVal = parsed[itemIndex] ?? parsed[String(itemIndex)] ?? '';
                    }
                } catch (e) {
                    savedVal = q.answer_text;
                }
            }
            if (savedVal) quill.root.innerHTML = savedVal;
        }

        quill.on('text-change', () => {
            const wcEl = document.getElementById('wc_' + itemId);
            if (wcEl) {
                const words = quill.getText().trim().split(/\s+/).filter(w => w.length > 0).length;
                wcEl.textContent = `${words} words inserted`;
            }
            // Find the question this editor belongs to and mark dirty
            const q = (window.questions || allQuestions)?.find(q =>
                (q.items || []).some((_, i) => `item_${q.task_id || q.id}_${i}` === itemId)
            );
            if (q) markDirty(q.task_id || q.id);
        });

        editorEl._quill = quill;
    });
}

// ── Input builders (read-only for admin) ──────────────────
function buildInput(q) {
    const taskId = q.task_id || q.id;
    const items = q.items || [];
    const locked = !document.body.classList.contains('edit-mode');
    const ro = locked ? 'readonly' : '';
    const dis = locked ? 'disabled' : '';
    const ls = locked ? 'background:#f0f2f7;color:var(--subtext)' : '';

    if (items.length > 0) {
        // Parse saved multi-item answers
        let savedItems = {};
        if (q.answer_text) {
            try {
                const parsed = JSON.parse(q.answer_text);
                if (parsed && typeof parsed === 'object' && !('ft' in parsed)) {
                    savedItems = parsed; // keyed by index string e.g. {"0":"yes","4":"huydrd"}
                }
            } catch (e) {
                // Plain string — applies to single-item questions
                if (items.length === 1) savedItems = { 0: q.answer_text };
            }
        }
        // Also handle single numeric item
        if (items.length === 1 && items[0].answer_type === 'number' && q.answer_number != null && !savedItems[0]) {
            savedItems = { 0: String(q.answer_number) };
        }

        let html = '';
        let i = 0;
        while (i < items.length) {
            const item = items[i];
            const itemId = `item_${taskId}_${i}`;
            const savedVal = savedItems[i] ?? savedItems[String(i)] ?? '';
            const dirty = `onchange="markDirty(${q.task_id || q.id})" oninput="markDirty(${q.task_id || q.id})"`;

            if (item.answer_type === 'checkbox' && item.label.includes(' — ')) {
                const [groupLabel] = item.label.split(' — ');
                const groupItems = [];
                let j = i;
                while (j < items.length && items[j].answer_type === 'checkbox' && items[j].label.startsWith(groupLabel + ' — ')) {
                    groupItems.push({ item: items[j], idx: j }); j++;
                }
                if (groupItems.length > 1) {
                    if (!isGreenMetric) {
                        html += `<div class="evidence-label" style="margin-top:1.5rem;font-weight:600;color:var(--text)">${groupLabel}</div>`;
                    }
                    groupItems.forEach(({ item: gi, idx }) => {
                        const gVal = savedItems[idx] ?? savedItems[String(idx)] ?? '';
                        const checked = (gVal === 'yes' || gVal === true) ? 'checked' : '';
                        html += `<label class="check-item" style="margin-top:.25rem">
                    <input type="checkbox" class="admin-input" data-itemidx="${idx}" ${checked} ${dis}
                        onchange="markDirty(${q.task_id || q.id})"> ${gi.label.split(' — ')[1]}
                </label>`;
                    });
                    i = j; continue;
                }
            }

            switch (item.answer_type) {
                case 'checkbox': {
                    const checked = (savedVal === 'yes' || savedVal === true) ? 'checked' : '';
                    html += `<label class="check-item" style="margin-top:${i === 0 ? '.35rem' : '.9rem'};${i > 0 ? 'padding-top:.7rem;border-top:1px solid #f0f2f8;' : ''}">
                        <input type="checkbox" class="admin-input" data-itemidx="${i}" ${checked} ${dis}
                            onchange="markDirty(${q.task_id || q.id})"> ${item.label}
                    </label>`; break;
                }
                case 'radio': {
                    const checked = (savedVal === 'yes' || savedVal === true) ? 'checked' : '';
                    html += `<label class="check-item" style="margin-top:${i === 0 ? '.35rem' : '.25rem'}">
                        <input type="radio" name="radio_${taskId}" class="admin-input" data-itemidx="${i}" 
                            value="${item.label}" ${savedVal === item.label ? 'checked' : ''} ${dis}
                            onchange="markDirty(${q.task_id || q.id})"> ${item.label.includes(' — ') ? item.label.split(' — ')[1] : item.label}
                    </label>`; break;
                }
                case 'url':
                    html += `<div style="margin-bottom:.8rem">
                    <div class="evidence-label" style="margin-top:1.3rem">${item.label}</div>
                    <div class="url-wrap"><input class="url-input admin-input" type="url" data-itemidx="${i}"
                        placeholder="https://..." value="${savedVal}" style="${ls}" ${ro}
                        oninput="markDirty(${q.task_id || q.id})"/></div>
                </div>`; break;
                case 'number':
                    html += `<div style="margin-bottom:1.5rem">
                        ${isGreenMetric ? '' : `<div class="evidence-label">${item.label}</div>`}
                        <input class="txt-input admin-input" type="number" id="${itemId}" data-itemidx="${i}" value="${savedVal}" 
                            placeholder="—" style="${ls}" ${ro}
                            oninput="markDirty(${q.task_id || q.id});calcEmployment(${taskId})"/>
                    </div>`;
                    break;
                case 'richtext':
                case 'text':
                    html += `<div class="evidence-label" style="margin-top:1rem">${item.label}</div>
                    <div id="quill_container_${itemId}" style="margin-top:.3rem">
                        <div id="quill_toolbar_${itemId}">
                            <span class="ql-formats">
                                <button class="ql-bold"></button>
                                <button class="ql-italic"></button>
                                <button class="ql-underline"></button>
                                <button class="ql-strike"></button>
                                <button class="ql-script" value="super"></button>
                                <button class="ql-script" value="sub"></button>
                            </span>
                            <span class="ql-formats">
                                <button class="ql-list" value="ordered"></button>
                                <button class="ql-list" value="bullet"></button>
                            </span>
                            <span class="ql-formats">
                                <button class="ql-link"></button>
                                <button class="ql-clean"></button>
                            </span>
                        </div>
                        <div id="${itemId}" style="min-height:80px;font-size:.78rem;font-family:'DM Sans',sans-serif"></div>
                    </div>
                    ${item.max_words ? `<div style="display:flex;justify-content:space-between;font-size:.71rem;color:var(--subtext);margin-top:.2rem">
                        <span id="wc_${itemId}">0 words inserted</span>
                        <span>Maximum ${item.max_words} words</span>
                    </div>` : ''}`;
                    break;
                case 'select': {
                    const opts = (item.options || '').split(',').map(o => o.trim());
                    html += `<div class="evidence-label" style="margin-top:1rem">${item.label}</div>
                    <select class="txt-input" id="${itemId}" ${dis} style="${ls};cursor:pointer">
                        <option value="">— Select —</option>
                        ${opts.map(o => `<option value="${o}" ${savedVal === o ? 'selected' : ''}>${o}</option>`).join('')}
                    </select>`;
                    break;
                }
                case 'calculated': {
                    const idx = i;
                    // Calculate based on ES1 items: Employed/Total respondents * 100
                    html += `<div class="evidence-label" style="margin-top:1rem">${item.label}</div>
                    <input class="txt-input" type="number" id="${itemId}" placeholder="Auto-calculated" 
                        readonly style="background:#f0f2f7;color:var(--subtext)"/>`;
                    break;
                }
                default:
                    html += `<input class="txt-input admin-input" type="text" data-itemidx="${i}"
                    placeholder="—" value="${savedVal}" style="${ls}" ${ro}
                    oninput="markDirty(${q.task_id || q.id})"/>`;
            }
            i++;
        }
        return html;
    }

    // No items — single answer fallback
    switch (q.question_type) {
        case 'yesno': {
            const saved = q.answer_text || '';
            return `${isTheImpact ? '' : '<div style="font-size:.8rem;font-weight:600;color:var(--teal);margin-bottom:.3rem">Please select one option:</div>'}
            <label class="check-item"><input type="radio" name="admin_q${taskId}" value="yes" class="admin-input" ${saved === 'yes' ? 'checked' : ''} ${dis} onchange="markDirty(${taskId})"> Yes</label>
            <label class="check-item"><input type="radio" name="admin_q${taskId}" value="no" class="admin-input" ${saved === 'no' ? 'checked' : ''} ${dis} onchange="markDirty(${taskId})"> No</label>`;
        }
        case 'url':
            return `<div class="evidence-label">Link or URL:</div>
        <div class="url-wrap"><input class="url-input admin-input" type="url" placeholder="https://..." value="${q.answer_text || ''}" style="${ls}" ${ro}/><button class="btn-open-link">↗ Open</button></div>`;
        case 'number':
            return `<div class="evidence-label">Value:</div>
        <input class="txt-input admin-input" type="number" placeholder="—" value="${q.answer_number ?? ''}" style="width:200px;${ls}" ${ro}/>`;
        case 'checkbox': {
            const checked = q.answer_text === 'yes' ? 'checked' : '';
            return `<label class="check-item"><input type="checkbox" class="admin-input" ${checked} ${dis} onchange="markDirty(${taskId})"> Tick if applicable</label>`;
        }
        default:
            return `<input class="txt-input admin-input" type="text" placeholder="—" value="${q.answer_text || ''}" style="${ls}" ${ro} oninput="markDirty(${taskId})"/>`;
    }
}

function openAssignModalById(btn) {
    const qid = parseInt(btn.getAttribute('data-qid'));
    const q = allQuestions.find(q => q.id === qid);
    if (q) openAssignModal(q.id, q.title);
}

// ── Assign functions ───────────────────────────────────────
function openAssignModal(questionId, title) {
    currentAssignQuestionId = questionId;
    document.getElementById('assignModalSub').textContent = `Assigning: "${title.slice(0, 70)}${title.length > 70 ? '…' : ''}"`;
    const sel = document.getElementById('assignDept');
    sel.innerHTML = '<option value="">— Select Department —</option>' +
        departments.map(d => `<option value="${d.id}">${d.name}</option>`).join('');
    document.getElementById('assignDeadline').value = '';
    document.getElementById('assignModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}
function closeAssignModal() {
    document.getElementById('assignModal').classList.remove('show');
    document.body.style.overflow = '';
}
async function saveAssignment() {
    const deptId = document.getElementById('assignDept').value;
    const deadline = document.getElementById('assignDeadline').value;
    if (!deptId) { showAlert('Missing Field', 'Please select a department.'); return; }
    if (!deadline) { showAlert('Missing Field', 'Please select a due date.'); return; }

    const btn = document.querySelector('#assignModal .btn-yes-submit');
    btn.textContent = '...';
    btn.disabled = true;

    try {
        const res = await fetch(`${API_BASE}/api/admin/assign`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ question_id: currentAssignQuestionId, department_id: parseInt(deptId), deadline })
        });
        let data;
        try {
            data = await res.json();
        } catch (e) {
            console.error('Failed to parse response:', e);
            closeAssignModal();
            loadQuestions();
            return;
        }
        if (data.success) {
            closeAssignModal();
            const deptId = parseInt(document.getElementById('assignDept').value);
            const deptName = departments.find(d => d.id === deptId)?.name || '';
            (data.assignedIds || [currentAssignQuestionId]).forEach(qid => {
                const q = allQuestions.find(q => q.id === qid);
                if (q) {
                    q.department_id = deptId;
                    q.department_name = deptName;
                    q.task_status = 'pending';
                    q.deadline = deadline;
                }
                // Update the DOM row directly instead of re-rendering
                const row = document.querySelector(`tr[data-qid="${qid}"]`);
                if (row) {
                    // Update dept cell
                    const deptCell = row.querySelector('td:nth-last-child(2)');
                    if (deptCell) deptCell.innerHTML = `<span class="dept-tag">${deptName}</span>`;
                    // Update due date cell
                    const dueDateCell = row.querySelector('.date-cell');
                    if (dueDateCell) dueDateCell.textContent = formatDate(deadline);
                    // Update action button to reassign
                    const actionCell = row.querySelector('.action-col');
                    if (actionCell) actionCell.innerHTML = `<button class="btn-reassign" data-qid="${qid}" onclick="event.stopPropagation();openAssignModalById(this)" title="Reassign">&#8634;</button>`;
                    // Update status dot
                    const statusCell = row.querySelector('.status-cell');
                    if (statusCell) {
                        const saveBtn = statusCell.querySelector('.btn-save-row');
                        const saveBtnHtml = saveBtn ? saveBtn.outerHTML : '';
                        statusCell.innerHTML = `${getStatusDot('pending')}
                        <div style="margin-top:.3rem;display:flex;flex-direction:column;gap:.3rem;justify-content:center;align-items:center">
                            ${saveBtnHtml}
                        </div>`;
                    }
                }
            });
            updateLegendCounts();
        }
        else showAlert('Save Failed', data.error || 'Failed to save');
    } catch (e) {
        showAlert('Server Error', 'Something went wrong. Make sure the server is running.');
    } finally {
        btn.textContent = 'Save Assignment';
        btn.disabled = false;
    }
}

// ── Sub-section map ────────────────────────────────────────
const SUB_SECTION_MAP = { 'AR': 'Annual Report', 'ES': 'Environmental Sustainability', 'EE': 'Environmental Education', 'ER': 'Environmental Research', 'EQ': 'Equality', 'DI': 'Equality', 'ST': 'Equality', 'KE': 'Knowledge Exchange', 'HW': 'Health and Wellbeing', 'GG': 'Good Governance', 'AI': 'Additional Information' };
const THEMES_WITH_SUBSECTIONS = ['Environmental Impact', 'Social Impact', 'Governance'];
function getSubSection(code) { const p = (code || '').match(/^[A-Z]+/)?.[0] || ''; return SUB_SECTION_MAP[p] || null; }

function groupByTheme(questions) {
    const groups = {}, order = [];
    questions.forEach(q => { const k = q.theme || 'General'; if (!groups[k]) { groups[k] = []; order.push(k); } groups[k].push(q); });
    return order.map(k => [k, groups[k]]);
}

function updateLegendCounts() {
    let accepted = 0, submitted = 0, pending = 0, nostatus = 0, rejected = 0;
    allQuestions.forEach(q => {
        const s = q.task_status;
        if (s === 'accepted') accepted++;
        else if (s === 'submitted') submitted++;
        else if (s === 'pending') pending++;
        else if (s === 'rejected') rejected++;
        else nostatus++;
    });
    document.getElementById('count-accepted').textContent = `(${accepted})`;
    document.getElementById('count-submitted').textContent = `(${submitted})`;
    document.getElementById('count-pending').textContent = `(${pending})`;
    document.getElementById('count-nostatus').textContent = `(${nostatus})`;
    document.getElementById('count-rejected').textContent = `(${rejected})`;
}

// ── Row renderers ──────────────────────────────────────────
function renderRow(q) {
    // Metric header row
    if (q.question_type === 'metric') {
        const colspan = isTheImpact ? 8 : isGreenMetric ? 7 : 7;
        return `<tr data-qid="${q.id}" style="background:#f0f2f7;cursor:default" onclick="">
            <td colspan="${colspan}" style="padding:.55rem 1rem;font-size:.82rem;font-weight:700;color:var(--navy);border-bottom:1px solid var(--border)">
                ${q.title}
            </td>
        </tr>`;
    }
    if (isTheImpact) {
        const updatedAt = formatDate(q.answer_updated_at);
        const inputHtml = buildInput(q);
        const deptCell = q.department_name
            ? `<span class="dept-tag">${q.department_name}</span>`
            : `<span class="unassigned">Unassigned</span>`;
        const actionBtn = q.department_id
            ? `<button class="btn-reassign" data-qid="${q.id}" onclick="event.stopPropagation();openAssignModalById(this)" title="Reassign">&#8634;</button>`
            : `<button class="btn-assign" data-qid="${q.id}" onclick="event.stopPropagation();openAssignModalById(this)" title="Assign">+</button>`;
        const saveBtn = `<button class="btn-save-row" data-saveid="${q.task_id || q.id}"
            onclick="event.stopPropagation();saveRowAnswer(${q.task_id || q.id},this)"
            title="Save Changes">💾 Save</button>`;
        const reviewBtn = (q.task_status === 'submitted' || q.task_status === 'accepted' || q.task_status === 'rejected')
            ? `<button onclick="event.stopPropagation();openReviewById(${q.id})" title="Evaluate Submission"
            style="background:#eef2ff;color:#3730a3;border:1.5px solid #c7d2fe;padding:.25rem .4rem;border-radius:6px;font-size:.72rem;font-weight:700;cursor:pointer;line-height:1;vertical-align:middle;display:inline-flex;align-items:center;justify-content:center">
            Evaluate</button>`
            : '';

        let evidenceVal = '';
        try {
            const parsed = JSON.parse(q.answer_text || '{}');
            evidenceVal = parsed['evidence'] ?? '';
        } catch (e) { evidenceVal = ''; }

        const evidenceCell = q.has_evidence === 1
            ? `<td><input class="url-input admin-input" type="url" placeholder="https://..."
            value="${evidenceVal}" style="background:#f5f7fc"
            oninput="markDirty(${q.task_id || q.id})"/></td>`
            : `<td style="color:var(--subtext);text-align:center">—</td>`;

        const publicCell = `<td style="text-align:center">
            <label class="check-item" style="justify-content:center;margin:0">
                <input type="checkbox" class="admin-input" oninput="markDirty(${q.task_id || q.id})"> Yes
            </label>
        </td>`;

        return `<tr data-qid="${q.id}"
            data-title="${q.title.replace(/"/g, '&quot;')}"
            data-desc="${(q.description || '').replace(/"/g, '&quot;')}"
            data-taskid="${q.task_id || ''}"
            onclick="selectRow(this)">
            <td><div class="q-text">${q.title}</div></td>
            <td>${inputHtml}</td>
            ${evidenceCell}
            ${publicCell}
            <td class="status-cell">
                ${getStatusDot(q.task_status)}
                ${(q.submitted_at && updatedAt !== '—') ? `<div style="font-size:.68rem;color:var(--subtext);margin-top:.25rem">↻ ${updatedAt}</div>` : ''}
                <div style="margin-top:.3rem;display:flex;flex-direction:column;gap:.3rem;justify-content:center;align-items:center">
                    ${saveBtn}${reviewBtn}
                </div>
            </td>
            <td class="date-cell">${q.deadline ? formatDate(q.deadline) : '—'}</td>
            <td style="text-align:center">${deptCell}</td>
            <td class="action-col">${actionBtn}</td>
        </tr>`;
    }
    const updatedAt = formatDate(q.answer_updated_at);
    const inputHtml = buildInput(q);
    const deptCell = q.department_name
        ? `<span class="dept-tag">${q.department_name}</span>`
        : `<span class="unassigned">Unassigned</span>`;
    const actionBtn = q.department_id
        ? `<button class="btn-reassign" data-qid="${q.id}" onclick="event.stopPropagation();openAssignModalById(this)" title="Reassign">&#8634;</button>`
        : `<button class="btn-assign" data-qid="${q.id}" onclick="event.stopPropagation();openAssignModalById(this)" title="Assign">+</button>`;
    const saveBtn = `<button class="btn-save-row" data-saveid="${q.task_id || q.id}"
        onclick="event.stopPropagation();saveRowAnswer(${q.task_id || q.id},this)"
        title="Save Changes">💾 Save</button>`;
    const reviewBtn = (q.task_status === 'submitted' || q.task_status === 'accepted' || q.task_status === 'rejected')
        ? `<button onclick="event.stopPropagation();openReviewById(${q.id})" title="Evaluate Submission"
            style="background:#eef2ff;color:#3730a3;border:1.5px solid #c7d2fe;padding:.25rem .4rem;border-radius:6px;font-size:.72rem;font-weight: 700;cursor:pointer;line-height:1;vertical-align:middle;display:inline-flex;align-items:center;justify-content:center">
            Evaluate</button>`
        : '';
    // Extract evidence URL from items if GreenMetric
    const needsEvidence = (isGreenMetric || isTheImpact) && q.has_evidence === 1;
    const evidenceItem = needsEvidence ? (q.items || []).find(item => item.answer_type === 'url') : null;
    let evidenceVal = '';
    if (evidenceItem) {
        const idx = (q.items || []).indexOf(evidenceItem);
        try {
            const parsed = JSON.parse(q.answer_text || '{}');
            evidenceVal = parsed[idx] ?? parsed[String(idx)] ?? '';
        } catch (e) { evidenceVal = ''; }
    }

    const evidenceCell = (isGreenMetric || isTheImpact)
        ? (needsEvidence
            ? `<td><input class="url-input admin-input" type="url" placeholder="https://..." 
            value="${evidenceVal}" style="background:#f5f7fc"
            oninput="markDirty(${q.task_id || q.id})"/></td>`
            : `<td style="color:var(--subtext);text-align:center">—</td>`)
        : '';

    return `<tr data-qid="${q.id}"
        data-title="${q.title.replace(/"/g, '&quot;')}"
        data-desc="${(q.description || '').replace(/"/g, '&quot;')}"
        data-taskid="${q.task_id || ''}"
        onclick="selectRow(this)">
        <td><div class="q-text">${isGreenMetric ? `<span class="kpi-num">${formatGMCode(q.code)}</span>` : ''}${isGreenMetric ? formatGMTitle(q.title) : q.title}${q.is_synced ? ' <span style="color:var(--teal);font-size:.78rem;font-weight:700" title="This answer syncs across ranking forms">↔</span>' : ''}</div></td>
        <td>${inputHtml}</td>
        ${evidenceCell}
        <td class="status-cell">
            ${getStatusDot(q.task_status)}
            ${(q.submitted_at && updatedAt !== '—') ? `<div style="font-size:.68rem;color:var(--subtext);margin-top:.25rem">↻ ${updatedAt}</div>` : ''}
            <div style="margin-top:.3rem;display:flex;flex-direction:column;gap:.3rem;justify-content:center;align-items:center">
                ${saveBtn}${reviewBtn}
            </div>
        </td>
        <td class="date-cell">${q.deadline ? formatDate(q.deadline) : '—'}</td>
        <td style="text-align:center">${deptCell}</td>
        <td class="action-col">${actionBtn}</td>
    </tr>`;
}

function renderEqualityRow(q) {
    const updatedAt = formatDate(q.answer_updated_at);
    let ft = '', pt = '', hc = '', fte = '';
    if (q.answer_text) { try { const p = JSON.parse(q.answer_text); ft = p.ft ?? ''; pt = p.pt ?? ''; hc = p.hc ?? ''; fte = p.fte ?? ''; } catch (e) { } }
    const deptCell = q.department_name
        ? `<span class="dept-tag">${q.department_name}</span>`
        : `<span class="unassigned">Unassigned</span>`;
    const actionBtn = q.department_id
        ? `<button class="btn-reassign" data-qid="${q.id}" onclick="event.stopPropagation();openAssignModalById(this)" title="Reassign">&#8634;</button>`
        : `<button class="btn-assign" data-qid="${q.id}" onclick="event.stopPropagation();openAssignModalById(this)" title="Assign">+</button>`; const calcStyle = 'background:#f0f2f7;color:var(--subtext);cursor:not-allowed';
    const saveBtn = `<button class="btn-save-row" data-saveid="${q.task_id || q.id}"
        onclick="event.stopPropagation();saveRowAnswer(${q.task_id || q.id},this)"
        title="Save Changes">💾 Save</button>`;
    const reviewBtn = (q.task_status === 'submitted' || q.task_status === 'accepted' || q.task_status === 'rejected')
        ? `<button onclick="event.stopPropagation();openReviewById(${q.id})" title="Evaluate Submission"
            style="background:#eef2ff;color:#3730a3;border:1.5px solid #c7d2fe;padding:.25rem .4rem;border-radius:6px;font-size:.72rem;font-weight:700;cursor:pointer;line-height:1;vertical-align:middle;display:inline-flex;align-items:center;justify-content:center">
            Evaluate</button>`
        : '';
    return `<tr data-qid="${q.id}"
        data-title="${q.title.replace(/"/g, '&quot;')}"
        data-desc="${(q.description || '').replace(/"/g, '&quot;')}"
        data-taskid="${q.task_id || ''}"
        onclick="selectRow(this)">
        <td><div class="q-text">${q.title}${q.is_synced ? ' <span style="color:var(--teal);font-size:.78rem;font-weight:700" title="This answer syncs across ranking forms">↔</span>' : ''}</div></td>
        <td>
            <div class="eq-row-grid">
                <div class="eq-cell"><span>FT</span><input type="number" value="${ft}" class="admin-input" oninput="markDirty(${q.task_id || q.id})"/></div>
                <div class="eq-cell"><span>PT</span><input type="number" value="${pt}" class="admin-input" oninput="markDirty(${q.task_id || q.id})"/></div>
                <div class="eq-cell"><span title="Auto-calculated: FT + PT">HC</span><input type="number" value="${hc}" readonly style="${calcStyle}" title="Auto-calculated: FT + PT"/></div>
                <div class="eq-cell"><span title="Auto-calculated: FT + (PT÷3)">FTE</span><input type="number" value="${fte}" readonly style="${calcStyle}" title="Auto-calculated: FT + (PT ÷ 3)"/></div>
            </div>
        </td>
        <td class="status-cell">
            ${getStatusDot(q.task_status)}
            ${(q.submitted_at && updatedAt !== '—') ? `<div style="font-size:.68rem;color:var(--subtext);margin-top:.25rem">↻ ${updatedAt}</div>` : ''}
            <div style="margin-top:.3rem;display:flex;flex-direction:column;gap:.3rem;justify-content:center;align-items:center">
                ${saveBtn}${reviewBtn}
            </div>
        </td>
        <td class="date-cell">${q.deadline ? formatDate(q.deadline) : '—'}</td>
        <td style="text-align:center">${deptCell}</td>
        <td class="action-col">${actionBtn}</td>
    </tr>`;
}

function renderEqualityRowFlat(q) {
    const updatedAt = formatDate(q.answer_updated_at);
    let ft = '', pt = '', hc = '', fte = '';
    if (q.answer_text) {
        try {
            const p = JSON.parse(q.answer_text);
            ft = p.ft ?? '';
            pt = p.pt ?? '';
            hc = p.hc ?? '';
            fte = p.fte ?? '';
        } catch (e) { }
    }
    const deptCell = q.department_name
        ? `<span class="dept-tag">${q.department_name}</span>`
        : `<span class="unassigned">Unassigned</span>`;
    const actionBtn = q.department_id
        ? `<button class="btn-reassign" data-qid="${q.id}" onclick="event.stopPropagation();openAssignModalById(this)" title="Reassign">&#8634;</button>`
        : `<button class="btn-assign" data-qid="${q.id}" onclick="event.stopPropagation();openAssignModalById(this)" title="Assign">+</button>`;
    const editableStyle = 'width:100%;border:1px solid #e2e8f4;border-radius:5px;padding:.2rem .2rem;font-size:.74rem;background:#fff;color:var(--text);font-family:DM Sans,sans-serif;outline:none;text-align:center';
    const calcStyle = 'width:100%;border:1px solid #e2e8f4;border-radius:5px;padding:.2rem .2rem;font-size:.74rem;background:#f0f2f7;color:var(--subtext);font-family:DM Sans,sans-serif;outline:none;text-align:center;cursor:not-allowed';
    const reviewBtn = (q.task_status === 'submitted' || q.task_status === 'accepted' || q.task_status === 'rejected')
        ? `<button onclick="event.stopPropagation();openReviewById(${q.id})" title="Evaluate Submission"
            style="background:#eef2ff;color:#3730a3;border:1.5px solid #c7d2fe;padding:.25rem .4rem;border-radius:6px;font-size:.72rem;font-weight:700;cursor:pointer;line-height:1;vertical-align:middle;display:inline-flex;align-items:center;justify-content:center">
            Evaluate</button>`
        : '';
    const saveBtn = `<button class="btn-save-row" data-saveid="${q.task_id || q.id}"
        onclick="event.stopPropagation();saveRowAnswer(${q.task_id || q.id},this)"
        title="Save Changes">💾 Save</button>`;
    return `<tr data-qid="${q.id}"
        data-title="${q.title.replace(/"/g, '&quot;')}"
        data-desc="${(q.description || '').replace(/"/g, '&quot;')}"
        data-taskid="${q.task_id || ''}"
        onclick="selectRow(this)">
        <td><div class="q-text">${q.title}${q.is_synced ? ' <span style="color:var(--teal);font-size:.78rem;font-weight:700" title="This answer syncs across ranking forms">↔</span>' : ''}</div></td>
        <td><input type="number" value="${ft}" style="${editableStyle}" onclick="event.stopPropagation()" oninput="calcFlatEq(${q.id},${q.task_id || q.id});markDirty(${q.task_id || q.id})"/></td>
        <td><input type="number" value="${pt}" style="${editableStyle}" onclick="event.stopPropagation()" oninput="calcFlatEq(${q.id},${q.task_id || q.id});markDirty(${q.task_id || q.id})"/></td>
        <td><input type="number" value="${hc}" readonly style="${calcStyle}"/></td>
        <td><input type="number" value="${fte}" readonly style="${calcStyle}"/></td>
        <td class="status-cell">
            ${getStatusDot(q.task_status)}
            ${(q.submitted_at && updatedAt !== '—') ? `<div style="font-size:.68rem;color:var(--subtext);margin-top:.25rem">↻ ${updatedAt}</div>` : ''}
            <div style="margin-top:.3rem;display:flex;flex-direction:column;gap:.3rem;justify-content:center;align-items:center">
                ${saveBtn}${reviewBtn}
            </div>
        </td>
        <td class="date-cell">${q.deadline ? formatDate(q.deadline) : '—'}</td>
        <td style="vertical-align:middle;white-space:normal;text-align:center">${deptCell}</td>
        <td class="action-col">${actionBtn}</td>
    </tr>`;
}

function makeTable(thFirst, rows) {
    const hdr = getTableHeaderColor();
    const thStyle = `background:${hdr.bg};color:${hdr.text};border-bottom:2px solid ${hdr.border};padding:.75rem 1rem;`;

    if (isTheImpact) {
        return `<div class="table-wrap"><table class="q-table">
            <colgroup>
                <col style="width:22%"/>
                <col style="width:17%"/>
                <col style="width:12%"/>
                <col style="width:6%"/>
                <col style="width:9%"/>
                <col style="width:9%"/>
                <col style="width:11%"/><col class="col-act"/>
            </colgroup>
            <thead><tr>
                <th style="${thStyle};text-align:left">${thFirst}</th>
                <th style="${thStyle};text-align:left">Answer</th>
                <th style="${thStyle};text-align:center">Evidence</th>
                <th style="${thStyle};text-align:center">Public</th>
                <th style="${thStyle};text-align:center">Status</th>
                <th style="${thStyle};text-align:center">Due Date</th>
                <th style="${thStyle};text-align:center">Assigned To</th>
                <th style="${thStyle};text-align:center" class="action-col">Assign</th>
            </tr></thead>
            <tbody>${rows}</tbody>
        </table></div>`;
    }

    if (isGreenMetric) {
        return `<div class="table-wrap"><table class="q-table">
            <colgroup>
                <col style="width:20%"/>
                <col style="width:23%"/>
                <col style="width:15%"/>
                <col style="width:8%"/>
                <col style="width:10%"/>
                <col style="width:13%"/><col class="col-act"/>
            </colgroup>
            <thead><tr>
                <th style="${thStyle};text-align:left">${thFirst}</th>
                <th style="${thStyle};text-align:left">Answer</th>
                <th style="${thStyle};text-align:center">Evidence (URL)</th>
                <th style="${thStyle};text-align:center">Status</th>
                <th style="${thStyle};text-align:center">Due Date</th>
                <th style="${thStyle};text-align:center">Assigned To</th>
                <th style="${thStyle};text-align:center" class="action-col">Assign</th>
            </tr></thead>
            <tbody>${rows}</tbody>
        </table></div>`;
    }

    return `<div class="table-wrap"><table class="q-table">
        <colgroup>
            <col style="width:24%"/><col style="width:28%"/>
            <col style="width:8%"/><col style="width:11%"/>
            <col style="width:15%"/><col class="col-act"/>
        </colgroup>
        <thead><tr>
            <th style="${thStyle};text-align:left">${thFirst}</th>
            <th style="${thStyle};text-align:left">URL / Response</th>
            <th style="${thStyle};text-align:center">Status</th>
            <th style="${thStyle};text-align:center">Due Date</th>
            <th style="${thStyle};text-align:center">Assigned To</th>
            <th style="${thStyle};text-align:center" class="action-col">Assign</th>
        </tr></thead>
        <tbody>${rows}</tbody>
    </table></div>`;
}

function makeEqTable(thFirst, rows) {
    const hdr = getTableHeaderColor();
    const thStyle = `background:${hdr.bg};color:${hdr.text};border-bottom:2px solid ${hdr.border};padding:.75rem 1rem;`;

    return `<div class="table-wrap"><table class="q-table" style="table-layout:fixed">
        <thead><tr>
            <th style="${thStyle};width:17%">${thFirst}</th>
            <th style="${thStyle};width:9%;text-align:center;white-space:normal;padding:.4rem .2rem">Full Time</th>
            <th style="${thStyle};width:9%;text-align:center;white-space:normal;padding:.4rem .2rem">Part Time</th>
            <th style="${thStyle};width:9%;text-align:center;white-space:normal;padding:.4rem .2rem">HC</th>
            <th style="${thStyle};width:9%;text-align:center;white-space:normal;padding:.4rem .2rem">FTE</th>
            <th style="${thStyle};width:9%;text-align:center;white-space:normal;padding:.4rem .2rem">Status</th>
            <th style="${thStyle};width:9%;text-align:center;white-space:normal;padding:.4rem .2rem">Due Date</th>
            <th style="${thStyle};width:11%;text-align:center;white-space:normal;padding:.4rem .2rem">Assigned To</th>
            <th style="${thStyle};width:10%;text-align:center;white-space:normal;padding:.4rem .2rem" class="action-col">Assign</th>
        </tr></thead>
        <tbody>${rows}</tbody>
    </table></div>`;
}

function isGridQuestion(q) {
    const items = q.items || [];
    return items.length === 4 &&
        items[0]?.label === 'Full Time' &&
        items[1]?.label === 'Part Time';
}

// ── Main render ────────────────────────────────────────────
function renderSections(questionsToRender) {
    const qs = questionsToRender || allQuestions;
    const groups = groupByTheme(qs);
    const container = document.getElementById('sectionsContainer');
    if (!qs.length) { container.innerHTML = `<div style="text-align:center;padding:3rem;color:var(--subtext)">No questions found.</div>`; return; }

    let secIdx = 0;
    const html = groups.map(([theme, qs]) => {
        const sid = 'sec_' + (secIdx++);
        const assigned = qs.filter(q => q.task_status && q.task_status !== 'pending').length;
        const useSubSections = THEMES_WITH_SUBSECTIONS.includes(theme);
        let bodyHtml = '';

        if (useSubSections) {
            const subGroups = {}, subOrder = [];
            qs.forEach(q => { const sub = getSubSection(q.code) || theme; if (!subGroups[sub]) { subGroups[sub] = []; subOrder.push(sub); } subGroups[sub].push(q); });
            subOrder.forEach(sub => {
                const subQs = subGroups[sub];
                const isEq = sub === 'Equality';
                const gridQs = isEq ? subQs.filter(q => /^EQ[1-9]$/.test(q.code) && (q.items || []).length === 4) : [];
                const normalQs = isEq ? subQs.filter(q => !(/^EQ[1-9]$/.test(q.code) && (q.items || []).length === 4)) : subQs;
                if (isEq && gridQs.length) {
                    const rows = gridQs.map(q => renderEqualityRowFlat(q)).join('');
                    bodyHtml += makeEqTable('Equality', rows);
                }
                if (normalQs.length) {
                    const rows = normalQs.map(q => isGridQuestion(q) ? renderEqualityRowFlat(q) : renderRow(q)).join('');
                    bodyHtml += makeTable(isEq ? 'Equality' : sub, rows);
                }
            });
        } else {
            const gridQs = qs.filter(q => isGridQuestion(q));
            const normalQs = qs.filter(q => !isGridQuestion(q));

            if (gridQs.length) {
                const gridRows = gridQs.map(q => renderEqualityRowFlat(q)).join('');
                bodyHtml += makeEqTable(theme, gridRows);
            }
            if (normalQs.length) {
                const normalRows = normalQs.map(q => renderRow(q)).join('');
                bodyHtml += makeTable(theme, normalRows);
            }
        }

        if (isGreenMetric) {
            return `<div style="background:#fff;border-radius:14px;border:1px solid var(--border);box-shadow:var(--card-shadow);overflow:hidden;margin-bottom:1.1rem">${bodyHtml}</div>`;
        }
        return `<div class="sec-block">
            <div class="sec-hdr" onclick="toggleSec('${sid}')">
                <span class="sec-hdr-title">${theme} (${qs.length}Q)</span>
                <div class="sec-hdr-right">
                    <span class="sec-count">${assigned}/${qs.length} answered</span>
                    <span class="sec-arrow" id="tog_${sid}">&#9650;</span>
                </div>
            </div>
            <div id="body_${sid}">${bodyHtml}</div>
        </div>`;
    }).join('');
    requestAnimationFrame(() => {
        container.innerHTML = html;
        setTimeout(initQuillEditors, 0);
        updateLegendCounts();
    });
}

let dirtyRows = new Set();

window.addEventListener('beforeunload', e => {
    if (dirtyRows.size > 0) {
        e.preventDefault();
        e.returnValue = '';
    }
});

function markDirty(questionId) {
    dirtyRows.add(questionId);
    // Show the save button for this row
    const btn = document.querySelector(`.btn-save-row[data-saveid="${questionId}"]`);
    if (btn) btn.classList.add('visible');
    // Highlight the row
    const row = btn?.closest('tr');
    if (row) row.classList.add('dirty');
}

const CROSS_VALIDATIONS = [
    {
        sumCodes: ['FS2', 'FS3'],
        totalCode: 'FS1',
        label: 'Faculty Staff Male + Faculty Staff Female must equal Faculty Staff Total'
    },
    {
        sumCodes: ['SD1', 'SD2'],
        totalCode: 'SO1',
        label: 'Students Male + Students Female must equal Students - Overall'
    }
];

function validateCrossQuestions() {
    const errors = [];
    for (const rule of CROSS_VALIDATIONS) {
        const sumQs = rule.sumCodes.map(code => allQuestions.find(q => q.code === code)).filter(Boolean);
        const totalQ = allQuestions.find(q => q.code === rule.totalCode);
        if (!totalQ || sumQs.length !== rule.sumCodes.length) continue;

        const getVal = (q, idx) => {
            const row = document.querySelector(`tr[data-qid="${q.id}"]`);
            if (!row) return 0;
            const tds = row.querySelectorAll('td');
            // flat layout: td[1]=FT, td[2]=PT
            if (tds.length >= 3 && tds[1].querySelector('input')) {
                return idx === 0
                    ? parseFloat(tds[1].querySelector('input')?.value) || 0
                    : parseFloat(tds[2].querySelector('input')?.value) || 0;
            }
            // eq-cell layout
            const el = document.getElementById(`item_${q.task_id || q.id}_${idx}`);
            return parseFloat(el?.value) || 0;
        };

        const ftVals = sumQs.map(q => getVal(q, 0));
        const ptVals = sumQs.map(q => getVal(q, 1));
        const ftTotal = getVal(totalQ, 0);
        const ptTotal = getVal(totalQ, 1);
        const ftSum = ftVals.reduce((a, b) => a + b, 0);
        const ptSum = ptVals.reduce((a, b) => a + b, 0);

        if (ftTotal === 0 && ptTotal === 0) continue;

        if (ftSum !== ftTotal) {
            errors.push(`⚠️ ${rule.label}\n   Full Time: ${ftVals.join(' + ')} = ${ftSum}, but overall total is ${ftTotal}`);
        }
        if (ptSum !== ptTotal) {
            errors.push(`⚠️ ${rule.label}\n   Part Time: ${ptVals.join(' + ')} = ${ptSum}, but overall total is ${ptTotal}`);
        }
    }
    return errors;
}

function showFormAlert(msg, type = 'error') {
    const existing = document.getElementById('_formAlert');
    if (existing) existing.remove();
    const div = document.createElement('div');
    div.id = '_formAlert';
    const isSuccess = type === 'success';
    div.style.cssText = `position:fixed;top:80px;left:50%;transform:translateX(-50%);
        background:${isSuccess ? '#f0fdf4' : '#fef2f2'};
        border:1px solid ${isSuccess ? '#bbf7d0' : '#fecaca'};
        color:${isSuccess ? '#065f46' : '#991b1b'};
        padding:.75rem 1.4rem;border-radius:10px;font-size:.84rem;z-index:2000;
        max-width:520px;box-shadow:0 4px 20px rgba(0,0,0,.15);line-height:1.6;
        white-space:pre-line;font-weight:500`;
    div.textContent = msg;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), isSuccess ? 4000 : 7000);
}

async function saveRowAnswer(questionId, btn) {
    const q = allQuestions.find(q => (q.task_id || q.id) === questionId);
    if (!q.task_id) {
        showAlert('Not Assigned', 'This question has not been assigned to a department yet. Please assign it first before saving.');
        btn.textContent = '💾';
        btn.disabled = false;
        return;
    }

    // Cross-validation check
    const errors = validateCrossQuestions();
    if (errors.length) {
        showFormAlert('Please fix the following before saving:\n\n' + errors.join('\n\n'));
        return;
    }

    // Collect current value from the DOM
    const answerData = collectAdminAnswer(q);

    btn.textContent = '...';
    btn.disabled = true;

    try {
        const res = await fetch(`${API_BASE}/api/submissions/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                task_assignment_id: q.task_id,
                answers: answerData,
                user_id: user.id
            })
        });
        const data = await res.json();
        if (data.success) {
            // Update local object
            q.answer_text = answerData.answer_text;
            q.answer_number = answerData.answer_number;
            q.answer_updated_at = new Date().toISOString();

            // Update status dot and date in the row
            const row = btn.closest('tr');
            if (row) {
                const statusCell = row.querySelector('.status-cell');
                if (statusCell) {
                    const qObj = allQuestions.find(q => (q.task_id || q.id) === questionId);
                    const reviewBtn = `<button onclick="event.stopPropagation();openReviewById(${qObj?.id})" title="Evaluate Submission"
                        style="background:#eef2ff;color:#3730a3;border:1.5px solid #c7d2fe;padding:.25rem .4rem;border-radius:6px;font-size:.72rem;font-weight:700;cursor:pointer;line-height:1;vertical-align:middle;display:inline-flex;align-items:center;justify-content:center">
                        Evaluate</button>`;
                    statusCell.innerHTML = `${getStatusDot('submitted')}
                    <div style="margin-top:.3rem;display:flex;flex-direction:column;gap:.3rem;justify-content:center;align-items:center">
                        <button class="btn-save-row" data-saveid="${questionId}"
                            onclick="event.stopPropagation();saveRowAnswer(${questionId},this)"
                            title="Save Changes">💾 Save</button>
                        ${reviewBtn}
                    </div>`;
                }
                const dateCell = row.querySelector('.date-cell');
                if (dateCell) dateCell.textContent = formatDate(q.answer_updated_at);
                row.classList.remove('dirty');
            }

            // Flash saved
            btn.textContent = '✓ Saved';
            btn.classList.add('saved');
            dirtyRows.delete(questionId);
            setTimeout(() => {
                btn.textContent = '💾 Save';
                btn.classList.remove('saved', 'visible');
                btn.disabled = false;
            }, 2000);
        } else {
            btn.textContent = '💾 Save';
            btn.disabled = false;
            alert(data.error || 'Failed to save');
        }
    } catch (e) {
        btn.textContent = '💾 Save';
        btn.disabled = false;
        alert('Server error');
    }
}

function collectAdminAnswer(q) {
    const taskId = q.task_id || q.id;
    const items = q.items || [];

    // Equality grid — handles both flat table layout and eq-cell grid layout
    if (isGridQuestion(q)) {
        // Try flat layout first (renderEqualityRowFlat — separate <td> inputs)
        const tds = document.querySelectorAll(`tr[data-qid="${q.id}"] td`);
        let ft = 0, pt = 0;
        if (tds.length >= 3) {
            ft = parseFloat(tds[1].querySelector('input')?.value) || 0;
            pt = parseFloat(tds[2].querySelector('input')?.value) || 0;
        } else {
            // Fallback: eq-cell grid layout (renderEqualityRow)
            ft = parseFloat(document.querySelector(`tr[data-qid="${q.id}"] .eq-cell:nth-child(1) input`)?.value) || 0;
            pt = parseFloat(document.querySelector(`tr[data-qid="${q.id}"] .eq-cell:nth-child(2) input`)?.value) || 0;
        }
        const hc = ft + pt;
        const fte = Math.round(ft + (pt / 3));
        return { answer_text: JSON.stringify({ ft, pt, hc, fte }), answer_number: null };
    }

    // Multi-item questions
    if (items.length > 0) {
        const collected = {};
        items.forEach((item, i) => {
            const el = document.querySelector(`tr[data-qid="${q.id}"] [data-itemidx="${i}"]`);
            if (!el) return;
            if (item.answer_type === 'checkbox') {
                collected[i] = el.checked ? 'yes' : 'no';
            } else if (item.answer_type === 'richtext' || item.answer_type === 'text') {
                collected[i] = el.innerText || el.textContent || '';
            } else {
                collected[i] = el.value || '';
            }
        });
        const keys = Object.keys(collected);
        if (keys.length === 1) {
            const item = items[0];
            const val = collected[0];
            if (item.answer_type === 'number') return { answer_text: null, answer_number: val ? parseFloat(val) : null };
            return { answer_text: val || null, answer_number: null };
        }
        return { answer_text: JSON.stringify(collected), answer_number: null };
    }

    // Single-answer fallback
    switch (q.question_type) {
        case 'yesno': {
            const checked = document.querySelector(`tr[data-qid="${q.id}"] input[type=radio]:checked`);
            return { answer_text: checked ? checked.value : null, answer_number: null };
        }
        case 'number': {
            const val = document.querySelector(`tr[data-qid="${q.id}"] input[type=number]`)?.value;
            return { answer_text: null, answer_number: val ? parseFloat(val) : null };
        }
        default: {
            const el = document.querySelector(`tr[data-qid="${q.id}"] input.admin-input, tr[data-qid="${q.id}"] .admin-editor`);
            const val = el ? (el.value || el.innerText || '') : '';
            return { answer_text: val || null, answer_number: null };
        }
    }
}

function calcFlatEq(qid, taskId) {
    const row = document.querySelector(`tr[data-qid="${qid}"]`);
    if (!row) return;
    const tds = row.querySelectorAll('td');
    const ft = parseFloat(tds[1].querySelector('input')?.value) || 0;
    const pt = parseFloat(tds[2].querySelector('input')?.value) || 0;
    const hcInput = tds[3].querySelector('input');
    const fteInput = tds[4].querySelector('input');
    if (hcInput) hcInput.value = ft + pt;
    if (fteInput) fteInput.value = Math.round(ft + (pt / 3));
}

// ── Load functions ─────────────────────────────────────────
async function loadCycleInfo() {
    try {
        const res = await fetch(`${API_BASE}/api/admin/cycles/${cycleId}`, { headers: { 'Authorization': `Bearer ${token}` } });
        const cycle = await res.json();
        if (cycle) {
            document.getElementById('pageTitle').textContent = cycle.name;
            document.title = cycle.name + ' – UoB Rankings Tracker';
            const start = cycle.start_date ? new Date(cycle.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
            const end = cycle.deadline ? new Date(cycle.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
            document.getElementById('pageSub').textContent = `${cycle.year || ''} · ${start} – ${end}`;
            document.getElementById('deadlineBanner').innerHTML = `🏆 <strong>${cycle.name}</strong> — Submission Deadline: <strong>${end}</strong>`;

            if (cycle.status === 'closed') {
                document.getElementById('closeFormBtn').textContent = '🔒 Form Closed';
                document.getElementById('closeFormBtn').disabled = true;
                document.getElementById('editModeBtn').disabled = true;
                const banner = document.createElement('div');
                banner.className = 'banner';
                banner.style.cssText = 'background:#fef2f2;border:1px solid #fecaca;color:#991b1b;margin-bottom:.55rem';
                banner.innerHTML = '🔒 <strong>Form Closed</strong> — This ranking form is now closed. Departments can no longer submit or edit answers.';
                document.getElementById('deadlineBanner').insertAdjacentElement('afterend', banner);
            }

            const name = (cycle.name || '').toLowerCase();
            isGreenMetric = name.includes('greenmetric');
            isTheImpact = name.includes('impact');
            currentCycleName = cycle.name || '';
            const hdr = getTableHeaderColor();
            if (hdr) {
                document.documentElement.style.setProperty('--tab-active-color', hdr.text);
            }
            const syncBanner = document.querySelector('.banner-yellow');
            if (syncBanner) {
                const name = (cycle.name || '').toLowerCase();
                if (name.includes('qs')) {
                    syncBanner.style.display = 'flex';
                } else {
                    syncBanner.style.display = 'none';
                }
            }
            if (isGreenMetric) {
                document.getElementById('gmTabsWrap').style.display = 'block';
                document.querySelector('.def-panel').style.display = 'none';
            } else if (isTheImpact) {
                document.getElementById('impactTabsWrap').style.display = 'block';
                document.querySelector('.def-panel').style.display = 'none';
            } else {
                document.querySelector('.def-panel').style.display = '';
            }
        }
    } catch (e) { console.error(e); }
}

async function loadQuestions() {
    try {
        const res = await fetch(`${API_BASE}/api/admin/cycles/${cycleId}/questions`, { headers: { 'Authorization': `Bearer ${token}` } });
        allQuestions = await res.json();
    } catch (e) {
        document.getElementById('sectionsContainer').innerHTML = '<div style="text-align:center;padding:3rem;color:var(--subtext)">Failed to load questions.</div>';
    }
}

async function loadDepartments() {
    try {
        const res = await fetch(`${API_BASE}/api/admin/departments`, { headers: { 'Authorization': `Bearer ${token}` } });
        departments = await res.json();
    } catch (e) { console.error(e); }
}

function openCloseModal() {
    document.getElementById('closeFormModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeCloseModal() {
    document.getElementById('closeFormModal').classList.remove('show');
    document.body.style.overflow = '';
}

async function confirmCloseForm() {
    const btn = document.querySelector('#closeFormModal .btn-yes-submit');
    btn.textContent = '...';
    btn.disabled = true;
    try {
        const res = await fetch(`${API_BASE}/api/admin/cycles/${cycleId}/close`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
            closeCloseModal();
            document.getElementById('closeFormBtn').textContent = '🔒 Form Closed';
            document.getElementById('closeFormBtn').disabled = true;
            document.getElementById('editModeBtn').disabled = true;
            const banner = document.createElement('div');
            banner.className = 'banner';
            banner.style.cssText = 'background:#fef2f2;border:1px solid #fecaca;color:#991b1b;margin-bottom:.55rem';
            banner.innerHTML = '🔒 <strong>Form Closed</strong> — This ranking form is now closed. Departments can no longer submit or edit answers.';
            document.getElementById('deadlineBanner').insertAdjacentElement('afterend', banner);
        } else {
            alert(data.error || 'Failed to close form');
            btn.textContent = 'Yes, Close Form';
            btn.disabled = false;
        }
    } catch (e) {
        alert('Server error');
        btn.textContent = 'Yes, Close Form';
        btn.disabled = false;
    }
}

function logout() {
    fetch(`${API_BASE}/api/auth/logout`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
    localStorage.clear(); window.location.href = 'login.html';
}

function toggleCycles() {
    const el = document.getElementById('navCycles');
    const ar = document.getElementById('cyclesArrow');
    el.classList.toggle('open');
    ar.textContent = el.classList.contains('open') ? '▴' : '▾';
}

function switchGMTab(el, cat) {
    document.querySelectorAll('.gm-tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    activeGMTab = cat;
    const filtered = allQuestions.filter(q => q.gm_category === cat);
    renderSections(filtered);
    document.querySelector('.def-panel').style.display = 'none'; // hide def panel
}

function switchImpactTab(el, theme) {
    document.querySelectorAll('#impactTabsWrap .gm-tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    activeImpactTab = theme;
    const filtered = allQuestions.filter(q => q.theme === theme);
    renderSections(filtered);
    document.querySelector('.def-panel').style.display = 'none';
}

function formatGMCode(code) {
    if (!code) return '';
    // SI_1_1 → 1.1, EC_2_3 → 2.3
    const parts = code.split('_');
    if (parts.length >= 3) return `${parts[1]}.${parts[2]}`;
    return '';
}

function formatGMTitle(title) {
    if (!title.includes(' — ')) return title;
    const [main, rest] = title.split(' — ');
    return `${main}<br><span style="font-size:.72rem;color:var(--subtext);font-style:italic">${rest}</span>`;
}

// Highlight sidebar nav child based on current cycle type
function highlightNavType() {
    const name = (currentCycleName || '').toLowerCase();
    let typeKey = '';
    if (name.includes('sustainability')) typeKey = 'qs-sustainability';
    else if (name.includes('qs') && name.includes('world')) typeKey = 'qs-wur';
    else if (name.includes('world')) typeKey = 'the-wur';
    else if (name.includes('impact')) typeKey = 'the-impact';
    else if (name.includes('greenmetric')) typeKey = 'greenmetric';

    document.querySelectorAll('.nav-child').forEach(a => {
        const url = new URL(a.href, location.href);
        if (url.searchParams.get('type') === typeKey) a.classList.add('active');
    });
}

function showAlert(title, msg) {
    document.getElementById('alertTitle').textContent = title;
    document.getElementById('alertMsg').textContent = msg;
    document.getElementById('alertConfirmBtn').onclick = () => closeModal('alertModal');
    document.getElementById('alertModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal(id) {
    document.getElementById(id).classList.remove('show');
    document.body.style.overflow = '';
}

let _reviewTaskId = null;

function openReviewModal(q) {
    _reviewTaskId = q.task_id;
    document.getElementById('reviewComment').value = '';
    document.getElementById('reviewModalTitle').textContent = 'Evaluate Submission';
    document.getElementById('reviewModalSub').textContent = `"${q.title.slice(0, 80)}${q.title.length > 80 ? '…' : ''}"`;
    document.getElementById('reviewModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

async function submitReview(status) {
    const comment = document.getElementById('reviewComment').value.trim();
    try {
        const res = await fetch(`${API_BASE}/api/admin/answers/${_reviewTaskId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ status, comment })
        });
        const data = await res.json();
        if (data.success) {
            closeModal('reviewModal');
            const q = allQuestions.find(q => q.task_id === _reviewTaskId);
            if (q) q.task_status = status;
            if (isGreenMetric) {
                renderSections(allQuestions.filter(q => q.gm_category === activeGMTab));
            } else if (isTheImpact) {
                renderSections(allQuestions.filter(q => q.theme === activeImpactTab));
            } else {
                renderSections();
            }
        } else {
            showAlert('Error', data.error || 'Failed to update status');
        }
    } catch (e) {
        showAlert('Server Error', 'Something went wrong.');
    }
}

function openReviewById(questionId) {
    const q = allQuestions.find(x => x.id === questionId);
    if (q) openReviewModal(q);
}

Promise.all([loadCycleInfo(), loadDepartments(), loadQuestions()]).then(() => {
    if (isGreenMetric) {
        document.querySelector('.def-panel').style.display = 'none';
        renderSections(allQuestions.filter(q => q.gm_category === activeGMTab));
    } else if (isTheImpact) {
        document.querySelector('.def-panel').style.display = 'none';
        renderSections(allQuestions.filter(q => q.theme === activeImpactTab));
    } else {
        renderSections();
    }

    // If opened via "Edit" button, start in edit mode
    if (editMode) {
        const btn = document.getElementById('editModeBtn');
        if (btn && !btn.disabled && !btn.classList.contains('active')) {
            toggleEditMode();
        }
    }
});
