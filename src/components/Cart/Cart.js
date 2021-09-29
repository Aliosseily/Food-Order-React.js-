import React, { useContext, useState } from "react";
import Modal from "../UI/Modal";
import styles from "./Cart.module.css";
import CartContext from "../../store/cart-context";
import CartItem from "./CartItem";
import Checkout from "./Checkout";
const Cart = (props) => {
  const [isCheckout, setIsCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);
  const [error, setError] = useState();

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

  const submitOrderHandler = async (userData) => {
    setIsSubmitting(true);
   setError();
    try {
      const response = await fetch(
        "https://react-http-9a2e3-default-rtdb.asia-southeast1.firebasedatabase.app/orders.json",
        {
          method: "POST",
          // when I add headers error message below was not returned
          // headers:{
          //   'Content-Type':'application/json'
          // },
          body: JSON.stringify({
            user: userData,
            orderedItems: cartCtx.items,
          }),
        }
      );
      console.log("response", response);
      if (!response.ok) {
        throw new Error("Something went wrong while trying to order");
      }
    } catch (error) {
      setDidSubmit(false);
      setError(error.message || "Something went wrong!");
    }
    setIsSubmitting(false);
    setDidSubmit(true);
    cartCtx.clearCartItems()
  };

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

  const cartModalcontent = (
    <React.Fragment>
      {cartItems}
      <div className={styles.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      {isCheckout && (
        <Checkout onCancel={cancelFormHandler} onConfirm={submitOrderHandler} />
      )}
      {!isCheckout && modalActions}
    </React.Fragment>
  );

  const isSubmittingModalcontent = <p>Sending order data...</p>;
  const didSubmitModalcontent = (
    <React.Fragment>
      <p>Successfully sent the order.</p>
      <div className={styles.actions}>
        <button className={styles["button--alt"]} onClick={props.onHideCart}>
          Close
        </button>
      </div>
    </React.Fragment>
  );
  return (
    <Modal onCloseCart={props.onHideCart}>
      { (error || (!isSubmitting && !didSubmit)) && cartModalcontent}
      {isSubmitting && isSubmittingModalcontent}
      {!isSubmitting && didSubmit && !error && didSubmitModalcontent}
    </Modal>
  );
};

export default Cart;
