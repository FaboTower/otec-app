const $tbody = document.getElementById("enrollmentsTbody");
const $flash = document.getElementById("flash");

const $gradesPanel = document.getElementById("gradesPanel");
const $gradesTbody = document.getElementById("gradesTbody");
const $gradesSubtitle = document.getElementById("gradesSubtitle");
const $btnCloseGrades = document.getElementById("btnCloseGrades");

function flash(message) {
  $flash.textContent = message;
  $flash.classList.remove("hidden");
  setTimeout(() => $flash.classList.add("hidden"), 2500);
}

function badge(status) {
  if (status === "APROBADA") return `<span class="badge ok">APROBADA</span>`;
  if (status === "RECHAZADA") return `<span class="badge no">RECHAZADA</span>`;
  return `<span class="badge pending">PENDIENTE</span>`;
}

async function fetchJSON(url, options) {
  const res = await fetch(url, options);
  const json = await res.json().catch(() => ({}));
  return { res, json };
}

function openGradesPanel({ enrollmentId, courseTitle }) {
  $gradesPanel.classList.remove("hidden");
  $gradesSubtitle.textContent = `Inscripción #${enrollmentId} · Curso: ${courseTitle}`;
  $gradesTbody.innerHTML = `<tr><td colspan="4">Cargando...</td></tr>`;
}

function closeGradesPanel() {
  $gradesPanel.classList.add("hidden");
  $gradesTbody.innerHTML = "";
  $gradesSubtitle.textContent = "";
}

$btnCloseGrades?.addEventListener("click", closeGradesPanel);

function formatDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString();
}

async function loadGrades(enrollmentId, courseTitle) {
  openGradesPanel({ enrollmentId, courseTitle });

  const { res, json } = await fetchJSON(`/api/grades?enrollmentId=${enrollmentId}`);
  if (!res.ok || !json.ok) {
    $gradesTbody.innerHTML = `<tr><td colspan="4">${json.message || "No se pudieron cargar notas"}</td></tr>`;
    return;
  }

  const grades = json.data || [];
  if (grades.length === 0) {
    $gradesTbody.innerHTML = `<tr><td colspan="4">Aún no hay notas registradas.</td></tr>`;
    return;
  }

  $gradesTbody.innerHTML = grades
    .map((g, idx) => {
      return `
        <tr>
          <td>${idx + 1}</td>
          <td>${g.score}</td>
          <td>${g.feedback ?? "-"}</td>
          <td>${formatDate(g.createdAt)}</td>
        </tr>
      `;
    })
    .join("");
}

function rowHTML(enrollment) {
  const courseTitle = enrollment.Course?.title ?? `Curso #${enrollment.CourseId}`;
  const canViewGrades = enrollment.status === "APROBADA";

  return `
    <tr>
      <td>${courseTitle}</td>
      <td>${badge(enrollment.status)}</td>
      <td>
        ${
          canViewGrades
            ? `<button class="btn secondary" data-action="grades" data-enrollment-id="${enrollment.id}" data-course-title="${encodeURIComponent(
                courseTitle
              )}">
                Ver notas
              </button>`
            : `<span class="muted">-</span>`
        }
      </td>
    </tr>
  `;
}

async function loadEnrollments() {
  const studentId = Number(localStorage.getItem("studentId") || 1);

  const { res, json } = await fetchJSON(`/api/enrollments?studentId=${studentId}`);
  if (!res.ok || !json.ok) {
    flash(json.message || "No se pudieron cargar inscripciones");
    return;
  }

  const list = json.data || [];
  if (list.length === 0) {
    $tbody.innerHTML = `<tr><td colspan="3">No tienes inscripciones aún.</td></tr>`;
    closeGradesPanel();
    return;
  }

  $tbody.innerHTML = list.map(rowHTML).join("");
}

$tbody.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action='grades']");
  if (!btn) return;

  const enrollmentId = Number(btn.dataset.enrollmentId);
  const courseTitle = decodeURIComponent(btn.dataset.courseTitle || "");

  if (!enrollmentId) return;
  loadGrades(enrollmentId, courseTitle).catch(() => {
    flash("Error inesperado cargando notas");
  });
});

loadEnrollments().catch(() => flash("Error inesperado cargando inscripciones"));