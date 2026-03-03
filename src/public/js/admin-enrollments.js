const $tbody = document.getElementById("adminEnrollmentsTbody");
const $flash = document.getElementById("flash");
const $filter = document.getElementById("filterStatus");
const $btnRefresh = document.getElementById("btnRefresh");

function flash(message) {
  $flash.textContent = message;
  $flash.classList.remove("hidden");
  setTimeout(() => $flash.classList.add("hidden"), 2500);
}

function adminHeaders() {
  const token = localStorage.getItem("adminToken") || "admin123";
  return { "Content-Type": "application/json", "x-admin-token": token };
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

function rowHTML(e) {
  const student = e.Student?.fullName ?? `Student #${e.StudentId}`;
  const course = e.Course?.title ?? `Course #${e.CourseId}`;

  const canAct = e.status === "PENDIENTE";

  return `
    <tr>
      <td>${student}</td>
      <td>${course}</td>
      <td>${badge(e.status)}</td>
      <td>
        ${
          canAct
            ? `
              <button class="btn" data-action="approve" data-id="${e.id}">Aprobar</button>
              <button class="btn secondary" data-action="reject" data-id="${e.id}">Rechazar</button>
            `
            : `<span class="muted">-</span>`
        }
      </td>
    </tr>
  `;
}

async function loadAll() {
  const { res, json } = await fetchJSON("/api/enrollments");
  if (!res.ok || !json.ok) {
    flash(json.message || "No se pudo cargar");
    return;
  }

  let list = json.data || [];

  const filterVal = $filter?.value || "PENDIENTE";
  if (filterVal === "PENDIENTE") {
    list = list.filter((x) => x.status === "PENDIENTE");
  }

  if (list.length === 0) {
    $tbody.innerHTML = `<tr><td colspan="4">No hay inscripciones para el filtro seleccionado.</td></tr>`;
    return;
  }

  $tbody.innerHTML = list.map(rowHTML).join("");
}

async function setStatus(id, status) {
  const { res, json } = await fetchJSON(`/api/enrollments/${id}/status`, {
    method: "PATCH",
    headers: adminHeaders(),
    body: JSON.stringify({ status }),
  });

  if (!res.ok || !json.ok) {
    flash(json.message || "No se pudo actualizar estado");
    return;
  }

  flash(`✅ Estado actualizado a ${status}`);
  loadAll();
}

$tbody.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;

  const id = btn.dataset.id;
  if (btn.dataset.action === "approve") setStatus(id, "APROBADA");
  if (btn.dataset.action === "reject") setStatus(id, "RECHAZADA");
});

$filter?.addEventListener("change", () => loadAll());
$btnRefresh?.addEventListener("click", () => loadAll());

loadAll().catch(() => flash("Error inesperado cargando admin"));