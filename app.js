const REQUIRED_HOURS = 288;

const store = {
  students: {
    S1234567: {
      logs: [
        {
          id: crypto.randomUUID(),
          date: '2026-01-12',
          hours: 7.5,
          site: 'Medical Ward A',
          status: 'approved',
        },
        {
          id: crypto.randomUUID(),
          date: '2026-01-14',
          hours: 8,
          site: 'Emergency Department',
          status: 'pending',
        },
      ],
    },
  },
};

const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((item) => item.classList.remove('is-active'));
    panels.forEach((panel) => panel.classList.remove('is-active'));
    tab.classList.add('is-active');
    document.getElementById(tab.dataset.tab).classList.add('is-active');
  });
});

function getOrCreateStudent(matric) {
  const key = matric.trim().toUpperCase();
  if (!store.students[key]) {
    store.students[key] = { logs: [] };
  }
  return { student: store.students[key], key };
}

function totals(logs) {
  const recorded = logs.reduce((sum, log) => sum + log.hours, 0);
  const verified = logs
    .filter((log) => log.status === 'approved')
    .reduce((sum, log) => sum + log.hours, 0);
  const remaining = Math.max(REQUIRED_HOURS - verified, 0);

  return {
    recorded: Number(recorded.toFixed(1)),
    verified: Number(verified.toFixed(1)),
    remaining: Number(remaining.toFixed(1)),
  };
}

function renderStudentView(matric) {
  const summary = document.getElementById('student-summary');
  const tableBody = document.getElementById('student-logs');

  if (!matric) {
    summary.innerHTML = '';
    tableBody.innerHTML = '';
    return;
  }

  const { student } = getOrCreateStudent(matric);
  const studentTotals = totals(student.logs);

  summary.innerHTML = `
    <div class="metric"><h4>Recorded Hours</h4><p>${studentTotals.recorded}</p></div>
    <div class="metric"><h4>Verified Hours</h4><p>${studentTotals.verified}</p></div>
    <div class="metric"><h4>Hours Remaining</h4><p>${studentTotals.remaining}</p></div>
  `;

  tableBody.innerHTML = student.logs
    .map(
      (log) => `
      <tr>
        <td>${log.date}</td>
        <td>${log.hours}</td>
        <td>${log.site}</td>
        <td class="status-${log.status}">${log.status}</td>
      </tr>
    `,
    )
    .join('');

  renderLecturerView();
}

function renderAssessorRows(matric) {
  const tableBody = document.getElementById('assessor-logs');
  const key = matric?.trim().toUpperCase();

  if (!key || !store.students[key]) {
    tableBody.innerHTML = '<tr><td colspan="4">No student found yet.</td></tr>';
    return;
  }

  const pending = store.students[key].logs.filter((log) => log.status === 'pending');

  if (!pending.length) {
    tableBody.innerHTML = '<tr><td colspan="4">No pending logs to review.</td></tr>';
    return;
  }

  tableBody.innerHTML = pending
    .map(
      (log) => `
      <tr>
        <td>${log.date}</td>
        <td>${log.hours}</td>
        <td>${log.site}</td>
        <td>
          <button class="secondary" data-action="approve" data-matric="${key}" data-log="${log.id}">Approve</button>
          <button class="ghost" data-action="reject" data-matric="${key}" data-log="${log.id}">Reject</button>
        </td>
      </tr>
    `,
    )
    .join('');
}

function renderLecturerView() {
  const body = document.getElementById('lecturer-summary');
  const entries = Object.entries(store.students);

  if (!entries.length) {
    body.innerHTML = '<tr><td colspan="4">No student data.</td></tr>';
    return;
  }

  body.innerHTML = entries
    .map(([matric, data]) => {
      const t = totals(data.logs);
      return `
        <tr>
          <td>${matric}</td>
          <td>${t.recorded}</td>
          <td>${t.verified}</td>
          <td>${t.remaining}</td>
        </tr>
      `;
    })
    .join('');
}

document.getElementById('student-form').addEventListener('submit', (event) => {
  event.preventDefault();

  const matric = document.getElementById('student-matric').value;
  const date = document.getElementById('student-date').value;
  const hours = Number(document.getElementById('student-hours').value);
  const site = document.getElementById('student-site').value.trim();

  if (!matric || !date || !site || Number.isNaN(hours) || hours <= 0) {
    return;
  }

  const { student, key } = getOrCreateStudent(matric);
  student.logs.unshift({
    id: crypto.randomUUID(),
    date,
    hours: Number(hours.toFixed(1)),
    site,
    status: 'pending',
  });

  renderStudentView(key);
  renderAssessorRows(key);
  event.target.reset();
  document.getElementById('student-matric').value = key;
});

document.getElementById('assessor-search').addEventListener('submit', (event) => {
  event.preventDefault();
  const matric = document.getElementById('assessor-matric').value;
  renderAssessorRows(matric);
});

document.getElementById('assessor-logs').addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) {
    return;
  }

  const matric = button.dataset.matric;
  const logId = button.dataset.log;
  const action = button.dataset.action;

  const student = store.students[matric];
  if (!student) {
    return;
  }

  const log = student.logs.find((item) => item.id === logId);
  if (!log || log.status !== 'pending') {
    return;
  }

  log.status = action === 'approve' ? 'approved' : 'rejected';

  renderAssessorRows(matric);
  renderStudentView(matric);
});

renderStudentView('S1234567');
renderAssessorRows('S1234567');
renderLecturerView();
