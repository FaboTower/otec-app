const $btnToggle = document.getElementById("btnTogglePanel");
const $panel = document.getElementById("demoPanel");
const $navStudentImage = document.getElementById("navStudentImage");

$btnToggle?.addEventListener("click", () => {
  $panel.classList.toggle("hidden");
});

function setNavbarStudentImage(image) {
  if (!$navStudentImage) return;

  if (!image) {
    $navStudentImage.src = "";
    $navStudentImage.classList.add("hidden");
    return;
  }

  $navStudentImage.src = `/uploads/${image}`;
  $navStudentImage.classList.remove("hidden");
}

async function uploadStudentImage(id) {
  const inputFile = document.getElementById("fuImagen");
  const file = inputFile?.files?.[0];
  if (!file) return null;

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`/api/students/${id}/image`, {
    method: "POST",
    body: formData,
  });

  const json = await response.json();
  if (!response.ok || !json.ok) {
    throw new Error(json.message || json.error || "No se pudo subir la imagen");
  }

  return json.data;
}

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
    $status.textContent = text;
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

  const currentStudentId = Number(localStorage.getItem("studentId") || 1);
  const currentAdminToken = localStorage.getItem("adminToken") || "admin123";

  $studentId.value = String(currentStudentId);
  $adminToken.value = currentAdminToken;

  const student = await fetchStudent(currentStudentId);
  if (student) {
    setStatus(`Activo: ${student.fullName} (#${student.id})`);
    setNavbarStudentImage(student.image);
  } else {
    setStatus(`Activo: StudentId #${currentStudentId} (no existe)`);
    setNavbarStudentImage(null);
  }

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
      setNavbarStudentImage(null);
      alert("Ese StudentId no existe. Crea el estudiante primero.");
      return;
    }

    localStorage.setItem("studentId", String(val));
    setStatus(`Activo: ${st.fullName} (#${st.id})`);
    setNavbarStudentImage(st.image);
    alert(`Student activo: ${st.fullName} (#${st.id})`);
  });

  $btnAdmin.addEventListener("click", () => {
    const token = String($adminToken.value || "").trim();
    if (!token) {
      alert("AdminToken no puede estar vacío");
      return;
    }
    localStorage.setItem("adminToken", token);
    alert("AdminToken guardado");
  });

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

    let created = json.data;

    try {
      const studentWithImage = await uploadStudentImage(created.id);
      if (studentWithImage) created = studentWithImage;
    } catch (error) {
      alert(error.message);
    }

    localStorage.setItem("studentId", String(created.id));
    $studentId.value = String(created.id);

    setStatus(`Activo: ${created.fullName} (#${created.id})`);
    setNavbarStudentImage(created.image);
    alert(`Estudiante creado y activado: ${created.fullName} (#${created.id})`);

    $newName.value = "";
    $newEmail.value = "";
    const inputFile = document.getElementById("fuImagen");
    if (inputFile) inputFile.value = "";
  });

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
    alert(`Curso creado: ${created.title} (#${created.id})`);

    $newCourseTitle.value = "";
    $newCourseCapacity.value = "";
  });
})();
