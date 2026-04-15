const FloatingElements = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Subtle ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-[0.03] blur-[120px]"
        style={{ background: 'hsl(var(--primary))' }}
      />
    </div>
  );
};

export default FloatingElements;
