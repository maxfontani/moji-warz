import { Types } from '@tosios/common';
import React, { CSSProperties, ReactNode } from 'react';
import { Inline } from './Inline';

const BUTTON_COLOR = 'greenyellow';

const BUTTON: CSSProperties = {
    fontSize: 16,
    borderRadius: 8,
    padding: '8px 16px 8px 16px',
    outline: 'none',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: BUTTON_COLOR,
    color: 'black',
    minHeight: 48,
    width: '100%',
    maxWidth: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const BUTTON_HOVERED: CSSProperties = {
    filter: 'brightness(90%)',
};

const BUTTON_REVERSED: CSSProperties = {
    backgroundColor: 'white',
    color: BUTTON_COLOR,
    border: `2px solid ${BUTTON_COLOR}`,
};

const BUTTON_BOLD: CSSProperties = {
    fontWeight: 'bolder'
};

export function Button(props: {
    type?: 'button' | 'submit' | 'reset';
    text?: string;
    children?: ReactNode;
    style?: CSSProperties;
    icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    title?: string;
    bold?: boolean;
    reversed?: boolean;
    onClick?: () => void;
}): React.ReactElement {
    const { type = 'button', text, children, style, icon: Icon, title, reversed = false, bold = false, onClick } = props;
    const [hovered, setHovered] = React.useState(false);

    return (
        <button
            type={type}
            style={{
                ...BUTTON,
                ...(hovered && BUTTON_HOVERED),
                ...(reversed && BUTTON_REVERSED),
                ...(bold && BUTTON_BOLD),
                ...style,
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            title={title}
            onClick={onClick}
        >
            {/* Icon */}
            {Icon && (
                <>
                    <Icon />
                    <Inline size="xxs" />
                </>
            )}

            {/* Content */}
            {text || children}
        </button>
    );
}
