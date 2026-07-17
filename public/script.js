fetch("/api/products")
  .then(res => res.json())
  .then(products => {

    const container = document.getElementById("products");

    products.forEach(product => {

      container.innerHTML += `
        <div class="card">

          <img src="${product.image}">

          <div class="card-content">

            <h3>${product.name}</h3>

            <p class="price">
              ₹${product.price}
            </p>

            <button>Add To Cart</button>

          </div>

        </div>
      `;
    });

  });
