import React, { useState, useRef } from 'react';

interface MentionsInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void; // Change from onKeyPress to onKeyDown
  placeholder?: string;
  className?: string;
}

const MentionsInput: React.FC<MentionsInputProps> = ({
  value,
  onChange,
  onKeyDown,
  placeholder,
  className = '',
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionPosition, setSuggestionPosition] = useState({ top: 0, left: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Mock team members for mentions
  const teamMembers = [
    'alex',
    'brian',
    'chris',
    'dana',
    'emma',
    'frank',
    'grace',
    'henry'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    
    // Show suggestions when @ is typed
    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = e.target.value.substring(0, cursorPosition);
    const lastAtSymbol = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtSymbol !== -1 && !textBeforeCursor.substring(lastAtSymbol).includes(' ')) {
      setShowSuggestions(true);
      // Calculate position for suggestions (simplified)
      setSuggestionPosition({ top: 20, left: lastAtSymbol * 8 });
    } else {
      setShowSuggestions(false);
    }
  };

  const insertMention = (username: string) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPosition);
    const lastAtSymbol = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtSymbol !== -1) {
      const newValue = 
        value.substring(0, lastAtSymbol) + 
        `@${username} ` + 
        value.substring(cursorPosition);
      onChange(newValue);
      setShowSuggestions(false);
      
      // Focus back on textarea and set cursor position
      setTimeout(() => {
        textarea.focus();
        const newCursorPosition = lastAtSymbol + username.length + 2;
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
    }
  };

  const filteredMembers = teamMembers.filter(member => 
    member.toLowerCase().includes(
      value.substring(value.lastIndexOf('@') + 1).toLowerCase()
    )
  );

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={onKeyDown} // Use onKeyDown instead of onKeyPress
        placeholder={placeholder}
        className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${className}`}
        rows={3}
      />
      
      {showSuggestions && filteredMembers.length > 0 && (
        <div 
          className="absolute z-10 w-48 bg-white border border-gray-200 rounded-lg shadow-lg max-h-32 overflow-y-auto"
          style={{ top: suggestionPosition.top, left: suggestionPosition.left }}
        >
          {filteredMembers.map((member) => (
            <button
              key={member}
              type="button"
              onClick={() => insertMention(member)}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              @{member}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MentionsInput;