import { useEffect, useMemo, useState } from "react";
import cName from 'classnames';
import './styles.scss';


type Option = {
  name: string;
  value: string;
}

type SelectProps = {
  options: Array<Option>;
  selectedValue: string;
  updateValue: (value: string) => void;
  id: string;
  className?: string;
}

export default function Select({ options, selectedValue, updateValue, className, id }: SelectProps) {
  const [isActive, setIsActive] = useState(false);
  const valuesToNameMap: { [key: string]: string } = useMemo(() => options.reduce((map, option) => ({
    ...map,
    [option.value]: option.name,
  }), {}), [options]);

  function handleOptionSelection(option: Option) {
    updateValue(option.value);
    setIsActive(!isActive);
  }

  useEffect(() => {
    function checkSafeArea(event: any) {
      const isSafeArea = Boolean(event.target.closest(`#${id}`));
      if (!isSafeArea) setIsActive(false);
    }

    if (isActive) document.addEventListener('click', checkSafeArea);
    return () => document.removeEventListener('click', checkSafeArea);
  }, [isActive, id])

  return (
    <div
      id={id}
      className={cName(
        'dropdown-select',
        className,
        { active: isActive },
      )}
    >
      <button type="button" onClick={() => setIsActive(!isActive)}>
        {valuesToNameMap[selectedValue]}
      </button>
      <div className="dropdown-options-list">
        {options.map((option: Option) => (
          <button
            key={option.name}
            type="button"
            className="dropdown-option"
            onClick={() => handleOptionSelection(option)}
          >
            {option.name}
          </button>
        ))}
      </div>
    </div>
  );
}
