import { FC } from "react";
import { QpayBanklist } from "../../types/Order";

interface DeepLinksProps {
  links?: QpayBanklist[];
}

const QpayBankDeepLinks: FC<DeepLinksProps> = ({ links }) => {
  if (!links) {
    return <></>;
  }
  return (
    <>
      <h5 className="text-sm text-center">
        Төлбөр төлөх банкны аппликейшнаа сонгоно уу
      </h5>
      <div
        className={`
          border max-w-[400px] w-full bg-white shadow
          p-2 rounded-md flex flex-wrap gap-1 justify-center 
          items-center 
        `}
      >
        {links?.map((deepLink) => (
          <QpayBankDeepLink key={deepLink.link} url={deepLink} />
        ))}
      </div>
    </>
  );
};

interface DeepLinkProps {
  url: QpayBanklist;
}

const QpayBankDeepLink: FC<DeepLinkProps> = ({ url }) => {
  if (
    url.name === "Chinggis khaan bank" ||
    url.name === "National investment bank"
  ) {
    return;
  }
  return (
    <a
      data-app={url.link}
      data-store-android
      data-store-ios
      href={url.link}
      className="
        mx-auto border w-20 h-24
        flex flex-col items-center rounded-lg
        shadow-md mb-1
      "
    >
      <img
        src={`${"/images/bankimgs/" + url.link.split(":")[0]}.png`}
        alt={url.name}
        className="
         w-12 h-12 object-contain 
         rounded-lg  p-1 mt-1 
        "
      />
      <span
        className="
            text-xs leading-3 my-1
            max-w-28 text-center block 
          "
      >
        {url.description}
      </span>
    </a>
  );
};

export default QpayBankDeepLinks;
