const $grid = document.getElementById("coursesGrid");
const $flash = document.getElementById("flash");

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

// Map: courseId -> { status, enrollmentId }
function buildEnrollmentMap(enrollments) {
  const map = new Map();
  for (const e of enrollments) {
    // Según tu modelo, debería venir CourseId
    const courseId = e.CourseId ?? e.Course?.id;
    if (!courseId) continue;

    map.set(Number(courseId), {
      status: e.status,
      enrollmentId: e.id,
    });
  }
  return map;
}

function courseCardHTML(course, enrollmentInfo) {
  const isEnrolled = Boolean(enrollmentInfo);
  const status = enrollmentInfo?.status;

  return `
    <div class="card">
      <div class="card-body">
        <h3 class="card-title">${course.title}</h3>
        <p class="card-desc">${course.description ?? ""}</p>
        <div class="card-meta">
          <span>Cupo: ${course.capacity}</span>
          ${isEnrolled ? badge(status) : ""}
        </div>
      </div>
      <div class="card-actions">
        ${
          isEnrolled
            ? `<button class="btn secondary" disabled>Ya inscrito</button>`
            : `<button class="btn" data-action="enroll" data-course-id="${course.id}">
                Inscribirme
              </button>`
        }
      </div>
    </div>
  `;
}

async function fetchJSON(url, options) {
  const res = await fetch(url, options);
  const json = await res.json().catch(() => ({}));
  return { res, json };
}

async function loadCoursesAndEnrollments() {
  const studentId = Number(localStorage.getItem("studentId") || 1);

  // 1) Traer cursos
  const coursesResp = await fetchJSON("/api/courses");
  if (!coursesResp.res.ok || !coursesResp.json.ok) {
    flash(coursesResp.json.message || "No se pudieron cargar cursos");
    return;
  }

  // 2) Traer inscripciones del estudiante activo
  const enrollResp = await fetchJSON(`/api/enrollments?studentId=${studentId}`);
  if (!enrollResp.res.ok || !enrollResp.json.ok) {
    // No rompemos la página: si falla enrollments, igual mostramos cursos
    flash("⚠️ No se pudieron cargar inscripciones (mostrando cursos igual)");
  }

  const enrollmentMap = buildEnrollmentMap(enrollResp.json.data || []);
  const courses = coursesResp.json.data;

  $grid.innerHTML = courses
    .map((c) => courseCardHTML(c, enrollmentMap.get(Number(c.id))))
    .join("");
}

async function enroll(courseId) {
  const studentId = Number(localStorage.getItem("studentId") || 1);

  const { res, json } = await fetchJSON("/api/enrollments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentId, courseId: Number(courseId) }),
  });

  if (!res.ok || !json.ok) {
    flash(json.message || "No se pudo inscribir");
    return;
  }

  flash("✅ Inscripción creada (PENDIENTE)");

  // recargar para deshabilitar el botón
  loadCoursesAndEnrollments().catch(() => {});
}

$grid.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action='enroll']");
  if (!btn) return;
  enroll(btn.dataset.courseId);
});

loadCoursesAndEnrollments().catch(() =>
  flash("Error inesperado cargando cursos")
);