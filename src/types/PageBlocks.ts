export interface WebPageRoot {
  website_id: number;
  website_published: boolean;
  is_published: boolean;
  can_publish: boolean;
  website_url: string;
  url: string;
  view_id: number;
  website_indexed: boolean;
  date_publish: boolean;
  menu_ids: number;
  is_in_menu: boolean;
  is_homepage: boolean;
  is_visible: boolean;
  is_new_page_template: boolean;
  header_overlay: boolean;
  header_color: boolean;
  header_text_color: boolean;
  header_visible: boolean;
  footer_visible: boolean;
  arch: string;
  id: number;
  display_name: string;
  create_uid: number;
  create_date: string;
  write_uid: number;
  write_date: string;
  theme_template_id: boolean;
  is_seo_optimized: boolean;
  website_meta_title: string;
  website_meta_description: string;
  website_meta_keywords: string;
  website_meta_og_img: string;
  seo_name: boolean;
  name: string;
  model: boolean;
  key: string;
  priority: number;
  type: string;
  arch_base: string;
  arch_db: ArchDb;
  arch_fs: string;
  arch_updated: boolean;
  arch_prev: string;
  inherit_id: boolean;
  inherit_children_ids: boolean;
  model_data_id: boolean;
  xml_id: string;
  groups_id: boolean;
  mode: string;
  warning_info: string;
  active: boolean;
  model_id: boolean;
  customize_show: boolean;
  page_ids: number;
  controller_page_ids: boolean;
  first_page_id: number;
  track: boolean;
  visibility: boolean;
  visibility_password: boolean;
  visibility_password_display: string;
}

export interface ArchDb {
  type: string;
  attributes: Attributes;
  children: Children[];
}

export interface Attributes {
  name: string;
  "t-name": string;
}

export interface Children {
  type: string;
  attributes: Attributes2;
  children: Children2[];
}

export interface Attributes2 {
  "t-call": string;
}

export interface Children2 {
  type: string;
  attributes: Attributes3;
  children: Children3[];
}

export interface Attributes3 {
  "t-set"?: string;
  "t-value"?: string;
  id?: string;
  class?: string;
}

export interface Children3 {
  type: string;
  attributes: Attributes4;
  children: Children4[];
}

export interface Attributes4 {
  class: string;
  "data-vcss"?: string;
  "data-columns"?: string;
  "data-snippet": string;
  "data-name": string;
  "data-vxml"?: string;
  "data-custom-template-data"?: string;
  "data-product-category-id"?: string;
  "data-show-variants"?: string;
  "data-number-of-records"?: string;
  "data-filter-id"?: string;
  "data-template-key"?: string;
  "data-carousel-interval"?: string;
}

export interface Children4 {
  type: string;
  attributes: Attributes5;
  children: Children5[];
}

export interface Attributes5 {
  class: string;
}

export interface Children5 {
  type: string;
  attributes: Attributes6;
  children: Children6[];
}

export interface Attributes6 {
  id?: string;
  class: string;
  "data-bs-interval"?: string;
  style?: string;
}

export interface Children6 {
  type: string;
  attributes: Attributes7;
  children: Children7[];
}

export interface Attributes7 {
  class?: string;
  "data-name"?: string;
  style?: string;
}

export interface Children7 {
  type: string;
  attributes: Attributes8;
  children: Children8[];
}

export interface Attributes8 {
  class?: string;
  "data-vxml"?: string;
  "data-snippet"?: string;
  "data-name"?: string;
  style?: string;
  "data-bs-slide"?: string;
  "aria-label"?: string;
  title?: string;
  "data-bs-target"?: string;
}

export interface Children8 {
  type: string;
  attributes: Attributes9;
  children: Children9[];
}

export interface Attributes9 {
  src?: string;
  alt?: string;
  class?: string;
  "data-mimetype"?: string;
  "data-original-id"?: string;
  "data-original-src"?: string;
  "data-mimetype-before-conversion"?: string;
  "data-resize-width"?: string;
  loading?: string;
  "aria-hidden"?: string;
  type?: string;
  "data-bs-target"?: string;
  "data-bs-slide-to"?: string;
  style?: string;
  "aria-label"?: string;
  "aria-current"?: string;
  title?: string;
  href?: string;
}

export interface Children9 {
  type: string;
  attributes: Attributes10;
  children: Children10[];
}

export interface Attributes10 {
  class?: string;
  src?: string;
  alt?: string;
  loading?: string;
  "data-mimetype"?: string;
  "data-original-id"?: string;
  "data-original-src"?: string;
  "data-mimetype-before-conversion"?: string;
}

export interface Children10 {
  type: string;
  attributes: Attributes11;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any[];
}

export interface Attributes11 {
  class: string;
}
