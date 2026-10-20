const enlacesMenu = document.querySelectorAll(".nav-link");
const tituloPagina = document.querySelector(".topbar h2");
const rutaPagina = document.querySelector(".breadcrumb");

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

enlacesMenu.forEach((enlace) => {
  enlace.addEventListener("click", (evento) => {
    evento.preventDefault();

    enlacesMenu.forEach((elemento) => {
      elemento.classList.remove("active");
    });

    enlace.classList.add("active");

    const seccion = enlace.dataset.section;
    const nombre = nombresSecciones[seccion];

    tituloPagina.textContent = nombre;
    rutaPagina.textContent = `OrdenOne / ${nombre}`;
  });
});
