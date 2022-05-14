import { API_ENDPOINT } from "../constants/api.js";

async function httpGetRequest(url) {
  const response = await fetch(url);

  if (!response) {
    throw new Error("오류가 발생했습니다.");
  }

  return await response.json();
}

class ProductClient {
  async getProductList() {
    return await httpGetRequest(API_ENDPOINT);
  }

  async getProductInfo(id) {
    return await httpGetRequest(`${API_ENDPOINT}/${id}`);
  }
}

const productClient = new ProductClient();
export default productClient;