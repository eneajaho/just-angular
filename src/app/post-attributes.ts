export default interface PostAttributes {
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  coverImageAlt: string;
  tags: string[];
  publishedAt: string;
  canonicalUrl: string;
  author: string;
}
