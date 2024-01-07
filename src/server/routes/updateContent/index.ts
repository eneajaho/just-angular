import { defineEventHandler, H3Event, readBody } from 'h3';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { cwd } from 'node:process';

// event that takes a file name and updates the content of the file

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody<{ content: string; slug: string }>(event);
  console.log('queryParams', body.slug);

  const filePath = `${cwd()}/src/content/${body.slug}.md`;
  console.log('dirname', filePath);

  const file = await readFile(filePath, 'utf-8');
  if (file) {
    // regex to get the head content of the file
    const headContent = file.match(/---(.|\n)*---/)?.[0] || '';
    const newFileContent = `${headContent}\n${body.content}
    `;

    // write the file
    await writeFile(filePath, newFileContent);

    return `Updated ${filePath}!`;
  }
  return `Hello ${event.context.params?.['fileName']}!`;
});
