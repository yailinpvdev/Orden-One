const enlacesMenu = document.querySelectorAll(".nav-link");
const accesosDashboard = document.querySelectorAll(".dashboard-link");

const tituloPagina = document.querySelector("#page-title");
const rutaPagina = document.querySelector("#breadcrumb-section");

const vistaDashboard = document.querySelector("#dashboard-view");
const vistaClientes = document.querySelector("#clientes-view");

const botonNuevoCliente = document.querySelector("#new-client-button");
const botonCancelarCliente = document.querySelector("#cancel-client-button");
const formularioCliente = document.querySelector("#client-form");
const contenedorFormulario = document.querySelector("#client-form-container");
const mensajeFormulario = document.querySelector("#client-form-message");
const tablaClientes = document.querySelector("#client-table-body");
const buscadorClientes = document.querySelector("#client-search");

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

  contenedorFormulario.hidden = true;
  mensajeFormulario.textContent = "";

  if (seccion === "clientes") {
    cargarClientes();
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
  contenedorFormulario.hidden = false;
  mensajeFormulario.textContent = "";
  document.querySelector("#client-name").focus();
});

botonCancelarCliente.addEventListener("click", () => {
  contenedorFormulario.hidden = true;
  formularioCliente.reset();
  mensajeFormulario.textContent = "";
});

function mostrarMensaje(texto, esError = false) {
  mensajeFormulario.textContent = texto;
  mensajeFormulario.style.color = esError ? "#a13c35" : "#398462";
}

function dibujarClientes(lista) {
  tablaClientes.replaceChildren();

  if (lista.length === 0) {
    const fila = document.createElement("tr");
    const celda = document.createElement("td");

    celda.colSpan = 4;
    celda.className = "empty-message";
    celda.textContent = "Todavía no hay clientes para mostrar.";

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

    fila.append(nombre, telefono, email, estado);
    tablaClientes.appendChild(fila);
  });
}

async function cargarClientes() {
  tablaClientes.innerHTML =
    '<tr><td colspan="4" class="empty-message">Cargando clientes...</td></tr>';

  try {
    const respuesta = await fetch("http://localhost:3000/api/clientes");

    if (!respuesta.ok) {
      throw new Error("No se pudieron consultar los clientes.");
    }

    clientes = await respuesta.json();
    filtrarClientes();
  } catch (error) {
    tablaClientes.innerHTML =
      '<tr><td colspan="4" class="empty-message">No se pudo conectar con el servidor. Comprueba que el backend esté funcionando.</td></tr>';

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

  const botonGuardar = formularioCliente.querySelector('button[type="submit"]');

  const datosCliente = {
    nombre_completo: document.querySelector("#client-name").value.trim(),
    telefono: document.querySelector("#client-phone").value.trim(),
    email: document.querySelector("#client-email").value.trim(),
  };

  if (!datosCliente.nombre_completo) {
    mostrarMensaje("El nombre completo es obligatorio.", true);
    return;
  }

  botonGuardar.disabled = true;
  botonGuardar.textContent = "Guardando...";

  try {
    const respuesta = await fetch("http://localhost:3000/api/clientes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosCliente),
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(resultado.mensaje || "No se pudo guardar el cliente.");
    }

    formularioCliente.reset();
    contenedorFormulario.hidden = true;
    mostrarMensaje("Cliente registrado correctamente.");
    await cargarClientes();
  } catch (error) {
    mostrarMensaje(
      error.message ||
        "No se pudo guardar el cliente. Comprueba que el servidor esté funcionando.",
      true,
    );

    console.error("Error al guardar cliente:", error);
  } finally {
    botonGuardar.disabled = false;
    botonGuardar.textContent = "Guardar cliente";
  }
});
