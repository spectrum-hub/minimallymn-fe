import React from "react";
import useWindowWidth from "../../Hooks/use-window-width";
import HorizantalCategories from "../../components/HorizantalCategories";
import SearchForm from "../../components/Header/SearchForm";
import { useHistoryNavigate } from "../../Hooks/use-navigate";

const MobileCategoriesScreen: React.FC = () => {
  const { historyNavigate } = useHistoryNavigate();

  const { isMobile } = useWindowWidth();

  if (!isMobile) {
    historyNavigate("/products");
    return;
  }

  return (
    <div className="w-full">
      <SearchForm />
      <h2 className="text-lg py-4 uppercase hidden  md:block my-2">
        Ангилалууд
      </h2>
      <HorizantalCategories />
    </div>
  );
};

export default MobileCategoriesScreen;
