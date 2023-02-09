function Title({ title, span }: { title: string; span: string }) {
  return (
    <div className="text-center text-white p-5">
        <h1 className="text-5xl font-sans">{title}</h1>
        <p className="text-xl font-mono mt-3 whitespace-pre-line">{span}</p>
    </div>
  );
}

export default Title;