import '../components.css';

export default function Card({ label, title, icon: Icon }) {
  return (
    <div className="home-card icon-primary">
      {Icon && <Icon size={32} />}
      <h3>{title}</h3>
      <p>{label}</p>
    </div>
  );
}
