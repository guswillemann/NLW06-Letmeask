import { ButtonHTMLAttributes, useEffect } from 'react';
import { ReactNode } from 'react';
import { useRef } from 'react';

import './styles.scss'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  ariaLabel?: string;
}

export default function IconButton({className = '', children, ariaLabel = '', ...props }: IconButtonProps) {
  const ObjectElement = useRef<HTMLObjectElement>(null);
  
  useEffect(() => {
    ObjectElement.current?.getSVGDocument()?.querySelectorAll('path').forEach((path) => {
      path.classList.add('icon-svg-path');
    });
  }, [ObjectElement]);

  return (
    <button className={`icon-button ${className}`} type="button" aria-label={ariaLabel} {...props}>
      {children}
    </button>
  );
}
