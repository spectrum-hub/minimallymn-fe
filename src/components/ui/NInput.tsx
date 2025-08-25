import { FC } from "react";
import { ControllerFieldState } from "react-hook-form";
import { TControllerRenderProps } from "../../types/Common";
import { Form, Input } from "antd";

export interface InputCustomProps {
  label?: string;
  fieldState: ControllerFieldState;
  field: TControllerRenderProps;
  type?: "I" | "T";
  isPhone?: boolean;
  name?: string;
  prefix?: never;
  icon?: never;
  defaultValue?: never;
}

const NInput: FC<InputCustomProps> = (props) => {

  console.log("propspropsprops-", props);
  const error = props?.fieldState?.error;
  const field = props?.field;


  if (props?.type === "T") {
    return (
      <Form.Item
        label={props?.label}
        validateStatus={error?.message ? "error" : ""}
        help={error?.message}
        layout={"vertical"}
        htmlFor={props?.name}
        initialValue={props?.defaultValue}
      >
    
        <Input.TextArea
          id={props?.name}
          onChange={field?.onChange}
          name={field?.name}
          defaultValue={field?.value}
          prefix={props?.prefix}
          rows={3}
        />
      </Form.Item>
    );
  }

  return (
    <Form.Item
      label={props?.label}
      validateStatus={error?.message ? "error" : ""}
      help={error?.message}
      layout={"vertical"}
      htmlFor={props?.name}
      initialValue={props?.defaultValue}
    >
      <Input
        id={props?.name}
        onChange={field?.onChange}
        name={field?.name}
        defaultValue={field?.value}
        prefix={props?.prefix}
        className={props?.isPhone ? "phone-input" : ""}
      />
    </Form.Item>
  );
};

export default NInput;
