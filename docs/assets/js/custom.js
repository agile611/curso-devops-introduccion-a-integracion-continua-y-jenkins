(function () {
  "use strict";

  const modules = [
    {
      path: "00-el-curso",
      title: "El curso"
    },
    {
      path: "01-fundamentos",
      title: "Fundamentos de DevOps y Jenkins"
    },
    {
      path: "02-pipelines",
      title: "Pipelines"
    },
    {
      path: "03-miscelania",
      title: "Miscelánea"
    },
    {
      path: "04-practicas",
      title: "Prácticas"
    },
    {
      path: "04-terraform",
      title: "Terraform"
    },
    {
      path: "05-ansible",
      title: "Ansible"
    },
    {
      path: "06-referencias",
      title: "Referencias"
    }
  ];

  const defaultTitle = "Curso DevOps: Introducción a Jenkins";

  function getModuleTitle() {
    const pathname = window.location.pathname;

    const selectedModule = modules.find(function (module) {
      return pathname.includes("/" + module.path + "/");
    });

    return selectedModule ? selectedModule.title : defaultTitle;
  }

  function updateSidebarTitle() {
    const title = getModuleTitle();

    /*
     * En Material for MkDocs, el primer .md-nav__title
     * dentro de la navegación principal suele ser el título
     * de la barra lateral.
     */
    const sidebarTitle = document.querySelector(
      ".md-sidebar--primary .md-nav__title"
    );

    if (sidebarTitle) {
      sidebarTitle.textContent = title;
    }
  }

  function initialize() {
    updateSidebarTitle();

    /*
     * Material puede completar o actualizar la navegación
     * ligeramente después de cargar el contenido.
     */
    window.setTimeout(updateSidebarTitle, 100);
    window.setTimeout(updateSidebarTitle, 500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }

  /*
   * Material for MkDocs con navegación instantánea.
   * document$ se emite cada vez que se carga una página nueva.
   */
  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(function () {
      initialize();
    });
  }
})();