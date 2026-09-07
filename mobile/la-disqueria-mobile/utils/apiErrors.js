// Traduce los mensajes que devuelve el backend a textos claros para el usuario.

const messages = {
  'Customer not found': 'No encontramos una cuenta con ese correo',
  'Wrong password': 'La contraseña es incorrecta',
  'Blocked account': 'Cuenta bloqueada temporalmente, intenta más tarde',
  'Blocked account for many attemps':
    'Cuenta bloqueada por intentos fallidos, intenta en unos minutos',
  'Email and password are required.': 'Ingresa tu correo y tu contraseña',
  'Fields required': 'Completa todos los campos',
  'Please insert a valid name': 'El nombre debe tener entre 3 y 15 caracteres',
  'Please insert a valid last name': 'El apellido debe tener entre 3 y 15 caracteres',
  'Invalid DUI format': 'El DUI debe tener el formato ########-#',
  'Invalid phone format': 'El teléfono debe tener el formato ####-####',
  'Email already registered': 'Ese correo ya está registrado',
  'DUI already registered': 'Ese DUI ya está registrado',
  'Phone already registered': 'Ese teléfono ya está registrado',
  'Customer already exists': 'La cuenta ya existe',
  'The password must be between 8 and 20 characters long':
    'La contraseña debe tener entre 8 y 20 caracteres',
  'The password must include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)':
    'La contraseña debe incluir mayúscula, minúscula, número y un carácter especial',
  'Invalid code': 'El código no es válido',
  'Expired registration': 'El registro expiró, vuelve a empezar',
  'Recovery session expired': 'La sesión de recuperación expiró, vuelve a empezar',
  'Code not verified': 'Primero verifica el código',
  'Passwords do not match': 'Las contraseñas no coinciden',
  'The new password must be different from the current one':
    'La nueva contraseña debe ser diferente a la actual',
  'Email is required': 'Ingresa tu correo',
  'Error sending email': 'No pudimos enviar el correo, intenta de nuevo',
  'El carrito está vacío': 'El carrito está vacío',
};

export const translateApiError = (message) =>
  messages[message] || message || 'Ocurrió un error, intenta de nuevo';
