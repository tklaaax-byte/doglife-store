let carrito = [];

async function cargarProductos() {
  const contenedor = document.getElementById('lista-productos');
  const inputBusqueda = document.getElementById('searchInput');
  const contadorCarrito = document.getElementById('contadorCarrito');

  try {
    const respuesta = await fetch('productos.json');
    const productos = await respuesta.json();

    function mostrarProductos(filtro = '') {
      contenedor.innerHTML = '';
      const filtrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(filtro.toLowerCase())
      );

      filtrados.forEach((p, i) => {
        const item = document.createElement('div');
        item.classList.add('item');
        item.innerHTML = `
          <img src="${p.imagen}" alt="${p.nombre}">
          <h2>${p.nombre}</h2>
          <p>${p.descripcion}</p>
          <p><strong>${p.precio}</strong></p>
          <button class="agregarCarrito">Agregar al carrito 🛒</button>
        `;
        contenedor.appendChild(item);

        item.querySelector('.agregarCarrito').addEventListener('click', () => {
          carrito.push(p);
          contadorCarrito.textContent = carrito.length;
          alert(`${p.nombre} añadido al carrito`);
        });
      });
    }

    mostrarProductos();
    inputBusqueda.addEventListener('input', e => mostrarProductos(e.target.value));

  } catch (error) {
    console.error('Error cargando productos:', error);
    contenedor.innerHTML = "<p>Error cargando productos.</p>";
  }
}

function manejarCarrito() {
  const modal = document.getElementById('carritoModal');
  const listaCarrito = document.getElementById('listaCarrito');
  const total = document.getElementById('total');
  const cerrar = document.getElementById('cerrarCarrito');
  const ver = document.getElementById('verCarrito');

  ver.addEventListener('click', () => {
    listaCarrito.innerHTML = '';
    let suma = 0;

    carrito.forEach((item, i) => {
      const div = document.createElement('div');
      div.classList.add('itemCarrito');
      div.innerHTML = `
        <p>${item.nombre} - ${item.precio}</p>
        <button class="eliminar">❌</button>
      `;
      listaCarrito.appendChild(div);

      suma += parseFloat(item.precioUSD);

      div.querySelector('.eliminar').addEventListener('click', () => {
        carrito.splice(i, 1);
        listaCarrito.removeChild(div);
        document.getElementById('contadorCarrito').textContent = carrito.length;
        total.textContent = `Total: $${suma.toFixed(2)} USD`;
      });
    });

    total.textContent = `Total: $${suma.toFixed(2)} USD`;
    modal.style.display = 'flex';
  });

  cerrar.addEventListener('click', () => {
    modal.style.display = 'none';
  });
}

cargarProductos();
manejarCarrito();
