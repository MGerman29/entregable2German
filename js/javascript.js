// Simulador de Rutina de Meditación
// Estudiante: Michael German
// Entrega N°2 | Interacción con DOM, Eventos y localStorage

const form = document.getElementById('formMeditacion');
const resultado = document.getElementById('resultado');
const listaRutinas = document.getElementById('listaRutinas');
const btnBorrar = document.getElementById('borrarRutinas');
const btnAleatoria = document.getElementById('cargarAleatoria');
let rutinas = JSON.parse(localStorage.getItem('rutinas')) || [];

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const nivel = document.getElementById('nivel').value;
  const objetivo = document.getElementById('objetivo').value;
  const tipo = document.getElementById('tipo').value;

  const rutina = {
    id: Date.now(),
    nombre,
    nivel,
    objetivo,
    tipo,
    pasos: generarPasos(tipo, nivel),
  };

  mostrarRutina(rutina);
  guardarRutina(rutina);
  mostrarRutinasGuardadas();
  form.reset();
});

function generarPasos(tipo, nivel) {
  const pasosBase = {
    chakra: ["Respiración profunda", "Visualizar cada uno de nuestros chakras", "Cerrar con afirmación YosoY la presencia absoluta del Yo Soy"],
    respiracion: ["Inhalar 4s", "Retener 4s", "Exhalar 4s", "Pausa 4s"],
    visualizacion: ["Respirar", "Visualizar luz dorada", "Sentir expansión interior"],
  };

  const extra = nivel === "avanzado" ? "Repetir 3 veces con mudras" : "Realizar en calma";

  return [...pasosBase[tipo], extra];
}

function mostrarRutina(rutina) {
  resultado.innerHTML = `
    <h2>Rutina para ${rutina.nombre}</h2>
    <p><strong>Objetivo:</strong> ${rutina.objetivo}</p>
    <p><strong>Nivel:</strong> ${rutina.nivel}</p>
    <p><strong>Tipo:</strong> ${rutina.tipo}</p>
    <ul>
      ${rutina.pasos.map(p => `<li>${p}</li>`).join("")}
    </ul>
  `;
}

function guardarRutina(rutina) {
  rutinas.push(rutina);
  localStorage.setItem('rutinas', JSON.stringify(rutinas));
}

function mostrarRutinasGuardadas() {
  listaRutinas.innerHTML = "";
  rutinas.forEach(r => {
    const li = document.createElement("li");
    li.textContent = `🔸 ${r.nombre} - ${r.tipo} (${r.nivel})`;
    listaRutinas.appendChild(li);
  });

btnAleatoria.addEventListener('click', () => {
  if (rutinas.length === 0) {
    resultado.innerHTML = "<p>No hay rutinas guardadas.</p>";
    return;
  }
  const aleatoria = rutinas[Math.floor(Math.random() * rutinas.length)];
  mostrarRutina(aleatoria);
});

  btnBorrar.addEventListener('click', () => {
  localStorage.removeItem('rutinas');
  rutinas = [];
  listaRutinas.innerHTML = "";
  resultado.innerHTML = "<p>Rutinas eliminadas.</p>";
});

document.getElementById('filtroTipo').addEventListener('change', aplicarFiltros);
document.getElementById('filtroNivel').addEventListener('change', aplicarFiltros);

function aplicarFiltros() {
  const tipo = document.getElementById('filtroTipo').value;
  const nivel = document.getElementById('filtroNivel').value;

  const filtradas = rutinas.filter(r => {
    return (!tipo || r.tipo === tipo) && (!nivel || r.nivel === nivel);
  });

  listaRutinas.innerHTML = "";
  filtradas.forEach(r => {
    const li = document.createElement("li");
    li.innerHTML = `
      🔹 ${r.nombre} - ${r.tipo} (${r.nivel})
      <button class="editar" data-id="${r.id}">Editar</button>
    `;
    listaRutinas.appendChild(li);
  });
}


}

mostrarRutinasGuardadas();
