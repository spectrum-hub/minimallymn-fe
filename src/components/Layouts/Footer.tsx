import { FooterBlock } from "../../types/Blocks";

interface FooterProps {
  footerData?: FooterBlock | null;
}

const FooterComponent: React.FC<FooterProps> = () => {
  return (
    <footer
      className=" bg-black text-white
       w-full p-4  text-sm  shadow-lg py-9 "
    >
      <div className=" mx-auto">
        <div className="flex flex-row flex-wrap gap-6 justify-between">
          <div>
            <a
              aria-current="page"
              className="active"
              href="/"
              data-discover="true"
            >
              <img
                src="/logoLight.png"
                alt="Minimally Logo"
                className="w-40 mt-2 transition-transform duration-300 hover:scale-105"
              />
            </a>
          </div>

          <div className="max-w-96">
            <h2 className=" text-white mb-4">Бидний тухай</h2>
            <p>
              Бид танд бараа бүтээгдэхүүнийг төлбөрийн олон төрлийн нөхцөлөөр
              илүү хялбараар худалдан авах боломжийг олгож байна.
            </p>
          </div>
          <div className="max-w-96">
            <h2 className=" text-white mb-2">Холбоо барих</h2>
            <ul>
              <li className="flex  flex-row gap-2 items-center h-10 ">
                <span className="text-md">Утас:</span>
                <h3 className=" text-white text-[16px] ">7200-5588</h3>
              </li>
              <li>
                <b>Цагийн хуваарь:</b> Өдөр бүр 10:00 - 19:00 цаг
              </li>
              <li>
                <b>Цахим шуудан:</b> sales@minimally.mn
              </li>
              <li>
                <b> Хаяг:</b> Улаанбаатар, Хан-Уул дүүрэг, 15-р хороо, Их Наяд
                Зүүн Өндөр 1давхар
              </li>
              <li>ANT MALL-тай ХАМТ ИРЭЭДҮЙГ НЭЭЦГЭЭЕ!</li>
            </ul>

            <div className="flex my-4 gap-2">
              <a
                href="https://www.facebook.com/minimally.mn"
                className="h-8"
                target="_blank"
              >
                <img
                  src={"/images/facebook.png"}
                  alt="facebook.com"
                  className="h-7"
                />
              </a>
              <a
                href="https://www.instagram.com/minimally_official/"
                target="_blank"
                className="h-8"
              >
                <img
                  src={"/images/instagram.png"}
                  alt="facebook.com"
                  className="h-7"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;

/***
 * 
  const RenderSocial: FC<{ element?: FooterBlock }> = ({ element }) => {
    if (!element?.attributes?.href) {
      return;
    }
    if (element?.attributes?.class === "s_social_media_facebook") {
      return (
        <NavLink
          to={element.attributes.href}
          className={element.attributes.class}
        >
          Facebook
        </NavLink>
      );
    } else if (element?.attributes?.class === "s_social_media_instagram") {
      return (
        <NavLink
          to={element.attributes.href}
          className={element.attributes.class}
        >
          s_social_media_instagram
        </NavLink>
      );
    } else if (element?.attributes?.class === "s_social_media_youtube") {
      return (
        <NavLink
          to={element.attributes.href}
          className={element.attributes.class}
        >
          s_social_media_youtube
        </NavLink>
      );
    }
    return <></>;
  };


 * 
 */

/** 
 
s_social_media_facebookFacebook
s_social_media_twitter
s_social_media_linkedin
s_social_media_youtube
s_social_media_instagram
s_social_media_github
s_social_media_tiktok
s_social_media_facebookFacebook
s_social_media_twitter
s_social_media_linkedin
 
  
*/

/**
 * 
  
  const DynamicElement = ({ element }: { element?: FooterBlock }) => {
    const renderTag = () => {
      const { tag, attributes, content = "", children = [] } = element ?? {};
      const cls = attributes?.class ?? "  ";

      switch (tag) {
        case "section":
        case "div":
          return (
            <div className={cls}>
              {content}
              {children.map((child, index) => (
                <DynamicElement key={index} element={child} />
              ))}
            </div>
          );
        case "i":
          return <span className={cls}>{content}</span>;
        case "h5":
        case "h4":
        case "h3":
        case "h2":
        case "h1":
          return <h5 className={"text-[#d0c4d9]"}>{content}</h5>;
        case "ul":
          return (
            <ul className={cls}>
              {children.map((child, index) => (
                <DynamicElement key={index} element={child} />
              ))}
            </ul>
          );
        case "li":
          return (
            <li className={cls}>
              {content}
              {children.map((child, index) => (
                <DynamicElement key={index} element={child} />
              ))}
            </li>
          );
        case "a":
          if (
            attributes?.class === "s_social_media_facebook" &&
            attributes?.href
          ) {
            return (
              <NavLink to={attributes.href} className={cls}>
                Facebook
              </NavLink>
            );
          }
          // Use NavLink for React Router if href exists, otherwise regular a tag
          return attributes?.href ? (
            <NavLink to={attributes.href} className={cls}>
              {content}
            </NavLink>
          ) : (
            <span className={cls}>{content}</span>
          );
        case "p":
        case "span":
          return (
            <p className={cls}>
              {content}
              {children?.map((child, index) => (
                <DynamicElement key={index} element={child} />
              ))}
            </p>
          );
        case "br":
          return <br className={cls} />;

        default:
          return <div className={cls}>{content}</div>;
      }
    };

    return renderTag();
  };


 * 
 */

// const footerRecursive = (element?: FooterBlock | null, index?: number) => {
//   if (!element) return null;
//   if ((element.children ?? []).length > 0) {
//     return (
//       <div
//         key={index}
//         className={
//           element?.attributes?.class === "row"
//             ? "flex flex-wrap gap-6 justify-between "
//             : ""
//         }
//       >
//         <RenderSocial element={element} />
//         {element.content ? <DynamicElement element={element} /> : null}

//         {element?.children?.map((child, childIndex) => (
//           <Fragment key={childIndex}>
//             {footerRecursive(child, childIndex)}
//           </Fragment>
//         ))}
//       </div>
//     );
//   }
//   return (
//     <Fragment key={index}>
//       <DynamicElement element={element} />
//     </Fragment>
//   );
// };
