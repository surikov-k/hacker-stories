
export default function RadioButton({ label, value, onChange }) {
  return (
    <label>
      <input type="radio"
             checked={ value }
             onChange={ onChange }/>
      { label }
    </label>
  );
}