# 과제를 수행하며 배운 것들

## Promise.all과 map을 함께 사용하기

Cart에서, 아이템들의 정보를 불러오기 위해 반복문에 비동기 호출을 사용했는데, 완성하고 나서 생각해보니 이거를 반복문을 돌릴 게 아니라 `Promise.all`을 이용해서 한번에 처리하는게 더 나은 구조임을 알아차리고 시도했으나 뭐가 꼬여서 잘 되지 않았다. 어떻게 하는 것인지 알아보자.

```js
// 반복문
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
  });
}

// Promise.all과 map을 사용
const cartItems = await Promise.all(
  items.map(async ({ productId, optionId, quantity }) => {
    const { name: productName, price: defaultPrice, imageUrl, productOptions } = await productClient.getProductInfo(productId);
    const { name: optionName, price: optionPrice } = productOptions.find((option) => option.id === optionId);

    return {
      imageUrl,
      productName,
      optionName,
      price: defaultPrice + optionPrice,
      quantity,
    };
  })
);
```

끝나고 나서 해설을 보며 위의 코드를 작성했는데, 코드를 이해하기가 어려웠다. 특히 async가 왜 저위치에 들어가는건지 이해하기가 어려웠다. 천천히 생각해보면 알 수 있다. 아래의 키워드를 조합해보자.

- `Promise.all`은 Promise의 배열(이터러블)을 받는다.
- `Array.prototype.map`은 전달받은 콜백함수를 이용해 배열의 원소들을 콜백함수의 리턴값으로 바꾼다.
- async 함수는 Promise를 반환한다.

즉, async 함수를 콜백함수로 전달함으로써 배열 원소들을 Promise로 바꿔버린 후, Promise.all로 바꿔준 것이다.
