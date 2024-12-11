import React from 'react';
import { ExperienceCard } from './ExperienceCard';

export const ExperienceSection: React.FC<{ mousePosition: { x: number; y: number } }> = ({ mousePosition }) => {
  const experiences = [
    {
      title: "Handhaver Openbare Ruimte",
      company: "Gemeente Amsterdam",
      period: "2025 - Present",
      description: "Tasked with maintaining public safety and enforcing municipal regulations, ensuring a safe and pleasant environment for all residents and visitors in Amsterdam. This role involves patrolling public spaces, handling disputes, and promoting community engagement."
    },
    {
      title: "Specialist",
      company: "Apple",
      period: "2022 - 2024",
      description: "Provided a unique, personalized experience to every customer, embodying Apple’s standard of excellence. Responsibilities included greeting guests, understanding their needs, and offering tailored solutions to enhance their interaction with Apple products and services."
    },
    {
      title: "Klantenservicemedeweker",
      company: "Albert Heijn",
      period: "2020 - 2022",
      description: "Delivered exceptional customer service by resolving issues, ensuring satisfaction, and contributing to process improvements to enhance the shopping experience."
    }
  ];

  return (
    <section className="px-4 py-20">
      <div className="container mx-auto">
        <h2 className="mb-12 text-3xl font-bold">Experience</h2>
        <div className="flex flex-col gap-2 lg:flex-row">
          {experiences.map((exp, index) => (
            <>
              <ExperienceCard
                key={index}
                {...exp}
                mousePosition={mousePosition}
              />
            </>
          ))}
        </div>
      </div>
    </section>
  );
};