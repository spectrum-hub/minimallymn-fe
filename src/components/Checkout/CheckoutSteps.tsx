/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from "react";
import { Check } from "lucide-react";

const steps = ["Хүргэлтийн мэдээлэл", "Төлбөр"];
const CheckoutSteps: FC<{
  currentStep?: number;
}> = ({ currentStep = 0 }) => {
  return (
    <nav aria-label="Progress" className="mb-12">

      
      <ol className="flex">
        {steps.map((step, index) => (
          <li
            key={step}
            className={`relative ${
              index !== steps.length - 1 ? "pr-8 sm:pr-20" : ""
            }`}
          >
            <div className="flex items-center">
              <div
                className={`relative flex h-8 w-8 items-center justify-center rounded-full ${(() => {
                  if (index < currentStep) {
                    return "bg-indigo-600";
                  } else if (index === currentStep) {
                    return "border-2 border-indigo-600 bg-white";
                  } else {
                    return "border-2 border-gray-300 bg-white";
                  }
                })()}`}
              >
                {index < currentStep ? (
                  <Check className="h-5 w-5 text-white" />
                ) : (
                  <span
                    className={`text-sm font-medium ${
                      index === currentStep
                        ? "text-indigo-600"
                        : "text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </span>
                )}
              </div>
              <span
                className={`ml-3 text-sm font-medium max-w-[116px] line-clamp-2 leading-4  ${
                  index <= currentStep ? "text-indigo-600" : "text-gray-500"
                }`}
              >
                {step}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default CheckoutSteps;
