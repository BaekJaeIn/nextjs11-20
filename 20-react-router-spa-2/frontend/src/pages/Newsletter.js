import NewsletterSignup from "../components/NewsletterSignup";
import PageContent from "../components/PageContent";

function NewsletterPage() {
  return (
    <PageContent title="우리의 멋진 뉴스레터에 참여하세요!">
      <NewsletterSignup />
    </PageContent>
  );
}

export default NewsletterPage;

export async function action({ request }) {
  const data = await request.formData();
  const email = data.get("email");

  // send to backend newsletter server ...
  console.log(email);
  return { message: "회원가입 성공!" };
}
