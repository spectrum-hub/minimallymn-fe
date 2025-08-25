import React from "react";
interface Props {
  loading?: boolean;
}
const CircleLoader: React.FC<Props> = ({ loading = false }) => {
  if (!loading) {
    return;
  }
  return (
    <section className="w-full flex justify-center my-8">
      <div className="loader-20"></div>
    </section>
  );
};

export default CircleLoader;
