import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { Button, Spin } from "antd";
import { baseURL } from "../lib/configs";
import { useParams } from "react-router";

type Blog = {
  id: number;
  name: string;
  description: string;
  subtitle: string;
  isPublished: string;
  writeDate: string;
  seoName: string;
  websiteMetaKeywords: string;
  websiteMetaDescription: string;
  websiteMetaTitle: string;
  link: string;
};

// GraphQL Query for Brands (matches your schema)

const GET_BLOGS = gql`
  query BlogNewsContents(
    $page: Int
    $pageSize: Int
    $orderBy: String
    $websiteId: Int
  ) {
    blogNewsContents(
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
      blogNewsContents {
        id
        name
        description
        link
        image
        active
      }
    }
  }
`;

function ContentsScreen() {
  const { contentTitle } = useParams<{ contentTitle: string }>();

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

  const { blogNewsContents } = data;

  const contentDetail = (
    blogNewsContents?.blogNewsContents as [] | Blog[]
  )?.find((content) => content.link === contentTitle);

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
          {contentDetail?.name}
        </h1>
        <div
          className=" my-8 text-gray-600 text-sm leading-6 
            max-w-[700px] justify-evenly mx-auto
            blog-content
          "
          dangerouslySetInnerHTML={{
            __html: processContent(contentDetail?.description),
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
          Хуудас {page} -ээс {blogNewsContents?.pageInfo?.pageCount || 1}
        </span>
        {page === blogNewsContents?.pageInfo?.pageCount ? null : (
          <Button
            onClick={() => setPage(page + 1)}
            disabled={page === blogNewsContents?.pageInfo?.pageCount}
          >
            Дараах
          </Button>
        )}
      </div>
    </section>
  );
}

export default ContentsScreen;
