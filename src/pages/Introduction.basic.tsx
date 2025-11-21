export default function IntroductionBasic() {
  return (
    <div
      style={{
        padding: "40px",
        backgroundColor: "#f0f0f0",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ color: "#333", fontSize: "48px", marginBottom: "20px" }}>
        MentorAid
      </h1>
      <p style={{ color: "#666", fontSize: "24px" }}>
        If you can see this, React routing is working!
      </p>
      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          backgroundColor: "white",
          borderRadius: "8px",
        }}
      >
        <h2 style={{ color: "#444" }}>Diagnostic Test:</h2>
        <ul style={{ fontSize: "18px", lineHeight: "2" }}>
          <li>✓ React is rendering</li>
          <li>✓ Route /introduction is working</li>
          <li>✓ Inline styles are working</li>
        </ul>
        <button
          onClick={() => (window.location.href = "/login")}
          style={{
            marginTop: "20px",
            padding: "15px 30px",
            fontSize: "18px",
            backgroundColor: "#3B82F6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
