export interface ThemeGridResponse {
  themeGrid: ThemeGrid;
}

export interface ThemeGrid {
  id: number;
  name: string;
  companyName: string;
  companyDescription: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  timetable: string;
  footerTemplate: string | null;
  copyrightText: string;
  facebookUrl: string | null;
  youtubeUrl: string | null;
  instagramUrl: string | null;
  twitterUrl: string | null;
  webfrontDefault: boolean;
  domainName: string;
  rows: GridRow[];
}

export interface GridRow {
  gridId: number;
  rowId: number;
  rowType: "banner" | "category" | "text_description" | "video" | "brand";
  itemViewType: string;
  sectionTitle: string;
  sectionSubtitle: string | null;
  sectionDescription: string | null;
  rowItems: RowItem[];
}

export interface RowItem {
  className: string;
  itemId: number | null;
  itemTitle: string | null;
  itemRowRel: string | null;
  itemDescriptionId: string | null;
  itemDescriptionTitle: string | null;
  itemDescriptionSubTitle: string | null;
  itemDescriptionFullDescription: string | null;
  itemDescriptionViewStyle: string | null;
  itemDescriptionRowRel: string | null;
  itemName: string | null;
  productTemplateId: number | null;
  itemLink: string | null;
  itemType: string | null;
  itemAttributes: string | null;
  itemImage: ItemImage;
}

export interface ItemImage {
  large: string;
  medium: string;
  small: string;
}
