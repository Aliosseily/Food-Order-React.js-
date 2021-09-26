import React, { useState, useEffect } from "react";
import styles from "./AvailableMeals.module.css";
import Card from "../UI/Card";
import MealItem from "./MealItem/MealItem";

const AvailableMeals = (props) => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // the function you pass to useEffect should not return a promise
  //useEffect( async () => { }, []); you can't do it like this
  // instead the function u pass to useEffect ma y return a cleanup function which can be executed
  //this cleanupr run syncronously and not return a promise
  useEffect(() => {
    const fetchMeals = async () => {
      const response = await fetch(
        "https://react-http-9a2e3-default-rtdb.asia-southeast1.firebasedatabase.app/meals.json"
      );
      if (!response.ok) {
        /* ewhen ew generate error like this and we pass a string to the constructor
         that string will be stored in the message property of the created error object on catch */
        throw new Error("Something went wrong!");
      }

      const responseData = await response.json();
      console.log("data", responseData);
      const loadedMeals = [];
      for (const key in responseData) {
        loadedMeals.push({
          id: key,
          name: responseData[key].name,
          description: responseData[key].description,
          price: responseData[key].price,
        });
      }

      setMeals(loadedMeals);
      setIsLoading(false);
    };

    fetchMeals().catch((error) => {
      setIsLoading(false);
      setError(error.message);
    });

    // we can,t handle error like this because fetchMeals is an asynx function , it always return a promise
    //if we throw an error inside of a promise that error will cause that promise to reject
    // try {
    //   fetchMeals();
    // } catch (error) {
    //   setIsLoading(false);
    //   setError(error.message);
    // }
  }, []);

  if (isLoading) {
    return (
      <section className={styles.MealsLoading}>
        <p> Loading...</p>
      </section>
    );
  }
  if (error) {
    return (
      <section className={styles.MealsError}>
        <p>{error}</p>
      </section>
    );
  }

  const mealsList = meals.map((meal) => (
    <MealItem
      key={meal.id}
      id={meal.id}
      name={meal.name}
      price={meal.price}
      description={meal.description}
    />
  ));
  return (
    <section className={styles.meals}>
      <Card>
        <ul>{mealsList}</ul>
      </Card>
    </section>
  );
};

export default AvailableMeals;
