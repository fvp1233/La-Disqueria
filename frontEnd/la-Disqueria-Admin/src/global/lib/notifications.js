import Swal from "sweetalert2";

// Única configuración de notificaciones del panel: toda alerta del sistema
// (login, logout, crear/actualizar/eliminar, errores) pasa por aquí para que
// se vean y se comporten siempre igual, en vez de cajas de texto ad-hoc por página.
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  timer: 5000,
  timerProgressBar: true,
  showConfirmButton: false,
  showCloseButton: true,
  didOpen: (toastEl) => {
    toastEl.onmouseenter = Swal.stopTimer;
    toastEl.onmouseleave = Swal.resumeTimer;
  },
});

export const notifySuccess = (message, title = "Listo") =>
  Toast.fire({ icon: "success", title, text: message });

export const notifyError = (message, title = "Error") =>
  Toast.fire({ icon: "error", title, text: message });

export const notifyWarning = (message, title = "Atención") =>
  Toast.fire({ icon: "warning", title, text: message });

export const notifyInfo = (message, title = "Info") =>
  Toast.fire({ icon: "info", title, text: message });

// Reemplaza a window.confirm() para las eliminaciones: mismo lenguaje visual
// que el resto de las notificaciones del sistema.
export const confirmDelete = async ({
  title = "¿Eliminar este registro?",
  text = "Esta acción no se puede deshacer.",
  confirmButtonText = "Sí, eliminar",
} = {}) => {
  const result = await Swal.fire({
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    reverseButtons: true,
  });

  return result.isConfirmed;
};

export default Toast;
