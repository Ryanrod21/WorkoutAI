import { useState } from 'react';
import Button from '../button';

export default function LocalEditableField({ label, value, onSave, options }) {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  return (
    <div className="editable-card">
      <div className="card-container">
        <div className="card-header">
          <h3>{label}</h3>

          {!editing && <p className="card-value">{value || 'Not answered'}</p>}
        </div>

        {editing && (
          <div className="card-edit">
            {options ? (
              options.map((opt) => (
                <button
                  key={opt}
                  className={`option-card ${tempValue === opt ? 'active' : ''}`}
                  onClick={() => {
                    setTempValue(opt);
                    onSave(opt);
                    setEditing(false);
                  }}
                >
                  {opt}
                </button>
              ))
            ) : (
              <>
                <input
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                />
                <Button
                  label="Save"
                  onClick={() => {
                    onSave(tempValue);
                    setEditing(false);
                  }}
                />
              </>
            )}
          </div>
        )}
      </div>
      <Button label="Edit" onClick={() => setEditing(true)} />
    </div>
  );
}
