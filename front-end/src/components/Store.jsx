export default function Store({ store }) {
  return (
    <div>
      <h2>{store.name}</h2>
      <p>{store.description}</p>
    </div>
  );
}