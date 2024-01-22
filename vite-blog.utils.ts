import * as fs from 'fs';
import * as path from 'path';

export function getBlogPosts() {
  const posts = fs
    .readdirSync('./src/content')
    // get all md files in the content dir
    .map((file: string) => `/blog/${path.parse(file).name}`)
    // remove draft posts in production
    .filter((filename) => !filename.startsWith('_'));
  return posts;
}
