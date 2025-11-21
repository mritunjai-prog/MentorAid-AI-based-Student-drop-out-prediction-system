function AppTest() {
  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f0f0f0",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ color: "#333" }}>MentorAid Test Page</h1>
      <p style={{ color: "#666" }}>If you can see this, React is working!</p>
      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "white",
          borderRadius: "8px",
        }}
      >
        <h2>Diagnostic Info:</h2>
        <ul>
          <li>React: ✓ Working</li>
          <li>Rendering: ✓ Working</li>
          <li>Styles: ✓ Inline styles working</li>
        </ul>
      </div>
    </div>
  );
}

export default AppTest;
