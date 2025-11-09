// components/common/HookFormInput.tsx
import React from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  ControllerFieldState,
  ControllerRenderProps,
  UseFormStateReturn,
} from "react-hook-form";
import { Input, InputProps, Form, Select, SelectProps } from "antd";
import { LucideIcon } from "lucide-react";
import { TextAreaProps } from "antd/es/input";
const { TextArea, Password } = Input;

interface HookFormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<ControllerProps<TFieldValues, TName>, "render"> {
  label?: string;
  placeholder?: string;
  prefixIcon?: LucideIcon;
  type?: "text" | "password" | "number" | "textarea";
  disabled?: boolean;
  loading?: boolean;
  isMobile?: boolean;
  inputProps?: InputProps | TextAreaProps;
  styles?: React.CSSProperties;
  textAreaRows: number;
}

const HookFormInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  textAreaRows = 4,
  name,
  label,
  placeholder = "",
  prefixIcon: PrefixIcon,
  type = "text",
  disabled = false,
  loading = false,
  inputProps = {},
  rules,
  shouldUnregister,
  defaultValue,
  styles = {},
  isMobile,
}: HookFormInputProps<TFieldValues, TName>): React.ReactElement => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      shouldUnregister={shouldUnregister}
      defaultValue={defaultValue}
      render={({
        field: { onChange, onBlur, value, name, ref, disabled: fieldDisabled },
        fieldState: { error },
      }: {
        field: ControllerRenderProps<TFieldValues, TName>;
        fieldState: ControllerFieldState;
        formState: UseFormStateReturn<TFieldValues>;
      }) => {
        const hasError = !!error;
        const isDisabled = disabled || loading || fieldDisabled;

        //  TextArea : InputProps | TextAreaProps

        const commonProps = {
          size: isMobile ? "small" : "middle",
          id: name,
          value: value ?? "",
          onChange: onChange,
          onBlur: onBlur,
          placeholder: placeholder,
          status: hasError ? "error" : "",
          disabled: isDisabled,
          style: styles,
        };

        const inputComponent = () => {
          if (type === "password") {
            return (
              <Password
                {...(commonProps as InputProps)}
                {...(inputProps as InputProps)}
              />
            );
          } else if (type === "textarea") {
            return (
              <TextArea
                {...(commonProps as TextAreaProps)}
                {...(inputProps as TextAreaProps)}
                rows={textAreaRows}
              />
            );
          }
          return (
            <Input
              {...(commonProps as InputProps)}
              {...(inputProps as InputProps)}
              ref={ref}
              prefix={
                PrefixIcon ? (
                  <PrefixIcon
                    size={18}
                    className={hasError ? "text-red-400" : "text-gray-400"}
                  />
                ) : null
              }
            />
          );
        };

        return (
          <Form.Item
            label={label}
            validateStatus={error ? "error" : ""}
            help={error?.message}
            layout="vertical"
          >
            {inputComponent}
          </Form.Item>
        );
      }}
    />
  );
};

interface Option {
  value: string | number;
  label: React.ReactNode;
  disabled?: boolean;
}

interface HookFormSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<ControllerProps<TFieldValues, TName>, "render"> {
  label?: string;
  placeholder?: string;
  options: Option[];
  prefixIcon?: LucideIcon;
  disabled?: boolean;
  loading?: boolean;
  isMobile?: boolean;
  selectProps?: SelectProps;
  mode?: "multiple" | "tags";
  allowClear?: boolean;
  showSearch?: boolean;
  styles?: React.CSSProperties;
}

const HookFormSelect = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  placeholder = "Сонгоно уу",
  options = [],
  prefixIcon: PrefixIcon,
  disabled = false,
  loading = false,
  isMobile = false,
  selectProps = {},
  mode,
  allowClear = true,
  showSearch = true,
  rules,
  shouldUnregister,
  defaultValue,
  styles = {},
}: HookFormSelectProps<TFieldValues, TName>): React.ReactElement => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      shouldUnregister={shouldUnregister}
      defaultValue={defaultValue}
      render={({
        field: { onChange, onBlur, value, name, ref },
        fieldState: { error },
      }: {
        field: ControllerRenderProps<TFieldValues, TName>;
        fieldState: ControllerFieldState;
        formState: UseFormStateReturn<TFieldValues>;
      }) => {
        const hasError = !!error;
        const isDisabled = disabled || loading;

        return (
          <Form.Item
            label={label}
            validateStatus={hasError ? "error" : ""}
            help={error?.message}
            layout="vertical"
            className="mb-4"
          >
            <Select
              id={name}
              value={value ?? (mode === "multiple" ? [] : undefined)}
              onChange={onChange}
              onBlur={onBlur}
              ref={ref}
              size={isMobile ? "small" : "middle"}
              placeholder={placeholder}
              options={options}
              disabled={isDisabled}
              loading={loading}
              mode={mode}
              allowClear={allowClear}
              showSearch={showSearch}
              optionFilterProp="label"
              prefix={
                PrefixIcon ? (
                  <PrefixIcon
                    size={18}
                    className={hasError ? "text-red-400" : "text-gray-400"}
                  />
                ) : null
              }
              status={hasError ? "error" : ""}
              className={`rounded-xl ${hasError ? "border-red-300" : ""}`}
              style={{
                ...styles,
              }}
              popupClassName="rounded-xl"
              {...selectProps}
            />
          </Form.Item>
        );
      }}
    />
  );
};

export { HookFormInput, HookFormSelect };
