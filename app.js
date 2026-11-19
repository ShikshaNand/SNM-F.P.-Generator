/**
 * MMC Practical Front Page Generator
 * Real-time Reactive Controller & High-Definition Export Engine
 */

(function () {
  'use strict';

  // --- Predefined Configurations & Faculty Mappings ---
  const SUBJECT_PRESETS = {
    'data-mining': {
      subject: 'DATA MINING',
      prefix: 'PRACTICAL FILE OF',
      teacher: 'Mrs. Nitu Jain',
      designation: '(Assistant Professor)',
      department: 'Dept. of Computer Science'
    },
    'computer-graphics': {
      subject: 'COMPUTER GRAPHICS',
      prefix: 'PRACTICAL FILE OF',
      teacher: 'Mrs. Priyanka Beniwal',
      designation: '(Assistant Professor)',
      department: 'Dept. of Computer Science'
    },
    'linux': {
      subject: 'LINUX',
      prefix: 'PRACTICAL FILE OF',
      teacher: 'Mrs. Nitu Jain',
      designation: '(Assistant Professor)',
      department: 'Dept. of Computer Science'
    }
  };

  // State Management
  const state = {
    collegeName: 'MANOHAR MEMORIAL COLLEGE',
    collegeCity: 'FATEHABAD',
    filePrefix: 'PRACTICAL FILE OF',
    subject: 'DATA MINING',
    teacher: 'Mrs. Nitu Jain',
    designation: '(Assistant Professor)',
    department: 'Dept. of Computer Science',
    studentName: 'SΛNΛM',
    studentClass: 'BCA III',
    studentSem: '5th',
    studentRoll: '24030115470053',
    currentPreset: 'data-mining',
    zoomLevel: 0.58,
    customLogoUrl: null,
    titleSpacing: 2.0,
    detailsSpacing: 2.05
  };

  const STORAGE_KEY = 'mmc_front_page_user_v4';

  // DOM Elements - Inputs
  const elCollegeName = document.getElementById('input-college-name');
  const elCollegeCity = document.getElementById('input-college-city');
  const elFilePrefix = document.getElementById('input-file-prefix');
  const elSubject = document.getElementById('input-subject');
  const elTeacher = document.getElementById('input-teacher');
  const elDesignation = document.getElementById('input-designation');
  const elDepartment = document.getElementById('input-department');
  const elStudentName = document.getElementById('input-student-name');
  const elStudentClass = document.getElementById('input-student-class');
  const elStudentSem = document.getElementById('input-student-sem');
  const elStudentRoll = document.getElementById('input-student-roll');
  const elLogoUpload = document.getElementById('input-logo-file');
  const elResetLogoBtn = document.getElementById('btn-reset-logo');
  const elFilenameDisplay = document.getElementById('filename-display');

  // DOM Elements - Line Spacing Controls (Desktop Only)
  const elSliderTitleGap = document.getElementById('slider-title-gap');
  const elValTitleGap = document.getElementById('val-title-gap');
  const elSliderDetailsGap = document.getElementById('slider-details-gap');
  const elValDetailsGap = document.getElementById('val-details-gap');
  const elBtnSpacingCompact = document.getElementById('btn-spacing-compact');
  const elBtnSpacingDefault = document.getElementById('btn-spacing-default');
  const elBtnSpacingRelaxed = document.getElementById('btn-spacing-relaxed');

  // DOM Elements - Preview
  const elPreviewCollegeName = document.getElementById('preview-college-name');
  const elPreviewCollegeCity = document.getElementById('preview-college-city');
  const elPreviewFilePrefix = document.getElementById('preview-file-prefix');
  const elPreviewSubject = document.getElementById('preview-subject');
  const elPreviewTeacher = document.getElementById('preview-teacher');
  const elPreviewDesignation = document.getElementById('preview-designation');
  const elPreviewDepartment = document.getElementById('preview-department');
  const elPreviewStudentName = document.getElementById('preview-student-name');
  const elPreviewStudentClass = document.getElementById('preview-student-class');
  const elPreviewStudentSem = document.getElementById('preview-student-sem');
  const elPreviewStudentRoll = document.getElementById('preview-student-roll');
  const elPreviewLogo = document.getElementById('preview-logo');
  const elPaperPage = document.getElementById('paper-page');
  const elPaperScaler = document.getElementById('paper-scaler');

  // DOM Elements - Action Buttons
  const btnDownloadPdf = document.getElementById('btn-download-pdf');
  const btnDownloadPng = document.getElementById('btn-download-png');
  const btnPrint = document.getElementById('btn-print');
  const btnCopyImg = document.getElementById('btn-copy-img');
  const btnReset = document.getElementById('btn-reset');

  // DOM Elements - Zoom Controls
  const btnZoomIn = document.getElementById('btn-zoom-in');
  const btnZoomOut = document.getElementById('btn-zoom-out');
  const btnZoomFit = document.getElementById('btn-zoom-fit');
  const btnZoom100 = document.getElementById('btn-zoom-100');
  const elZoomText = document.getElementById('zoom-text');

  // DOM Elements - Mobile Tabs
  const tabBtnForm = document.getElementById('tab-btn-form');
  const tabBtnPreview = document.getElementById('tab-btn-preview');
  const elSidebar = document.querySelector('.sidebar');
  const elPreviewPanel = document.querySelector('.preview-panel');

  // --- Initialize Application ---
  function init() {
    loadSavedSettings();
    setZoom(0.58);
    bindEvents();
    syncInputsWithState();
    renderAll();
    setTimeout(applyInitialZoom, 100);
  }

  // --- LocalStorage persistence ---
  function loadSavedSettings() {
    try {
      // Purge all old legacy cache keys
      ['mmc_front_page_user', 'mmc_front_page_user_v2', 'mmc_front_page_user_v3'].forEach(k => {
        try { localStorage.removeItem(k); } catch (e) {}
      });

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.studentName && parsed.studentName !== 'Sameer') {
          state.studentName = parsed.studentName;
        } else {
          state.studentName = 'SΛNΛM';
        }

        if (parsed.studentRoll && parsed.studentRoll !== '24030115470043') {
          state.studentRoll = parsed.studentRoll;
        } else {
          state.studentRoll = '24030115470053';
        }

        if (parsed.studentClass) state.studentClass = parsed.studentClass;
        if (parsed.studentSem) state.studentSem = parsed.studentSem;
        if (parsed.subject) state.subject = parsed.subject;
        if (parsed.teacher) state.teacher = parsed.teacher;
        if (parsed.currentPreset) state.currentPreset = parsed.currentPreset;
        if (typeof parsed.titleSpacing === 'number' && parsed.titleSpacing !== 5.22 && parsed.titleSpacing !== 3.6) {
          state.titleSpacing = parsed.titleSpacing;
        } else {
          state.titleSpacing = 2.0;
        }
        if (typeof parsed.detailsSpacing === 'number') state.detailsSpacing = parsed.detailsSpacing;
      } else {
        state.studentName = 'SΛNΛM';
        state.studentRoll = '24030115470053';
        state.titleSpacing = 2.0;
      }
    } catch (e) {
      console.warn('LocalStorage unavailable or corrupt', e);
      state.studentName = 'SΛNΛM';
      state.studentRoll = '24030115470053';
      state.titleSpacing = 2.0;
    }
  }

  function saveSettings() {
    try {
      const toSave = {
        studentName: state.studentName,
        studentClass: state.studentClass,
        studentSem: state.studentSem,
        studentRoll: state.studentRoll,
        subject: state.subject,
        teacher: state.teacher,
        currentPreset: state.currentPreset,
        titleSpacing: state.titleSpacing,
        detailsSpacing: state.detailsSpacing
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      // Ignored
    }
  }

  // --- Auto-Fill & Subject Matching Logic ---
  function detectSubjectAndAutoFill(rawSubjectText, forceUpdateTeacher = false) {
    const lower = (rawSubjectText || '').trim().toLowerCase();

    // Check Data Mining
    if (lower.includes('data mining') || lower === 'dm') {
      highlightPreset('data-mining');
      if (forceUpdateTeacher || state.currentPreset !== 'custom') {
        state.teacher = 'Mrs. Nitu Jain';
        state.designation = '(Assistant Professor)';
        state.department = 'Dept. of Computer Science';
      }
      return;
    }

    // Check Computer Graphics
    if (lower.includes('computer graphic') || lower.includes('graphics') || lower === 'cg') {
      highlightPreset('computer-graphics');
      if (forceUpdateTeacher || state.currentPreset !== 'custom') {
        state.teacher = 'Mrs. Priyanka Beniwal';
        state.designation = '(Assistant Professor)';
        state.department = 'Dept. of Computer Science';
      }
      return;
    }

    // Check Linux
    if (lower.includes('linux')) {
      highlightPreset('linux');
      if (forceUpdateTeacher || state.currentPreset !== 'custom') {
        state.teacher = 'Mrs. Nitu Jain';
        state.designation = '(Assistant Professor)';
        state.department = 'Dept. of Computer Science';
      }
      return;
    }

    // Custom subject
    highlightPreset('custom');
  }

  function selectPreset(presetKey) {
    state.currentPreset = presetKey;
    highlightPreset(presetKey);

    if (SUBJECT_PRESETS[presetKey]) {
      const p = SUBJECT_PRESETS[presetKey];
      state.subject = p.subject;
      state.filePrefix = p.prefix;
      state.teacher = p.teacher;
      state.designation = p.designation;
      state.department = p.department;
    }

    syncInputsWithState();
    renderAll();
    saveSettings();
  }

  function highlightPreset(presetKey) {
    document.querySelectorAll('.preset-btn').forEach(btn => {
      if (btn.getAttribute('data-preset') === presetKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // --- Filename Generator according to User Requirement ---
  // "with name like abhi ye data mining ka hai toh name aana chahiye Data-mining front page or phir user ka name"
  function getComputedFilename(extension = 'pdf') {
    // Subject Slug
    let sub = (state.subject || 'Practical').trim();
    let subSlug = sub
      .split(/\s+/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join('-')
      .replace(/[^\p{L}\p{N}\-_]/gu, '');

    if (!subSlug) subSlug = 'Front-Page';

    // User Name Slug (preserves Unicode characters like SΛNΛM)
    let name = (state.studentName || 'Student').trim();
    let nameSlug = name
      .split(/\s+/)
      .join('-')
      .replace(/[^\p{L}\p{N}\-_]/gu, '');

    if (!nameSlug) nameSlug = 'Student';

    return `${subSlug}-front-page-${nameSlug}.${extension}`;
  }

  // --- Rendering & Synchronization ---
  function syncInputsWithState() {
    if (elCollegeName) elCollegeName.value = state.collegeName;
    if (elCollegeCity) elCollegeCity.value = state.collegeCity;
    if (elFilePrefix) elFilePrefix.value = state.filePrefix;
    if (elSubject) elSubject.value = state.subject;
    if (elTeacher) elTeacher.value = state.teacher;
    if (elDesignation) elDesignation.value = state.designation;
    if (elDepartment) elDepartment.value = state.department;
    if (elStudentName) elStudentName.value = state.studentName;
    if (elStudentClass) elStudentClass.value = state.studentClass;
    if (elStudentSem) elStudentSem.value = state.studentSem;
    if (elStudentRoll) elStudentRoll.value = state.studentRoll;
  }

  function renderAll() {
    // Update preview page
    if (elPreviewCollegeName) elPreviewCollegeName.textContent = state.collegeName || 'COLLEGE NAME';
    if (elPreviewCollegeCity) elPreviewCollegeCity.textContent = state.collegeCity || 'CITY';
    if (elPreviewFilePrefix) elPreviewFilePrefix.textContent = state.filePrefix || 'PRACTICAL FILE OF';
    if (elPreviewSubject) elPreviewSubject.textContent = (state.subject || 'SUBJECT NAME').toUpperCase();
    if (elPreviewTeacher) elPreviewTeacher.textContent = state.teacher || 'Teacher Name';
    if (elPreviewDesignation) elPreviewDesignation.textContent = state.designation || '';
    if (elPreviewDepartment) elPreviewDepartment.textContent = state.department || '';
    if (elPreviewStudentName) elPreviewStudentName.textContent = state.studentName || '';
    if (elPreviewStudentClass) elPreviewStudentClass.textContent = state.studentClass || '';
    if (elPreviewStudentSem) elPreviewStudentSem.textContent = state.studentSem || '';
    if (elPreviewStudentRoll) elPreviewStudentRoll.textContent = state.studentRoll || '';

    // Logo
    if (elPreviewLogo) {
      if (state.customLogoUrl) {
        elPreviewLogo.src = state.customLogoUrl;
      } else if (typeof DEFAULT_MMC_LOGO !== 'undefined') {
        elPreviewLogo.src = DEFAULT_MMC_LOGO;
      } else {
        elPreviewLogo.src = 'assets/logo.png';
      }
    }

    // Dynamic Filename display
    if (elFilenameDisplay) {
      elFilenameDisplay.textContent = getComputedFilename('pdf');
    }

    // Apply line spacing settings
    applySpacing();
  }

  function applySpacing() {
    const paper = document.getElementById('paper-page');
    if (paper) {
      paper.style.setProperty('--title-spacing', `${state.titleSpacing}mm`);
      paper.style.setProperty('--details-spacing', `${state.detailsSpacing}mm`);
    }
    const elSub = document.getElementById('preview-subject');
    if (elSub) {
      elSub.style.marginTop = `${state.titleSpacing}mm`;
    }
    document.querySelectorAll('.page-submitted-to .page-sub-heading, .page-submitted-to .page-text-line, .page-submitted-by .page-sub-heading').forEach(el => {
      el.style.marginBottom = `${state.detailsSpacing}mm`;
    });
    document.querySelectorAll('.page-submitted-by .page-text-line').forEach(el => {
      el.style.marginBottom = `${(state.detailsSpacing * 0.54).toFixed(2)}mm`;
    });

    if (elSliderTitleGap) elSliderTitleGap.value = state.titleSpacing;
    if (elValTitleGap) elValTitleGap.textContent = `${Number(state.titleSpacing).toFixed(1)} mm`;
    if (elSliderDetailsGap) elSliderDetailsGap.value = state.detailsSpacing;
    if (elValDetailsGap) elValDetailsGap.textContent = `${Number(state.detailsSpacing).toFixed(1)} mm`;
  }

  function setSpacingPillActive(type) {
    [elBtnSpacingCompact, elBtnSpacingDefault, elBtnSpacingRelaxed].forEach(b => b?.classList.remove('active'));
    if (type === 'compact') elBtnSpacingCompact?.classList.add('active');
    else if (type === 'default') elBtnSpacingDefault?.classList.add('active');
    else if (type === 'relaxed') elBtnSpacingRelaxed?.classList.add('active');
  }

  function updateSpacingPillsState() {
    if (Math.abs(state.titleSpacing - 2.0) < 0.15 && Math.abs(state.detailsSpacing - 2.05) < 0.15) {
      setSpacingPillActive('default');
    } else if (Math.abs(state.titleSpacing - 1.0) < 0.15 && Math.abs(state.detailsSpacing - 1.4) < 0.15) {
      setSpacingPillActive('compact');
    } else if (Math.abs(state.titleSpacing - 4.5) < 0.15 && Math.abs(state.detailsSpacing - 3.0) < 0.15) {
      setSpacingPillActive('relaxed');
    } else {
      setSpacingPillActive('custom');
    }
  }

  // --- Zoom & Scaler Handling ---
  function setZoom(level) {
    state.zoomLevel = Math.max(0.3, Math.min(2.0, level));
    if (elPaperScaler) {
      elPaperScaler.style.transform = `scale(${state.zoomLevel})`;
      // Compensate for CSS transform layout bounds
      const a4HeightPx = 1123;
      const heightDelta = a4HeightPx * (1 - state.zoomLevel);
      elPaperScaler.style.marginBottom = `${-heightDelta}px`;
    }
    if (elZoomText) {
      elZoomText.textContent = `${Math.round(state.zoomLevel * 100)}%`;
    }
  }

  function applyInitialZoom() {
    const container = document.querySelector('.preview-scroll-area');
    if (!container) return;

    const availableWidth = container.clientWidth > 100 ? (container.clientWidth - 40) : (window.innerWidth - 480);
    const availableHeight = container.clientHeight > 100 ? (container.clientHeight - 40) : (window.innerHeight - 150);

    const a4WidthPx = 794;
    const a4HeightPx = 1123;

    let zoomW = availableWidth / a4WidthPx;
    let zoomH = availableHeight / a4HeightPx;
    let targetZoom = Math.min(zoomW, zoomH);

    if (window.innerWidth < 900) {
      targetZoom = Math.max(0.38, Math.min(0.85, zoomW * 0.95));
    } else {
      // Fit full page comfortably
      targetZoom = Math.max(0.48, Math.min(0.85, targetZoom * 0.92));
    }
    setZoom(targetZoom);
  }

  // --- Export Functions ---

  // 1. Download PDF (300 DPI High-Definition Vector/Raster A4)
  async function downloadPDF() {
    const filename = getComputedFilename('pdf');
    setButtonLoading(btnDownloadPdf, true, 'Generating PDF...');

    try {
      const { jsPDF } = window.jspdf;
      if (!jsPDF || !window.html2canvas) {
        throw new Error('Export libraries not loaded');
      }

      // Temporarily ensure full opacity & 100% scale for snapshot
      const clone = elPaperPage.cloneNode(true);
      clone.style.transform = 'none';
      clone.style.margin = '0';
      clone.style.boxShadow = 'none';
      clone.style.position = 'fixed';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        scale: 3, // 300+ DPI razor sharp resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false
      });

      document.body.removeChild(clone);

      // Create PDF in A4 Portrait mm
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      // A4 is 210mm x 297mm
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      pdf.save(filename);

      showToast(`Downloaded: ${filename}`, 'success');
    } catch (err) {
      console.error('PDF Generation Error:', err);
      // Fallback: system print
      showToast('Opening print dialog as fallback...', 'info');
      window.print();
    } finally {
      setButtonLoading(btnDownloadPdf, false, '📄 Download PDF');
    }
  }

  // 2. Download High-Res PNG
  async function downloadPNG() {
    const filename = getComputedFilename('png');
    setButtonLoading(btnDownloadPng, true, 'Generating PNG...');

    try {
      const clone = elPaperPage.cloneNode(true);
      clone.style.transform = 'none';
      clone.style.margin = '0';
      clone.style.boxShadow = 'none';
      clone.style.position = 'fixed';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false
      });

      document.body.removeChild(clone);

      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      showToast(`Downloaded: ${filename}`, 'success');
    } catch (err) {
      console.error('PNG Generation Error:', err);
      showToast('Error generating image', 'info');
    } finally {
      setButtonLoading(btnDownloadPng, false, '🖼️ Download PNG');
    }
  }

  // 3. Copy to Clipboard
  async function copyToClipboard() {
    setButtonLoading(btnCopyImg, true, 'Copying...');

    try {
      const clone = elPaperPage.cloneNode(true);
      clone.style.transform = 'none';
      clone.style.margin = '0';
      clone.style.boxShadow = 'none';
      clone.style.position = 'fixed';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false
      });

      document.body.removeChild(clone);

      canvas.toBlob(async blob => {
        if (!blob) {
          showToast('Failed to create image blob', 'info');
          return;
        }
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          showToast('Copied to clipboard! Ready to paste.', 'success');
        } catch (e) {
          console.warn('Clipboard write failed, downloading instead:', e);
          downloadPNG();
        } finally {
          setButtonLoading(btnCopyImg, false, '📋 Copy Image');
        }
      }, 'image/png');
    } catch (err) {
      console.error('Copy Error:', err);
      setButtonLoading(btnCopyImg, false, '📋 Copy Image');
      showToast('Could not copy image', 'info');
    }
  }

  function setButtonLoading(btn, isLoading, text) {
    if (!btn) return;
    btn.disabled = isLoading;
    btn.innerHTML = text;
  }

  function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${type === 'success' ? '✓' : 'ℹ'}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toastOut 0.25s forwards';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 250);
    }, 3200);
  }

  // --- Event Bindings ---
  function bindEvents() {
    // Preset buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = btn.getAttribute('data-preset');
        selectPreset(p);
      });
    });

    // Subject input listener with smart auto-detection
    if (elSubject) {
      elSubject.addEventListener('input', e => {
        state.subject = e.target.value;
        detectSubjectAndAutoFill(e.target.value, false);
        syncInputsWithState();
        renderAll();
        saveSettings();
      });
    }

    // Other inputs real-time listeners
    const inputBindings = [
      [elCollegeName, 'collegeName'],
      [elCollegeCity, 'collegeCity'],
      [elFilePrefix, 'filePrefix'],
      [elTeacher, 'teacher'],
      [elDesignation, 'designation'],
      [elDepartment, 'department'],
      [elStudentName, 'studentName'],
      [elStudentClass, 'studentClass'],
      [elStudentSem, 'studentSem'],
      [elStudentRoll, 'studentRoll']
    ];

    inputBindings.forEach(([inputEl, stateKey]) => {
      if (inputEl) {
        inputEl.addEventListener('input', e => {
          state[stateKey] = e.target.value;
          renderAll();
          saveSettings();
        });
      }
    });

    // Line Spacing Sliders & Presets (Desktop Only)
    if (elSliderTitleGap) {
      elSliderTitleGap.addEventListener('input', e => {
        state.titleSpacing = parseFloat(e.target.value);
        applySpacing();
        updateSpacingPillsState();
        saveSettings();
      });
    }

    if (elSliderDetailsGap) {
      elSliderDetailsGap.addEventListener('input', e => {
        state.detailsSpacing = parseFloat(e.target.value);
        applySpacing();
        updateSpacingPillsState();
        saveSettings();
      });
    }

    // Micro Stepper Buttons (+ / -)
    const btnDecTitle = document.getElementById('btn-dec-title');
    const btnIncTitle = document.getElementById('btn-inc-title');
    const btnDecDetails = document.getElementById('btn-dec-details');
    const btnIncDetails = document.getElementById('btn-inc-details');

    if (btnDecTitle) {
      btnDecTitle.addEventListener('click', () => {
        state.titleSpacing = Math.max(0, +(state.titleSpacing - 0.2).toFixed(1));
        applySpacing();
        updateSpacingPillsState();
        saveSettings();
      });
    }

    if (btnIncTitle) {
      btnIncTitle.addEventListener('click', () => {
        state.titleSpacing = Math.min(12, +(state.titleSpacing + 0.2).toFixed(1));
        applySpacing();
        updateSpacingPillsState();
        saveSettings();
      });
    }

    if (btnDecDetails) {
      btnDecDetails.addEventListener('click', () => {
        state.detailsSpacing = Math.max(0.5, +(state.detailsSpacing - 0.1).toFixed(1));
        applySpacing();
        updateSpacingPillsState();
        saveSettings();
      });
    }

    if (btnIncDetails) {
      btnIncDetails.addEventListener('click', () => {
        state.detailsSpacing = Math.min(5.0, +(state.detailsSpacing + 0.1).toFixed(1));
        applySpacing();
        updateSpacingPillsState();
        saveSettings();
      });
    }

    if (elBtnSpacingDefault) {
      elBtnSpacingDefault.addEventListener('click', () => {
        state.titleSpacing = 2.0;
        state.detailsSpacing = 2.05;
        applySpacing();
        setSpacingPillActive('default');
        saveSettings();
      });
    }

    if (elBtnSpacingCompact) {
      elBtnSpacingCompact.addEventListener('click', () => {
        state.titleSpacing = 1.0;
        state.detailsSpacing = 1.4;
        applySpacing();
        setSpacingPillActive('compact');
        saveSettings();
      });
    }

    if (elBtnSpacingRelaxed) {
      elBtnSpacingRelaxed.addEventListener('click', () => {
        state.titleSpacing = 4.5;
        state.detailsSpacing = 3.0;
        applySpacing();
        setSpacingPillActive('relaxed');
        saveSettings();
      });
    }

    // Quick Pick Pills (Class, Sem, Teachers)
    document.querySelectorAll('.pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetField = btn.getAttribute('data-target');
        const value = btn.getAttribute('data-value');
        if (targetField && value) {
          state[targetField] = value;
          syncInputsWithState();
          renderAll();
          saveSettings();

          // Highlight selected pill in the same group
          btn.parentElement.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        }
      });
    });

    // Custom Logo File Upload
    if (elLogoUpload) {
      elLogoUpload.addEventListener('change', e => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = ev => {
            state.customLogoUrl = ev.target.result;
            renderAll();
            showToast('Custom logo uploaded!', 'success');
          };
          reader.readAsDataURL(file);
        }
      });
    }

    if (elResetLogoBtn) {
      elResetLogoBtn.addEventListener('click', () => {
        state.customLogoUrl = null;
        if (elLogoUpload) elLogoUpload.value = '';
        renderAll();
        showToast('Reset to MMC official logo', 'info');
      });
    }

    // Accordions
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const acc = header.closest('.accordion');
        acc.classList.toggle('open');
      });
    });

    // Action Buttons
    if (btnDownloadPdf) btnDownloadPdf.addEventListener('click', downloadPDF);
    if (btnDownloadPng) btnDownloadPng.addEventListener('click', downloadPNG);
    if (btnPrint) btnPrint.addEventListener('click', () => window.print());
    if (btnCopyImg) btnCopyImg.addEventListener('click', copyToClipboard);

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (confirm('Reset all fields to default Data Mining front page?')) {
          // 1. Purge all localStorage keys completely
          try {
            ['mmc_front_page_user', 'mmc_front_page_user_v2', 'mmc_front_page_user_v3', STORAGE_KEY].forEach(k => {
              localStorage.removeItem(k);
            });
          } catch (e) {}

          // 2. Reset full state to pristine defaults
          selectPreset('data-mining');
          state.collegeName = 'MANOHAR MEMORIAL COLLEGE';
          state.collegeCity = 'FATEHABAD';
          state.filePrefix = 'PRACTICAL FILE OF';
          state.subject = 'DATA MINING';
          state.teacher = 'Mrs. Nitu Jain';
          state.designation = '(Assistant Professor)';
          state.department = 'Dept. of Computer Science';
          state.studentName = 'SΛNΛM';
          state.studentClass = 'BCA III';
          state.studentSem = '5th';
          state.studentRoll = '24030115470053';
          state.customLogoUrl = null;
          state.titleSpacing = 2.0;
          state.detailsSpacing = 2.05;

          // 3. Immediately persist clean reset state so refresh never brings back old data
          saveSettings();

          setSpacingPillActive('default');
          syncInputsWithState();
          renderAll();
          showToast('Reset to original sample defaults', 'info');
        }
      });
    }

    // Zoom buttons
    if (btnZoomIn) btnZoomIn.addEventListener('click', () => setZoom(state.zoomLevel + 0.1));
    if (btnZoomOut) btnZoomOut.addEventListener('click', () => setZoom(state.zoomLevel - 0.1));
    if (btnZoomFit) btnZoomFit.addEventListener('click', applyInitialZoom);
    if (btnZoom100) btnZoom100.addEventListener('click', () => setZoom(1.0));

    // Mobile tabs
    if (tabBtnForm && tabBtnPreview) {
      tabBtnForm.addEventListener('click', () => {
        tabBtnForm.classList.add('active');
        tabBtnPreview.classList.remove('active');
        elSidebar.classList.remove('hidden-mobile');
        elPreviewPanel.classList.add('hidden-mobile');
      });

      tabBtnPreview.addEventListener('click', () => {
        tabBtnPreview.classList.add('active');
        tabBtnForm.classList.remove('active');
        elSidebar.classList.add('hidden-mobile');
        elPreviewPanel.classList.remove('hidden-mobile');
        applyInitialZoom();
      });
    }

    // Window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth < 900) {
        // Handle mobile layout resize
      }
    });
  }

  // Self-start on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
