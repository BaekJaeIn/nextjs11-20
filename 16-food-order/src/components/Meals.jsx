import useHttp from "../hooks/useHttps";
import Error from "./Error";
import MealItem from "./MealItem";

const requestConfig = {};

export default function Meals() {
  const {
    data: loadedMeals,
    isLoading,
    error,
  } = useHttp(
    "https://react-http-20885-default-rtdb.asia-southeast1.firebasedatabase.app/16-food-order/meals.json",
    requestConfig,
    []
  );

  if (isLoading) {
    return <p className="center">메뉴 가져오는 중...</p>;
  }

  if (error) {
    return <Error title="메뉴를 가져오는데 실패함" message={error} />;
  }

  return (
    <ul id="meals">
      {loadedMeals.map((meal) => (
        <MealItem key={meal.id} meal={meal} />
      ))}
    </ul>
  );
}
