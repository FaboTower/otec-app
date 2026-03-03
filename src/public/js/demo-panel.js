const $btnToggle = document.getElementById("btnTogglePanel");
const $panel = document.getElementById("demoPanel");

$btnToggle?.addEventListener("click", () => {
  $panel.classList.toggle("hidden");
});


(async function () {
  const $studentId = document.getElementById("demoStudentId");
  const $adminToken = document.getElementById("demoAdminToken");
  const $btnStudent = document.getElementById("btnSaveStudent");
  const $btnAdmin = document.getElementById("btnSaveAdmin");
  const $status = document.getElementById("demoStatus");

  const $newName = document.getElementById("newStudentName");
  const $newEmail = document.getElementById("newStudentEmail");
  const $btnCreate = document.getElementById("btnCreateStudent");

  const $newCourseTitle = document.getElementById("newCourseTitle");
  const $newCourseCapacity = document.getElementById("newCourseCapacity");
  const $btnCreateCourse = document.getElementById("btnCreateCourse");

  if (
    !$studentId ||
    !$adminToken ||
    !$btnStudent ||
    !$btnAdmin ||
    !$status ||
    !$newName ||
    !$newEmail ||
    !$btnCreate ||
    !$newCourseTitle ||
    !$newCourseCapacity ||
    !$btnCreateCourse
  ) return;

  function setStatus(text) {
    $status.innerHTML = `<span class="demo-pill">${text}</span>`;
  }

  function adminHeaders() {
    const token = localStorage.getItem("adminToken") || "admin123";
    return { "Content-Type": "application/json", "x-admin-token": token };
  }

  async function fetchStudent(id) {
    const res = await fetch(`/api/students/${id}`);
    const json = await res.json();
    if (!res.ok || !json.ok) return null;
    return json.data;
  }

  // Load initial
  const currentStudentId = Number(localStorage.getItem("studentId") || 1);
  const currentAdminToken = localStorage.getItem("adminToken") || "admin123";

  $studentId.value = String(currentStudentId);
  $adminToken.value = currentAdminToken;

  // Paint initial status
  const student = await fetchStudent(currentStudentId);
  if (student) setStatus(`Activo: ${student.fullName} (#${student.id})`);
  else setStatus(`Activo: StudentId #${currentStudentId} (no existe)`);

  // Save StudentId
  $btnStudent.addEventListener("click", async () => {
    const val = Number($studentId.value);

    if (!Number.isInteger(val) || val <= 0) {
      alert("StudentId inválido (debe ser un entero > 0)");
      return;
    }

    setStatus("Activo: validando...");

    const st = await fetchStudent(val);
    if (!st) {
      setStatus(`Activo: StudentId #${val} (no existe)`);
      alert("❌ Ese StudentId no existe. Crea el estudiante primero.");
      return;
    }

    localStorage.setItem("studentId", String(val));
    setStatus(`Activo: ${st.fullName} (#${st.id})`);
    alert(`✅ Student activo: ${st.fullName} (#${st.id})`);
  });

  // Save AdminToken
  $btnAdmin.addEventListener("click", () => {
    const token = String($adminToken.value || "").trim();
    if (!token) {
      alert("AdminToken no puede estar vacío");
      return;
    }
    localStorage.setItem("adminToken", token);
    alert("✅ AdminToken guardado");
  });

  // Create Student
  $btnCreate.addEventListener("click", async () => {
    const fullName = String($newName.value || "").trim();
    const email = String($newEmail.value || "").trim();

    if (fullName.length < 3) {
      alert("Nombre muy corto (mín 3 caracteres)");
      return;
    }
    if (!email.includes("@")) {
      alert("Email inválido");
      return;
    }

    setStatus("Creando estudiante...");

    const res = await fetch("/api/students", {
      method: "POST",
      headers: adminHeaders(),
      body: JSON.stringify({ fullName, email }),
    });

    const json = await res.json();

    if (!res.ok || !json.ok) {
      setStatus("Activo: error creando estudiante");
      alert(json.message || "No se pudo crear estudiante");
      return;
    }

    const created = json.data;

    // auto-set como estudiante activo
    localStorage.setItem("studentId", String(created.id));
    $studentId.value = String(created.id);

    setStatus(`Activo: ${created.fullName} (#${created.id})`);
    alert(`✅ Estudiante creado y activado: ${created.fullName} (#${created.id})`);

    $newName.value = "";
    $newEmail.value = "";
  });

  // Create Course
  $btnCreateCourse.addEventListener("click", async () => {
    const title = String($newCourseTitle.value || "").trim();
    const capacity = Number($newCourseCapacity.value || 20);

    if (title.length < 3) {
      alert("Título muy corto (mín 3 caracteres)");
      return;
    }
    if (!Number.isFinite(capacity) || capacity <= 0) {
      alert("Capacidad inválida (debe ser > 0)");
      return;
    }

    setStatus("Creando curso...");

    const res = await fetch("/api/courses", {
      method: "POST",
      headers: adminHeaders(),
      body: JSON.stringify({
        title,
        capacity,
        description: "Creado desde Panel Demo",
      }),
    });

    const json = await res.json();

    if (!res.ok || !json.ok) {
      setStatus("Activo: error creando curso");
      alert(json.message || "No se pudo crear el curso");
      return;
    }

    const created = json.data;
    setStatus(`Curso creado: ${created.title} (#${created.id})`);
    alert(`✅ Curso creado: ${created.title} (#${created.id})`);

    $newCourseTitle.value = "";
    $newCourseCapacity.value = "";
  });
})();