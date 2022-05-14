import Router from "../core/Router.js";

const router = new Router("/web", {
  "/": "ProductList",
  "/products/*": "ProductDetail",
  "/cart": "Cart",
});
export default router;