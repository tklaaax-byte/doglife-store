async function cargarProductos() {
  const contenedor = document.getElementById('lista-productos');

  try {
    const respuesta = await fetch('productos.json');
    const productos = await respuesta.json();

    productos.forEach((p, i) => {
      const item = document.createElement('div');
      item.classList.add('item');
      item.innerHTML = `
        <img src="${p.imagen}" alt="${p.nombre}">
        <h2>${p.nombre}</h2>
        <p>${p.descripcion}</p>
        <p><strong>${p.precio}</strong></p>
        <div id="paypal-button-${i}"></div>
      `;
      contenedor.appendChild(item);

      paypal.Buttons({
        style: { color: 'gold', shape: 'rect', label: 'pay' },
        createOrder: function (data, actions) {
          return actions.order.create({
            purchase_units: [{ amount: { value: p.precioUSD } }]
          });
        },
        onApprove: function (data, actions) {
          return actions.order.capture().then(function (details) {
            alert(`Pago completado por ${details.payer.name.given_name}. Gracias por comprar ${p.nombre}!`);
          });
        }
      }).render(`#paypal-button-${i}`);
    });

  } catch (error) {
    console.error('Error cargando productos:', error);
    contenedor.innerHTML = "<p>Error cargando productos. Revisa el archivo productos.json</p>";
  }
}

cargarProductos();
