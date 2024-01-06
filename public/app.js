const toCurrency = (price) => {
  return new Intl.NumberFormat("ru-RU", {
    currency: "UAH",
    style: "currency",
  }).format(price);
};

document.querySelectorAll(".price").forEach((node) => {
  node.textContent = toCurrency(node.textContent);
});

const $card = document.querySelector("#card");
if ($card) {
  $card.addEventListener("click", (e) => {
    if (e.target.classList.contains("js-remove")) {
      const id = e.target.dataset.id;

      fetch("/card/remove/" + id, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((card) => {
          if (card.courses.length) {
            //need to update table
            const html = card.courses
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
            $card.querySelector("tbody").innerHTML = html;
            $card.querySelector(".price").textContent = toCurrency(card.price);
          } else {
            $card.innerHTML = "<p>Your card is empty</p>";
          }
        });
    }
  });
}
