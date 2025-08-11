// ========================================
// SCRIPT DE CONTACTO - IMPRESIONES Y MAQUETAS
// ========================================

/**
 * Configuración global para WhatsApp
 */
const WHATSAPP_CONFIG = {
  phoneNumber: '51999451887',
  baseUrl: 'https://wa.me/'
};

/**
 * Detecta si el dispositivo es móvil
 * @returns {boolean} true si es un dispositivo móvil
 */
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
         window.innerWidth <= 768;
}

// ========================================
// FUNCIONES COMUNES
// ========================================

/**
 * Formatea la fecha para mostrar en el mensaje de WhatsApp
 * @param {string} dateString - Fecha en formato YYYY-MM-DD
 * @returns {string} Fecha formateada como DD/MM/YYYY
 */
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Valida que todos los campos requeridos estén completos
 * @param {Object} formData - Datos del formulario
 * @param {Array} requiredFields - Array de campos requeridos
 * @returns {boolean} true si todos los campos requeridos están completos
 */
function validateForm(formData, requiredFields) {
  return requiredFields.every(field => formData[field] && formData[field].trim() !== '');
}

/**
 * Valida el formato del email
 * @param {string} email - Email a validar
 * @returns {boolean} true si el email tiene formato válido
 */
function validateEmail(email) {
  if (!email || email.trim() === '') return true; // Email opcional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Abre WhatsApp con el mensaje predefinido
 * @param {string} message - Mensaje formateado para WhatsApp
 */
function openWhatsApp(message) {
  const whatsappUrl = `${WHATSAPP_CONFIG.baseUrl}${WHATSAPP_CONFIG.phoneNumber}?text=${message}`;
  window.open(whatsappUrl, '_blank');
}

/**
 * Muestra mensajes en el formulario
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de mensaje ('success', 'error', '')
 * @param {string} formId - ID del formulario
 */
function showFormMessage(message, type, formId) {
  const messageElement = document.getElementById(`${formId}Message`);
  if (messageElement) {
    messageElement.textContent = message;
    messageElement.className = `form-message ${type}`;
  }
}

// ========================================
// FUNCIONES PARA MAQUETAS
// ========================================

/**
 * Construye el mensaje para WhatsApp - Maquetas
 * @param {Object} formData - Datos del formulario
 * @returns {string} Mensaje formateado para WhatsApp
 */
function buildMaquetasWhatsAppMessage(formData) {
  const formattedDate = formatDate(formData.deadline);
  
  // Obtener fecha y hora actual
  const now = new Date();
  const currentDate = now.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const currentTime = now.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  let message = `*Nueva Solicitud de Maqueta - Librería JSR*%0A%0A`;
  message += `*Nombre:* ${formData.name}%0A`;
  message += `*Email:* ${formData.email}%0A`;
  
  if (formData.phone && formData.phone.trim() !== '') {
    message += `*Teléfono:* ${formData.phone}%0A`;
  }
  
  message += `*Fecha de Entrega:* ${formattedDate}%0A%0A`;
  message += `*Descripción del Proyecto:*%0A${formData.message.replace(/\n/g, '%0A')}%0A%0A`;
  message += `---%0A`;
  message += `*Enviado desde:* Maquetas - Librería JSR%0A`;
  message += `*Fecha y hora de envío:* ${currentDate} a las ${currentTime}`;
  
  return message;
}

/**
 * Maneja el envío del formulario de maquetas
 * @param {Event} e - Evento del formulario
 */
function handleMaquetasFormSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    deadline: form.deadline.value,
    message: form.message.value.trim()
  };
  
  // Validar campos requeridos
  const requiredFields = ['name', 'email', 'deadline', 'message'];
  if (!validateForm(formData, requiredFields)) {
    showFormMessage('Por favor, completa todos los campos requeridos.', 'error', 'form');
    return;
  }
  
  // Validar formato del email
  if (!validateEmail(formData.email)) {
    showFormMessage('Por favor, ingresa un email válido.', 'error', 'form');
    return;
  }
  
  // Construir mensaje para WhatsApp
  const whatsappMessage = buildMaquetasWhatsAppMessage(formData);
  
  // Mostrar mensaje de confirmación
  showFormMessage('Redirigiendo a WhatsApp...', 'success', 'form');
  
  // Abrir WhatsApp después de un breve delay
  setTimeout(() => {
    openWhatsApp(whatsappMessage);
    
    // Limpiar formulario después de enviar
    form.reset();
    showFormMessage('', '', 'form');
  }, 1500);
}

// ========================================
// FUNCIONES PARA IMPRESIONES
// ========================================

/**
 * Construye el mensaje para WhatsApp - Impresiones
 * @param {Object} formData - Datos del formulario
 * @returns {string} Mensaje formateado para WhatsApp
 */
function buildImpresionesWhatsAppMessage(formData) {
  // Obtener fecha y hora actual
  const now = new Date();
  const currentDate = now.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const currentTime = now.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  let message = `*Nueva Solicitud de Impresión - Librería JSR*%0A%0A`;
  message += `*Nombre:* ${formData.nombre}%0A`;
  message += `*Teléfono:* ${formData.telefono}%0A`;
  
  if (formData.email && formData.email.trim() !== '') {
    message += `*Email:* ${formData.email}%0A`;
  }
  
  message += `*Tipo de Servicio:* ${formData.servicio}%0A%0A`;
  
  if (formData.mensaje && formData.mensaje.trim() !== '') {
    message += `*Descripción:*%0A${formData.mensaje.replace(/\n/g, '%0A')}%0A%0A`;
  }
  
  message += `---%0A`;
  message += `*Enviado desde:* Impresiones - Librería JSR%0A`;
  message += `*Fecha y hora de envío:* ${currentDate} a las ${currentTime}`;
  
  return message;
}

/**
 * Maneja el envío del formulario de impresiones
 * @param {Event} e - Evento del formulario
 */
function handleImpresionesFormSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = {
    nombre: form.nombre.value.trim(),
    telefono: form.telefono.value.trim(),
    email: form.email.value.trim(),
    servicio: form.servicio.value,
    mensaje: form.mensaje.value.trim()
  };
  
  // Validar campos requeridos
  const requiredFields = ['nombre', 'telefono', 'servicio'];
  if (!validateForm(formData, requiredFields)) {
    showFormMessage('Por favor, completa todos los campos requeridos.', 'error', 'contactForm');
    return;
  }
  
  // Validar formato del email si se proporciona
  if (formData.email && formData.email.trim() !== '' && !validateEmail(formData.email)) {
    showFormMessage('Por favor, ingresa un email válido.', 'error', 'contactForm');
    return;
  }
  
  // Construir mensaje para WhatsApp
  const whatsappMessage = buildImpresionesWhatsAppMessage(formData);
  
  // Mostrar mensaje de confirmación
  showFormMessage('Redirigiendo a WhatsApp...', 'success', 'contactForm');
  
  // Abrir WhatsApp después de un breve delay
  setTimeout(() => {
    openWhatsApp(whatsappMessage);
    
    // Limpiar formulario después de enviar
    form.reset();
    showFormMessage('', '', 'contactForm');
  }, 1500);
}

// ========================================
// FUNCIONES PARA INVESTIGACIONES
// ========================================

/**
 * Construye el mensaje para WhatsApp - Investigaciones
 * @param {Object} formData - Datos del formulario
 * @returns {string} Mensaje formateado para WhatsApp
 */
function buildInvestigacionesWhatsAppMessage(formData) {
  // Obtener fecha y hora actual
  const now = new Date();
  const currentDate = now.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const currentTime = now.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  let message = `*Nueva Solicitud de Investigación - Librería JSR*%0A%0A`;
  message += `*Nombre:* ${formData.nombre}%0A`;
  message += `*Email:* ${formData.email}%0A`;
  message += `*Tipo de Proyecto:* ${formData.proyecto}%0A%0A`;
  
  if (formData.mensaje && formData.mensaje.trim() !== '') {
    message += `*Descripción del Proyecto:*%0A${formData.mensaje.replace(/\n/g, '%0A')}%0A%0A`;
  }
  
  message += `---%0A`;
  message += `*Enviado desde:* Investigaciones - Librería JSR%0A`;
  message += `*Fecha y hora de envío:* ${currentDate} a las ${currentTime}`;
  
  return message;
}

/**
 * Maneja el envío del formulario de investigaciones
 * @param {Event} e - Evento del formulario
 */
function handleInvestigacionesFormSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = {
    nombre: form.nombre.value.trim(),
    email: form.email.value.trim(),
    proyecto: form.proyecto.value,
    mensaje: form.mensaje.value.trim()
  };
  
  // Validar campos requeridos
  const requiredFields = ['nombre', 'email', 'proyecto', 'mensaje'];
  if (!validateForm(formData, requiredFields)) {
    showFormMessage('Por favor, completa todos los campos requeridos.', 'error', 'investigacionesForm');
    return;
  }
  
  // Validar formato del email
  if (!validateEmail(formData.email)) {
    showFormMessage('Por favor, ingresa un email válido.', 'error', 'investigacionesForm');
    return;
  }
  
  // Construir mensaje para WhatsApp
  const whatsappMessage = buildInvestigacionesWhatsAppMessage(formData);
  
  // Mostrar mensaje de confirmación
  showFormMessage('Redirigiendo a WhatsApp...', 'success', 'investigacionesForm');
  
  // Abrir WhatsApp después de un breve delay
  setTimeout(() => {
    openWhatsApp(whatsappMessage);
    
    // Limpiar formulario después de enviar
    form.reset();
    showFormMessage('', '', 'investigacionesForm');
  }, 1500);
}

// ========================================
// CONFIGURACIÓN DE EVENT LISTENERS
// ========================================

/**
 * Configura los event listeners para el formulario de maquetas
 */
function setupMaquetasFormListeners() {
  const form = document.getElementById('form');
  if (form) {
    form.addEventListener('submit', handleMaquetasFormSubmit);
  }
}

/**
 * Configura los event listeners para el formulario de impresiones
 */
function setupImpresionesFormListeners() {
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', handleImpresionesFormSubmit);
  }
}

/**
 * Configura los event listeners para el formulario de investigaciones
 */
function setupInvestigacionesFormListeners() {
  const form = document.querySelector('.contact-form form');
  if (form) {
    form.addEventListener('submit', handleInvestigacionesFormSubmit);
  }
}

/**
 * Configura todos los event listeners globales
 */
function setupGlobalEventListeners() {
  // Cerrar modales con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modals = document.querySelectorAll('.modal');
      modals.forEach(modal => {
        if (modal.style.display === 'flex') {
          modal.style.display = 'none';
          document.body.classList.remove('modal-active');
        }
      });
    }
  });
}

// ========================================
// INICIALIZACIÓN
// ========================================

/**
 * Inicializa toda la funcionalidad de contacto
 */
function initializeContacto() {
  // Configurar formularios según la página
  const currentPath = window.location.pathname;
  
  if (currentPath.includes('maquetas.html')) {
    setupMaquetasFormListeners();
  } else if (currentPath.includes('impresiones.html')) {
    setupImpresionesFormListeners();
  } else if (currentPath.includes('investigaciones.html')) {
    setupInvestigacionesFormListeners();
  }
  
  setupGlobalEventListeners();
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializeContacto);

// Exportar funciones para uso global si es necesario
window.ContactoJS = {
  handleMaquetasFormSubmit,
  handleImpresionesFormSubmit,
  handleInvestigacionesFormSubmit,
  openWhatsApp,
  validateEmail,
  formatDate
};
