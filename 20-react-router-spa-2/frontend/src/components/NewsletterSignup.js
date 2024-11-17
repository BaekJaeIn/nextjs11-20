import { useFetcher } from "react-router-dom";
import classes from "./NewsletterSignup.module.css";
import { useEffect } from "react";

function NewsletterSignup() {
  const fetcher = useFetcher();
  const { data, state } = fetcher;

  useEffect(() => {
    if (state === "idle" && data && data.message) {
      window.alert(data.message);
    }
  }, [data, state]);

  return (
    <fetcher.Form
      method="post"
      action="/newsletter"
      className={classes.newsletter}
    >
      <input
        type="email"
        placeholder="뉴스레터에 가입하세요..."
        aria-label="뉴스레터에 가입하세요"
      />
      <button>회원가입</button>
    </fetcher.Form>
  );
}

export default NewsletterSignup;
