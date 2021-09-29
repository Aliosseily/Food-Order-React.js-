import { useRef, useState } from "react";
import styles from "./Checkout.module.css";

const isEmpty = (value) => value.trim() === "";
const isFiveChar = (value) => value.trim().length === 5;

const Checkout = (props) => {
    console.log("Checkout")
  const [formInputsValidity, setFormInputsValidity] =useState({
    name: true,
    street: true,
    postalCode: true,
    city: true,
  });

  const nameInput = useRef();
  const streetInput = useRef();
  const postalCodeInput = useRef();
  const cityInput = useRef();
  const confirmHandler = (event) => {
    event.preventDefault();
    const enteredName = nameInput.current.value;
    const enteredStreet = streetInput.current.value;
    const enteredPostalCode = postalCodeInput.current.value;
    const enteredCity = cityInput.current.value;
    // Simple form validation
    const enteredNameIsValid = !isEmpty(enteredName);
    const enteredStreetIsValid = !isEmpty(enteredStreet);
    const enteredPostalCodeIsValid = isFiveChar(enteredPostalCode);
    const enteredcityIsValid = !isEmpty(enteredCity);

    setFormInputsValidity({
      name: enteredNameIsValid,
      street: enteredStreetIsValid,
      postalCode: enteredPostalCodeIsValid,
      city: enteredcityIsValid,
    });

    const formIsValid =
      enteredNameIsValid &&
      enteredStreetIsValid &&
      enteredPostalCodeIsValid &&
      enteredcityIsValid;
    if (!formIsValid) {
      return;
    }
    props.onConfirm({
        name:enteredName,
        street:enteredStreet,
        postalCode:enteredPostalCode,
        city:enteredCity,
    })
  };
const nameControlClasses = `${styles.control} ${formInputsValidity.name ? "" : styles.invalid}`;
const streetControlClasses = `${styles.control} ${formInputsValidity.street ? "" : styles.invalid}`;
const postalCodeControlClasses = `${styles.control} ${formInputsValidity.postalCode ? "" : styles.invalid}`;
const cityControlClasses = `${styles.control} ${formInputsValidity.city ? "" : styles.invalid}`;
  return (
    <form className={styles.form} onSubmit={confirmHandler}>
      <div className={nameControlClasses}>
        <label htmlFor="name">Your Name</label>
        <input ref={nameInput} type="text" id="name" />
        {!formInputsValidity.name && <p>Please enter a valid name!</p>}
      </div>
      <div className={streetControlClasses}>
        <label htmlFor="street">Street</label>
        <input ref={streetInput} type="text" id="street" />
        {!formInputsValidity.street && <p>Please enter a valid stret!</p>}

      </div>
      <div className={postalCodeControlClasses}>
        <label htmlFor="postal">Postal Code</label>
        <input ref={postalCodeInput} type="text" id="postal" />
        {!formInputsValidity.postalCode && <p>Please enter a valid postal code ( 5 character long )</p>}

      </div>
      <div className={cityControlClasses}>
        <label htmlFor="city">City</label>
        <input ref={cityInput} type="text" id="city" />
        {!formInputsValidity.city && <p>Please enter a valid city!</p>}

      </div>
      <div className={styles.actions}>
        <button type="button" onClick={props.onCancel}>
          Cancel
        </button>
        <button type="submit" className={styles.submit}>Confirm</button>
      </div>
    </form>
  );
};

export default Checkout;
