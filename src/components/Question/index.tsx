import { ReactNode } from 'react';

import './styles.scss';

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  }
  children: ReactNode;
}

export default function Question({
  content, author, children,
}: QuestionProps) {
  
  return (
  <div className="question-card">
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
