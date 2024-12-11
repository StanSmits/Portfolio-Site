import React from 'react';
import { ExperienceCard } from './ExperienceCard';

export const ExperienceSection: React.FC<{ mousePosition: { x: number; y: number } }> = ({ mousePosition }) => {
  const experiences = [
    {
      title: "Senior Developer",
      company: "Tech Solutions Inc.",
      period: "2020 - Present",
      description: "Leading development team in creating enterprise-level web applications."
    },
    {
      title: "Full Stack Developer",
      company: "Digital Innovations",
      period: "2018 - 2020",
      description: "Developed and maintained multiple client projects using React and Node.js."
    },
    {
      title: "Junior Developer",
      company: "StartUp Hub",
      period: "2016 - 2018",
      description: "Worked on various startup projects and gained extensive experience in modern web technologies."
    }
  ];

  return (
    <section className="px-4 py-20">
      <div className="container mx-auto">
        <h2 className="mb-12 text-3xl font-bold">Experience</h2>
        <div className="flex flex-col gap-6 lg:flex-row">
          {experiences.map((exp, index) => (
            <ExperienceCard
              key={index}
              {...exp}
              mousePosition={mousePosition}
            />
          ))}
        </div>
      </div>
    </section>
  );
};