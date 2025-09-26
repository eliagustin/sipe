// Datos de usuarios y municipios
const users = [
    { municipio: 'CAMARON DE TEJEDA', username: 'camaron.tejeda@bienestar.com', password: 'g2BTy1Cr', role: 'user' },
    { municipio: 'CARRILLO PUERTO', username: 'carrillo.puerto@bienestar.com', password: 'EmpD7fID', role: 'user' },
    { municipio: 'COMAPA', username: 'comapa.comapa@bienestar.com', password: '1RZhO9Vw', role: 'user' },
    { municipio: 'COTAXTLA', username: 'cotaxtla.cotaxtla@bienestar.com', password: 'B8WAevr6', role: 'user' },
    { municipio: 'CUITLAHUAC', username: 'cuitlahuac.cuitlahuac@bienestar.com', password: 'BafEqeBD', role: 'user' },
    // CUITLAHUAC es user, pero el admin.eagc es de CUITLAHUAC tambien
    { municipio: 'CUITLAHUAC', username: 'admin.eagc@bienestar.com', password: 'admineagc', role: 'admin' },
    { municipio: 'HUATUSCO', username: 'huatusco.huatusco@bienestar.com', password: 'zaD2XSjA', role: 'user' },
    { municipio: 'IGNACIO DE LA LLAVE', username: 'ignacio.llave@bienestar.com', password: 'SWhAuRUg', role: 'user' },
    { municipio: 'PASO DE OVEJAS', username: 'paso.ovejas@bienestar.com', password: 'PeqKEHOQ', role: 'user' },
    { municipio: 'PASO DEL MACHO', username: 'goNFDOMj@bienestar.com', password: 'goNFDOMj', role: 'user' }, // Corregido: email goNFDOMj@bienestar.com
    { municipio: 'SOCHIAPA', username: 'sochiapa.sochiapa@bienestar.com', password: '0CxNizEW', role: 'user' },
    { municipio: 'SOLEDAD DE DOBLADO', username: 'soledad.doblado@bienestar.com', password: 'PYCAracK', role: 'user' },
    { municipio: 'TIERRA BLANCA', username: 'tierra.blanca@bienestar.com', password: 'JOpvNfyD', role: 'user' },
    { municipio: 'TLALIXCOYAN', username: 'tlalixcoyan.tlalixcoyan@bienestar.com', password: '8E0xce9V', role: 'user' },
    { municipio: 'ZENTLA', username: 'zentla.zentla@bienestar.com', password: '3VEMcir1', role: 'user' }
];

const municipiosList = [
    'CAMARON DE TEJEDA', 'CARRILLO PUERTO', 'COMAPA', 'COTAXTLA', 'CUITLAHUAC',
    'HUATUSCO', 'IGNACIO DE LA LLAVE', 'PASO DE OVEJAS', 'PASO DEL MACHO',
    'SOCHIAPA', 'SOLEDAD DE DOBLADO', 'TIERRA BLANCA', 'TLALIXCOYAN', 'ZENTLA'
];

// Función para guardar el estado de la sesión
function setSession(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

// Función para obtener el estado de la sesión
function getSession() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// --- Lógica para index.html (Login) ---
if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                setSession(user);
                if (user.role === 'admin') {
                    window.location.href = 'admin-panel.html';
                } else {
                    window.location.href = 'user-panel.html';
                }
            } else {
                errorMessage.textContent = 'Usuario o contraseña incorrectos.';
            }
        });
    }

    // Si ya hay una sesión activa, redirigir automáticamente
    const currentUser = getSession();
    if (currentUser) {
        if (currentUser.role === 'admin') {
            window.location.href = 'admin-panel.html';
        } else {
            window.location.href = 'user-panel.html';
        }
    }
}

// --- Lógica para user-panel.html ---
if (window.location.pathname.endsWith('user-panel.html')) {
    const currentUser = getSession();
    if (!currentUser || currentUser.role === 'admin') {
        window.location.href = 'index.html'; // Redirigir si no hay sesión o es admin
        
    } else {
        document.getElementById('currentUserMunicipio').textContent = currentUser.municipio;

        const municipioSelect = document.getElementById('municipio');
        // Limpiar opciones existentes
        municipioSelect.innerHTML = '';
        // Cargar solo el municipio del usuario actual
        const option = document.createElement('option');
        option.value = currentUser.municipio;
        option.textContent = currentUser.municipio;
        option.selected = true; // Seleccionar automáticamente
        municipioSelect.appendChild(option);

        const permissionForm = document.getElementById('permissionForm');
        const motivoSelect = document.getElementById('motivo');
        const otroMotivoGroup = document.getElementById('otroMotivoGroup');
        const otroMotivoInput = document.getElementById('otroMotivo');

        // Mostrar/ocultar campo "Otro Motivo"
        motivoSelect.addEventListener('change', () => {
            if (motivoSelect.value === 'OTRO') {
                otroMotivoGroup.style.display = 'block';
                otroMotivoInput.setAttribute('required', 'required');
            } else {
                otroMotivoGroup.style.display = 'none';
                otroMotivoInput.removeAttribute('required');
                otroMotivoInput.value = ''; // Limpiar el valor si se oculta
            }
        });

        permissionForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Obtener los datos del formulario
            const permiso = {
                id: Date.now(), // ID único para el permiso
                fechaSolicitud: document.getElementById('fechaSolicitud').value,
                municipio: municipioSelect.value,
                nombre: document.getElementById('nombre').value,
                apellidoPaterno: document.getElementById('apellidoPaterno').value,
                apellidoMaterno: document.getElementById('apellidoMaterno').value,
                telefono: document.getElementById('telefono').value,
                motivo: motivoSelect.value,
                otroMotivo: motivoSelect.value === 'OTRO' ? otroMotivoInput.value : '',
                diaInicio: document.getElementById('diaInicio').value,
                diaTermino: document.getElementById('diaTermino').value,
                // Guardar el archivo PDF como Base64 para localStorage
                pdfFile: '' // Se llenará en el lector de archivos
            };

            const fileInput = document.getElementById('cargarSolicitud');
            const file = fileInput.files[0];

            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    permiso.pdfFile = event.target.result; // Contenido del PDF en Base64
                    savePermit(permiso);
                    alert('Solicitud de permiso enviada con éxito!');
                    permissionForm.reset();
                    otroMotivoGroup.style.display = 'none'; // Ocultar después de enviar
                    otroMotivoInput.removeAttribute('required');
                };
                reader.readAsDataURL(file);
            } else {
                alert('Por favor, carga el archivo PDF de la solicitud.');
            }
        });
    }
}

// Función para guardar un permiso en localStorage
function savePermit(permiso) {
    let permits = JSON.parse(localStorage.getItem('permits')) || [];
    permits.push(permiso);
    localStorage.setItem('permits', JSON.stringify(permits));
}

// --- Lógica para admin-panel.html ---
if (window.location.pathname.endsWith('admin-panel.html')) {
    const currentUser = getSession();
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = 'index.html'; // Redirigir si no hay sesión o no es admin
    } else {
        loadPermitsTable();
    }
}

// Cargar la tabla de permisos para el admin
function loadPermitsTable() {
    const permits = JSON.parse(localStorage.getItem('permits')) || [];
    const tableBody = document.querySelector('#permitsTable tbody');
    tableBody.innerHTML = ''; // Limpiar tabla antes de cargar

    if (permits.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="11">No hay solicitudes de permiso registradas.</td></tr>';
        return;
    }

    permits.forEach(permit => {
        const row = tableBody.insertRow();
        row.dataset.id = permit.id; // Para identificar la fila al eliminar

        row.insertCell().textContent = permit.id;
        row.insertCell().textContent = permit.fechaSolicitud;
        row.insertCell().textContent = permit.municipio;
        row.insertCell().textContent = `${permit.nombre} ${permit.apellidoPaterno} ${permit.apellidoMaterno}`;
        row.insertCell().textContent = permit.telefono;
        row.insertCell().textContent = permit.motivo;
        row.insertCell().textContent = permit.otroMotivo || 'N/A';
        row.insertCell().textContent = permit.diaInicio;
        row.insertCell().textContent = permit.diaTermino;

        // Enlace para descargar el PDF
        const pdfCell = row.insertCell();
        if (permit.pdfFile) {
            const downloadLink = document.createElement('a');
            downloadLink.href = permit.pdfFile;
            downloadLink.download = `Solicitud_Permiso_${permit.id}_${permit.nombre}.pdf`;
            downloadLink.textContent = 'Descargar PDF';
            pdfCell.appendChild(downloadLink);
        } else {
            pdfCell.textContent = 'No adjunto';
        }

        const actionsCell = row.insertCell();
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.onclick = () => deletePermit(permit.id);
        actionsCell.appendChild(deleteButton);
    });
}

// Función para eliminar un permiso
function deletePermit(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta solicitud de permiso?')) {
        let permits = JSON.parse(localStorage.getItem('permits')) || [];
        permits = permits.filter(permit => permit.id !== id);
        localStorage.setItem('permits', JSON.stringify(permits));
        loadPermitsTable(); // Recargar la tabla
    }
}

// Función para descargar registros en Excel (CSV simple)
function downloadExcel() {
    const permits = JSON.parse(localStorage.getItem('permits')) || [];
    if (permits.length === 0) {
        alert('No hay registros para descargar.');
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    // Encabezados
    const headers = [
        "ID", "Fecha Solicitud", "Municipio", "Nombre", "Apellido Paterno", "Apellido Materno",
        "Teléfono", "Motivo", "Otro Motivo", "Día Inicio", "Día Término", "URL Archivo PDF"
    ];
    csvContent += headers.join(",") + "\n";

    // Filas de datos
    permits.forEach(permit => {
        const row = [
            permit.id,
            permit.fechaSolicitud,
            permit.municipio,
            permit.nombre,
            permit.apellidoPaterno,
            permit.apellidoMaterno,
            permit.telefono,
            permit.motivo,
            permit.otroMotivo,
            permit.diaInicio,
            permit.diaTermino,
            permit.pdfFile ? 'Ver en navegador' : 'No adjunto' // No podemos poner el base64 directo en CSV, solo una referencia
        ];
        csvContent += row.map(item => `"${item}"`).join(",") + "\n"; // Escapar comas dentro de los datos
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "registros_permisos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
