import { useRouteError } from "react-router-dom";
import PageContent from "../components/PageContent";
import MainNavigation from "../components/MainNavigation";

export default function ErrorPage() {
  const error = useRouteError();

  let title = "오류가 발생했습니다";
  let message = "뭔가 잘못되었습니다.";

  if (error.status === 500) {
    message = error.data.message;
  }

  if (error.status === 404) {
    title = "찾을 수 없음";
    message = "리소스 또는 페이지를 찾을 수 없습니다.";
  }

  return (
    <>
      <PageContent title={title}>
        <p>{message}</p>
      </PageContent>
    </>
  );
}
