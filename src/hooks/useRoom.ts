import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import useAuth from "./useAuth";

type FirebaseQuestions = Record<string, {
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likes: Record<string, {
    authorId: string;
  }>
}> 

type QuestionType = {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  }
  isHighlighted: boolean;
  isAnswered: boolean;
  likeCount: number;
  likeId: string | undefined;
}

export type Filters = {
  input: string;
  inputType: 'author' | 'content' | 'likes';
  likeFilterOperator: '=' | '>' | '>=' | '<' | '<=';
  showDefault: boolean;
  showAnswered: boolean;
  showHighlighted: boolean;
}

export type FiltersTypes = 'input' | 'inputType' | 'likeFilterOperator'
  | 'showDefault' | 'showAnswered' | 'showHighlighted';

export default function useRoom(roomId: string) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([] as Array<QuestionType>);
  const [isClosed, setIsClosed] = useState(false);
  const [filters, setFilters] = useState({
    input: '',
    inputType: 'content',
    likeFilterOperator: '=',
    showDefault: true,
    showAnswered: true,
    showHighlighted: true,
  } as Filters);

  function updateFilters(filterType: FiltersTypes, newFilterValue: string | boolean) {
    setFilters({
      ...filters,
      [filterType]: newFilterValue,
    })
  }

  function checkFilterStatus(question: QuestionType) {
    const likeTestOptions = {
      '>': question.likeCount > parseInt(filters.input),
      '>=': question.likeCount >= parseInt(filters.input),
      '<': question.likeCount < parseInt(filters.input),
      '<=': question.likeCount <= parseInt(filters.input),
      '=': question.likeCount === parseInt(filters.input),
    }
    
    const inputTypeTests = {
      author: () => {
        const authorInputRegExp = new RegExp(filters.input, 'i');
        return authorInputRegExp.test(question.author.name);
      },
      content: () => {
        const contentInputRegExp = new RegExp(filters.input, 'i');
        return contentInputRegExp.test(question.content);
      },
      likes: () => likeTestOptions[filters.likeFilterOperator],
    }

    const hasInput = Boolean(filters.input);

    const hideAnswered = !filters.showAnswered && question.isAnswered;
    const hideHighlighted = !filters.showHighlighted && question.isHighlighted;
    const hideDefault = !filters.showDefault && !question.isAnswered && !question.isHighlighted;
    const hideFromInput = hasInput && !inputTypeTests[filters.inputType]();

    const isHidden = hideFromInput
      || hideAnswered
      || hideHighlighted
      || hideDefault;

    if (isHidden) return 'hidden-question';
  }

  useEffect(() => {
    const roomRef = database.ref(`/rooms/${roomId}`);
    roomRef.on('value', (room) => {
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
      
      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => ({
        id: key,
        content: value.content,
        author: value.author,
        isHighlighted: value.isHighlighted,
        isAnswered: value.isAnswered,
        likeCount: Object.values(value.likes ?? {}).length,
        likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
      }))
      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
      setIsClosed(Boolean(room.val().closedAt));
    })
    return () => roomRef.off('value');
  }, [roomId, user?.id])


  return {
    title,
    questions,
    isClosed,
    filters,
    updateFilters,
    checkFilterStatus,
  }
}