import { useContext } from "react";
import Modal from "./UI/Modal";
import CartContext from "../store/CartContext";
import { currencyFormatter } from "../util/formatting";
import Input from "./UI/Input";
import Button from "./UI/Button";
import UserProgressContext from "../store/UserProgressContext";
import useHttp from "../hooks/useHttps";
import Error from "./Error";

const requestConfig = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

export default function Checkout() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
    cleaerData,
  } = useHttp("http://localhost:3000/orders", requestConfig);

  const cartTotal = cartCtx.items.reduce(
    (totalPrice, item) => totalPrice + item.quantity * item.price,
    0
  );

  function handleClose() {
    userProgressCtx.hideCheckout();
  }

  function handleFinish() {
    userProgressCtx.hideCheckout();
    cartCtx.clearCart();
    cleaerData();
  }

  function handleSubmit(event) {
    event.preventDefault();

    const fd = new FormData(event.target);
    const customerData = Object.fromEntries(fd.entries());

    sendRequest(
      JSON.stringify({
        order: {
          items: cartCtx.items,
          customer: customerData,
        },
      })
    );
  }

  let actions = (
    <>
      <Button type="button" textOnly onClick={handleClose}>
        닫기
      </Button>
      <Button>결제 요청</Button>
    </>
  );

  if (isSending) {
    actions = <span>주문 데이터 보내는 중...</span>;
  }

  if (data && !error) {
    return (
      <Modal
        open={userProgressCtx.progress === "checkout"}
        onClose={handleFinish}
      >
        <h2>주문 성공!</h2>
        <p>주문이 정상적으로 이루어졌습니다.</p>
        <p>주문 상세내용을 이메일로 보내드리겠습니다.</p>
        <p className="modal-actions">
          <Button onClick={handleFinish}>확인</Button>
        </p>
      </Modal>
    );
  }

  return (
    <Modal open={userProgressCtx.progress === "checkout"} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <h2>결제</h2>
        <p>결제 금액: {currencyFormatter.format(cartTotal)}</p>

        <Input label="이름" type="text" id="name" />
        <Input label="이메일" type="email" id="email" />
        <Input label="주소" type="text" id="street" />
        <div className="control-row">
          <Input label="우편번호" type="text" id="postal-code" />
          <Input label="상세주소" type="text" id="city" />
        </div>

        {error && <Error title="주문 전송 실패" message={error} />}

        <p className="modal-actions">{actions}</p>
      </form>
    </Modal>
  );
}
