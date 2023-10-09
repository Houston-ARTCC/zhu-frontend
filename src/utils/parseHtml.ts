import { type ReactNode } from 'react';
import parse from 'react-html-parser';

export const parseHtml = (source: string): ReactNode => (
    parse(
        source,
        {
            // eslint-disable-next-line consistent-return
            transform: (node) => {
                // Gets rid of excessive whitespace when <br> tags are inserted.
                if (node.type === 'tag' && node.children.length === 1 && node.children[0].name === 'br') {
                    return null;
                }
            },
        },
    )
);
