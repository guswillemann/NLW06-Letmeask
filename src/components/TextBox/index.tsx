import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import cNames from 'classnames';

import './styles.scss';

type TextBoxProps = InputHTMLAttributes<HTMLInputElement> & TextareaHTMLAttributes<HTMLTextAreaElement> & {
  variant: 'input' | 'textarea';
}

const TextBoxVariants = {
  input: (props: InputHTMLAttributes<HTMLInputElement>) => (
    <input className={cNames('text-box', props.className)} {...props} />
  ),
  
  textarea: (props: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea className={cNames('text-box', props.className)} {...props} />
  ),
}

export default function TextBox({variant, ...props}: TextBoxProps) {
  return TextBoxVariants[variant](props);
}
