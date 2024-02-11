import React from "react";

const Checkbox = ({
  name,
  label,
  width,
  widthLabel,
  listItems,
  labelItems,
  value,
  onChange,
}) => {
  /*
  here is my on Chnage function 
    handleCheckboxChange = (name, value, isChecked) => {
    const data = { ...this.state.data };
    if (isChecked) {
      if (!data[name].includes(value)) {
        data[name].push(value);
      }
    } else {
      data[name] = data[name].filter((item) => item !== value);
    }
    this.setState({ data });
  };
    */
  return (
    <div className="flex flex-col">
      <div className="flex w-fit flex-wrap">
        {label && (
          <label
            className={`mr-3 text-right text-xs font-bold leading-9 text-[#72757c]`}
            style={{ width: widthLabel }}
          >
            {label}
          </label>
        )}
        <div className={`flex justify-between`} style={{ width }}>
          {listItems.map((item, index) => (
            <div key={item}>
              <label
                htmlFor={item}
                className="mr-2 inline-flex items-center text-xs font-bold leading-9 text-[#72757c]"
              >
                <input
                  name={name}
                  id={item}
                  className="mr-2"
                  type="checkbox"
                  checked={value ? value.includes(item) : false}
                  onChange={(e) => onChange(name, item, e.target.checked)}
                />
                {labelItems[index]}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Checkbox;
