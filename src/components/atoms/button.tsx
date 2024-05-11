import React, { FC } from 'react';

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {};

const Button: FC<ButtonProps> = (props) => {
  return (
    <button
      className="bg-indigo-900 rounded-md m-2 hover:bg-indigo-800 text-white hover:shadow-md px-4 py-2"
      {...props}
    />
  );
};

export default Button;
