const ERB_COMMENT_MARKER = 'comment-erb';

function isHtmlComment(lineText: string): boolean {
    return lineText.startsWith('<!--') && lineText.endsWith('-->');
}

function uncommentHtml(lineText: string): string {
    return lineText.replace(/<!--\s*/, '').replace(/\s*-->/, '');
}

function commentErbLine(lineText: string): string {
    return lineText.replace(/<%/, '<%# ').replace(/\s*%>/, ' %>');
}

function uncommentErbLine(lineText: string): string {
    return lineText.replace(/<%#\s*/, '<%').replace(/\s*%>/, '%>');
}

function commentExecutableErbTags(lineText: string): string {
    return lineText.replace(/<%(?!#|%)(==|=|-)?([\s\S]*?)(-?)%>/g, (_match, opening = '', body, closing = '') => {
        return `<%# ${ERB_COMMENT_MARKER}:${opening}:${closing}:${body}%>`;
    });
}

function uncommentMarkedErbTags(lineText: string): string {
    const markerPattern = new RegExp(`<%#\\s*${ERB_COMMENT_MARKER}:(==|=|-)?:(-?):([\\s\\S]*?)%>`, 'g');

    return lineText.replace(markerPattern, (_match, opening = '', closing = '', body) => {
        return `<%${opening}${body}${closing}%>`;
    });
}

export function toggleErbCommentLine(text: string): string {
    const lineText = text.trim();
    let updatedText: string;

    if (isHtmlComment(lineText)) {
        updatedText = uncommentMarkedErbTags(uncommentHtml(lineText));
    } else if (lineText.startsWith('<%#')) {
        updatedText = uncommentErbLine(lineText);
    } else if (lineText.startsWith('<%')) {
        updatedText = commentErbLine(lineText);
    } else if (lineText.includes('<%')) {
        updatedText = `<!-- ${commentExecutableErbTags(lineText)} -->`;
    } else {
        updatedText = `<!-- ${lineText} -->`;
    }

    const leadingWhitespace = text.match(/^\s*/)?.[0] || '';
    return `${leadingWhitespace}${updatedText.trim()}`;
}
