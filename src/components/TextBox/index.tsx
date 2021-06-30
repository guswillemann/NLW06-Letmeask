import { ChangeEvent, InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import cName from 'classnames';

import './styles.scss';

type TextBoxProps = InputHTMLAttributes<HTMLInputElement> & TextareaHTMLAttributes<HTMLTextAreaElement> & {
  variant: 'input' | 'textarea';
}

export type TextBoxEvent = ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>;

const TextBoxVariants = {
  input: ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => (
    <input className={cName('text-box', className)} {...props} />
  ),
  
  textarea: ({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea className={cName('text-box', className)} {...props} />
  ),
}

export default function TextBox({variant, ...props}: TextBoxProps) {
  return TextBoxVariants[variant](props);
}
