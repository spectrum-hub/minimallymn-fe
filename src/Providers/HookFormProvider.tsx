// components/providers/HookFormProvider.tsx
import { Button, Spin } from "antd";
import { UseFormHandleSubmit, FieldValues } from "react-hook-form";

interface HookFormProviderProps<T extends FieldValues> {
  loading: boolean;
  children: React.ReactNode;
  handleSubmit: UseFormHandleSubmit<T>;
  onSubmit: (data: T) => Promise<void> | void;
}

const HookFormProvider = <T extends FieldValues>({
  loading,
  children,
  handleSubmit,
  onSubmit,
}: HookFormProviderProps<T>): JSX.Element => {
  return (
    <Spin spinning={loading} tip="Хадгалж байна...">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
        noValidate // HTML5 validation унтраана
      >
        {children}

        <Button
          htmlType="submit"
          loading={loading}
          type="primary"
          size="large"
          className="w-full rounded-xl font-medium"
          style={{ height: 48 }}
        >
          {loading ? "Хадгалж байна..." : "Хадгалах"}
        </Button>
      </form>
    </Spin>
  );
};

export default HookFormProvider;