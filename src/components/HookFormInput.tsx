// components/common/HookFormInput.tsx
import React from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { Input, InputProps, Form, Select, SelectProps } from "antd";
import { LucideIcon } from "lucide-react";

const { TextArea } = Input;
const Password = Input.Password;

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
  inputProps?: InputProps;
  textareaProps?: Omit<
    React.ComponentProps<typeof TextArea>,
    "value" | "onChange" | "onBlur"
  >;
  textareaRows?: number;
  styles?: React.CSSProperties;
}

const HookFormInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  placeholder = "",
  prefixIcon: PrefixIcon,
  type = "text",
  disabled = false,
  loading = false,
  inputProps = {},
  textareaProps = {},
  textareaRows = 4,
  rules,
  shouldUnregister,
  defaultValue,
  styles = {},
  isMobile,
}: HookFormInputProps<TFieldValues, TName>) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      shouldUnregister={shouldUnregister}
      defaultValue={defaultValue}
      render={({
        field: { onChange, onBlur, value, ref, disabled: fieldDisabled },
        fieldState: { error },
      }) => {
        const hasError = !!error;
        const isDisabled = disabled || loading || fieldDisabled;

        const baseProps = {
          size: isMobile ? ("small" as const) : ("middle" as const),
          placeholder,
          disabled: isDisabled,
          style: styles,
          status: hasError ? ("error" as const) : undefined,
        };

        const prefix = PrefixIcon ? (
          <PrefixIcon
            size={18}
            className={hasError ? "text-red-500" : "text-gray-400"}
          />
        ) : null;

        const renderInput = () => {
          if (type === "textarea") {
            return (
              <TextArea
                {...baseProps}
                {...textareaProps}
                value={value ?? ""}
                onChange={onChange}
                onBlur={onBlur}
                rows={textareaRows}
                autoSize={
                  textareaRows === undefined
                    ? { minRows: 3, maxRows: 8 }
                    : false
                }
                // prefix TextArea-д хэцүү байдаг тул хасав
              />
            );
          }

          if (type === "password") {
            return (
              <Password
                {...baseProps}
                {...inputProps}
                ref={ref}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                prefix={prefix}
              />
            );
          }

          return (
            <Input
              {...baseProps}
              {...inputProps}
              ref={ref}
              type={type === "number" ? "number" : "text"}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              prefix={prefix}
            />
          );
        };

        return (
          <Form.Item
            label={label}
            validateStatus={hasError ? "error" : ""}
            help={error?.message}
            layout="vertical"
          >
            {renderInput()}
          </Form.Item>
        );
      }}
    />
  );
};

// ==================== SELECT ====================

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
}: HookFormSelectProps<TFieldValues, TName>) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      shouldUnregister={shouldUnregister}
      defaultValue={defaultValue}
      render={({
        field: { onChange, onBlur, value, ref },
        fieldState: { error },
      }) => {
        const hasError = !!error;
        const isDisabled = disabled || loading;

        return (
          <Form.Item
            label={label}
            validateStatus={hasError ? "error" : ""}
            help={error?.message}
            layout="vertical"
          >
            <Select
              ref={ref}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              size={isMobile ? "small" : "middle"}
              placeholder={placeholder}
              options={options}
              disabled={isDisabled}
              loading={loading}
              mode={mode}
              allowClear={allowClear}
              showSearch={showSearch}
              optionFilterProp="label"
              status={hasError ? "error" : undefined}
              style={{ width: "100%", ...styles }}
              popupClassName="rounded-lg"
              {...selectProps}
            />
          </Form.Item>
        );
      }}
    />
  );
};

export { HookFormInput, HookFormSelect };
