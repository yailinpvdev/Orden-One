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

formularioCliente.addEventListener("submit", (evento) => {
  evento.preventDefault();

  mensajeFormulario.textContent =
    "El formulario está preparado, pero todavía falta conectarlo con el servidor para guardar los clientes.";

  mensajeFormulario.style.color = "#a13c35";
});
