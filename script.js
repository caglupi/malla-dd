let totalCreditos = 0;
let ramosSeleccionados = new Set();

fetch('data_DER.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('malla');
    const creditDisplay = document.getElementById('total-creditos');
    const ramoElements = [];

    for (let semestre in data) {
      const box = document.createElement('div');
      box.className = 'semestre';
      const title = document.createElement('h2');
      title.textContent = semestre.toUpperCase();
      box.appendChild(title);

      data[semestre].forEach(ramo => {
        const [nombre, codigo, creditos, _, _, prereqs] = ramo;

        const ramoDiv = document.createElement('div');
        ramoDiv.className = 'ramo';
        ramoDiv.textContent = `${nombre} (${codigo}) - ${creditos} créditos`;
        ramoDiv.dataset.codigo = codigo;
        ramoDiv.dataset.creditos = creditos;
        ramoDiv.dataset.prereqs = JSON.stringify(prereqs);

        ramoElements.push(ramoDiv); // lo guardamos para revalidar luego

        ramoDiv.addEventListener('click', () => {
          if (ramoDiv.classList.contains('disabled')) return;

          const cod = ramoDiv.dataset.codigo;
          const cred = parseInt(ramoDiv.dataset.creditos);

          if (!ramoDiv.classList.contains('selected')) {
            ramoDiv.classList.add('selected');
            ramosSeleccionados.add(cod);
            totalCreditos += cred;
          } else {
            ramoDiv.classList.remove('selected');
            ramosSeleccionados.delete(cod);
            totalCreditos -= cred;
          }

          creditDisplay.textContent = totalCreditos;
          actualizarEstados(); // revisamos qué ramos pueden desbloquearse
        });

        box.appendChild(ramoDiv);
      });

      container.appendChild(box);
    }

    // Evaluar qué ramos deben estar habilitados o deshabilitados
    function actualizarEstados() {
      ramoElements.forEach(ramoDiv => {
        const prereqs = JSON.parse(ramoDiv.dataset.prereqs);
        const yaSeleccionado = ramoDiv.classList.contains('selected');

        const cumple = prereqs.every(cod => ramosSeleccionados.has(cod));

        if (!cumple && !yaSeleccionado && prereqs.length > 0) {
          ramoDiv.classList.add('disabled');
        } else {
          ramoDiv.classList.remove('disabled');
        }
      });
    }

    // Evaluar al cargar
    actualizarEstados();
  });
