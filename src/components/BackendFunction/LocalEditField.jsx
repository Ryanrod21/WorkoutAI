import { useState } from 'react';
import Button from '../button';

export default function LocalEditableField({ label, value, onSave, options }) {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true); // start saving
    try {
      // simulate async save (replace this with real API call)
      await new Promise((res) => setTimeout(res, 800));

      onSave(tempValue); // call the parent save
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save');
    } finally {
      setSaving(false); // done saving
    }
  };

  return (
    <div className="editable-card">
      <div className="card-container">
        <div className="card-header">
          <h3>{label} :</h3>
          <p className="card-value">{value || 'Not answered'}</p>
        </div>

        {editing && (
          <div className="card-edit">
            {options ? (
              <>
                <div className="choices-row">
                  {options.map((opt) => (
                    <button
                      key={opt}
                      className={`option-card ${tempValue === opt ? 'active' : ''}`}
                      onClick={() => setTempValue(opt)} // just select
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                <div className="edit-buttons">
                  <Button
                    label={saving ? 'Saving...' : 'Save'}
                    onClick={handleSave}
                    disabled={saving}
                  />
                  <Button
                    label="Cancel"
                    onClick={() => {
                      setTempValue(value);
                      setEditing(false);
                    }}
                    disabled={saving}
                  />
                </div>
              </>
            ) : (
              <>
                <input
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                />
                <div className="edit-buttons">
                  <Button
                    label={saving ? 'Saving...' : 'Save'}
                    onClick={handleSave}
                    disabled={saving}
                  />
                  <Button
                    label="Cancel"
                    onClick={() => {
                      setTempValue(value);
                      setEditing(false);
                    }}
                    disabled={saving}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>
      {!editing && <Button label="Edit" onClick={() => setEditing(true)} />}
    </div>
  );
}
