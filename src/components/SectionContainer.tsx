import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const SectionContainer: React.FC<ContainerProps> = ({ children, className }) => {
  return (
    <section className={`max-w-7xl mx-auto container ${className}`}>
      {children}
    </section>
  );
};

export default SectionContainer;
