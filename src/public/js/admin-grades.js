const $form = document.getElementById("gradeForm");
const $flash = document.getElementById("flash");

const $select = document.getElementById("approvedEnrollmentsSelect");
const $btnReload = document.getElementById("btnReloadApproved");
const $hint = document.getElementById("approvedHint");

function flash(message) {
  $flash.textContent = message;
  $flash.classList.remove("hidden");
  setTimeout(() => $flash.classList.add("hidden"), 2500);
}

function adminHeaders() {
  const token = localStorage.getItem("adminToken") || "admin123";
  return { "Content-Type": "application/json", "x-admin-token": token };
}

async function fetchJSON(url, options) {
  const res = await fetch(url, options);
  const json = await res.json().catch(() => ({}));
  return { res, json };
}

function optionHTML(e) {
  const student = e.Student?.fullName ?? `Student #${e.StudentId}`;
  const course = e.Course?.title ?? `Course #${e.CourseId}`;
  return `<option value="${e.id}">#${e.id} · ${student} → ${course}</option>`;
}

async function loadApprovedEnrollments() {
  $select.innerHTML = `<option value="">Cargando...</option>`;
  $hint.textContent = "";

  const { res, json } = await fetchJSON("/api/enrollments");
  if (!res.ok || !json.ok) {
    $select.innerHTML = `<option value="">Error cargando inscripciones</option>`;
    $hint.textContent = json.message || "No se pudo cargar /api/enrollments";
    return;
  }

  const all = json.data || [];
  const approved = all.filter((x) => x.status === "APROBADA");

  if (approved.length === 0) {
    $select.innerHTML = `<option value="">No hay inscripciones APROBADAS</option>`;
    $hint.textContent = "Aprueba inscripciones en Admin → Inscripciones.";
    return;
  }

  $select.innerHTML =
    `<option value="">Selecciona una inscripción...</option>` +
    approved.map(optionHTML).join("");

  $hint.textContent = `Encontradas: ${approved.length} inscripciones aprobadas.`;
}

// cuando selecciono, relleno enrollmentId
$select?.addEventListener("change", () => {
  const id = Number($select.value);
  if (!id) return;
  document.getElementById("enrollmentId").value = String(id);
});

$btnReload?.addEventListener("click", () => loadApprovedEnrollments());

$form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const enrollmentId = Number(document.getElementById("enrollmentId").value);
  const score = Number(document.getElementById("score").value);
  const feedback = document.getElementById("feedback").value;

  const { res, json } = await fetchJSON("/api/grades", {
    method: "POST",
    headers: adminHeaders(),
    body: JSON.stringify({ enrollmentId, score, feedback }),
  });

  if (!res.ok || !json.ok) {
    flash(json.message || "No se pudo guardar la nota");
    return;
  }

  flash("✅ Nota guardada");
  $form.reset();
  // no reseteamos el select para seguir calificando rápido
});

loadApprovedEnrollments().catch(() => flash("Error inesperado cargando aprobadas"));