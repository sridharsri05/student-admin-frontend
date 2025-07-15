import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React from "react";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  containerClassName = "w-64",
  className = "",
  ...props
}) => {
  return (
    <div className={`relative ${containerClassName}`}>
      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        {...props}
        className={`pl-8 ${className}`}
      />
    </div>
  );
}; 