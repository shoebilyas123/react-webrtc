import React, { FC, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
}

const Input: FC<InputProps> = ({ name, label, ...props }) => {
  return (
    <div className=" my-4 flex flex-col space-y-2">
      {label ? <label className="text-white">{label}</label> : null}
      <input
        className="outline-none focus:border-purple-800 border-2 border-transparent rounded-md px-2 py-1"
        name={name}
        {...props}
      ></input>
    </div>
  );
};

export default Input;
