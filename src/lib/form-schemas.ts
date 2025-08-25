import * as Yup from "yup";
import { FormName } from "../Screens/Auth/LoginScreen";
import { PaymentTypes } from "../types/Cart";

const validPaymentCodes: PaymentTypes[] = [
  "pocketzero",
  "storepay",
  "wire_transfer",
  "lendmn",
]; // Replace with actual codes

export const searchFormSchema = Yup.object().shape({
  searchString: Yup.string().required(""),
});

export const loginSchema = Yup.object().shape({
  phone: Yup.string()
    .required("Утасны дугаар оруулна уу")
    .matches(/^[0-9]+$/, "Утасны дугаараа зөв оруулна уу")
    .length(8, "Утасны дугаараа зөв оруулна уу"),
  password: Yup.string().required("Нууц үгээ оруулна уу"),
});

export const authSchema = Yup.object().shape({
  phone: Yup.string()
    .required("Утасны дугаар оруулна уу")
    .matches(/^[0-9]+$/, "Утасны дугаараа зөв оруулна уу")
    .length(8, "Утасны дугаараа зөв оруулна уу"),
  password: Yup.string().when("formName", {
    is: "login",
    then: (schema) => schema.required("Нууц үгээ оруулна уу"),
    otherwise: (schema) => schema.notRequired(),
  }),
  verify_code: Yup.string().when("formName", {
    is: "login_by_otp",
    then: (schema) => schema.required("OTP код оруулна уу"),
    otherwise: (schema) => schema.notRequired(),
  }),
  formName: Yup.mixed<FormName>()
    .oneOf(["login", "reset_password", "login_by_otp"])
    .required(),
});

const phoneSchema = Yup.object().shape({
  phone: Yup.string()
    .required("Утасны дугаар оруулна уу")
    .matches(/^[0-9]+$/, "Утасны дугаараа зөв оруулна уу")
    .min(8, "Утасны дугаараа зөв оруулна уу")
    .max(8, "Утасны дугаараа зөв оруулна уу"),
});
export const validSchema1 = Yup.object().shape({
  city: Yup.string().required("Заавал бөглөх"),
  district: Yup.string().required("Заавал бөглөх "),
  baghoroo: Yup.string().required("Заавал бөглөх"),
  firstname: Yup.string().required("Заавал бөглөх"),
  register_org: Yup.string().notRequired(),
  s_phone: Yup.string()
    .required("Утасны дугаар оруулна уу")
    .matches(/^[0-9]+$/, "Утасны дугаараа зөв оруулна уу")
    .min(8, "Утасны дугаараа зөв оруулна уу")
    .max(8, "Утасны дугаараа зөв оруулна уу"),
  customer_type: Yup.string().required(),
  s_address: Yup.string().required("Хүргэлтийн дэлгэрэнгүй хаягаа оруулна уу "),
  email: Yup.string().notRequired(),
  customer_notes: Yup.string().notRequired(),
});

export const validSchema2 = validSchema1.shape({
    city: Yup.string().required("Заавал бөглөх"),
  district: Yup.string().required("Заавал бөглөх "),
  baghoroo: Yup.string().required("Заавал бөглөх"),
  firstname: Yup.string().required("Заавал бөглөх"),
  register_org: Yup.string().notRequired(),
  s_phone: Yup.string()
    .required("Утасны дугаар оруулна уу")
    .matches(/^[0-9]+$/, "Утасны дугаараа зөв оруулна уу")
    .min(8, "Утасны дугаараа зөв оруулна уу")
    .max(8, "Утасны дугаараа зөв оруулна уу"),
  customer_type: Yup.string().required(),
  s_address: Yup.string().required("Хүргэлтийн дэлгэрэнгүй хаягаа оруулна уу "),
  email: Yup.string().notRequired(),
  customer_notes: Yup.string().notRequired(),
  deliveryId: Yup.number().when("paymentCode", {
    is: (val: string) => val !== undefined,
    then: (schema) => schema.required("Хүргэлтийн аргаа сонгоно уу"),
    otherwise: (schema) => schema.notRequired(),
  }),
  paymentCode: Yup.mixed<PaymentTypes>()
    .oneOf([...validPaymentCodes])
    .required("Төлбөр төлөх хэлбэрээ сонгоно уу "),
});

export const validationSchemaGift = Yup.object().shape({
  firstname: Yup.string().required(),
  city: Yup.string().required(),
  s_phone: Yup.number().required("Утасны дугаар оруулна уу"),
  customer_type: Yup.string().required(),
  paymentCode: Yup.string().required("Төлбөр төлөх хэлбэрээ сонгоно уу "),
});

export const validationSchemaCouponCodes = Yup.object().shape({
  coupon_codes: Yup.string().required("Урамшууллын код оруулна уу"),
});

export const registerSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(/^\d{8}$/, "Утасны дугаар 8 оронтой байх ёстой.")
    .required("Утасны дугаараа оруулна уу."),
});

export const resetPasswordSchema = phoneSchema.clone().shape({
  verify_code: Yup.string(),
});

export const resetPasswordSchemaOTP = phoneSchema.clone().shape({
  verify_code: Yup.string()
    .required("Нэг удаагийн нууц үгийг оруулна уу")
    .matches(/^[0-9]+$/, "Нэг удаагийн нууц үгийг оруулна уу")
    .min(4, "Нэг удаагийн нууц үгийг оруулна уу")
    .max(4, "Нэг удаагийн нууц үгийг оруулна уу"),
});

export const profileSchema = phoneSchema.clone().shape({
  firstname: Yup.string().required("Заавал бөглөх"),
  s_address: Yup.string().required("Хүргэлтийн дэлгэрэнгүй хаягаа оруулна уу "),
  email: Yup.string().notRequired(),
});
export const passwordResetSchema = Yup.object().shape({
  email: Yup.string().notRequired(),
  password1: Yup.string().required("Заавал бөглөх"),
  password2: Yup.string().required("Заавал бөглөх"),
});

export const AccountFormSchema = Yup.object().shape({
  city_id: Yup.string().required("Заавал бөглөх"),
  district_id: Yup.string().required("Заавал бөглөх "),
  baghoroo_id: Yup.string().required("Заавал бөглөх"),
});
