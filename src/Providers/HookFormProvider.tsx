// components/providers/HookFormProvider.tsx
import { Button, Spin } from "antd";
import { UseFormHandleSubmit, FieldValues } from "react-hook-form";

interface HookFormProviderProps<T extends FieldValues> {
  loading: boolean;
  children: React.ReactNode;
  handleSubmit: UseFormHandleSubmit<T>;
  onSubmit: (data: T) => Promise<void> | void;
  submitText?: string;
  onCancel?: () => void;
}

const HookFormProvider = <T extends FieldValues>({
  loading,
  children,
  handleSubmit,
  onSubmit,
  submitText = "Хадгалах",
  onCancel,
}: HookFormProviderProps<T>): JSX.Element => {
  return (
    <Spin spinning={loading} tip="Хадгалж байна...">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
        noValidate // HTML5 validation унтраана
      >
        {children}

        <div className="w-full flex gap-4 items-center justify-center">
          <Button
            htmlType="submit"
            loading={loading}
            type="primary"
            size="large"
            className="w-full rounded-xl font-medium"
            style={{ height: 48 }}
          >
            {loading ? "Хадгалж байна..." : submitText}
          </Button>
          {onCancel && (
            <Button
              htmlType="button"
              loading={loading}
              type="primary"
              size="large"
              className="w-full rounded-xl font-medium"
              style={{ height: 48 }}
              onClick={onCancel}
            >
              Цуцлах
            </Button>
          )}
        </div>
      </form>
    </Spin>
  );
};

export default HookFormProvider;
