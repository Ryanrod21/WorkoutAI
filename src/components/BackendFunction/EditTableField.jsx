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
        <strong>{label}</strong>
        <Button
          label="✏️"
          onClick={() => setEditing(true)}
          className="pencil-btn"
        />
      </div>

      {!editing && <p className="card-value">{value}</p>}

      {editing && QUESTION_OPTIONS[column] ? (
        <div className="choices-row">
          {QUESTION_OPTIONS[column].map((option) => (
            <div
              key={option}
              className={`choice-card ${tempValue === option ? 'selected' : ''}`}
              onClick={() => setTempValue(option)}
            >
              {option}
            </div>
          ))}
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
            />
          </div>
        </div>
      ) : (
        editing && (
          <div className="edit-input-wrapper">
            <input
              type="text"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="edit-input"
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
              />
            </div>
          </div>
        )
      )}
    </div>
  );
}
