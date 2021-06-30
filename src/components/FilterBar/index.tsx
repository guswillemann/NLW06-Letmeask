import cName from 'classnames';
import TextBox, { TextBoxEvent } from '../TextBox';
import Select from '../Select';
import IconButton from '../IconButton';
import AnswerIcon from '../icons/AnswerIcon';
import CheckIcon from '../icons/CheckIcon';
import QuestionIcon from '../icons/QuestionIcon';
import { Filters, FiltersTypes } from '../../hooks/useRoom';

import './styles.scss';

type FilterBarProps = {
  filters: Filters;
  updateFilters: (filterType: FiltersTypes, newFilterValue: string | boolean) => void;
}

export default function FilterBar({ filters, updateFilters }: FilterBarProps) {
  function handleTextFilterChange(event: TextBoxEvent) {
    updateFilters('input', event.target.value)
  }

  function updateInputType(value: string) {
    updateFilters('inputType', value)
  }

  function updateLikeFilterOperator(value: string) {
    updateFilters('likeFilterOperator', value);
  }

  const placeholderMap = {
    author: 'nome',
    content: 'conteúdo',
    likes: 'quantidade',
  }

  return (
    <div id="filter-bar">
      <p>filtrar:</p>
      {filters.inputType === 'likes' && (
        <Select
          id="like-operator-select"
          className="filter-operator-select"
          updateValue={updateLikeFilterOperator}
          selectedValue={filters.likeFilterOperator}
          options={[
            { name: '=', value: '=' },
            { name: '>', value: '>' },
            { name: '>=', value: '>=' },
            { name: '<', value: '<' },
            { name: '<=', value: '<=' },
          ]}
        />
      )}
      <TextBox
        onChange={handleTextFilterChange}
        variant="input"
        value={filters.input}
        placeholder={placeholderMap[filters.inputType]}
        className={cName({ 'like-input': filters.inputType === 'likes' })}
      />
      <Select
        id="filter-type-select"
        className="filter-type-select"
        updateValue={updateInputType}
        selectedValue={filters.inputType}
        options={[
          { name: 'Pergunta', value: 'content' },
          { name: 'Autor', value: 'author' },
          { name: 'Likes', value: 'likes' },
        ]}
      />
      <IconButton
        className={cName({active: filters.showAnswered})}
        onClick={() => updateFilters('showAnswered', filters.showAnswered ? false : true)}
        aria-label="Filtrar respondidas">
          <CheckIcon />
      </IconButton>
      <IconButton
        className={cName({active: filters.showHighlighted})}
        onClick={() => updateFilters('showHighlighted', filters.showHighlighted ? false : true)}
        aria-label="Filtrar destacadas">
          <AnswerIcon />
      </IconButton>
      <IconButton
        className={cName({active: filters.showDefault})}
        onClick={() => updateFilters('showDefault', filters.showDefault ? false : true)}
        aria-label="Filtrar sem marcações">
          <QuestionIcon />
      </IconButton>
    </div>
  );
}
