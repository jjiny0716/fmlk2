import Component from "../core/Component.js";

import productClient from "../clients/productClient.js";

import { LOCAL_STORAGE_KEY } from "../constants/localStorage.js";

import router from "./router.js";

export default class App extends Component {
  setup() {
    const id = window.location.href.split('/').at(-1);

    this.state = {
      id,
      productInfo: null,
      selectedOptions: [],
    }
  }

  template() {
    const { productInfo, selectedOptions } = this.state;
    if (!this.state.productInfo) return '';

    const { name, price, imageUrl, productOptions } = productInfo;

    return `
    <h1>${name} 상품 정보</h1>
    <div class="ProductDetail">
      <img src=${imageUrl}>
      <div class="ProductDetail__info">
        <h2>${name}</h2>
        <div class="ProductDetail__price">${Number(price).toLocaleString()}원~</div>
        <select>
          <option disabled>선택하세요.</option>
          ${productOptions.map((option, i) => this.createOptionElement(option, i)).join('')}
        </select>
        <div class="ProductDetail__selectedOptions">
          <h3>선택된 상품</h3>
          <ul>
            ${selectedOptions.map((option, i) => this.createSelectedOptionElement(option, i)).join('')}
          </ul>
          <div class="ProductDetail__totalPrice">${this.getTotalPrice()}원</div>
          <button class="OrderButton">주문하기</button>
        </div>
      </div>
    </div>
    `;
  }

  setEvents() {
    // 옵션 선택
    this.addEventListener("change", "select", (e) => {
      this.addSelectedOption(e.target.options[e.target.selectedIndex].dataset.index);
    })

    // 옵션 추가, 감소
    this.addEventListener("input", ".ProductDetail__selectedOptions", (e) => {
      const resultValue = this.changeSelectedOptionQuantity(e.target.dataset.index, e.target.value);
      e.target.value = resultValue;
    })

    // 주문하기 버튼 클릭
    this.addEventListener("click", ".OrderButton", (e) => {
      this.storeCartItems();
      router.push("/cart");
    })
  }
  
  afterMount() {
    this.loadProductInfo();
  }

  async loadProductInfo() {
    const { id } = this.state;
    const productInfo = await productClient.getProductInfo(id);
    
    this.setState({ productInfo });
  }

  createOptionElement({ name: optionName, price, stock }, i) {
    const { name: productName } = this.state.productInfo;
    if (Number(price) === 0) return `<option data-index=${i}>${productName} ${optionName}</option>`;

    if (stock === 0) return `<option disabled>(품절) ${productName} ${optionName}</option>`;

    return `<option data-index=${i}>${productName} ${optionName} (+${price}원)</option>`;
  }

  addSelectedOption(optionIndex) {
    const { productInfo, selectedOptions } = this.state;
    const { price: defaultPrice, productOptions } = productInfo;
    const { id, name, price: optionPrice, stock } = productOptions[optionIndex];

    if (selectedOptions.find((option) => option.id === id)) return;

    selectedOptions.push({
      id, 
      name,
      price: defaultPrice + optionPrice,
      quantity: 1,
      stock,
    })
    
    this.setState({ selectedOptions: [...selectedOptions] });
  }

  createSelectedOptionElement({ name, price, quantity }, i) {
    return `
    <li>
      ${name} ${Number(price).toLocaleString()} <div><input type="number" value=${quantity} data-index=${i}>개</div>
    </li>
    `;
  }

  changeSelectedOptionQuantity(optionIndex, value) {
    if (value === "") return "";
    const { selectedOptions } = this.state;
    const option = selectedOptions[optionIndex];

    if (value < 0) return 0;
    if (value > option.stock) return option.stock;

    option.quantity = value;
    if (Number(option.quantity) === 0) {
      selectedOptions.splice(optionIndex, 1);
    }

    this.setState({ selectedOptions: [...selectedOptions] });
    return value;
  }

  getTotalPrice() {
    const { selectedOptions } = this.state;

    return selectedOptions.reduce((total, { price, quantity }) => total += price * quantity, 0).toLocaleString();
  }

  storeCartItems() {
    const { id: productId, selectedOptions } = this.state;
    const cartItems = [];

    for (let { id: optionId, quantity} of selectedOptions) {
      cartItems.push({
        productId,
        optionId,
        quantity,
      })
    }

    const previousCartItems = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) ?? [];
    const resultCartItems = [...previousCartItems, ...cartItems];
    
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(resultCartItems));
  }
}
