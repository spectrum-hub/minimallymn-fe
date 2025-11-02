import { Spin } from "antd";
import { baseURL } from "../lib/configs";
import { NavLink, useParams } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";

function PagesScreen() {
  const { data, loading, error } = useSelector(
    (state: RootState) => state.layouts
  );

  const { pageSlug } = useParams<{ pageSlug: string }>();

  const pageData = data?.themeGrid?.pages?.find((p) => p.pageSlug === pageSlug);

  if (loading) return <Spin />;
  if (error)
    return (
      <p className="text-center text-red-500 text-xs">
        Error: {JSON.stringify(error)}
      </p>
    );

  // Function to update image src attributes
  const processContent = (content: string | undefined) => {
    if (!content) return "";
    return content.replace(
      /src=["']\/web\/image\/([^"']+)["']/g,
      `src="${baseURL}/web/image/$1"`
    );
  };

  return (
    <section className="products  mx-auto">
      <div className="w-full bg-white p-4">
        <h1 className="my-4 text-center text-md md:text-lg">
          {pageData?.pageName}
        </h1>
        <div
          className=" my-8 text-gray-600 text-sm leading-6 
            max-w-[700px] justify-evenly mx-auto
            blog-content
          "
          dangerouslySetInnerHTML={{
            __html: processContent(pageData?.pageDescription),
          }}
        />
      </div>

      <NavLink to={`/`} className={"text-center mx-auto block"}>
        Буцах
      </NavLink>
    </section>
  );
}

export default PagesScreen;
