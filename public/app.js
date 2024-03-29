const toCurrency = (price) => {
  return new Intl.NumberFormat("ru-RU", {
    currency: "UAH",
    style: "currency",
  }).format(price);
};

document.querySelectorAll(".price").forEach((node) => {
  node.textContent = toCurrency(node.textContent);
});

const $cart = document.querySelector("#cart");
if ($cart) {
  $cart.addEventListener("click", (e) => {
    if (e.target.classList.contains("js-remove")) {
      const id = e.target.dataset.id;

      fetch("/cart/remove/" + id, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((cart) => {
          if (cart.courses.length) {
            //need to update table
            const html = cart.courses
              .map((c) => {
                return `
                <tr>
                  <td>${c.title}</td>
                  <td>${c.count}</td>
                  <td>
                    <button
                      class="btn btn-small js-remove"
                      data-id="${c.id}"
                    >Delete</button>
                  </td>
                </tr>
              `;
              })
              .join("");
            $cart.querySelector("tbody").innerHTML = html;
            $cart.querySelector(".price").textContent = toCurrency(cart.price);
          } else {
            $cart.innerHTML = "<p>Your cart is empty</p>";
          }
        });
    }
  });
}

const toDate = (date) => {
  return new Intl.DateTimeFormat("ua-UA", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(date));
};

const date = document.querySelectorAll(".date").forEach((node) => {
  node.textContent = toDate(node.textContent);
});
