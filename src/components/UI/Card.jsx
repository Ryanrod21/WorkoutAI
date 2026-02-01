import '../components.css';

export default function Card({ className, label, title, icon: Icon }) {
  return (
    <div className={className}>
      {Icon && <Icon size={32} />}
      <h3>{title}</h3>
      <p>{label}</p>
    </div>
  );
}
