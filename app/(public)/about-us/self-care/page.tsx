"use client";
import HatcheryNavigation from "@/app/ui/navigation";
import Image from "next/image";

const Section1 = () => {
  return (
    <div className="container mx-auto px-4">
      <section>
        <h4 className="text-xl font-bold text-center my-8">SELF-CARE</h4>
      </section>
      <section className="flex flex-wrap justify-center items-center">
        {[
          {
            href: "https://www.studentlife.utoronto.ca/feeling-distressed",
            imgSrc: "/about-us/student_life.png",
            width: 250,
            height: 150,
          },
          {
            href: "https://undergrad.engineering.utoronto.ca/advising-and-wellness/",
            imgSrc: "/about-us/uoft_engineering.png",
            width: 250,
            height: 150,
          },
          {
            href: "https://undergrad.engineering.utoronto.ca/advising-and-wellness/",
            imgSrc: "/about-us/uoft_psychiatrist.png",
            width: 250,
            height: 150,
          },
          {
            href: "http://mentalhealth.utoronto.ca/",
            imgSrc: "/about-us/mentalhealth_uoft.png",
            width: 250,
            height: 150,
          },
          {
            href: "https://iar.utoronto.ca/main/",
            imgSrc: "/about-us/iar.png",
            width: 250,
            height: 150,
          },
          {
            href: "http://www.camh.ca/",
            imgSrc: "/about-us/camh.png",
            width: 250,
            height: 150,
          },
          {
            href: "https://undergrad.engineering.utoronto.ca/advising-and-wellness/",
            imgSrc: "/about-us/startups.png",
            width: 250,
            height: 150,
          },
          {
            href: "https://www.ted.com/talks/brene_brown_on_vulnerability?language=en",
            imgSrc: "/about-us/brenebrown.png",
            width: 250,
            height: 150,
          },
          {
            href: "https://www.ted.com/talks/robert_waldinger_what_makes_a_good_life_lessons_from_the_longest_study_on_happiness#t-479126",
            imgSrc: "/about-us/robert.png",
            width: 250,
            height: 150,
          },
          {
            href: "https://www.ted.com/talks/elizabeth_dunn_helping_others_makes_us_happier_but_it_matters_how_we_do_it",
            imgSrc: "/about-us/elizabethdunn.png",
            width: 250,
            height: 150,
          },
          {
            href: "https://www.theglobeandmail.com/report-on-business/small-business/startups/why-so-many-entrepreneurs-struggle-with-mental-illness/article30042089/",
            imgSrc: "/about-us/why_so_many.png",
            width: 250,
            height: 150,
          },
          {
            href: "https://cmha.ca/news/entrepreneurs-and-mental-health-study",
            imgSrc: "/about-us/study.png",
            width: 250,
            height: 150,
          },
        ].map((item, index) => (
          <div key={index} className="p-4">
            <div className="max-w-xs mx-auto">
              <div className="bg-white shadow-lg rounded-lg overflow-hidden my-4">
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:opacity-75"
                >
                  <div className="relative w-full h-auto">
                    <Image
                      src={item.imgSrc}
                      alt="Resource Logo"
                      height={item.height}
                      width={item.width}
                    />
                  </div>
                </a>
              </div>
            </div>
          </div>
        ))}
      </section>
      {/* Assuming meeple image section is dynamically generated in PHP, replace PHP code with actual image path if available */}
      <section className="hidden md:block flex justify-center my-8">
        <div className="relative h-72 w-full">
          {" "}
          {/* Adjust width and height as needed */}
          <Image
            src="/about-us/hatchery_circle.png"
            alt="Meeple Logo"
            fill={true}
          />
        </div>
      </section>
    </div>
  );
};

export default function Page() {
  return (
    <main>
      <HatcheryNavigation></HatcheryNavigation>
      <Section1 />
    </main>
  );
}
