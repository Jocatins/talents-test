import React from "react";

interface CustomButtonProps {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  onClick,
  icon,
  type = "button",
  className = "",
  disabled = false
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-[10px] 
                  bg-[#2D3748] hover:bg-[#4A5568] text-white 
                  px-[20px] py-[12px] rounded-[8px] font-medium 
                  text-[14px] leading-[20px] transition-all duration-200 
                  w-full lg:w-auto ${className}`}
    >
      {icon && <span>{icon}</span>}
      {label}
    </button>
  );
};

export default CustomButton;
