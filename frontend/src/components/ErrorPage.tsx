export default function Error() {
  return (
    <div>
      <h1
        style={{
          fontSize: '2rem',
          textAlign: 'center',
          marginTop: '50px'
        }}
      >
        Ooops, page not found!
      </h1>
      <img
        src="/RadiantRaccoons.webp"
        alt="404"
        style={{ display: 'block', margin: 'auto', height: '50vh' }}
      />
    </div>
  );
}
