declare namespace JSX {
  interface IntrinsicElements {
    "swiper-container": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      "slides-per-view"?: string | number;
      "space-between"?: string | number;
      navigation?: string | boolean;
      pagination?: string | boolean;
      direction?: "vertical" | "horizantal";
      vertical?: boolean | undefined;
      rows?: number | undefined;
      dots?: boolean | undefined;
      draggable?: boolean | undefined;
      loop?: boolean;
      autoplay?: boolean | { delay: number; disableOnInteraction: boolean };
      effect?: "slide" | "fade" | "cube" | "coverflow" | "flip";
      responsive?: ResponsiveObject[] | undefined;
    };
    "swiper-slide": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >;
  }
}
