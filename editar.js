fetch('data_DER.json')
  .then(res => res.json())
  .then(data => {
    const editorDiv = document.getElementById('editor');
    const allRamos = [];

    // Recopilar todos los ramos (nombre, código)
    for (let semestre in data) {
      data[semestre].forEach(ramo => {
        allRamos.push({ nombre: ramo[0], codigo: ramo[1] });
      });
    }

    // Construir formulario
    for (let semestre in data) {
      const semBox = document.createElement('div');
      semBox.className = 'semestre';
      const title = document.createElement('h2');
      title.textContent = semestre.toUpperCase();
      semBox.appendChild(title);

      data[semestre].forEach(ramo => {
        const [nombre, codigo, creditos, _, categoria, prereqs] = ramo;

        const container = document.createElement('div');
        container.className = 'ramo';

        const label = document.createElement('label');
        label.innerHTML = `<strong>${nombre} (${codigo})</strong><br>Prerrequisitos: `;
        container.appendChild(label);

        const select = document.createElement('select');
        select.multiple = true;
        select.dataset.codigo = codigo;

        allRamos.forEach(r => {
          if (r.codigo !== codigo) {
            const option = document.createElement('option');
            option.value = r.codigo;
            option.textContent = `${r.nombre} (${r.codigo})`;
            if (prereqs.includes(r.codigo)) {
              option.selected = true;
            }
            select.appendChild(option);
          }
        });

        container.appendChild(select);
        semBox.appendChild(container);
      });

      editorDiv.appendChild(semBox);
    }

    // Exportar datos actualizados
    document.getElementById('exportar').addEventListener('click', () => {
      const nuevaData = JSON.parse(JSON.stringify(data)); // copiar original

      // Iterar y reemplazar prerrequisitos
      document.querySelectorAll('select').forEach(select => {
        const cod = select.dataset.codigo;
        const seleccionados = Array.from(select.selectedOptions).map(opt => opt.value);

        for (let semestre in nuevaData) {
          nuevaData[semestre].forEach(ramo => {
            if (ramo[1] === cod) {
              ramo[5] = seleccionados; // actualizar prerrequisitos
            }
          });
        }
      });

      // Mostrar JSON actualizado
      const output = document.getElementById('output');
      output.value = JSON.stringify(nuevaData, null, 2);
    });
  });
