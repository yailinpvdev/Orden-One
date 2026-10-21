const enlacesMenu = document.querySelectorAll(".nav-link");
const accesosDashboard = document.querySelectorAll(".dashboard-link");

const tituloPagina = document.querySelector("#page-title");
const rutaPagina = document.querySelector("#breadcrumb-section");

const vistaDashboard = document.querySelector("#dashboard-view");
const vistaClientes = document.querySelector("#clientes-view");
const vistaEmpleados = document.querySelector("#empleados-view");

const botonNuevoEmpleado = document.querySelector("#new-employee-button");
const botonCancelarEmpleado = document.querySelector("#cancel-employee-button");
const formularioEmpleado = document.querySelector("#employee-form");
const contenedorFormularioEmpleado = document.querySelector(
  "#employee-form-container",
);
const mensajeFormularioEmpleado = document.querySelector(
  "#employee-form-message",
);

// Mantener cerrado el formulario de empleados al iniciar.
contenedorFormularioEmpleado.hidden = true;

// Abrir el formulario al pulsar Nuevo empleado.
botonNuevoEmpleado.addEventListener("click", () => {
  formularioEmpleado.reset();
  mensajeFormularioEmpleado.textContent = "";
  contenedorFormularioEmpleado.hidden = false;

  const campoNombreEmpleado = document.querySelector("#employee-name");

  if (campoNombreEmpleado) {
    campoNombreEmpleado.focus();
  }
});

// Cerrar el formulario al pulsar Cancelar.
botonCancelarEmpleado.addEventListener("click", () => {
  formularioEmpleado.reset();
  contenedorFormularioEmpleado.hidden = true;
  mensajeFormularioEmpleado.textContent = "";
});

const tablaEmpleados = document.querySelector("#employee-table-body");
const buscadorEmpleados = document.querySelector("#employee-search");

let empleados = [];
let empleadoEnEdicion = null;

const botonNuevoCliente = document.querySelector("#new-client-button");
const botonCancelarCliente = document.querySelector("#cancel-client-button");
const formularioCliente = document.querySelector("#client-form");
const contenedorFormulario = document.querySelector("#client-form-container");
const mensajeFormulario = document.querySelector("#client-form-message");
const tablaClientes = document.querySelector("#client-table-body");
const buscadorClientes = document.querySelector("#client-search");

const campoNombre = document.querySelector("#client-name");
const campoTelefono = document.querySelector("#client-phone");
const campoEmail = document.querySelector("#client-email");
const botonGuardar = formularioCliente.querySelector('button[type="submit"]');
const tituloFormulario = contenedorFormulario.querySelector("h3");
const descripcionFormulario =
  contenedorFormulario.querySelector(".form-heading p");

const nombresSecciones = {
  dashboard: "Panel principal",
  clientes: "Clientes",
  empleados: "Empleados y usuarios",
  servicios: "Servicios",
  citas: "Citas",
  ordenes: "Órdenes de servicio",
  pagos: "Registro de pagos",
  seguimiento: "Seguimiento",
  horarios: "Horarios",
};

let clientes = [];
let clienteEnEdicion = null;

function mostrarSeccion(seccion) {
  const nombre = nombresSecciones[seccion];

  if (!nombre) {
    return;
  }

  enlacesMenu.forEach((enlace) => {
    enlace.classList.toggle("active", enlace.dataset.section === seccion);
  });

  tituloPagina.textContent = nombre;
  rutaPagina.textContent = seccion === "dashboard" ? "Inicio" : nombre;

  vistaDashboard.hidden = seccion !== "dashboard";
  vistaClientes.hidden = seccion !== "clientes";
  vistaEmpleados.hidden = seccion !== "empleados";

  cerrarFormulario();

  if (seccion === "clientes") {
    cargarClientes();
  }
  if (seccion === "empleados") {
    cargarEmpleados();
  }
}

enlacesMenu.forEach((enlace) => {
  enlace.addEventListener("click", (evento) => {
    evento.preventDefault();
    mostrarSeccion(enlace.dataset.section);
  });
});

accesosDashboard.forEach((boton) => {
  boton.addEventListener("click", () => {
    mostrarSeccion(boton.dataset.section);
  });
});

botonNuevoCliente.addEventListener("click", () => {
  prepararNuevoCliente();
});

botonCancelarCliente.addEventListener("click", () => {
  cerrarFormulario();
});

function mostrarMensaje(texto, esError = false) {
  mensajeFormulario.textContent = texto;
  mensajeFormulario.style.color = esError ? "#a13c35" : "#398462";
}

function prepararNuevoCliente() {
  clienteEnEdicion = null;
  formularioCliente.reset();

  tituloFormulario.textContent = "Registrar cliente";
  descripcionFormulario.textContent = "Completa los datos de contacto.";
  botonGuardar.textContent = "Guardar cliente";

  mensajeFormulario.textContent = "";
  contenedorFormulario.hidden = false;
  campoNombre.focus();
}

function prepararEdicionCliente(cliente) {
  clienteEnEdicion = cliente.id_cliente;

  campoNombre.value = cliente.nombre_completo || "";
  campoTelefono.value = cliente.telefono || "";
  campoEmail.value = cliente.email || "";

  tituloFormulario.textContent = "Editar cliente";
  descripcionFormulario.textContent = "Actualiza los datos de contacto.";
  botonGuardar.textContent = "Guardar cambios";

  mensajeFormulario.textContent = "";
  contenedorFormulario.hidden = false;
  contenedorFormulario.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
  campoNombre.focus();
}

function cerrarFormulario() {
  contenedorFormulario.hidden = true;
  formularioCliente.reset();
  mensajeFormulario.textContent = "";
  clienteEnEdicion = null;

  tituloFormulario.textContent = "Registrar cliente";
  descripcionFormulario.textContent = "Completa los datos de contacto.";
  botonGuardar.textContent = "Guardar cliente";
}

function dibujarClientes(lista) {
  tablaClientes.replaceChildren();

  if (lista.length === 0) {
    const fila = document.createElement("tr");
    const celda = document.createElement("td");

    celda.colSpan = 5;
    celda.className = "empty-message";
    celda.textContent = buscadorClientes.value.trim()
      ? "No se encontraron clientes con esa búsqueda."
      : "Todavía no hay clientes para mostrar.";

    fila.appendChild(celda);
    tablaClientes.appendChild(fila);
    return;
  }

  lista.forEach((cliente) => {
    const fila = document.createElement("tr");

    const nombre = document.createElement("td");
    nombre.textContent = cliente.nombre_completo;

    const telefono = document.createElement("td");
    telefono.textContent = cliente.telefono || "—";

    const email = document.createElement("td");
    email.textContent = cliente.email || "—";

    const estado = document.createElement("td");
    estado.textContent = cliente.estado || "Activo";

    const acciones = document.createElement("td");
    const botonEditar = document.createElement("button");

    botonEditar.type = "button";
    botonEditar.className = "secondary-button";
    botonEditar.textContent = "Editar";
    botonEditar.addEventListener("click", () => {
      prepararEdicionCliente(cliente);
    });

    acciones.appendChild(botonEditar);
    fila.append(nombre, telefono, email, estado, acciones);
    tablaClientes.appendChild(fila);
  });
}

async function cargarClientes() {
  tablaClientes.innerHTML =
    '<tr><td colspan="5" class="empty-message">Cargando clientes...</td></tr>';

  try {
    const respuesta = await fetch("http://localhost:3000/api/clientes");

    if (!respuesta.ok) {
      throw new Error("No se pudieron consultar los clientes.");
    }

    clientes = await respuesta.json();
    filtrarClientes();
  } catch (error) {
    tablaClientes.innerHTML =
      '<tr><td colspan="5" class="empty-message">No se pudo conectar con el servidor. Comprueba que el backend esté funcionando.</td></tr>';

    console.error("Error al cargar clientes:", error);
  }
}

function filtrarClientes() {
  const busqueda = buscadorClientes.value.trim().toLowerCase();

  const resultado = clientes.filter((cliente) => {
    const nombre = (cliente.nombre_completo || "").toLowerCase();
    const telefono = (cliente.telefono || "").toLowerCase();
    const email = (cliente.email || "").toLowerCase();

    return (
      nombre.includes(busqueda) ||
      telefono.includes(busqueda) ||
      email.includes(busqueda)
    );
  });

  dibujarClientes(resultado);
}

buscadorClientes.addEventListener("input", filtrarClientes);

formularioCliente.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const datosCliente = {
    nombre_completo: campoNombre.value.trim(),
    telefono: campoTelefono.value.trim(),
    email: campoEmail.value.trim(),
  };

  if (!datosCliente.nombre_completo) {
    mostrarMensaje("El nombre completo es obligatorio.", true);
    return;
  }

  botonGuardar.disabled = true;
  botonGuardar.textContent = "Guardando...";

  try {
    const estaEditando = clienteEnEdicion !== null;

    const url = estaEditando
      ? `http://localhost:3000/api/clientes/${clienteEnEdicion}`
      : "http://localhost:3000/api/clientes";

    const respuesta = await fetch(url, {
      method: estaEditando ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosCliente),
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(
        resultado.mensaje || "No se pudieron guardar los datos del cliente.",
      );
    }

    const mensajeExito = estaEditando
      ? "Cliente actualizado correctamente."
      : "Cliente registrado correctamente.";

    cerrarFormulario();
    mostrarMensaje(mensajeExito);
    await cargarClientes();
  } catch (error) {
    mostrarMensaje(
      error.message ||
        "No se pudieron guardar los datos. Comprueba que el servidor esté funcionando.",
      true,
    );

    console.error("Error al guardar cliente:", error);
  } finally {
    botonGuardar.disabled = false;
    botonGuardar.textContent =
      clienteEnEdicion !== null ? "Guardar cambios" : "Guardar cliente";
  }
});

async function cargarEmpleados() {
  tablaEmpleados.innerHTML =
    '<tr><td colspan="6" class="empty-message">Cargando empleados...</td></tr>';

  try {
    const respuesta = await fetch("http://localhost:3000/api/empleados");

    if (!respuesta.ok) {
      throw new Error("No se pudieron consultar los empleados.");
    }

    empleados = await respuesta.json();
    filtrarEmpleados();
  } catch (error) {
    tablaEmpleados.innerHTML =
      '<tr><td colspan="6" class="empty-message">No se pudieron cargar los empleados. Comprueba que el servidor esté funcionando.</td></tr>';

    console.error("Error al cargar empleados:", error);
  }
}

function filtrarEmpleados() {
  const busqueda = buscadorEmpleados.value.trim().toLowerCase();

  const resultado = empleados.filter((empleado) => {
    const nombre = (empleado.nombre_completo || "").toLowerCase();
    const telefono = (empleado.telefono || "").toLowerCase();
    const email = (empleado.email || "").toLowerCase();
    const cargo = (empleado.cargo || "").toLowerCase();

    return (
      nombre.includes(busqueda) ||
      telefono.includes(busqueda) ||
      email.includes(busqueda) ||
      cargo.includes(busqueda)
    );
  });

  dibujarEmpleados(resultado);
}

function dibujarEmpleados(lista) {
  tablaEmpleados.replaceChildren();

  if (lista.length === 0) {
    const fila = document.createElement("tr");
    const celda = document.createElement("td");

    celda.colSpan = 6;
    celda.className = "empty-message";
    celda.textContent = "Todavía no hay empleados para mostrar.";

    fila.appendChild(celda);
    tablaEmpleados.appendChild(fila);
    return;
  }

  lista.forEach((empleado) => {
    const fila = document.createElement("tr");

    const nombre = document.createElement("td");
    nombre.textContent = empleado.nombre_completo;

    const telefono = document.createElement("td");
    telefono.textContent = empleado.telefono || "—";

    const email = document.createElement("td");
    email.textContent = empleado.email || "—";

    const cargo = document.createElement("td");
    cargo.textContent = empleado.cargo || "—";

    const estado = document.createElement("td");
    estado.textContent = empleado.estado || "Activo";

    const acciones = document.createElement("td");
    acciones.textContent = "—";

    fila.append(nombre, telefono, email, cargo, estado, acciones);
    tablaEmpleados.appendChild(fila);
  });
}

buscadorEmpleados.addEventListener("input", filtrarEmpleados);

const campoNombreEmpleado = document.querySelector("#employee-name");
const campoTelefonoEmpleado = document.querySelector("#employee-phone");
const campoEmailEmpleado = document.querySelector("#employee-email");
const campoCargoEmpleado = document.querySelector("#employee-role");

formularioEmpleado.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const datosEmpleado = {
    nombre_completo: campoNombreEmpleado.value.trim(),
    telefono: campoTelefonoEmpleado.value.trim(),
    email: campoEmailEmpleado.value.trim(),
    cargo: campoCargoEmpleado.value.trim(),
  };

  if (!datosEmpleado.nombre_completo || !datosEmpleado.cargo) {
    mensajeFormularioEmpleado.textContent =
      "El nombre completo y el cargo son obligatorios.";
    mensajeFormularioEmpleado.style.color = "#a13c35";
    return;
  }

  const botonGuardarEmpleado = formularioEmpleado.querySelector(
    'button[type="submit"]',
  );

  botonGuardarEmpleado.disabled = true;
  botonGuardarEmpleado.textContent = "Guardando...";

  try {
    const respuesta = await fetch("http://localhost:3000/api/empleados", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosEmpleado),
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(resultado.mensaje || "No se pudo registrar el empleado.");
    }

    formularioEmpleado.reset();
    contenedorFormularioEmpleado.hidden = true;

    await cargarEmpleados();

    alert("Empleado registrado correctamente.");
  } catch (error) {
    mensajeFormularioEmpleado.textContent = error.message;
    mensajeFormularioEmpleado.style.color = "#a13c35";

    console.error("Error al guardar empleado:", error);
  } finally {
    botonGuardarEmpleado.disabled = false;
    botonGuardarEmpleado.textContent = "Guardar empleado";
  }
});
