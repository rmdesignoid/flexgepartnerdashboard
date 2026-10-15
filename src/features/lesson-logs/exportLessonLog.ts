type RecordRow = { date: string; time: string; name: string; goal: string; grammars: string[]; summary: string; status: string; taught: boolean };

export function exportLessonLog(records: RecordRow[], period: string, filters: string) {
  const escape = (value: string) => value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
  const metrics = [[records.length, "Classes in period"], [records.filter(r => r.taught).length, "Classes taught"], [records.filter(r => r.status === "Scheduled").length, "Scheduled classes"], [records.filter(r => r.status === "Rescheduled").length, "Rescheduled classes"], [records.filter(r => r.status === "Canceled").length, "Canceled classes"]];
  // The printable iframe has its own document; carry over the shared DS tokens.
  const theme = getComputedStyle(document.documentElement);
  const tokenNames = ["font-sans", "font-size-xs", "font-size-sm", "font-size-lg", "font-size-2xl", "line-height-xs", "line-height-sm", "line-height-lg", "line-height-2xl", "font-weight-normal", "font-weight-medium", "font-weight-semibold", "space-1", "space-2", "space-3", "space-4", "space-6"];
  const reportTokens = tokenNames.map(name => `--ds-${name}:${theme.getPropertyValue(`--ds-${name}`).trim()};`).join("");
  const report = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Lesson Logs report</title><style>
    :root{${reportTokens}}
    @font-face{font-family:Inter;font-style:normal;font-weight:100 900;font-display:swap;src:url("${escape(window.location.origin)}/fonts/inter-latin.woff2") format("woff2")}
    @page{size:A4 landscape;margin:12mm}
    *{box-sizing:border-box}
    body{font-family:var(--ds-font-sans);font-size:var(--ds-font-size-sm);line-height:var(--ds-line-height-sm);font-weight:var(--ds-font-weight-normal);color:#374151;background:white;margin:var(--ds-space-6)}
    header{display:flex;gap:var(--ds-space-4);justify-content:space-between;align-items:flex-start;margin-bottom:var(--ds-space-4);break-inside:avoid}
    header img{width:69px;height:32px;flex-shrink:0}
    h1{font-size:var(--ds-font-size-2xl);line-height:var(--ds-line-height-2xl);font-weight:var(--ds-font-weight-semibold);margin:0 0 var(--ds-space-1);letter-spacing:-.025em}
    p{margin:0;font:inherit}
    header p{color:#6b7280}
    .period{font-weight:var(--ds-font-weight-medium)}
    .filters{margin-top:var(--ds-space-1);font-size:var(--ds-font-size-xs);line-height:var(--ds-line-height-xs);color:#6b7280}
    .metrics{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:var(--ds-space-3);margin:var(--ds-space-6) 0;break-inside:avoid}
    .metrics strong{font-size:var(--ds-font-size-lg);line-height:var(--ds-line-height-lg);font-weight:var(--ds-font-weight-semibold);display:block}
    .metrics span{display:block;font-size:var(--ds-font-size-xs);line-height:var(--ds-line-height-xs);color:#6b7280}
    table{width:100%;border-collapse:collapse;table-layout:fixed;font:inherit}
    th{background:#f3f4f6;text-align:left;font-weight:var(--ds-font-weight-medium)}
    td,th{padding:var(--ds-space-3) var(--ds-space-2);vertical-align:top;border-bottom:1px solid #d1d5db;overflow-wrap:break-word}
    td:last-child{font-size:var(--ds-font-size-xs);line-height:var(--ds-line-height-xs)}
    .record-date{display:block}
    .record-time{display:block;color:#6b7280;font-size:var(--ds-font-size-xs);line-height:var(--ds-line-height-xs)}
    thead{display:table-header-group}
    tr{break-inside:avoid}
    footer{margin-top:var(--ds-space-4);font-size:var(--ds-font-size-xs);line-height:var(--ds-line-height-xs);color:#6b7280;break-inside:avoid}
    @media print{body{margin:0}th{print-color-adjust:exact;-webkit-print-color-adjust:exact}}
    </style></head><body><header><div><h1>Lesson Logs report</h1><p>Class history, lesson goals, grammar topics and lesson summaries.</p></div><img src="${escape(window.location.origin)}/flexge-logo.svg" alt="Flexge"></header><p class="period">Period: ${escape(period)}</p><p class="filters">${escape(filters)}</p><div class="metrics">${metrics.map(([value, label]) => `<div><strong>${value}</strong><span>${label}</span></div>`).join("")}</div><table><colgroup>${[12,14,19,17,28,10].map(width => `<col style="width:${width}%">`).join("")}</colgroup><thead><tr>${["Date","Class","Lesson goal","Grammars","Lesson summary","Status"].map(label => `<th>${label}</th>`).join("")}</tr></thead><tbody>${records.map(r => `<tr><td><span class="record-date">${escape(r.date)}</span><span class="record-time">${escape(r.time)}</span></td>${[r.name,r.goal,r.grammars.join(", ")||"—",r.summary||"—",r.status].map(value => `<td>${escape(value)}</td>`).join("")}</tr>`).join("")}</tbody></table><footer>${records.length} classes exported</footer></body></html>`;
  const previousFocus = document.activeElement as HTMLElement | null;
  const preview = document.createElement("dialog");
  preview.setAttribute("aria-label", "Lesson Logs report preview");
  preview.style.cssText = "width:min(1100px,calc(100vw - 32px));height:calc(100vh - 48px);max-height:900px;margin:auto;overflow:hidden;padding:0;border:1px solid #d1d5db;border-radius:12px;background:white;color:#374151;box-shadow:0 24px 60px #0003";
  const toolbar = document.createElement("div");
  toolbar.style.cssText = "display:flex;align-items:center;gap:12px;padding:16px 20px;border-bottom:1px solid #d1d5db;font-family:var(--ds-font-sans);font-size:var(--ds-font-size-sm);line-height:var(--ds-line-height-sm)";
  const title = document.createElement("strong");
  title.textContent = "Lesson Logs report";
  title.style.marginRight = "auto";
  const frame = document.createElement("iframe");
  frame.title = "Lesson Logs printable report";
  frame.style.cssText = "display:block;width:100%;height:calc(100% - 65px);border:0";
  frame.srcdoc = report;
  const print = document.createElement("button");
  print.textContent = "Print / Save as PDF";
  print.style.cssText = "font:inherit;font-weight:var(--ds-font-weight-medium);padding:8px 12px;border:0;border-radius:6px;background:#285d8d;color:white;cursor:pointer";
  print.addEventListener("click", async () => {
    await frame.contentDocument?.fonts.ready;
    frame.contentWindow?.focus();
    frame.contentWindow?.print();
  });
  const close = document.createElement("button");
  close.textContent = "Close";
  close.setAttribute("aria-label", "Close report preview");
  close.style.cssText = "font:inherit;font-weight:var(--ds-font-weight-medium);padding:8px 12px;border:1px solid #d1d5db;border-radius:6px;background:white;color:#374151;cursor:pointer";
  close.addEventListener("click", () => preview.close());
  preview.addEventListener("close", () => { preview.remove(); previousFocus?.focus(); });
  toolbar.append(title, print, close);
  preview.append(toolbar, frame);
  document.body.append(preview);
  preview.showModal();
  return true;
}
