import Component from "../core/Component.js";

import productClient from "../clients/productClient.js";

import router from "../routes/router.js";

import { LOCAL_STORAGE_KEY } from "../constants/localStorage.js";

export default class App extends Component {
  setup() {
    this.state = {
      cartItems: [],
    }
  }

  template() {
    const { cartItems } = this.state;

    return `
    <h1>장바구니</h1>
    <div class="Cart">
      <ul>
        ${cartItems.map((item) => this.createCartItemElement(item)).join('')}
      </ul>
      <div class="Cart__totalPrice">
        총 상품가격 ${this.getTotalPrice()}원
      </div>
      <button class="OrderButton">주문하기</button>
    `;
  }

  setEvents() {
    this.addEventListener("click", ".OrderButton", () => {
      this.order();
    });
  }
  
  afterMount() {
    this.loadCartItems();
  }

  handleEmpty() {
    alert("장바구니가 비어 있습니다");
    router.push("/");
  }

  async loadCartItems() {
    const items = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (!items || items.length === 0) {
      this.handleEmpty();
      return;
    }

    const cartItems = [];

    for (let { productId, optionId, quantity } of items) {
      const { name: productName, price: defaultPrice, imageUrl, productOptions } = await productClient.getProductInfo(productId);
      const { name: optionName, price: optionPrice } = productOptions.find((option) => option.id === optionId);

      cartItems.push({
        imageUrl,
        productName,
        optionName,
        price: defaultPrice + optionPrice,
        quantity,
      })
    }

    this.setState({ cartItems });
  }

  createCartItemElement({ imageUrl, productName, optionName, price, quantity }) {
    return `
    <li class="Cart__item">
      <img src=${imageUrl}>
      <div class="Cart__itemDesription">
        <div>${productName} ${optionName} ${quantity}개</div>
        <div>${Number(price * quantity).toLocaleString()}원</div>
      </div>
    </li>
    `;
  }

  getTotalPrice() {
    const { cartItems } = this.state;

    return cartItems.reduce((total, { price, quantity }) => total += price * quantity , 0);
  }

  order() {
    alert("주문되었습니다");
    localStorage.setItem(LOCAL_STORAGE_KEY, "[]");
    router.push("/");
  }
}