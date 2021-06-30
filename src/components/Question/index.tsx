import { ReactNode } from 'react';
import cNames from 'classnames';

import './styles.scss';

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  }
  children: ReactNode;
  isAnswered: boolean;
  isHighlighted: boolean;
  className?: string;
}

export default function Question({
  content,
  author,
  children,
  isAnswered = false,
  isHighlighted = false,
  className,
}: QuestionProps) {
  
  return (
  <div className={cNames(
    'question-card',
    className,
    { answered: isAnswered },
    { highlighted: isHighlighted && !isAnswered },
  )}>
    <p>{content}</p>
    <div className="question-footer">
      <div className="author-info">
        <img src={author.avatar} alt={author.name} />
        <span>{author.name}</span>
      </div>
      <div className="question-panel">
        {children}
      </div>
    </div>
  </div>
);
}
