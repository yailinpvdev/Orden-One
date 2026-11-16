const enlacesMenu = document.querySelectorAll(".nav-link");
const accesosDashboard = document.querySelectorAll(".dashboard-link");

const tituloPagina = document.querySelector("#page-title");
const rutaPagina = document.querySelector("#breadcrumb-section");

const vistaDashboard = document.querySelector("#dashboard-view");
const vistaClientes = document.querySelector("#clientes-view");
const vistaEmpleados = document.querySelector("#empleados-view");
const vistaServicios = document.querySelector("#servicios-view");
const vistaCitas = document.querySelector("#citas-view");
const vistaOrdenes = document.querySelector("#ordenes-view");

const vistaPagos = document.querySelector("#pagos-view");
const vistaSeguimiento = document.querySelector("#seguimiento-view");
const botonNuevaOrden = document.querySelector("#new-order-button");

const formularioOrden = document.querySelector("#order-form");
const contenedorFormularioOrden = document.querySelector(
  "#order-form-container",
);
const botonCancelarOrden = document.querySelector("#cancel-order-button");

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

  localStorage.setItem("ordenoneSeccionActiva", seccion);

  enlacesMenu.forEach((enlace) => {
    enlace.classList.toggle("active", enlace.dataset.section === seccion);
  });

  tituloPagina.textContent = nombre;
  rutaPagina.textContent = seccion === "dashboard" ? "Inicio" : nombre;

  vistaDashboard.hidden = seccion !== "dashboard";
  vistaClientes.hidden = seccion !== "clientes";
  vistaEmpleados.hidden = seccion !== "empleados";
  vistaServicios.hidden = seccion !== "servicios";
  vistaCitas.hidden = seccion !== "citas";
  vistaOrdenes.hidden = seccion !== "ordenes";
  vistaPagos.hidden = seccion !== "pagos";
  vistaSeguimiento.hidden = seccion !== "seguimiento";

  cerrarFormulario();

  if (seccion === "clientes") {
    cargarClientes();
  }
  if (seccion === "empleados") {
    cargarEmpleados();
  }
  if (seccion === "servicios") {
    cargarServicios();
  }
  if (seccion === "citas") {
    cargarCitas();
  }
  if (seccion === "seguimiento") {
    cargarSeguimiento();
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

function prepararEdicionEmpleado(empleado) {
  empleadoEnEdicion = empleado.id_empleado;

  campoNombreEmpleado.value = empleado.nombre_completo || "";
  campoTelefonoEmpleado.value = empleado.telefono || "";
  campoEmailEmpleado.value = empleado.email || "";
  campoCargoEmpleado.value = empleado.cargo || "";

  document.querySelector("#employee-form-title").textContent =
    "Editar empleado";

  mensajeFormularioEmpleado.textContent = "";

  const botonGuardarEmpleado = formularioEmpleado.querySelector(
    'button[type="submit"]',
  );

  botonGuardarEmpleado.textContent = "Guardar cambios";

  contenedorFormularioEmpleado.hidden = false;

  contenedorFormularioEmpleado.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  campoNombreEmpleado.focus();
}

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

const tablaServicios = document.querySelector("#service-table-body");
const botonNuevoServicio = document.querySelector("#new-service-button");
const botonCancelarServicio = document.querySelector("#cancel-service-button");
const formularioServicio = document.querySelector("#service-form");
const contenedorFormularioServicio = document.querySelector(
  "#service-form-container",
);
const mensajeFormularioServicio = document.querySelector(
  "#service-form-message",
);
const buscadorServicios = document.querySelector("#service-search");

let servicios = [];
let servicioEnEdicion = null;
// Abrir el formulario para registrar un servicio
botonNuevoServicio.addEventListener("click", () => {
  formularioServicio.reset();
  servicioEnEdicion = null;
  document.querySelector("#service-form-title").textContent =
    "Registrar servicio";
  formularioServicio.querySelector('button[type="submit"]').textContent =
    "Guardar servicio";
  mensajeFormularioServicio.textContent = "";
  contenedorFormularioServicio.hidden = false;
  contenedorFormularioServicio.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
  document.querySelector("#service-name").focus();
});

// Cerrar el formulario al pulsar Cancelar
botonCancelarServicio.addEventListener("click", () => {
  formularioServicio.reset();
  mensajeFormularioServicio.textContent = "";
  contenedorFormularioServicio.hidden = true;
  servicioEnEdicion = null;
  document.querySelector("#service-form-title").textContent =
    "Registrar servicio";
  formularioServicio.querySelector('button[type="submit"]').textContent =
    "Guardar servicio";
});

function prepararEdicionServicio(servicio) {
  servicioEnEdicion = servicio.id_servicio;

  document.querySelector("#service-name").value = servicio.nombre || "";
  document.querySelector("#service-price").value = Number(servicio.precio_base);
  document.querySelector("#service-duration").value =
    servicio.duracion_estimada ?? "";
  document.querySelector("#service-description").value =
    servicio.descripcion || "";

  document.querySelector("#service-form-title").textContent = "Editar servicio";

  formularioServicio.querySelector('button[type="submit"]').textContent =
    "Guardar cambios";

  mensajeFormularioServicio.textContent = "";
  contenedorFormularioServicio.hidden = false;

  contenedorFormularioServicio.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  document.querySelector("#service-name").focus();
}

async function cargarServicios() {
  tablaServicios.innerHTML =
    '<tr><td colspan="6" class="empty-message">Cargando servicios...</td></tr>';

  try {
    const respuesta = await fetch("http://localhost:3000/api/servicios");

    if (!respuesta.ok) {
      throw new Error("No se pudieron consultar los servicios.");
    }

    servicios = await respuesta.json();
    filtrarServicios();
  } catch (error) {
    tablaServicios.innerHTML =
      '<tr><td colspan="6" class="empty-message">No se pudieron cargar los servicios.</td></tr>';

    console.error("Error al cargar servicios:", error);
  }
}

function dibujarServicios(lista) {
  tablaServicios.replaceChildren();

  if (lista.length === 0) {
    const fila = document.createElement("tr");
    const celda = document.createElement("td");

    celda.colSpan = 6;
    celda.className = "empty-message";
    celda.textContent = buscadorServicios.value.trim()
      ? "No se encontraron servicios con esa búsqueda."
      : "Todavía no hay servicios para mostrar.";

    fila.appendChild(celda);
    tablaServicios.appendChild(fila);
    return;
  }

  lista.forEach((servicio) => {
    const fila = document.createElement("tr");

    const nombre = document.createElement("td");
    nombre.textContent = servicio.nombre;

    const descripcion = document.createElement("td");
    descripcion.textContent = servicio.descripcion || "—";

    const precio = document.createElement("td");

    const valorPrecio = Number(servicio.precio_base);
    console.log(
      "Precio recibido:",
      servicio.precio_base,
      "| Precio convertido:",
      valorPrecio,
    );

    precio.textContent = `$${valorPrecio.toLocaleString("es-CO", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      useGrouping: true,
    })}`;

    const duracion = document.createElement("td");
    duracion.textContent = servicio.duracion_estimada;

    const estado = document.createElement("td");
    estado.textContent = servicio.estado || "Activo";

    const acciones = document.createElement("td");

    const botonEditar = document.createElement("button");
    botonEditar.type = "button";
    botonEditar.textContent = "Editar";
    botonEditar.className = "secondary-button";

    botonEditar.addEventListener("click", () => {
      prepararEdicionServicio(servicio);
    });

    acciones.appendChild(botonEditar);

    fila.append(nombre, descripcion, precio, duracion, estado, acciones);
    tablaServicios.appendChild(fila);
  });
}

function filtrarServicios() {
  const busqueda = buscadorServicios.value.trim().toLowerCase();

  const resultado = servicios.filter((servicio) =>
    [servicio.nombre, servicio.descripcion].some((dato) =>
      (dato || "").toLowerCase().includes(busqueda),
    ),
  );

  dibujarServicios(resultado);
}

buscadorServicios.addEventListener("input", filtrarServicios);

formularioServicio.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const datos = new FormData(formularioServicio);

  const precioTexto = String(datos.get("precio_base") ?? "").trim();
  const precioNormalizado = precioTexto.replace(/\./g, "").replace(",", ".");
  const precio = Number(precioNormalizado);
  const duracion = Number(datos.get("duracion_estimada"));

  if (!Number.isFinite(precio) || precio < 0) {
    mensajeFormularioServicio.textContent =
      "Introduce un precio válido, usando punto para los decimales.";
    return;
  }

  if (!Number.isInteger(duracion) || duracion < 1) {
    mensajeFormularioServicio.textContent =
      "La duración debe ser un número entero mayor que cero.";
    return;
  }

  const servicio = {
    nombre: String(datos.get("nombre") || "").trim(),
    precio_base: precio,
    duracion_estimada: duracion,
    descripcion: String(datos.get("descripcion") || "").trim(),
  };

  const botonGuardar = formularioServicio.querySelector(
    'button[type="submit"]',
  );

  botonGuardar.disabled = true;
  botonGuardar.textContent = "Guardando...";
  mensajeFormularioServicio.textContent = "";

  try {
    const editando = servicioEnEdicion !== null;

    const respuesta = await fetch(
      editando
        ? `http://localhost:3000/api/servicios/${servicioEnEdicion}`
        : "http://localhost:3000/api/servicios",
      {
        method: editando ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(servicio),
      },
    );

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(resultado.mensaje || "No se pudo guardar el servicio.");
    }

    mensajeFormularioServicio.textContent = editando
      ? "¡Servicio actualizado correctamente!"
      : "¡Servicio registrado correctamente!";

    formularioServicio.reset();
    servicioEnEdicion = null;
    document.querySelector("#service-form-title").textContent =
      "Registrar servicio";
    formularioServicio.querySelector('button[type="submit"]').textContent =
      "Guardar servicio";
    await cargarServicios();

    contenedorFormularioServicio.hidden = true;
  } catch (error) {
    mensajeFormularioServicio.textContent = error.message;
    console.error("Error al guardar el servicio:", error);
  } finally {
    botonGuardar.disabled = false;
    botonGuardar.textContent =
      servicioEnEdicion !== null ? "Guardar cambios" : "Guardar servicio";
  }
});

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
    const botonEditarEmpleado = document.createElement("button");

    botonEditarEmpleado.type = "button";
    botonEditarEmpleado.className = "secondary-button";
    botonEditarEmpleado.textContent = "Editar";

    botonEditarEmpleado.addEventListener("click", () => {
      prepararEdicionEmpleado(empleado);
    });

    acciones.appendChild(botonEditarEmpleado);

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
    const estaEditando = empleadoEnEdicion !== null;

    const url = estaEditando
      ? `http://localhost:3000/api/empleados/${empleadoEnEdicion}`
      : "http://localhost:3000/api/empleados";

    const respuesta = await fetch(url, {
      method: estaEditando ? "PUT" : "POST",
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
    empleadoEnEdicion = null;

    document.querySelector("#employee-form-title").textContent =
      "Registrar empleado";

    botonGuardarEmpleado.textContent = "Guardar empleado";

    await cargarEmpleados();

    alert(
      estaEditando
        ? "Empleado actualizado correctamente."
        : "Empleado registrado correctamente.",
    );
  } catch (error) {
    mensajeFormularioEmpleado.textContent = error.message;
    mensajeFormularioEmpleado.style.color = "#a13c35";

    console.error("Error al guardar empleado:", error);
  } finally {
    botonGuardarEmpleado.disabled = false;
    botonGuardarEmpleado.textContent =
      empleadoEnEdicion !== null ? "Guardar cambios" : "Guardar empleado";
  }
});

/* =========================================
   MÓDULO DE CITAS
========================================= */

const botonNuevaCita = document.querySelector("#new-appointment-button");
const botonCancelarCita = document.querySelector("#cancel-appointment-button");
const formularioCita = document.querySelector("#appointment-form");
const contenedorFormularioCita = document.querySelector(
  "#appointment-form-container",
);
const mensajeFormularioCita = document.querySelector(
  "#appointment-form-message",
);
const tablaCitas = document.querySelector("#appointment-table-body");
const buscadorCitas = document.querySelector("#appointment-search");

const selectClienteCita = document.querySelector("#appointment-client");
const selectEmpleadoCita = document.querySelector("#appointment-employee");
const selectServicioCita = document.querySelector("#appointment-service");

let citas = [];
let citaEditandoId = null;

async function cargarOpcionesCita() {
  try {
    const [respuestaClientes, respuestaEmpleados, respuestaServicios] =
      await Promise.all([
        fetch("http://localhost:3000/api/clientes"),
        fetch("http://localhost:3000/api/empleados"),
        fetch("http://localhost:3000/api/servicios"),
      ]);

    if (
      !respuestaClientes.ok ||
      !respuestaEmpleados.ok ||
      !respuestaServicios.ok
    ) {
      throw new Error("No se pudieron cargar los datos.");
    }

    const [listaClientes, listaEmpleados, listaServicios] = await Promise.all([
      respuestaClientes.json(),
      respuestaEmpleados.json(),
      respuestaServicios.json(),
    ]);

    selectClienteCita.innerHTML =
      '<option value="">Selecciona un cliente</option>';
    selectEmpleadoCita.innerHTML =
      '<option value="">Selecciona un empleado</option>';
    selectServicioCita.innerHTML =
      '<option value="">Selecciona un servicio</option>';

    listaClientes.forEach((cliente) => {
      const opcion = document.createElement("option");
      opcion.value = cliente.id_cliente;
      opcion.textContent = cliente.nombre_completo;
      selectClienteCita.appendChild(opcion);
    });

    listaEmpleados.forEach((empleado) => {
      const opcion = document.createElement("option");
      opcion.value = empleado.id_empleado;
      opcion.textContent = empleado.nombre_completo;
      selectEmpleadoCita.appendChild(opcion);
    });

    listaServicios.forEach((servicio) => {
      const opcion = document.createElement("option");
      opcion.value = servicio.id_servicio;
      opcion.textContent = servicio.nombre;
      selectServicioCita.appendChild(opcion);
    });
  } catch (error) {
    mensajeFormularioCita.textContent = error.message;
    mensajeFormularioCita.style.color = "#a13c35";
  }
}

async function cargarCitas() {
  try {
    const respuesta = await fetch("http://localhost:3000/api/citas");

    if (!respuesta.ok) {
      throw new Error("No se pudieron cargar las citas.");
    }

    citas = await respuesta.json();
    dibujarCitas(citas);
  } catch (error) {
    tablaCitas.innerHTML =
      '<tr><td colspan="7" class="empty-message">No se pudieron cargar las citas.</td></tr>';

    console.error("Error al cargar citas:", error);
  }
}

function dibujarCitas(lista) {
  tablaCitas.replaceChildren();

  if (lista.length === 0) {
    tablaCitas.innerHTML =
      '<tr><td colspan="7" class="empty-message">Todavía no hay citas para mostrar.</td></tr>';
    return;
  }

  lista.forEach((cita) => {
    const fila = document.createElement("tr");

    const datos = [
      cita.cliente,
      cita.empleado || "Sin asignar",
      Array.isArray(cita.servicios) ? cita.servicios.join(", ") : "—",
      cita.fecha ? new Date(cita.fecha).toLocaleDateString("es-CO") : "—",
      cita.hora || "—",
      cita.estado || "—",
    ];

    datos.forEach((dato) => {
      const celda = document.createElement("td");
      celda.textContent = dato;
      fila.appendChild(celda);
    });

    const acciones = document.createElement("td");

    const botonEditar = document.createElement("button");
    botonEditar.textContent = "Editar";
    botonEditar.type = "button";
    botonEditar.className = "btn-accion btn-editar";
    botonEditar.addEventListener("click", () => prepararEdicionCita(cita));

    const botonCancelar = document.createElement("button");
    botonCancelar.textContent = "Cancelar";
    botonCancelar.type = "button";
    botonCancelar.className = "btn-accion btn-cancelar";
    botonCancelar.addEventListener("click", () => cancelarCita(cita.id_cita));

    acciones.append(botonEditar, botonCancelar);
    fila.appendChild(acciones);

    tablaCitas.appendChild(fila);
  });
}

async function prepararEdicionCita(cita) {
  citaEditandoId = cita.id_cita;

  contenedorFormularioCita.hidden = false;

  await cargarOpcionesCita();

  selectClienteCita.value = cita.id_cliente;
  selectEmpleadoCita.value = cita.id_empleado || "";
  selectServicioCita.value = cita.id_servicios?.[0] || "";

  document.querySelector("#appointment-date").value =
    cita.fecha?.split("T")[0] || "";

  document.querySelector("#appointment-time").value = String(
    cita.hora || "",
  ).slice(0, 5);

  document.querySelector("#appointment-status").value =
    cita.estado || "Programada";

  document.querySelector("#appointment-notes").value = cita.observaciones || "";

  const botonGuardar = formularioCita.querySelector('button[type="submit"]');

  botonGuardar.textContent = "Guardar cambios";

  mensajeFormularioCita.textContent = "";

  contenedorFormularioCita.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

async function cancelarCita(id) {
  const confirmar = confirm("¿Estás segura de que deseas cancelar esta cita?");

  if (!confirmar) {
    return;
  }

  try {
    const respuesta = await fetch(
      `http://localhost:3000/api/citas/${id}/cancelar`,
      {
        method: "PATCH",
      },
    );

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(resultado.mensaje || "No se pudo cancelar la cita.");
    }

    alert("La cita ha sido cancelada correctamente.");

    await cargarCitas();
  } catch (error) {
    alert(error.message);
    console.error("Error al cancelar cita:", error);
  }
}

botonNuevaCita.addEventListener("click", async () => {
  formularioCita.reset();
  citaEditandoId = null;

  formularioCita.querySelector('button[type="submit"]').textContent =
    "Guardar cita";
  mensajeFormularioCita.textContent = "";
  contenedorFormularioCita.hidden = false;

  await cargarOpcionesCita();

  contenedorFormularioCita.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
});

botonCancelarCita.addEventListener("click", () => {
  formularioCita.reset();
  contenedorFormularioCita.hidden = true;
  mensajeFormularioCita.textContent = "";
});

formularioCita.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const datosCita = {
    id_cliente: selectClienteCita.value,
    id_empleado: selectEmpleadoCita.value || null,
    fecha: document.querySelector("#appointment-date").value,
    hora: document.querySelector("#appointment-time").value,
    estado: document.querySelector("#appointment-status").value,
    observaciones: document.querySelector("#appointment-notes").value.trim(),
    id_servicios: [Number(selectServicioCita.value)],
  };

  const botonGuardarCita = formularioCita.querySelector(
    'button[type="submit"]',
  );

  try {
    botonGuardarCita.disabled = true;
    botonGuardarCita.textContent = "Guardando...";

    const respuesta = await fetch(
      citaEditandoId
        ? `http://localhost:3000/api/citas/${citaEditandoId}`
        : "http://localhost:3000/api/citas",
      {
        method: citaEditandoId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosCita),
      },
    );

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(resultado.mensaje || "No se pudo registrar la cita.");
    }

    const estabaEditando = citaEditandoId !== null;

    formularioCita.reset();
    contenedorFormularioCita.hidden = true;
    citaEditandoId = null;

    await cargarCitas();

    alert(
      estabaEditando
        ? "Cita actualizada correctamente."
        : "Cita registrada correctamente.",
    );
  } catch (error) {
    mensajeFormularioCita.textContent = error.message;
    mensajeFormularioCita.style.color = "#a13c35";
    console.error("Error al guardar cita:", error);
  } finally {
    botonGuardarCita.disabled = false;
    botonGuardarCita.textContent = "Guardar cita";
  }
});

buscadorCitas.addEventListener("input", () => {
  const busqueda = buscadorCitas.value.trim().toLowerCase();

  const resultado = citas.filter((cita) =>
    [cita.cliente, cita.empleado, cita.estado, ...(cita.servicios || [])]
      .join(" ")
      .toLowerCase()
      .includes(busqueda),
  );

  dibujarCitas(resultado);
});

mostrarSeccion(localStorage.getItem("ordenoneSeccionActiva") || "dashboard");

// ==========================================
// FUNCIONALIDAD DE ÓRDENES DE SERVICIO
// ==========================================

const tablaOrdenes = document.querySelector("#order-table-body");
const buscadorOrdenes = document.querySelector("#order-search");

const selectClienteOrden = document.querySelector("#order-client");
const selectEmpleadoOrden = document.querySelector("#order-employee");
const selectCitaOrden = document.querySelector("#order-appointment");
const selectServicioOrden = document.querySelector("#order-service");

const campoFechaOrden = document.querySelector("#order-date");
const campoCantidadOrden = document.querySelector("#order-quantity");
const campoObservacionesOrden = document.querySelector("#order-observations");

let ordenes = [];

async function cargarOpcionesOrden() {
  try {
    const [rClientes, rEmpleados, rServicios, rCitas] = await Promise.all([
      fetch("http://localhost:3000/api/clientes"),
      fetch("http://localhost:3000/api/empleados"),
      fetch("http://localhost:3000/api/servicios"),
      fetch("http://localhost:3000/api/citas"),
    ]);

    if (![rClientes, rEmpleados, rServicios, rCitas].every((r) => r.ok)) {
      throw new Error("No se pudieron cargar los datos del formulario.");
    }

    const [clientes, empleados, servicios, citas] = await Promise.all([
      rClientes.json(),
      rEmpleados.json(),
      rServicios.json(),
      rCitas.json(),
    ]);

    selectClienteOrden.innerHTML =
      '<option value="">Seleccionar cliente</option>';
    selectEmpleadoOrden.innerHTML =
      '<option value="">Seleccionar empleado</option>';
    selectServicioOrden.innerHTML =
      '<option value="">Seleccionar servicio</option>';
    selectCitaOrden.innerHTML = '<option value="">Sin cita asociada</option>';

    clientes.forEach((cliente) => {
      const opcion = document.createElement("option");
      opcion.value = cliente.id_cliente;
      opcion.textContent = cliente.nombre_completo;
      selectClienteOrden.appendChild(opcion);
    });

    empleados.forEach((empleado) => {
      const opcion = document.createElement("option");
      opcion.value = empleado.id_empleado;
      opcion.textContent = empleado.nombre_completo;
      selectEmpleadoOrden.appendChild(opcion);
    });

    servicios.forEach((servicio) => {
      const opcion = document.createElement("option");
      opcion.value = servicio.id_servicio;
      opcion.textContent = `${servicio.nombre} - $${Number(servicio.precio_base).toLocaleString("es-CO")}`;
      selectServicioOrden.appendChild(opcion);
    });

    citas.forEach((cita) => {
      const opcion = document.createElement("option");
      opcion.value = cita.id_cita;
      opcion.textContent = `Cita #${cita.id_cita} - ${cita.cliente}`;
      selectCitaOrden.appendChild(opcion);
    });
  } catch (error) {
    alert(error.message);
    console.error("Error al cargar opciones de orden:", error);
  }
}

async function cargarOrdenes() {
  try {
    const respuesta = await fetch("http://localhost:3000/api/ordenes");

    if (!respuesta.ok) {
      throw new Error("No se pudieron consultar las órdenes.");
    }

    ordenes = await respuesta.json();
    dibujarOrdenes(ordenes);
  } catch (error) {
    tablaOrdenes.innerHTML =
      '<tr><td colspan="7" class="empty-message">No se pudieron cargar las órdenes.</td></tr>';

    console.error("Error al cargar órdenes:", error);
  }
}

function dibujarOrdenes(lista) {
  tablaOrdenes.replaceChildren();

  if (lista.length === 0) {
    tablaOrdenes.innerHTML =
      '<tr><td colspan="7" class="empty-message">Todavía no hay órdenes para mostrar.</td></tr>';
    return;
  }

  lista.forEach((orden) => {
    const fila = document.createElement("tr");

    const datos = [
      `#${orden.id_orden}`,
      orden.cliente,
      orden.empleado,
      orden.fecha_servicio
        ? new Date(orden.fecha_servicio).toLocaleDateString("es-CO")
        : "—",
      `$${Number(orden.total).toLocaleString("es-CO")}`,
      orden.estado,
    ];

    datos.forEach((dato) => {
      const celda = document.createElement("td");
      celda.textContent = dato ?? "—";
      fila.appendChild(celda);
    });

    const acciones = document.createElement("td");
    const botonDetalle = document.createElement("button");

    botonDetalle.type = "button";
    botonDetalle.className = "btn-accion btn-editar";
    botonDetalle.textContent = "Ver";

    botonDetalle.addEventListener("click", () => {
      const servicios = (orden.servicios || [])
        .map(
          (servicio) =>
            `${servicio.nombre} x ${servicio.cantidad} - $${Number(servicio.precio).toLocaleString("es-CO")}`,
        )
        .join("\n");

      alert(
        `Orden #${orden.id_orden}\n\n` +
          `Cliente: ${orden.cliente}\n` +
          `Empleado: ${orden.empleado}\n` +
          `Servicios:\n${servicios}\n\n` +
          `Total: $${Number(orden.total).toLocaleString("es-CO")}\n` +
          `Estado: ${orden.estado}\n` +
          `Observaciones: ${orden.observaciones || "Ninguna"}`,
      );
    });

    const botonEditar = document.createElement("button");
    botonEditar.type = "button";
    botonEditar.className = "btn-accion btn-editar";
    botonEditar.textContent = "Editar";

    botonEditar.addEventListener("click", async () => {
      if (orden.estado !== "Registrada") {
        alert("Solo se pueden editar órdenes registradas.");
        return;
      }

      formularioOrden.reset();
      await cargarOpcionesOrden();

      window.ordenEditandoId = orden.id_orden;

      selectClienteOrden.value = orden.id_cliente;
      selectEmpleadoOrden.value = orden.id_empleado;
      selectCitaOrden.value = orden.id_cita || "";
      campoFechaOrden.value = orden.fecha_servicio
        ? String(orden.fecha_servicio).replace(" ", "T").slice(0, 16)
        : "";
      campoObservacionesOrden.value = orden.observaciones || "";

      const detalle = orden.servicios?.[0];

      if (detalle) {
        selectServicioOrden.value = detalle.id_servicio;
        campoCantidadOrden.value = detalle.cantidad;
      }

      contenedorFormularioOrden.hidden = false;
      document.querySelector("#save-order-button").textContent =
        "Actualizar orden";

      contenedorFormularioOrden.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    acciones.appendChild(botonEditar);

    acciones.appendChild(botonDetalle);
    fila.appendChild(acciones);
    tablaOrdenes.appendChild(fila);
  });
}

// Abrir formulario
botonNuevaOrden.addEventListener("click", async () => {
  formularioOrden.reset();
  contenedorFormularioOrden.hidden = false;

  campoFechaOrden.value = new Date().toISOString().slice(0, 16);

  await cargarOpcionesOrden();

  contenedorFormularioOrden.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
});

// Cancelar formulario
botonCancelarOrden.addEventListener("click", () => {
  formularioOrden.reset();
  contenedorFormularioOrden.hidden = true;
});

// Guardar orden
formularioOrden.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const botonGuardar = document.querySelector("#save-order-button");

  const datosOrden = {
    id_cliente: Number(selectClienteOrden.value),
    id_empleado: Number(selectEmpleadoOrden.value),
    id_cita: selectCitaOrden.value ? Number(selectCitaOrden.value) : null,
    fecha_servicio: campoFechaOrden.value || null,
    observaciones: campoObservacionesOrden.value.trim(),
    detalles: [
      {
        id_servicio: Number(selectServicioOrden.value),
        cantidad: Number(campoCantidadOrden.value),
      },
    ],
  };

  try {
    botonGuardar.disabled = true;
    botonGuardar.textContent = "Guardando...";

    const editando = window.ordenEditandoId;

    const respuesta = await fetch(
      editando
        ? `http://localhost:3000/api/ordenes/${editando}`
        : "http://localhost:3000/api/ordenes",
      {
        method: editando ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosOrden),
      },
    );

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(resultado.mensaje || "No se pudo guardar la orden.");
    }

    alert(
      editando
        ? "¡Orden actualizada correctamente!"
        : "¡Orden registrada correctamente!",
    );

    formularioOrden.reset();
    window.ordenEditandoId = null;
    contenedorFormularioOrden.hidden = true;

    await cargarOrdenes();
  } catch (error) {
    alert(error.message);
    console.error("Error al guardar orden:", error);
  } finally {
    botonGuardar.disabled = false;
    botonGuardar.textContent = "Guardar orden";
  }
});

// Buscar órdenes
buscadorOrdenes.addEventListener("input", () => {
  const busqueda = buscadorOrdenes.value.trim().toLowerCase();

  const resultado = ordenes.filter((orden) =>
    [orden.id_orden, orden.cliente, orden.empleado, orden.estado]
      .join(" ")
      .toLowerCase()
      .includes(busqueda),
  );

  dibujarOrdenes(resultado);
});

// Cargar órdenes al entrar en el módulo
enlacesMenu.forEach((enlace) => {
  enlace.addEventListener("click", () => {
    if (enlace.dataset.section === "ordenes") {
      cargarOrdenes();
    }
  });
});

accesosDashboard.forEach((boton) => {
  boton.addEventListener("click", () => {
    if (boton.dataset.section === "ordenes") {
      cargarOrdenes();
    }
  });
});

cargarOrdenes();

// =====================================
// MÓDULO DE REGISTRO DE PAGOS
// =====================================

const formularioPago = document.querySelector("#payment-form");
const selectorOrdenPago = document.querySelector("#payment-order");
const montoPago = document.querySelector("#payment-amount");
const metodoPago = document.querySelector("#payment-method");
const fechaPago = document.querySelector("#payment-date");
const tablaPagos = document.querySelector("#payment-table-body");

// Cargar órdenes que tienen saldo pendiente
async function cargarOrdenesPendientes() {
  try {
    const respuesta = await fetch(
      "http://localhost:3000/api/pagos/ordenes-pendientes",
    );
    if (!respuesta.ok) throw new Error("No se pudieron cargar las órdenes");

    const ordenesPendientes = await respuesta.json();

    selectorOrdenPago.innerHTML = '<option value="">Seleccionar orden</option>';

    ordenesPendientes.forEach((orden) => {
      const opcion = document.createElement("option");
      opcion.value = orden.id_orden;
      opcion.textContent = `Orden #${orden.id_orden} - ${orden.cliente} | Saldo: $${Number(orden.saldo_pendiente).toLocaleString("es-CO")}`;
      selectorOrdenPago.appendChild(opcion);
    });
  } catch (error) {
    console.error("Error al cargar órdenes pendientes:", error);
  }
}

// Consultar historial de pagos
async function cargarHistorialPagos() {
  try {
    const respuesta = await fetch("http://localhost:3000/api/pagos");
    if (!respuesta.ok) throw new Error("No se pudo cargar el historial");

    const pagos = await respuesta.json();

    tablaPagos.innerHTML = "";

    if (pagos.length === 0) {
      tablaPagos.innerHTML = `
        <tr>
          <td colspan="6" class="empty-message">
            Todavía no hay pagos registrados.
          </td>
        </tr>`;
      return;
    }

    pagos.forEach((pago) => {
      const fila = document.createElement("tr");
      const fecha = new Date(pago.fecha_pago).toLocaleDateString("es-CO");

      fila.innerHTML = `
        <td>#${pago.id_pago}</td>
        <td>#${pago.id_orden}</td>
        <td>${fecha}</td>
        <td>$${Number(pago.monto).toLocaleString("es-CO")}</td>
        <td>${pago.metodo}</td>
        <td>${pago.estado}</td>
      `;

      tablaPagos.appendChild(fila);
    });
  } catch (error) {
    console.error("Error al cargar historial de pagos:", error);
  }
}

// Registrar un pago
formularioPago.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const datosPago = {
    id_orden: Number(selectorOrdenPago.value),
    monto: Number(montoPago.value),
    metodo: metodoPago.value,
    fecha_pago: fechaPago.value,
  };

  try {
    const respuesta = await fetch("http://localhost:3000/api/pagos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosPago),
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      alert(resultado.mensaje || "No se pudo registrar el pago.");
      return;
    }

    alert("¡Pago registrado correctamente!");

    formularioPago.reset();

    await cargarOrdenesPendientes();
    await cargarHistorialPagos();
  } catch (error) {
    console.error("Error al registrar pago:", error);
    alert("No se pudo conectar con el servidor.");
  }
});

// Cargar información al iniciar
cargarOrdenesPendientes();
cargarHistorialPagos();
