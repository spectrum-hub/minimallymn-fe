/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";

declare global {
  interface Window {
    FB: any;
    fbAsyncInit?: () => void;
  }
}

const FacebookMessenger = ({ pageId }: { pageId: string }) => {
  useEffect(() => {
    (window as any).fbAsyncInit = function () {
      window.FB.init({
        xfbml: true,
        version: "v13.0",
      });
    };

    (function (d, s, id) {
      const js = d.createElement(s) as HTMLScriptElement;
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js";
      if (fjs.parentNode) {
        fjs.parentNode.insertBefore(js, fjs);
      }
    })(document, "script", "facebook-jssdk");
  }, []);

  return (
    <div>
      <div id="fb-root"></div>
      <div className="fb-customerchat" data-page-id={pageId}></div>
    </div>
  );
};

function FacebookMessengerChat() {
  // 141635876518290 Page ID
  return <FacebookMessenger pageId={"141635876518290"} />;
}

export default FacebookMessengerChat;
