import React from 'react';
import { ExperienceCard } from './ExperienceCard';
import './experience.css';

export const ExperienceSection: React.FC<{ mousePosition: { x: number; y: number } }> = ({ mousePosition }) => {
  const experiences = [
    {
      title: "Handhaver Openbare Ruimte",
      company: "Gemeente Amsterdam",
      period: "2025 - Present",
      description: "Tasked with maintaining public safety and enforcing municipal regulations, ensuring a safe and pleasant environment for all residents and visitors in Amsterdam. This role involves patrolling public spaces, handling disputes, and promoting community engagement."
    },
    {
      title: "Delivery Driver",
      company: "Amazon",
      period: "2024 - 2025",
      description: "Delivered packages to customers in a timely and professional manner, ensuring that all items arrived safely and on time. Responsibilities included planning routes, loading and unloading vehicles, and providing excellent customer service."
    },
    {
      title: "Warmtepomp Installateur",
      company: "Eco-Electric",
      period: "2024 - 2024",
      description: "Installed and maintained heat pumps for residential and commercial clients, ensuring that systems were operating efficiently and safely. Responsibilities included diagnosing issues, performing repairs, and providing excellent customer service."
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
    },
    {
      title: "All-round Medewerker",
      company: "Hema",
      period: "2019 - 2020",
      description: "Performed a variety of tasks, including customer service, restocking, and cashiering, to ensure the store ran smoothly and customers received the best possible service."
    }
  ];

  return (
    <section className="px-4 py-20">
      <div className="container mx-auto max-w-screen-lg">
        <h2 className="mb-12 text-3xl font-bold">Experience</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {experiences.map((exp, index) => (
            <div key={index} className="w-full h-full">
              <ExperienceCard
                {...exp}
                mousePosition={mousePosition}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};