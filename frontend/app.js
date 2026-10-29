const enlacesMenu = document.querySelectorAll(".nav-link");
const accesosDashboard = document.querySelectorAll(".dashboard-link");

const tituloPagina = document.querySelector("#page-title");
const rutaPagina = document.querySelector("#breadcrumb-section");

const vistaDashboard = document.querySelector("#dashboard-view");
const vistaClientes = document.querySelector("#clientes-view");
const vistaEmpleados = document.querySelector("#empleados-view");
const vistaServicios = document.querySelector("#servicios-view");

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
  vistaServicios.hidden = seccion !== "servicios";

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
