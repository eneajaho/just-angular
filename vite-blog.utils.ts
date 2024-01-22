import * as fs from 'fs';
import * as path from 'path';

export function getAllContentFiles() {
  const content = fs
    .readdirSync('./src/content')
    // get all md files in the content dir
    .map((file: string) => `/blog/${path.parse(file).name}`);
  return content;
}

export function getProductionBlogPosts() {
  // remove draft posts in production
  return getAllContentFiles().filter((filename) => !filename.startsWith('_'));
}
