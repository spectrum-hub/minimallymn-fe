import { baseURL } from "../lib/configs";

const processContent = (content: string | undefined) => {
  if (!content) return "";
  return content.replace(
    /src=["']\/web\/image\/([^"']+)["']/g,
    `src="${baseURL}/web/image/$1"`
  );
};

const RenderHtml: React.FC<{
  text?: string;
  className?: string;
}> = ({ text, className }) => {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{
        __html: processContent(text),
      }}
    />
  );
};
export default RenderHtml;
