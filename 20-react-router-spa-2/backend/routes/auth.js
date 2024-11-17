const express = require("express");
const { add, get } = require("../data/user");
const { createJSONToken, isValidPassword } = require("../util/auth");
const { isValidEmail, isValidText } = require("../util/validation");

const router = express.Router();

router.post("/signup", async (req, res, next) => {
  const data = req.body;
  let errors = {};

  if (!isValidEmail(data.email)) {
    errors.email = "잘못된 이메일입니다.";
  } else {
    try {
      const existingUser = await get(data.email);
      if (existingUser) {
        errors.email = "이미 존재하는 이메일입니다.";
      }
    } catch (error) {}
  }

  if (!isValidText(data.password, 6)) {
    errors.password =
      "비밀번호가 잘못되었습니다. 길이는 6자 이상이어야 합니다..";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: "유효성 검사 오류로 인해 회원가입에 실패했습니다..",
      errors,
    });
  }

  try {
    const createdUser = await add(data);
    const authToken = createJSONToken(createdUser.email);
    res
      .status(201)
      .json({
        message: "회원가입이 완료되었습니다.",
        user: createdUser,
        token: authToken,
      });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  let user;
  try {
    user = await get(email);
  } catch (error) {
    return res.status(401).json({ message: "인증에 실패했습니다." });
  }

  const pwIsValid = await isValidPassword(password, user.password);
  if (!pwIsValid) {
    return res.status(422).json({
      message: "잘못된 자격 증명.",
      errors: { credentials: "잘못된 이메일 또는 비밀번호를 입력했습니다." },
    });
  }

  const token = createJSONToken(email);
  res.json({ token });
});

module.exports = router;
