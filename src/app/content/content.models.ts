export interface PostFrontMatter {
  title: string;
  description: string;
  published: boolean;
  datePublished: string;
  picture: string;
}

export interface PostSummary extends PostFrontMatter {
  id: string;
  route: `/posts/${string}`;
  sourceFile: string;
  datePublishedIso: string;
}

export interface PostDocument extends PostSummary {
  html: string;
}
