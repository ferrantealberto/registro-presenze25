import { useState } from 'react';

interface SettingsProps {
  includeNotes: boolean;
  setIncludeNotes: (value: boolean) => void;
}

export default function Settings({ includeNotes, setIncludeNotes }: SettingsProps) {
  return (
    <div>
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="form-checkbox h-5 w-5"
          checked={includeNotes}
          onChange={(e) => setIncludeNotes(e.target.checked)}
        />
        <span className="ml-2">Includi note nel PDF</span>
      </label>
    </div>
  );
}