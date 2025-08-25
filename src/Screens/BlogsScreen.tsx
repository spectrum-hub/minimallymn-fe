import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { Button, Spin } from "antd";
import { baseURL } from "../lib/configs";

type Blog = {
  id: number;
  name: string;
  content: string;
  subtitle: string;
  isPublished: string;
  writeDate: string;
  seoName: string;
  websiteMetaKeywords: string;
  websiteMetaDescription: string;
  websiteMetaTitle: string;
};

// GraphQL Query for Brands (matches your schema)
const GET_BLOGS = gql`
  query Blogs($page: Int, $pageSize: Int, $orderBy: String, $websiteId: Int) {
    blogs(
      page: $page
      pageSize: $pageSize
      orderBy: $orderBy
      websiteId: $websiteId
    ) {
      pageInfo {
        totalCount
        pageCount
        currentPage
        pageSize
      }
      items {
        id
        name
        content
        subtitle
        isPublished
        writeDate
        seoName
        websiteMetaKeywords
        websiteMetaDescription
        websiteMetaTitle
      }
    }
  }
`;


function BlogsScreen() {
  const [page, setPage] = useState(1);
  const pageSize = 10; // Default page size
  const orderBy = "name asc"; // Default sorting
  const websiteId = 1; // Example website ID; adjust as needed or make dynamic

  const { loading, error, data } = useQuery(GET_BLOGS, {
    variables: { page, pageSize, orderBy, websiteId },
  });

  if (loading) return <Spin />;
  if (error)
    return (
      <p className="text-center text-red-500 text-xs">Error: {error.message}</p>
    );

  const { blogs } = data;
  const firstBlog: Blog = blogs?.items?.[0];


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
          {firstBlog?.name}
        </h1>
        <div
          className=" my-8 text-gray-600 text-sm leading-6 
            max-w-[700px] justify-evenly mx-auto
            blog-content
          "
          dangerouslySetInnerHTML={{
            __html: processContent(firstBlog?.content),
          }}
        />
      </div>
      {/* Pagination */}
      <div className="mt-5 text-center text-xs">
        {page === 1 ? null : (
          <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
            Өмнөх
          </Button>
        )}

        <span className="px-4 py-2 text-gray-700">
          Хуудас {page} -ээс {blogs?.pageInfo?.pageCount || 1}
        </span>
        {page === blogs?.pageInfo?.pageCount ? null : (
          <Button
            onClick={() => setPage(page + 1)}
            disabled={page === blogs?.pageInfo?.pageCount}
          >
            Дараах
          </Button>
        )}
      </div>
    </section>
  );
}

export default BlogsScreen;

