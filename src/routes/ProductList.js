import Component from "../core/Component.js";

import Product from "../components/Product.js";

import productClient from "../clients/productClient.js";

import router from "./router.js";

export default class App extends Component {
  setup() {
    this.state = {
      productList: [],
    }
  }

  template() {
    const { productList } = this.state;

    return `
    <h1>상품목록</h1>
    <ul>
      ${productList.map(({ id }, i) => `<li class="Product" data-component="Product" data-key=${i} data-id=${id}></li>`).join('')}
    </ul>
    `;
  }

  generateChildComponent(target, name, key) {
    const { productList } = this.state;
    
    switch(name) {
      case "Product":
        return new Product(target, () => {
          return {
            product: productList[key],
          }
        });
    }
  }

  setEvents() {
    this.addEventListener("click", ".Product", (e) => {
      const target = e.target.closest(".Product");
      if (!target) return;

      router.push(`/products/${target.dataset.id}`);
    })
  }
  
  afterMount() {
    this.loadProductList();
  }

  async loadProductList() {
    const productList = await productClient.getProductList();
    this.setState({ productList });
  }
}