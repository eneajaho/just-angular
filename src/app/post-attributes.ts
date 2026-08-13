export default interface PostAttributes {
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  /** Optional light-theme variant of the cover; falls back to coverImage. */
  coverImageLight?: string;
  coverImageAlt: string;
  tags: string[];
  publishedAt: string;
  canonicalUrl: string;
  author: string;
}
