function Title({ title, span }: { title: string; span: string }) {
  return (
    <div className="text-center text-white p-5 opacity-0 animate-fade-up animate-once animate-duration-[400ms] animate-ease-in-out animate-normal animate-fill-forwards">
        <h1 className="text-5xl font-sans animate-delay-200">{title}</h1>
        <p className="text-xl font-mono mt-3 whitespace-pre-line animate-delay-500">{span}</p>
    </div>
  );
}

export default Title;