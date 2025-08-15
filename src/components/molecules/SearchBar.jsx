import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";

const SearchBar = ({ value, onChange, placeholder = "Search services..." }) => {
return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <ApperIcon name="Search" className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-12 bg-white/80 backdrop-blur-sm border-gray-200/50 hover:border-blue-300 focus:border-blue-500 focus:ring-blue-500/20 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl"
      />
    </div>
  );
};

export default SearchBar;