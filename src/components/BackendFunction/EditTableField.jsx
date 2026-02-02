import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Button from '../button';
import { QUESTION_OPTIONS } from '../constants/questionOptions'; // ✅ import options

export default function EditTableField({
  label,
  value,
  userId,
  column,
  onChange,
}) {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('gym')
        .update({ [column]: tempValue })
        .eq('user_id', userId);

      if (error) throw error;

      if (onChange) onChange(tempValue);

      setEditing(false);
    } catch (err) {
      console.error('Failed to save:', err);
      alert('Failed to save. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="editable-card">
      <div className="card-header">
        <h3>{label} :</h3>
        <p className="card-value">{value}</p>
      </div>

      {editing && QUESTION_OPTIONS[column] && (
        <div className="card-edit">
          <>
            <div className="choices-row">
              {QUESTION_OPTIONS[column].map((option) => (
                <button
                  key={option}
                  className={`option-card ${tempValue === option ? 'active' : ''}`}
                  onClick={() => setTempValue(option)} // just select
                >
                  {option}
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
        </div>
      )}

      {!editing && (
        <Button
          label="Edit"
          onClick={() => setEditing(true)}
          className="pencil-btn"
        />
      )}
    </div>
  );
}
