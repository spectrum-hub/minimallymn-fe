import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { Form, Select } from "antd";

interface PSelectProps<T extends FieldValues> {
  field: ControllerRenderProps<T, FieldPath<T>>;
  fieldState: ControllerFieldState;
  label: string;
  htmlFor: string;
  options: { label: string; value: string }[];
  disabled?: boolean;
  onChange?: (value: string) => void; // Custom onChange функц
}

const PSelect = <T extends FieldValues>({
  field,
  fieldState,
  label,
  htmlFor,
  options,
  disabled = false,
  onChange,
}: PSelectProps<T>): JSX.Element => {
  const commonFormProps = {
    validateStatus: (fieldState: ControllerFieldState) =>
      fieldState?.error ? "error" : "",
    help: (fieldState: ControllerFieldState) => fieldState?.error?.message,
    layout: "vertical" as const,
  };

  return (
    <Form.Item
      label={label}
      {...commonFormProps}
      validateStatus={commonFormProps.validateStatus(fieldState)}
      help={commonFormProps.help(fieldState)}
      htmlFor={htmlFor}
    >
      <Select
        id={htmlFor}
        value={field.value}
        onChange={(v) => {
          field.onChange(v);
          if (onChange) onChange(v);
        }}
        disabled={disabled}
        options={options}
        className={`min-w-44 w-full `} // styles.select-ийг нэмсэн
      />
    </Form.Item>
  );
};

export default PSelect;
