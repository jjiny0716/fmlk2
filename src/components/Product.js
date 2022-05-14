import Component from "../core/Component.js";

export default class Product extends Component {
  template() {
    const { name, imageUrl, price } = this.props.product;

    return `
    <img src=${imageUrl}>
    <div class="Product__info">
      <div>${name}</div>
      <div>${Number(price).toLocaleString()}원~</div>
    </div>
    `;
  }
}