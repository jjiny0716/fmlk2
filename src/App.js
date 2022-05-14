import Component from "./core/Component.js";

import ProductList from "./routes/ProductList.js";
import ProductDetail from "./routes/ProductDetail.js";
import Cart from "./routes/Cart.js";

import router from "./routes/router.js";

export default class App extends Component {
  template() {
    const route = router.route ?? "ProductList";
    console.log(route);
    return `
    <div class="${route}Page" data-component=${route}>
    `;
  }

  generateChildComponent(target, name) {
    switch(name) {
      case "ProductList":
        return new ProductList(target);
      case "ProductDetail":
        return new ProductDetail(target);
      case "Cart":
        return new Cart(target);
    }
  }
}
