const getCartItems = () =>
  fetch("http://nathanw.intdw.org:7001/api/cart").then((resp) => resp.json());

const addToCart = (pokemon) =>
  fetch("http://nathanw.intdw.org:7001/api/add", {
    method: "POST",
    body: JSON.stringify({
      pokemon,
    }),
    headers: {
      "content-type": "application/json",
    },
  }).then((resp) => resp.json());

const checkout = () =>
  fetch("http://nathanw.intdw.org:7001/api/checkout", {
    method: "POST",
    body: JSON.stringify({}),
    headers: {
      "content-type": "application/json",
    },
  }).then((resp) => resp.json());

module.exports = {
  checkout,
  getCartItems,
  addToCart,
};
