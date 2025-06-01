import { type ReactNode } from 'react';
import parse from 'html-react-parser';
import { ElementType } from 'domelementtype';

export const parseHtml = (source: string): ReactNode => (
    parse(
        source,
        {
            replace: (node) => {
                // Gets rid of excessive whitespace when <br> tags are inserted.
                if (
                    node.type === ElementType.Tag && node.children.length === 1
                    && node.children[0].type === ElementType.Tag && node.children[0].name === 'br'
                ) {
                    return null;
                }
            },
        },
    )
);
