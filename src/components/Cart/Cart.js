import { useContext, useState } from "react";
import Modal from "../UI/Modal";
import styles from "./Cart.module.css";
import CartContext from "../../store/cart-context";
import CartItem from "./CartItem";
import Checkout from "./Checkout";
const Cart = (props) => {
  const [isCheckout, setIsCheckout] = useState(false);

  const cartCtx = useContext(CartContext);
  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;
  const cartItemAddHandler = (item) => {
    const obj = {
      ...item,
      amount: 1,
    };
    cartCtx.addItem(obj);
  };

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const orderHandler = () => {
    setIsCheckout(true);
  };


  const submitOrderHandler = (userData) => {
    fetch("https://react-http-9a2e3-default-rtdb.asia-southeast1.firebasedatabase.app/orders.json",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify({
        user:userData,
        orderedItems:cartCtx.items
      })
    })
  }

  const cancelFormHandler = () => {
    setIsCheckout(false);
  };

  const cartItems = (
    <ul className={styles["cart-items"]}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          price={item.price}
          name={item.name}
          amount={item.amount}
          onAdd={cartItemAddHandler.bind(null, item)}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
        />
      ))}
    </ul>
  );

  const modalActions = (
    <div className={styles.actions}>
      <button className={styles["button--alt"]} onClick={props.onHideCart}>
        Close
      </button>
      {hasItems && (
        <button onClick={orderHandler} className={styles.button}>
          Order
        </button>
      )}
    </div>
  );

  return (
    <Modal onCloseCart={props.onHideCart}>
      {cartItems}
      <div className={styles.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {isCheckout && <Checkout onCancel={cancelFormHandler} onConfirm={submitOrderHandler} />}

      {!isCheckout && modalActions}
    </Modal>
  );
};

export default Cart;
